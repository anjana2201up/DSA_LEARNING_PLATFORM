// lib/userStore.js
// A deliberately simple, file-backed "database" (data/users.json).
// This keeps the whole project dependency-light and easy to run anywhere
// with zero setup. It's fine for personal/small-team use; if you outgrow
// it, swap this module for a real DB (Postgres/Mongo) without touching
// any route logic — everything goes through the functions below.

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const DB_FILE = path.join(__dirname, "..", "data", "users.json");

function readAll() {
  try {
    if (!fs.existsSync(DB_FILE)) return [];
    const raw = fs.readFileSync(DB_FILE, "utf8").trim();
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error("userStore: failed to read users.json, starting fresh:", err.message);
    return [];
  }
}

function writeAll(users) {
  fs.writeFileSync(DB_FILE, JSON.stringify(users, null, 2));
}

function publicUser(u) {
  if (!u) return null;
  const { passwordHash, ...rest } = u;
  return rest;
}

function findByEmail(email) {
  return readAll().find(u => u.email.toLowerCase() === String(email).toLowerCase());
}

function findById(id) {
  return readAll().find(u => u.id === id);
}

function findByGoogleId(googleId) {
  return readAll().find(u => u.googleId === googleId);
}

function createUser({ name, email, passwordHash = null, googleId = null, avatar = "🧑‍💻" }) {
  const users = readAll();
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
      completed: [],       // topic ids
      bookmarks: [],       // topic ids
      completedAt: {},     // topicId -> ISO timestamp
      solvedProblems: []   // problem ids solved via the judge
    }
  };
  users.push(user);
  writeAll(users);
  return user;
}

function updateUser(id, patch) {
  const users = readAll();
  const idx = users.findIndex(u => u.id === id);
  if (idx === -1) return null;
  users[idx] = { ...users[idx], ...patch, lastActive: new Date().toISOString() };
  writeAll(users);
  return users[idx];
}

function updateProgress(id, { completed, bookmarks, solvedProblemId } = {}) {
  const users = readAll();
  const idx = users.findIndex(u => u.id === id);
  if (idx === -1) return null;
  const user = users[idx];
  if (Array.isArray(completed)) {
    const now = new Date().toISOString();
    for (const topicId of completed) {
      if (!user.progress.completed.includes(topicId)) {
        user.progress.completed.push(topicId);
        user.progress.completedAt[topicId] = now;
      }
    }
  }
  if (Array.isArray(bookmarks)) {
    user.progress.bookmarks = [...new Set(bookmarks)];
  }
  if (solvedProblemId && !user.progress.solvedProblems.includes(solvedProblemId)) {
    user.progress.solvedProblems.push(solvedProblemId);
  }
  user.lastActive = new Date().toISOString();
  writeAll(users);
  return user;
}

module.exports = {
  readAll, findByEmail, findById, findByGoogleId,
  createUser, updateUser, updateProgress, publicUser
};