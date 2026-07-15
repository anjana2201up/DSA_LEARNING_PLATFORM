// public/js/terminal.js
// A reusable multi-language code terminal. Two modes:
//   - "judge" mode (mountJudge): tied to a specific problem, has Run + Submit,
//     Submit grades against hidden test cases (JavaScript only — see server).
//   - "free" mode (mountFree): plain Run against stdin, any available language.

const Terminal = (() => {
  const LANG_LABELS = { javascript: "JavaScript", python: "Python 3", cpp: "C++", java: "Java" };

  async function getAvailability() {
    if (window.__langCache) return window.__langCache;
    const res = await fetch("/api/languages");
    const data = await res.json();
    window.__langCache = data.available;
    return data.available;
  }

  function langSelectHTML(available, selected) {
    return Object.keys(LANG_LABELS).map(lang => {
      const ok = available[lang];
      return `<option value="${lang}" ${lang === selected ? "selected" : ""} ${ok ? "" : "disabled"}>${LANG_LABELS[lang]}${ok ? "" : " (not installed)"}</option>`;
    }).join("");
  }

  async function mountJudge(host, problem) {
    const available = await getAvailability();
    const starters = problem.starterCode || {};
    let currentLang = available.javascript ? "javascript" : Object.keys(available).find(l => available[l]) || "javascript";

    host.innerHTML = `
      <div class="terminal-shell">
        <div class="lang-select-row">
          <select class="lang-select" id="tLangSelect">${langSelectHTML(available, currentLang)}</select>
          <span class="lang-unavailable-note" id="tAvailNote"></span>
        </div>
        <div class="editor-shell">
          <div class="editor-toolbar">
            <div class="dots"><span></span><span></span><span></span></div>
            <div class="toolbar-actions">
              <button class="reset-btn" id="tResetBtn" type="button">Reset</button>
              <button class="run-btn" id="tRunBtn" type="button" style="margin-right:8px;">▶ Run</button>
              <button class="run-btn" id="tSubmitBtn" type="button">✓ Submit</button>
            </div>
          </div>
          <textarea id="tEditor" spellcheck="false"></textarea>
          <div class="output-panel">
            <div class="output-header">Output</div>
            <pre id="tOutput" class="empty">Run your code, or Submit to check it against the test cases.</pre>
            <div class="exec-meta" id="tMeta"></div>
          </div>
        </div>
        <div id="tJudgeResults"></div>
      </div>`;

    const editor = host.querySelector("#tEditor");
    const langSelect = host.querySelector("#tLangSelect");
    const output = host.querySelector("#tOutput");
    const meta = host.querySelector("#tMeta");
    const results = host.querySelector("#tJudgeResults");
    const availNote = host.querySelector("#tAvailNote");

    function loadStarter(lang) {
      editor.value = starters[lang] || `// ${LANG_LABELS[lang]} starter not provided for this problem.`;
    }
    loadStarter(currentLang);
    availNote.textContent = currentLang !== "javascript" ? "Auto-grading (Submit) works for JavaScript. Other languages: use Run." : "";

    langSelect.addEventListener("change", () => {
      currentLang = langSelect.value;
      loadStarter(currentLang);
      availNote.textContent = currentLang !== "javascript" ? "Auto-grading (Submit) works for JavaScript. Other languages: use Run." : "";
      results.innerHTML = "";
    });

    host.querySelector("#tResetBtn").addEventListener("click", () => loadStarter(currentLang));

    host.querySelector("#tRunBtn").addEventListener("click", async () => {
      setRunning(true);
      output.textContent = "Running…"; output.classList.remove("err", "empty");
      try {
        const res = await fetch(`/api/problems/${problem.id}/run`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ language: currentLang, code: editor.value })
        });
        const data = await res.json();
        output.textContent = (data.stdout || "") + (data.stderr ? `\n${data.stderr}` : "") || "(no output)";
        output.classList.toggle("err", !data.ok);
        meta.textContent = data.ms !== undefined ? `Finished in ${data.ms}ms` : "";
      } catch {
        output.textContent = "Network error — is the server running?"; output.classList.add("err");
      }
      setRunning(false);
    });

    host.querySelector("#tSubmitBtn").addEventListener("click", async () => {
      setRunning(true);
      results.innerHTML = `<p style="color:var(--text-muted)">Grading…</p>`;
      try {
        const token = window.Auth ? Auth.getToken() : null;
        const res = await fetch(`/api/problems/${problem.id}/submit`, {
          method: "POST",
          headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
          body: JSON.stringify({ language: currentLang, code: editor.value })
        });
        const grade = await res.json();
        renderGrade(grade);
      } catch {
        results.innerHTML = `<div class="judge-summary fail">Network error — is the server running?</div>`;
      }
      setRunning(false);
    });

    function renderGrade(grade) {
      if (!grade.ok) {
        results.innerHTML = `<div class="judge-summary fail">${escapeHtml(grade.error || "Could not grade your submission.")}</div>`;
        return;
      }
      const passCount = grade.results.filter(r => r.pass).length;
      const summary = `<div class="judge-summary ${grade.allPass ? "pass" : "fail"}">
        ${grade.allPass ? "✓ All test cases passed!" : `${passCount}/${grade.results.length} test cases passed`}
      </div>`;
      const rows = grade.results.map(r => `
        <div class="test-case-row ${r.pass ? "pass" : "fail"}">
          <div class="tc-line"><b>Test ${r.index + 1}:</b> ${r.pass ? "✓ Passed" : "✗ Failed"}</div>
          <div class="tc-line">Input: ${escapeHtml(JSON.stringify(r.input))}</div>
          <div class="tc-line">Expected: ${escapeHtml(JSON.stringify(r.expected))}</div>
          ${r.error ? `<div class="tc-line">Error: ${escapeHtml(r.error)}</div>` : `<div class="tc-line">Got: ${escapeHtml(JSON.stringify(r.actual))}</div>`}
        </div>`).join("");
      results.innerHTML = summary + rows;
      if (grade.allPass) {
        Auth?.pushProgress?.({ solvedProblemId: problem.id });
      }
    }

    function setRunning(isRunning) {
      host.querySelectorAll("button").forEach(b => b.disabled = isRunning);
    }
  }

  function mountFree(host) {
    let currentLang = "javascript";
    getAvailability().then(available => {
      currentLang = available.javascript ? "javascript" : Object.keys(available).find(l => available[l]) || "javascript";
      host.innerHTML = `
        <div class="lang-select-row">
          <select class="lang-select" id="fLangSelect">${langSelectHTML(available, currentLang)}</select>
          <span class="lang-unavailable-note">Detected on this server at startup — install a compiler and restart to unlock more.</span>
        </div>
        <div class="editor-shell">
          <div class="editor-toolbar">
            <div class="dots"><span></span><span></span><span></span></div>
            <div class="toolbar-actions"><button class="run-btn" id="fRunBtn" type="button">▶ Run</button></div>
          </div>
          <textarea id="fEditor" spellcheck="false">${defaultSnippet(currentLang)}</textarea>
          <div class="output-panel">
            <div class="output-header">stdin (optional)</div>
            <textarea id="fStdin" style="width:100%; min-height:60px; background:#0D0F16; color:var(--text); font-family:var(--font-mono); font-size:0.82rem; border:none; padding:10px; outline:none;" placeholder="Input piped to your program's stdin, if it reads any"></textarea>
            <div class="output-header">Output</div>
            <pre id="fOutput" class="empty">Run your code to see output here.</pre>
            <div class="exec-meta" id="fMeta"></div>
          </div>
        </div>`;

      const editor = host.querySelector("#fEditor");
      const langSelect = host.querySelector("#fLangSelect");
      const stdinBox = host.querySelector("#fStdin");
      const output = host.querySelector("#fOutput");
      const meta = host.querySelector("#fMeta");

      langSelect.addEventListener("change", () => {
        currentLang = langSelect.value;
        editor.value = defaultSnippet(currentLang);
      });

      host.querySelector("#fRunBtn").addEventListener("click", async () => {
        const btn = host.querySelector("#fRunBtn");
        btn.disabled = true; output.textContent = "Running…"; output.classList.remove("err", "empty");
        try {
          const res = await fetch("/api/run", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ language: currentLang, code: editor.value, stdin: stdinBox.value })
          });
          const data = await res.json();
          output.textContent = (data.stdout || "") + (data.stderr ? `\n${data.stderr}` : "") || "(no output)";
          output.classList.toggle("err", !data.ok);
          meta.textContent = data.ms !== undefined ? `Finished in ${data.ms}ms` : "";
        } catch {
          output.textContent = "Network error — is the server running?"; output.classList.add("err");
        }
        btn.disabled = false;
      });
    });
  }

  function defaultSnippet(lang) {
    return {
      javascript: `console.log("Hello from JavaScript!");`,
      python: `print("Hello from Python!")`,
      cpp: `#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n    cout << "Hello from C++!" << endl;\n    return 0;\n}`,
      java: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello from Java!");\n    }\n}`
    }[lang] || "";
  }

  function escapeHtml(str) {
    return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  return { mountJudge, mountFree };
})();