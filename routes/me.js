// routes/me.js
const express = require("express");
const store = require("../lib/userStore");
const { requireAuth } = require("../middleware/auth");
const { TOPICS } = require("../data/topics");
const { PROBLEMS } = require("../data/problems");
const { PROBLEMS_EXTRA } = require("../data/problems-extra");
const ALL_PROBLEMS = [...PROBLEMS, ...PROBLEMS_EXTRA];

const router = express.Router();

router.get("/", requireAuth, (req, res) => {
  const user = store.findById(req.user.sub);
  if (!user) return res.status(404).json({ error: "User not found." });
  res.json({ user: store.publicUser(user), stats: buildStats(user) });
});

router.put("/", requireAuth, (req, res) => {
  try {
    const { name, avatar } = req.body || {};
    const patch = {};
    if (typeof name === "string" && name.trim()) patch.name = name.trim().slice(0, 60);
    if (typeof avatar === "string") patch.avatar = avatar.slice(0, 8);
    const user = store.updateUser(req.user.sub, patch);
    if (!user) return res.status(404).json({ error: "User not found." });
    res.json({ user: store.publicUser(user) });
  } catch (err) {
    if (err && err.code === "USERSTORE_WRITE_FAILED") return res.status(503).json({ error: err.message });
    console.error("Profile update error:", err);
    res.status(500).json({ error: "Internal server error." });
  }
});

// Merge-sync progress from the client (e.g. localStorage progress made while
// signed out, or a new completion/bookmark toggle) into the account.
router.put("/progress", requireAuth, (req, res) => {
  try {
    const { completed, bookmarks, solvedProblemId } = req.body || {};
    const user = store.updateProgress(req.user.sub, { completed, bookmarks, solvedProblemId });
    if (!user) return res.status(404).json({ error: "User not found." });
    res.json({ progress: user.progress, stats: buildStats(user) });
  } catch (err) {
    if (err && err.code === "USERSTORE_WRITE_FAILED") return res.status(503).json({ error: err.message });
    console.error("Progress sync error:", err);
    res.status(500).json({ error: "Internal server error." });
  }
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

  // Problem difficulty breakdown (difficulty casing varies across problem
  // data files - normalize to lowercase keys so nothing silently under-counts)
  const difficulties = { easy: { total: 0, solved: 0 }, medium: { total: 0, solved: 0 }, hard: { total: 0, solved: 0 } };
  for (const p of ALL_PROBLEMS) {
    const d = (p.difficulty || "easy").toLowerCase();
    if (difficulties[d]) {
      difficulties[d].total++;
      if (user.progress.solvedProblems.includes(p.id)) difficulties[d].solved++;
    }
  }

  const submissions = user.progress.submissions || [];
  const acceptedCount = submissions.filter(s => s.pass).length;
  const acceptanceRate = submissions.length ? Math.round((acceptedCount / submissions.length) * 100) : 0;
  const languageCounts = {};
  for (const s of submissions) languageCounts[s.language] = (languageCounts[s.language] || 0) + 1;

  return {
    totalTopics,
    completedCount,
    percentComplete: totalTopics ? Math.round((completedCount / totalTopics) * 100) : 0,
    bookmarkCount: user.progress.bookmarks.length,
    solvedProblemCount: user.progress.solvedProblems.length,
    totalProblems: ALL_PROBLEMS.length,
    difficulties,
    byCategory,
    memberSince: user.createdAt,
    recentSubmissions: submissions.slice(0, 15),
    totalSubmissions: submissions.length,
    acceptanceRate,
    languageCounts,
    solvedAt: user.progress.solvedAt || {}
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