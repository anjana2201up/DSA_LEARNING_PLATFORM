// routes/feedback.js
const express = require("express");
const fs = require("fs");
const path = require("path");
const { optionalAuth } = require("../middleware/auth");

const router = express.Router();
const FILE = path.join(__dirname, "..", "data", "feedback.json");

function readAll() {
  try { return JSON.parse(fs.readFileSync(FILE, "utf8") || "[]"); } catch { return []; }
}
function writeAll(items) { fs.writeFileSync(FILE, JSON.stringify(items, null, 2)); }

router.post("/", optionalAuth, (req, res) => {
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
});

router.get("/summary", (req, res) => {
  const items = readAll();
  const count = items.length;
  const avg = count ? items.reduce((s, i) => s + i.rating, 0) / count : 0;
  res.json({ count, avgRating: Math.round(avg * 10) / 10 });
});

module.exports = router;
