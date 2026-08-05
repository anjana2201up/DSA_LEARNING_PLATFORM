// routes/problems.js
const express = require("express");
const { PROBLEMS, GENERIC_CPP_STARTER, GENERIC_JAVA_STARTER } = require("../data/problems");
const { PROBLEMS_EXTRA } = require("../data/problems-extra");
const { gradeJavaScript } = require("../lib/grader");

const ALL_PROBLEMS = [...PROBLEMS, ...PROBLEMS_EXTRA];
const { runCode, AVAILABLE } = require("../lib/runner");
const { optionalAuth } = require("../middleware/auth");
const store = require("../lib/userStore");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    total: ALL_PROBLEMS.length,
    problems: ALL_PROBLEMS.map(({ id, title, difficulty, tags }) => ({ id, title, difficulty, tags }))
  });
});

router.get("/:id", (req, res) => {
  const problem = ALL_PROBLEMS.find(p => p.id === req.params.id);
  if (!problem) return res.status(404).json({ error: "Problem not found." });
  res.json({
    ...problem,
    testCases: problem.testCases.map(tc => ({ args: tc.args })), // hide expected values from the client
    starterCode: {
      ...problem.starterCode,
      cpp: GENERIC_CPP_STARTER,
      java: GENERIC_JAVA_STARTER
    },
    languagesAvailable: AVAILABLE
  });
});

// Free-run: execute code as-is (any available language), no grading.
router.post("/:id/run", async (req, res) => {
  const { language = "javascript", code = "", stdin = "" } = req.body || {};
  const result = await runCode({ language, code, stdin });
  res.json(result);
});

// Submit: only JavaScript is auto-graded against hidden test cases (see data/problems.js for why).
router.post("/:id/submit", optionalAuth, async (req, res) => {
  const problem = ALL_PROBLEMS.find(p => p.id === req.params.id);
  if (!problem) return res.status(404).json({ error: "Problem not found." });
  const { language = "javascript", code = "" } = req.body || {};

  if (language !== "javascript") {
    return res.status(400).json({
      error: `Auto-grading is only available for JavaScript right now. Use "Run" to execute ${language} freely.`
    });
  }

  const grade = gradeJavaScript(code, problem);
  const passed = !!(grade.ok && grade.allPass);
  let saveWarning = null;
  if (req.user) {
    try {
      await store.recordSubmission(req.user.sub, {
        problemId: problem.id, title: problem.title, difficulty: problem.difficulty,
        language, pass: passed
      });
      if (passed) await store.updateProgress(req.user.sub, { solvedProblemId: problem.id });
    } catch (err) {
      // Grading itself succeeded - don't fail the whole request just because
      // saving the result to the account didn't work (e.g. ephemeral storage
      // on a serverless deploy). Surface it as a soft warning instead.
      saveWarning = err.message;
    }
  }
  res.json(saveWarning ? { ...grade, saveWarning } : grade);
});

module.exports = router;