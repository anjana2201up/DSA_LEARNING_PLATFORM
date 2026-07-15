// lib/runner.js
// JavaScript runs in an in-process V8 sandbox (fast, safely timeboxed).
// Other languages use the Wandbox API, making this project Vercel-friendly
// without needing local compilers installed.

const vm = require("vm");

const TIMEOUT_MS = 5000;
const MAX_OUTPUT = 20000;

// All languages are enabled by default since we proxy non-JS to Wandbox.
const AVAILABLE = {
  javascript: true,
  python: true,
  cpp: true,
  java: true
};

function runJavaScript(code, stdinIgnored, timeoutMs) {
  const logs = [];
  let truncated = false;
  const capture = (level) => (...args) => {
    if (truncated) return;
    const line = args.map(a => {
      if (typeof a === "string") return a;
      try { return JSON.stringify(a); } catch { return String(a); }
    }).join(" ");
    const budgetLeft = MAX_OUTPUT - logs.join("\n").length;
    if (budgetLeft <= 0) { truncated = true; return; }
    logs.push((level === "log" ? "" : `[${level}] `) + line.slice(0, budgetLeft));
  };
  const sandbox = { console: { log: capture("log"), warn: capture("warn"), error: capture("error"), info: capture("log") } };
  const context = vm.createContext(sandbox);
  const start = Date.now();
  try {
    new vm.Script(code, { filename: "submission.js" }).runInContext(context, { timeout: timeoutMs });
    return { ok: true, stdout: logs.join("\n") + (truncated ? "\n...output truncated" : ""), stderr: "", ms: Date.now() - start };
  } catch (err) {
    const message = err && err.message ? err.message : String(err);
    const isTimeout = /Script execution timed out/i.test(message);
    return {
      ok: false,
      stdout: logs.join("\n"),
      stderr: isTimeout ? `Execution timed out after ${timeoutMs}ms (possible infinite loop).` : message,
      ms: Date.now() - start
    };
  }
}

async function runViaWandbox(compiler, code, stdin) {
  const start = Date.now();
  try {
    const res = await fetch("https://wandbox.org/api/compile.json", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ compiler, code, stdin: stdin || "" })
    });
    if (!res.ok) {
      return { ok: false, stdout: "", stderr: `Wandbox API Error: ${res.statusText}`, ms: Date.now() - start };
    }
    const data = await res.json();
    const ok = data.status === "0";
    const stdout = (data.program_output || "").slice(0, MAX_OUTPUT);
    const stderr = [data.compiler_error, data.program_error].filter(Boolean).join("\n").slice(0, MAX_OUTPUT);
    return { ok, stdout, stderr, ms: Date.now() - start };
  } catch (err) {
    return { ok: false, stdout: "", stderr: `Network Error: ${err.message}`, ms: Date.now() - start };
  }
}

const RUNNERS = {
  javascript: (code, stdin, timeoutMs) => Promise.resolve(runJavaScript(code, stdin, timeoutMs)),
  python: (code, stdin) => runViaWandbox("cpython-3.11.10", code, stdin),
  cpp: (code, stdin) => runViaWandbox("gcc-13.2.0-c++", code, stdin),
  java: (code, stdin) => runViaWandbox("openjdk-jdk-21+35", code, stdin)
};

async function runCode({ language, code, stdin = "", timeoutMs = TIMEOUT_MS }) {
  if (!code || typeof code !== "string") return { ok: false, stdout: "", stderr: "No code provided.", ms: 0 };
  if (code.length > 20000) return { ok: false, stdout: "", stderr: "Code too long (20,000 char limit).", ms: 0 };
  if (!AVAILABLE[language]) {
    return {
      ok: false, stdout: "", ms: 0,
      stderr: `"${language}" isn't available.`
    };
  }
  return RUNNERS[language](code, stdin, Math.min(timeoutMs, 10000));
}

module.exports = { runCode, AVAILABLE };