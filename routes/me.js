// routes/me.js
const express = require("express");
const store = require("../lib/userStore");
const { requireAuth } = require("../middleware/auth");
const { TOPICS } = require("../data/topics");

const router = express.Router();

router.get("/", requireAuth, (req, res) => {
  const user = store.findById(req.user.sub);
  if (!user) return res.status(404).json({ error: "User not found." });
  res.json({ user: store.publicUser(user), stats: buildStats(user) });
});

router.put("/", requireAuth, (req, res) => {
  const { name, avatar } = req.body || {};
  const patch = {};
  if (typeof name === "string" && name.trim()) patch.name = name.trim().slice(0, 60);
  if (typeof avatar === "string") patch.avatar = avatar.slice(0, 8);
  const user = store.updateUser(req.user.sub, patch);
  if (!user) return res.status(404).json({ error: "User not found." });
  res.json({ user: store.publicUser(user) });
});

// Merge-sync progress from the client (e.g. localStorage progress made while
// signed out, or a new completion/bookmark toggle) into the account.
router.put("/progress", requireAuth, (req, res) => {
  const { completed, bookmarks, solvedProblemId } = req.body || {};
  const user = store.updateProgress(req.user.sub, { completed, bookmarks, solvedProblemId });
  if (!user) return res.status(404).json({ error: "User not found." });
  res.json({ progress: user.progress, stats: buildStats(user) });
});

function buildStats(user) {
  const totalTopics = TOPICS.length;
  const completedCount = user.progress.completed.length;
  const byCategory = {};
  for (const t of TOPICS) {
    byCategory[t.category] ??= { total: 0, done: 0 };
    byCategory[t.category].total++;
    if (user.progress.completed.includes(t.id)) byCategory[t.category].done++;
  }
  return {
    totalTopics,
    completedCount,
    percentComplete: totalTopics ? Math.round((completedCount / totalTopics) * 100) : 0,
    bookmarkCount: user.progress.bookmarks.length,
    solvedProblemCount: user.progress.solvedProblems.length,
    byCategory,
    memberSince: user.createdAt
  };
}

router.get("/leaderboard", (req, res) => {
  const users = store.getAllPublicUsers();
  const ranked = users.map(u => ({
    id: u.id,
    name: u.name,
    avatar: u.avatar,
    solvedCount: u.progress?.solvedProblems?.length || 0,
    completedCount: u.progress?.completed?.length || 0
  })).sort((a, b) => (b.solvedCount + b.completedCount) - (a.solvedCount + a.completedCount));
  res.json({ leaderboard: ranked });
});

module.exports = router;