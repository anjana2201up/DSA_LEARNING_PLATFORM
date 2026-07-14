// public/js/compiler.js
// Wires up the "Try it Yourself" code editor: sends code to /api/compile
// (a sandboxed, timeboxed Node vm on the server) and renders the output.
// Exposed as window.Compiler so app.js can attach it after rendering a topic page.

const Compiler = {
  defaultCode(topic) {
    if (topic && topic.code && topic.code.js) return topic.code.js;
    return `// Write JavaScript and press Run\nconsole.log("Hello, DSA Nexus!");`;
  },

  mount(container, topic) {
    const initialCode = this.defaultCode(topic);
    container.innerHTML = `
      <section class="editor-section">
        <h2>Try it Yourself</h2>
        <p class="hint">This runs real JavaScript in a sandboxed server-side environment (3s time limit, output capped). Edit the code and press Run.</p>
        <div class="editor-shell">
          <div class="editor-toolbar">
            <div class="dots"><span></span><span></span><span></span></div>
            <div class="toolbar-actions">
              <button class="reset-btn" id="resetBtn" type="button">Reset</button>
              <button class="run-btn" id="runBtn" type="button">▶ Run</button>
            </div>
          </div>
          <textarea id="codeEditor" spellcheck="false">${escapeHtml(initialCode)}</textarea>
          <div class="output-panel">
            <div class="output-header">Output</div>
            <pre id="output" class="empty">Press Run to see output here…</pre>
            <div class="exec-meta" id="execMeta"></div>
          </div>
        </div>
      </section>`;

    const textarea = container.querySelector("#codeEditor");
    const runBtn = container.querySelector("#runBtn");
    const resetBtn = container.querySelector("#resetBtn");
    const output = container.querySelector("#output");
    const execMeta = container.querySelector("#execMeta");

    // Basic tab-key support inside the textarea for a more editor-like feel
    textarea.addEventListener("keydown", (e) => {
      if (e.key === "Tab") {
        e.preventDefault();
        const start = textarea.selectionStart, end = textarea.selectionEnd;
        textarea.value = textarea.value.slice(0, start) + "  " + textarea.value.slice(end);
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        runBtn.click();
      }
    });

    resetBtn.addEventListener("click", () => {
      textarea.value = initialCode;
      output.textContent = "Press Run to see output here…";
      output.className = "empty";
      execMeta.textContent = "";
    });

    runBtn.addEventListener("click", async () => {
      const code = textarea.value;
      runBtn.disabled = true;
      runBtn.textContent = "Running…";
      output.className = "";
      output.textContent = "Running…";
      try {
        const res = await fetch("/api/compile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code })
        });
        const data = await res.json();
        if (data.ok) {
          output.textContent = data.output && data.output.trim() ? data.output : "(no output — try console.log(...) )";
          output.className = data.output && data.output.trim() ? "" : "empty";
        } else {
          output.textContent = (data.output ? data.output + "\n" : "") + "Error: " + data.error;
          output.className = "err";
        }
        execMeta.textContent = data.ms !== undefined ? `Executed in ${data.ms}ms` : "";
      } catch (err) {
        output.textContent = "Network error: could not reach the compiler endpoint.";
        output.className = "err";
      } finally {
        runBtn.disabled = false;
        runBtn.textContent = "▶ Run";
      }
    });
  }
};

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
