// routes/feedback.js
// Serverless-safe feedback storage — mirrors the pattern from lib/userStore.js.
// On Vercel/Lambda the deployed filesystem is read-only except /tmp, so we
// auto-detect that environment and write there instead.

const express = require("express");
const fs = require("fs");
const path = require("path");
const os = require("os");
const { optionalAuth } = require("../middleware/auth");

const router = express.Router();

const REPO_FILE = path.join(__dirname, "..", "data", "feedback.json");
const IS_SERVERLESS = !!(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NOW_REGION);
const FILE = IS_SERVERLESS ? path.join(os.tmpdir(), "dsa-nexus-feedback.json") : REPO_FILE;

function ensureSeedFile() {
  if (fs.existsSync(FILE)) return;
  try {
    const seed = fs.existsSync(REPO_FILE) ? fs.readFileSync(REPO_FILE, "utf8") : "[]";
    fs.writeFileSync(FILE, seed || "[]");
  } catch (err) {
    console.error("feedback: could not seed", FILE, "-", err.message);
  }
}

function readAll() {
  try {
    if (IS_SERVERLESS) ensureSeedFile();
    if (!fs.existsSync(FILE)) return [];
    const raw = fs.readFileSync(FILE, "utf8").trim();
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeAll(items) {
  try {
    fs.writeFileSync(FILE, JSON.stringify(items, null, 2));
  } catch (err) {
    console.error("feedback: FAILED to persist to", FILE, "-", err.message);
    const wrapped = new Error(
      "Could not save feedback (storage is unavailable). " +
      "If this is a serverless deployment, storage is expected to be ephemeral."
    );
    wrapped.code = "FEEDBACK_WRITE_FAILED";
    throw wrapped;
  }
}

router.post("/", optionalAuth, (req, res) => {
  try {
    const { message, rating, name, email } = req.body || {};
    if (!message || !message.trim()) return res.status(400).json({ error: "Please write a message." });
    const ratingNum = Number(rating);
    if (!Number.isInteger(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return res.status(400).json({ error: "Rating must be an integer from 1 to 5." });
    }
    const items = readAll();
    items.push({
      id: items.length + 1,
      message: String(message).slice(0, 2000),
      rating: ratingNum,
      name: req.user ? undefined : (name || "Anonymous").slice(0, 60),
      userId: req.user ? req.user.sub : null,
      createdAt: new Date().toISOString()
    });
    writeAll(items);
    res.status(201).json({ ok: true });
  } catch (err) {
    if (err && err.code === "FEEDBACK_WRITE_FAILED") {
      return res.status(503).json({ error: err.message });
    }
    console.error("Feedback error:", err);
    res.status(500).json({ error: "Internal server error." });
  }
});

router.get("/summary", (req, res) => {
  const items = readAll();
  const count = items.length;
  const avg = count ? items.reduce((s, i) => s + i.rating, 0) / count : 0;
  res.json({ count, avgRating: Math.round(avg * 10) / 10 });
});

module.exports = router;
