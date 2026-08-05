const mongoose = require("mongoose");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const os = require("os");

const MONGODB_URI = process.env.MONGODB_URI;
const USE_MONGO = !!MONGODB_URI;

if (USE_MONGO) {
  mongoose.connect(MONGODB_URI)
    .then(() => console.log("[userStore] Connected to MongoDB"))
    .catch(err => console.error("[userStore] MongoDB connection error:", err));
} else {
  console.warn("[userStore] MONGODB_URI is not set. Falling back to local JSON file.");
}

// ---- File Fallback Logic ----
const REPO_DB_FILE = path.join(__dirname, "..", "data", "users.json");
const IS_SERVERLESS = !!(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NOW_REGION);
const DB_FILE = IS_SERVERLESS ? path.join(os.tmpdir(), "dsa-nexus-users.json") : REPO_DB_FILE;

let warnedOnce = false;
function warnServerless() {
  if (warnedOnce) return;
  warnedOnce = true;
  console.warn(
    "[userStore] Running in a serverless environment - using ephemeral /tmp storage for user accounts.\n" +
    "  Accounts/progress created here may be lost on the next cold start or deployment.\n" +
    "  For real persistence in production, connect a hosted database."
  );
}

function ensureSeedFile() {
  if (fs.existsSync(DB_FILE)) return;
  try {
    const seed = fs.existsSync(REPO_DB_FILE) ? fs.readFileSync(REPO_DB_FILE, "utf8") : "[]";
    fs.writeFileSync(DB_FILE, seed || "[]");
  } catch (err) {
    console.error("userStore: could not seed", DB_FILE, "-", err.message);
  }
}

function readAllFallback() {
  try {
    if (IS_SERVERLESS) { warnServerless(); ensureSeedFile(); }
    if (!fs.existsSync(DB_FILE)) return [];
    const raw = fs.readFileSync(DB_FILE, "utf8").trim();
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error("userStore: failed to read", DB_FILE, "- starting fresh:", err.message);
    return [];
  }
}

function writeAllFallback(users) {
  try {
    if (IS_SERVERLESS) warnServerless();
    fs.writeFileSync(DB_FILE, JSON.stringify(users, null, 2));
  } catch (err) {
    console.error("userStore: FAILED to persist to", DB_FILE, "-", err.message);
    const wrapped = new Error(
      "Could not save your account data on this server (storage is unavailable)."
    );
    wrapped.code = "USERSTORE_WRITE_FAILED";
    throw wrapped;
  }
}

// ---- Mongoose Schema ----
const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String },
  googleId: { type: String },
  avatar: { type: String, default: "🧑‍💻" },
  createdAt: { type: Date, default: Date.now },
  lastActive: { type: Date, default: Date.now },
  progress: {
    completed: [String],
    bookmarks: [String],
    completedAt: { type: Map, of: Date },
    solvedProblems: [String],
    solvedAt: { type: Map, of: Date },
    submissions: [{
      problemId: String,
      title: String,
      difficulty: String,
      language: String,
      pass: Boolean,
      timestamp: { type: Date, default: Date.now }
    }]
  }
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

function publicUser(u) {
  if (!u) return null;
  const obj = u.toObject ? u.toObject() : u;
  const { passwordHash, _id, __v, ...rest } = obj;
  return rest;
}

// ---- API Functions ----

async function findByEmail(email) {
  if (!email) return null;
  if (USE_MONGO) {
    return User.findOne({ email: new RegExp(`^${email}$`, "i") });
  }
  return readAllFallback().find(u => u.email.toLowerCase() === String(email).toLowerCase());
}

async function findById(id) {
  if (USE_MONGO) {
    return User.findOne({ id });
  }
  return readAllFallback().find(u => u.id === id);
}

async function findByGoogleId(googleId) {
  if (USE_MONGO) {
    return User.findOne({ googleId });
  }
  return readAllFallback().find(u => u.googleId === googleId);
}

async function createUser({ name, email, passwordHash = null, googleId = null, avatar = "🧑‍💻" }) {
  if (USE_MONGO) {
    const user = new User({
      id: crypto.randomUUID(),
      name: name || email.split("@")[0],
      email,
      passwordHash,
      googleId,
      avatar,
      progress: {
        completed: [],
        bookmarks: [],
        completedAt: new Map(),
        solvedProblems: [],
        solvedAt: new Map(),
        submissions: []
      }
    });
    await user.save();
    return user;
  }
  
  const users = readAllFallback();
  const user = {
    id: crypto.randomUUID(),
    name: name || email.split("@")[0],
    email,
    passwordHash,
    googleId,
    avatar,
    createdAt: new Date().toISOString(),
    lastActive: new Date().toISOString(),
    progress: {
      completed: [],
      bookmarks: [],
      completedAt: {},
      solvedProblems: [],
      solvedAt: {},
      submissions: []
    }
  };
  users.push(user);
  writeAllFallback(users);
  return user;
}

