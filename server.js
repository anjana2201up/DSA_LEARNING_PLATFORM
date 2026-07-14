// server.js - DSA Nexus backend
// Serves the static frontend, exposes topic content as JSON, and runs a
// sandboxed JavaScript "compiler" endpoint (Node's vm module, timeboxed,
// with no access to require/fs/network from inside the sandbox).

const express = require("express");
const compression = require("compression");
const vm = require("vm");
const path = require("path");
const { CATEGORIES, TOPICS, SCALE } = require("./data/topics");
const { PATTERNS } = require("./data/patterns");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(compression());
app.use(express.json({ limit: "200kb" }));
app.use(express.static(path.join(__dirname, "public")));

// ---------- Content API ----------

app.get("/api/categories", (req, res) => {
  const withCounts = CATEGORIES.map(c => ({
    ...c,
    count: TOPICS.filter(t => t.category === c.id).length
  }));
  res.json({ categories: withCounts, scale: SCALE });
});

app.get("/api/topics", (req, res) => {
  const list = TOPICS.map(({ id, category, title, summary, diagram, complexity }) => ({
    id, category, title, summary, diagram, complexity
  }));
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
  const topicResults = TOPICS.filter(t =>
    t.title.toLowerCase().includes(q) || t.summary.toLowerCase().includes(q)
  ).map(({ id, title, category, summary }) => ({ id, title, category, summary, type: "topic" }));
  const patternResults = PATTERNS.filter(p =>
    p.title.toLowerCase().includes(q) || p.tagline.toLowerCase().includes(q)
  ).map(({ id, title, tagline }) => ({ id, title, category: "pattern", summary: tagline, type: "pattern" }));
  res.json({ results: [...topicResults, ...patternResults] });
});

app.get("/api/patterns", (req, res) => {
  const list = PATTERNS.map(({ id, title, tagline, diagram, slides }) => ({
    id, title, tagline, diagram, slideCount: slides.length
  }));
  res.json({ total: list.length, patterns: list });
});

app.get("/api/patterns/:id", (req, res) => {
  const pattern = PATTERNS.find(p => p.id === req.params.id);
  if (!pattern) return res.status(404).json({ error: "Pattern not found" });
  res.json(pattern);
});

// ---------- Compiler endpoint ----------
// Executes untrusted JavaScript in a fresh V8 context with:
//  - no require/module/process/fs access (not passed into the sandbox)
//  - console.log/warn/error captured into an output buffer instead of stdout
//  - a hard wall-clock timeout so infinite loops can't hang the server
//  - a rough output-size cap so runaway logging can't exhaust memory

const MAX_OUTPUT_CHARS = 20000;
const EXEC_TIMEOUT_MS = 3000;

app.post("/api/compile", (req, res) => {
  const { code } = req.body || {};
  if (typeof code !== "string" || !code.trim()) {
    return res.status(400).json({ error: "No code provided." });
  }
  if (code.length > 20000) {
    return res.status(400).json({ error: "Code too long (20,000 char limit)." });
  }

  const logs = [];
  let truncated = false;
  const capture = (level) => (...args) => {
    if (truncated) return;
    const line = args.map(a => {
      if (typeof a === "string") return a;
      try { return JSON.stringify(a); } catch { return String(a); }
    }).join(" ");
    const budgetLeft = MAX_OUTPUT_CHARS - logs.join("\n").length;
    if (budgetLeft <= 0) { truncated = true; return; }
    logs.push((level === "log" ? "" : `[${level}] `) + line.slice(0, budgetLeft));
  };

  const sandbox = {
    console: {
      log: capture("log"),
      warn: capture("warn"),
      error: capture("error"),
      info: capture("log")
    }
  };

  const context = vm.createContext(sandbox, { name: "dsa-nexus-sandbox" });
  const start = Date.now();

  try {
    const script = new vm.Script(code, { filename: "user-code.js" });
    script.runInContext(context, { timeout: EXEC_TIMEOUT_MS });
    return res.json({
      ok: true,
      output: logs.join("\n") + (truncated ? "\n...output truncated" : ""),
      ms: Date.now() - start
    });
  } catch (err) {
    const message = err && err.message ? err.message : String(err);
    const isTimeout = /Script execution timed out/i.test(message);
    return res.json({
      ok: false,
      output: logs.join("\n"),
      error: isTimeout ? `Execution timed out after ${EXEC_TIMEOUT_MS}ms (possible infinite loop).` : message,
      ms: Date.now() - start
    });
  }
});

app.get("/health", (req, res) => res.json({ status: "ok" }));

// SPA fallback - client-side router handles topic pages via hash routing
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`DSA Nexus running at http://localhost:${PORT}`);
});
