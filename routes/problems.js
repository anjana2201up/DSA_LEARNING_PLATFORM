// routes/problems.js
const express = require("express");
const { PROBLEMS, GENERIC_CPP_STARTER, GENERIC_JAVA_STARTER } = require("../data/problems");
const { gradeJavaScript } = require("../lib/grader");
const { runCode, AVAILABLE } = require("../lib/runner");
const { optionalAuth } = require("../middleware/auth");
const store = require("../lib/userStore");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    total: PROBLEMS.length,
    problems: PROBLEMS.map(({ id, title, difficulty, tags }) => ({ id, title, difficulty, tags }))
  });
});

router.get("/:id", (req, res) => {
  const problem = PROBLEMS.find(p => p.id === req.params.id);
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
router.post("/:id/submit", optionalAuth, (req, res) => {
  const problem = PROBLEMS.find(p => p.id === req.params.id);
  if (!problem) return res.status(404).json({ error: "Problem not found." });
  const { language = "javascript", code = "" } = req.body || {};

  if (language !== "javascript") {
    return res.status(400).json({
      error: `Auto-grading is only available for JavaScript right now. Use "Run" to execute ${language} freely.`
    });
  }

  const grade = gradeJavaScript(code, problem);
  if (grade.ok && grade.allPass && req.user) {
    store.updateProgress(req.user.sub, { solvedProblemId: problem.id });
  }
  res.json(grade);
});

module.exports = router;
