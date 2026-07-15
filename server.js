// server.js — DSA Nexus backend
// Serves: a marketing landing page ("/"), the learning app ("/app"),
// content APIs (topics/patterns/problems), auth (JWT + optional Google),
// a personal dashboard API, a multi-language code runner, and feedback.

require("dotenv").config();
const express = require("express");
const compression = require("compression");
const path = require("path");

const { CATEGORIES, TOPICS, SCALE } = require("./data/topics");
const { PATTERNS } = require("./data/patterns");
const { runCode, AVAILABLE } = require("./lib/runner");

const authRoutes = require("./middleware/auth");
const meRoutes = require("./routes/me");
const problemsRoutes = require("./routes/problems");
const runRoutes = require("./routes/run");
const feedbackRoutes = require("./routes/feedback");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(compression());
app.use(express.json({ limit: "200kb" }));
// index:false — we control "/" and "/app" ourselves below (landing vs SPA)
app.use(express.static(path.join(__dirname, "public"), { index: false }));

// ---------- Content API (topics / patterns / search) ----------

app.get("/api/categories", (req, res) => {
  const withCounts = CATEGORIES.map(c => ({ ...c, count: TOPICS.filter(t => t.category === c.id).length }));
  res.json({ categories: withCounts, scale: SCALE });
});

app.get("/api/topics", (req, res) => {
  const list = TOPICS.map(({ id, category, title, summary, diagram, complexity }) => ({ id, category, title, summary, diagram, complexity }));
  res.json({ total: list.length, topics: list });
});

app.get("/api/topics/:id", (req, res) => {
  const topic = TOPICS.find(t => t.id === req.params.id);
  if (!topic) return res.status(404).json({ error: "Topic not found" });
  res.json(topic);
});

app.get("/api/search", (req, res) => {
  const q = (req.query.q || "").toLowerCase().trim();
  if (!q) return res.json({ results: [] });
  const topicResults = TOPICS.filter(t => t.title.toLowerCase().includes(q) || t.summary.toLowerCase().includes(q))
    .map(({ id, title, category, summary }) => ({ id, title, category, summary, type: "topic" }));
  const patternResults = PATTERNS.filter(p => p.title.toLowerCase().includes(q) || p.tagline.toLowerCase().includes(q))
    .map(({ id, title, tagline }) => ({ id, title, category: "pattern", summary: tagline, type: "pattern" }));
  res.json({ results: [...topicResults, ...patternResults] });
});

app.get("/api/patterns", (req, res) => {
  const list = PATTERNS.map(({ id, title, tagline, diagram, slides }) => ({ id, title, tagline, diagram, slideCount: slides.length }));
  res.json({ total: list.length, patterns: list });
});

app.get("/api/patterns/:id", (req, res) => {
  const pattern = PATTERNS.find(p => p.id === req.params.id);
  if (!pattern) return res.status(404).json({ error: "Pattern not found" });
  res.json(pattern);
});

// ---------- Quick JS "try it yourself" compiler (used on topic pages) ----------

app.post("/api/compile", async (req, res) => {
  const result = await runCode({ language: "javascript", code: (req.body || {}).code });
  res.json({ ok: result.ok, output: result.stdout, error: result.ok ? undefined : result.stderr, ms: result.ms });
});

// ---------- Auth / dashboard / problems / terminal / feedback ----------

app.use("/api/auth", authRoutes);
app.use("/api/me", meRoutes);
app.use("/api/problems", problemsRoutes);
app.use("/api/run", runRoutes);
app.use("/api/feedback", feedbackRoutes);
app.get("/api/languages", (req, res) => res.json({ available: AVAILABLE }));

app.get("/health", (req, res) => res.json({ status: "ok" }));

// ---------- Page routing: landing page at "/", the SPA at "/app" ----------

app.get("/", (req, res) => res.sendFile(path.join(__dirname, "public", "welcome.html")));
app.get(["/app", "/app/*"], (req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));

app.get("*", (req, res) => res.redirect("/"));

app.listen(PORT, () => {
  console.log(`DSA Nexus running at http://localhost:${PORT}`);
  console.log(`Languages available for the terminal: ${Object.entries(AVAILABLE).filter(([, v]) => v).map(([k]) => k).join(", ")}`);
  if (!process.env.GOOGLE_CLIENT_ID) console.log(`Google Sign-In: disabled (set GOOGLE_CLIENT_ID in .env to enable)`);
});