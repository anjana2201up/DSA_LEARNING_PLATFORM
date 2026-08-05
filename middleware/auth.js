// middleware/auth.js
// Server-side auth router and middlewares.
// Supports custom JWT and Google Auth verification.

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const store = require("../lib/userStore");

const router = express.Router();

// Falls back to a generated-at-boot secret if JWT_SECRET isn't set, so the
// app never silently 500s on every auth call — but this fallback does NOT
// survive a restart (every deploy/cold-start invalidates existing tokens),
// so set a real JWT_SECRET in your environment for production.
let JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  JWT_SECRET = require("crypto").randomBytes(48).toString("hex");
  console.warn(
    "[auth] JWT_SECRET is not set in the environment — using a random secret generated at boot.\n" +
    "  Existing sessions will be invalidated on every restart/deploy. Set JWT_SECRET in your\n" +
    "  environment (.env locally, or your host's dashboard in production) to fix this."
  );
}

function friendlyAuthError(res, err, fallbackMsg) {
  if (err && err.code === "USERSTORE_WRITE_FAILED") {
    return res.status(503).json({ error: err.message });
  }
  console.error(fallbackMsg + ":", err);
  return res.status(500).json({ error: "Internal server error." });
}

// ---------- Auth Routes ----------

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters long." });
    }
    const existingUser = await store.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered." });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await store.createUser({ name, email, passwordHash });
    const token = jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });
    res.status(201).json({ token, user: store.publicUser(user) });
  } catch (err) {
    friendlyAuthError(res, err, "Register error");
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }
    const user = await store.findByEmail(email);
    if (!user || !user.passwordHash) {
      return res.status(401).json({ error: "Invalid email or password." });
    }
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(401).json({ error: "Invalid email or password." });
    }
    const token = jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: store.publicUser(user) });
  } catch (err) {
    friendlyAuthError(res, err, "Login error");
  }
});

router.post("/google", async (req, res) => {
  try {
    const { idToken } = req.body || {};
    if (!idToken) {
      return res.status(400).json({ error: "Google ID token is required." });
    }
    const googleClientId = process.env.GOOGLE_CLIENT_ID;
    if (!googleClientId) {
      return res.status(400).json({ error: "Google Sign-In is not configured on this server." });
    }
    const client = new OAuth2Client(googleClientId);
    const ticket = await client.verifyIdToken({
      idToken,
      audience: googleClientId
    });
    const payload = ticket.getPayload();
    const googleId = payload.sub;
    const email = payload.email;
    const name = payload.name;

    let user = await store.findByGoogleId(googleId);
    if (!user) {
      user = await store.findByEmail(email);
      if (user) {
        user = await store.updateUser(user.id, { googleId });
      } else {
        user = await store.createUser({ name, email, googleId });
      }
    }
    const token = jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: store.publicUser(user) });
  } catch (err) {
    if (err && err.code === "USERSTORE_WRITE_FAILED") {
      return res.status(503).json({ error: err.message });
    }
    console.error("Google Sign-In error:", err);
    res.status(400).json({ error: "Google sign-in failed: " + err.message });
  }
});

router.get("/config", (req, res) => {
  const googleClientId = process.env.GOOGLE_CLIENT_ID;
  res.json({
    googleEnabled: !!googleClientId,
    googleClientId: googleClientId || ""
  });
});

// ---------- Middlewares ----------

const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: Missing token." });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized: Invalid or expired token." });
  }
};

const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
    } catch (err) {
      // Ignored for optional auth
    }
  }
  next();
};

router.requireAuth = requireAuth;
router.optionalAuth = optionalAuth;

module.exports = router;