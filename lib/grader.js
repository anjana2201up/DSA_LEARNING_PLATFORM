// lib/grader.js
// Runs a JavaScript submission against a problem's hidden test cases inside
// the same sandboxed vm context used by the compiler, then compares actual
// vs. expected output per test case.

const vm = require("vm");

function deepEqual(a, b) {
  if (Number.isNaN(a) && Number.isNaN(b)) return true;
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (Array.isArray(a) || Array.isArray(b)) {
    if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return false;
    return a.every((v, i) => deepEqual(v, b[i]));
  }
  if (a && b && typeof a === "object") {
    const ak = Object.keys(a), bk = Object.keys(b);
    if (ak.length !== bk.length) return false;
    return ak.every(k => deepEqual(a[k], b[k]));
  }
  return false;
}

function clone(v) { return v === undefined ? v : JSON.parse(JSON.stringify(v)); }

function gradeJavaScript(code, problem, timeoutMs = 5000) {
  if (!code || !code.trim()) return { ok: false, error: "No code submitted.", results: [] };
  if (code.length > 20000) return { ok: false, error: "Code too long.", results: [] };

  const logs = [];
  const sandbox = {
    console: {
      log: (...a) => logs.push(a.map(x => (typeof x === "string" ? x : JSON.stringify(x))).join(" ")),
      warn: () => {}, error: () => {}, info: () => {}
    }
  };
  const context = vm.createContext(sandbox);

  try {
    new vm.Script(code, { filename: "submission.js" }).runInContext(context, { timeout: timeoutMs });
  } catch (err) {
    const isTimeout = /Script execution timed out/i.test(err.message || "");
    return { ok: false, error: isTimeout ? "Your code timed out while loading (possible infinite loop)." : `Error: ${err.message}`, results: [] };
  }

  const fn = context[problem.functionName];
  if (typeof fn !== "function") {
    return { ok: false, error: `We couldn't find a function named "${problem.functionName}". Make sure it's defined at the top level.`, results: [] };
  }

  const results = problem.testCases.map((tc, i) => {
    try {
      const args = tc.args.map(clone);
      const start = Date.now();
      const actual = fn(...args);
      const ms = Date.now() - start;
      return { index: i, pass: deepEqual(actual, tc.expected), input: tc.args, expected: tc.expected, actual, ms };
    } catch (err) {
      return { index: i, pass: false, input: tc.args, expected: tc.expected, error: err.message };
    }
  });

  return { ok: true, allPass: results.every(r => r.pass), results, logs: logs.join("\n") };
}

module.exports = { gradeJavaScript, deepEqual };