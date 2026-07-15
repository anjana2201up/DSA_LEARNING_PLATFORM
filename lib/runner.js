// lib/runner.js
// Executes user-submitted code. JavaScript runs in an in-process V8 sandbox
// (fast, safely timeboxed, no filesystem/network access from inside).
// Other languages shell out to the actual toolchain (python3/g++/javac) IF
// it's installed on the machine running this server — detected once at
// startup so the frontend only offers languages that will really work.
//
// Honesty note: this is a *local* code runner, appropriate for personal or
// small-team use on a trusted machine. It does not sandbox non-JS languages
// (no container/VM isolation) — don't expose this server to the public
// internet without adding OS-level sandboxing (e.g. Docker + seccomp) first.

const { execFile, execFileSync } = require("child_process");
const vm = require("vm");
const fs = require("fs");
const os = require("os");
const path = require("path");
const crypto = require("crypto");

const TIMEOUT_MS = 5000;
const MAX_OUTPUT = 20000;

function commandExists(cmd) {
  try {
    execFileSync(process.platform === "win32" ? "where" : "which", [cmd], { stdio: "ignore" });
    return true;
  } catch { return false; }
}

// Detected once at boot; exported so /api/languages can report it.
const AVAILABLE = {
  javascript: true, // always available (in-process vm)
  python: commandExists("python3") || commandExists("python"),
  cpp: commandExists("g++"),
  java: commandExists("javac") && commandExists("java")
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

function runViaProcess({ command, buildArgs, fileExt, compileCommand, compileArgs }) {
  return (code, stdin, timeoutMs) => new Promise((resolve) => {
    const workDir = fs.mkdtempSync(path.join(os.tmpdir(), "dsa-nexus-"));
    const srcName = `submission${fileExt}`;
    const srcPath = path.join(workDir, srcName);
    fs.writeFileSync(srcPath, code);
    const start = Date.now();

    const cleanup = () => { try { fs.rmSync(workDir, { recursive: true, force: true }); } catch { /* ignore */ } };

    const runFinal = (cmd, args) => {
      const child = execFile(cmd, args, { cwd: workDir, timeout: timeoutMs, maxBuffer: MAX_OUTPUT * 4 }, (err, stdout, stderr) => {
        cleanup();
        resolve({
          ok: !err,
          stdout: (stdout || "").slice(0, MAX_OUTPUT),
          stderr: err ? (err.killed ? `Execution timed out after ${timeoutMs}ms.` : (stderr || err.message || "").slice(0, MAX_OUTPUT)) : (stderr || "").slice(0, MAX_OUTPUT),
          ms: Date.now() - start
        });
      });
      if (stdin) { child.stdin.write(stdin); }
      child.stdin.end();
    };

    if (compileCommand) {
      execFile(compileCommand, compileArgs(srcPath, workDir), { cwd: workDir, timeout: timeoutMs }, (err, _out, compileStderr) => {
        if (err) {
          cleanup();
          return resolve({ ok: false, stdout: "", stderr: `Compile error:\n${compileStderr || err.message}`, ms: Date.now() - start });
        }
        const [finalCmd, finalArgs] = buildArgs(srcPath, workDir);
        runFinal(finalCmd, finalArgs);
      });
    } else {
      const [finalCmd, finalArgs] = buildArgs(srcPath, workDir);
      runFinal(finalCmd, finalArgs);
    }
  });
}

const RUNNERS = {
  javascript: (code, stdin, timeoutMs) => Promise.resolve(runJavaScript(code, stdin, timeoutMs)),

  python: runViaProcess({
    fileExt: ".py",
    buildArgs: (srcPath) => [commandExists("python3") ? "python3" : "python", [srcPath]]
  }),

  cpp: runViaProcess({
    fileExt: ".cpp",
    compileCommand: "g++",
    compileArgs: (srcPath, workDir) => [srcPath, "-O2", "-std=c++17", "-o", path.join(workDir, "a.out")],
    buildArgs: (_srcPath, workDir) => [path.join(workDir, "a.out"), []]
  }),

  java: runViaProcess({
    fileExt: ".java", // note: class must be named "Main" — see starter templates
    compileCommand: "javac",
    compileArgs: (srcPath) => [srcPath],
    buildArgs: (_srcPath, workDir) => ["java", ["-cp", workDir, "Main"]]
  })
};

async function runCode({ language, code, stdin = "", timeoutMs = TIMEOUT_MS }) {
  if (!code || typeof code !== "string") return { ok: false, stdout: "", stderr: "No code provided.", ms: 0 };
  if (code.length > 20000) return { ok: false, stdout: "", stderr: "Code too long (20,000 char limit).", ms: 0 };
  if (!AVAILABLE[language]) {
    return {
      ok: false, stdout: "", ms: 0,
      stderr: `"${language}" isn't available on this server (its compiler/interpreter isn't installed). ` +
              `Available languages here: ${Object.entries(AVAILABLE).filter(([, v]) => v).map(([k]) => k).join(", ")}.`
    };
  }
  return RUNNERS[language](code, stdin, Math.min(timeoutMs, 10000));
}

module.exports = { runCode, AVAILABLE };