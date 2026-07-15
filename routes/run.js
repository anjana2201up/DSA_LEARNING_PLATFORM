// routes/run.js — the general-purpose "terminal": run any snippet in any
// available language, independent of the problems bank.
const express = require("express");
const { runCode, AVAILABLE } = require("../lib/runner");

const router = express.Router();

router.get("/languages", (req, res) => res.json({ available: AVAILABLE }));

router.post("/", async (req, res) => {
  const { language = "javascript", code = "", stdin = "" } = req.body || {};
  const result = await runCode({ language, code, stdin });
  res.json(result);
});

module.exports = router;