async function updateUser(id, patch) {
  if (USE_MONGO) {
    patch.lastActive = new Date();
    return User.findOneAndUpdate({ id }, { $set: patch }, { new: true });
  }

  const users = readAllFallback();
  const idx = users.findIndex(u => u.id === id);
  if (idx === -1) return null;
  users[idx] = { ...users[idx], ...patch, lastActive: new Date().toISOString() };
  writeAllFallback(users);
  return users[idx];
}

async function updateProgress(id, { completed, bookmarks, solvedProblemId } = {}) {
  const now = new Date();
  
  if (USE_MONGO) {
    const user = await User.findOne({ id });
    if (!user) return null;
    let changed = false;

    if (Array.isArray(completed)) {
      for (const topicId of completed) {
        if (!user.progress.completed.includes(topicId)) {
          user.progress.completed.push(topicId);
          if (!user.progress.completedAt) user.progress.completedAt = new Map();
          user.progress.completedAt.set(topicId, now);
          changed = true;
        }
      }
    }
    if (Array.isArray(bookmarks)) {
      user.progress.bookmarks = [...new Set(bookmarks)];
      changed = true;
    }
    if (solvedProblemId) {
      if (!user.progress.solvedProblems.includes(solvedProblemId)) {
        user.progress.solvedProblems.push(solvedProblemId);
        changed = true;
      }
      if (!user.progress.solvedAt) user.progress.solvedAt = new Map();
      if (!user.progress.solvedAt.has(solvedProblemId)) {
        user.progress.solvedAt.set(solvedProblemId, now);
        changed = true;
      }
    }
    if (changed) {
      user.lastActive = now;
      await user.save();
    }
    return user;
  }

  const users = readAllFallback();
  const idx = users.findIndex(u => u.id === id);
  if (idx === -1) return null;
  const user = users[idx];
  const isoNow = now.toISOString();

  if (Array.isArray(completed)) {
    for (const topicId of completed) {
      if (!user.progress.completed.includes(topicId)) {
        user.progress.completed.push(topicId);
        if (!user.progress.completedAt) user.progress.completedAt = {};
        user.progress.completedAt[topicId] = isoNow;
      }
    }
  }
  if (Array.isArray(bookmarks)) {
    user.progress.bookmarks = [...new Set(bookmarks)];
  }
  if (solvedProblemId) {
    if (!user.progress.solvedAt) user.progress.solvedAt = {};
    if (!user.progress.solvedProblems.includes(solvedProblemId)) {
      user.progress.solvedProblems.push(solvedProblemId);
    }
    if (!user.progress.solvedAt[solvedProblemId]) {
      user.progress.solvedAt[solvedProblemId] = isoNow;
    }
  }
  user.lastActive = isoNow;
  writeAllFallback(users);
  return user;
}

const MAX_SUBMISSIONS_KEPT = 200;

async function recordSubmission(id, { problemId, title, difficulty, language, pass }) {
  if (USE_MONGO) {
    const user = await User.findOne({ id });
    if (!user) return null;
    if (!user.progress.submissions) user.progress.submissions = [];
    user.progress.submissions.unshift({
      problemId, title, difficulty, language, pass,
      timestamp: new Date()
    });
    if (user.progress.submissions.length > MAX_SUBMISSIONS_KEPT) {
      user.progress.submissions = user.progress.submissions.slice(0, MAX_SUBMISSIONS_KEPT);
    }
    user.lastActive = new Date();
    await user.save();
    return user;
  }

  const users = readAllFallback();
  const idx = users.findIndex(u => u.id === id);
  if (idx === -1) return null;
  const user = users[idx];
  if (!user.progress.submissions) user.progress.submissions = [];
  user.progress.submissions.unshift({
    problemId, title, difficulty, language, pass,
    timestamp: new Date().toISOString()
  });
  if (user.progress.submissions.length > MAX_SUBMISSIONS_KEPT) {
    user.progress.submissions.length = MAX_SUBMISSIONS_KEPT;
  }
  user.lastActive = new Date().toISOString();
  writeAllFallback(users);
  return user;
}

async function getAllPublicUsers() {
  if (USE_MONGO) {
    const users = await User.find({});
    return users.map(publicUser);
  }
  return readAllFallback().map(publicUser);
}

module.exports = {
  findByEmail, findById, findByGoogleId,
  createUser, updateUser, updateProgress, recordSubmission, publicUser, getAllPublicUsers
};