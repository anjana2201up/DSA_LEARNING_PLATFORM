// public/js/highlight.js
// A small, self-contained syntax highlighter for JavaScript code blocks.
// Deliberately not a full tokenizer/AST — just enough regex-based passes
// to make reference code and slide code readable, with zero external
// dependencies (keeps the "HTML/CSS/JS only" constraint intact).
// Exposed as window.highlightJS(code) -> safe HTML string.

const highlightJS = (() => {
  const KEYWORDS = new Set([
    "const","let","var","function","return","if","else","for","while","do",
    "switch","case","break","continue","class","extends","new","this","super",
    "try","catch","finally","throw","typeof","instanceof","in","of","null",
    "undefined","true","false","async","await","yield","static","get","set",
    "import","export","default","from","void","delete"
  ]);

  function escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  // Tokenize with a single combined regex so ordering (comments/strings first)
  // is respected and we never re-highlight inside an already-matched token.
  const TOKEN_RE = new RegExp([
    /(\/\/[^\n]*)/.source,                         // 1: line comment
    /(\/\*[\s\S]*?\*\/)/.source,                    // 2: block comment
    /(`(?:\\.|[^`\\])*`)/.source,                   // 3: template string
    /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')/.source, // 4: string
    /(\b\d+\.?\d*\b)/.source,                       // 5: number
    /([a-zA-Z_$][\w$]*)(?=\s*\()/.source,           // 6: function call name
    /(\b[a-zA-Z_$][\w$]*\b)/.source                 // 7: identifier/keyword
  ].join("|"), "g");

  function highlight(code) {
    let out = "";
    let lastIndex = 0;
    let match;
    TOKEN_RE.lastIndex = 0;
    while ((match = TOKEN_RE.exec(code)) !== null) {
      out += escapeHtml(code.slice(lastIndex, match.index));
      const [full, comment1, comment2, template, str, num, fnCall, ident] = match;
      if (comment1 || comment2) {
        out += `<span class="tok-com">${escapeHtml(full)}</span>`;
      } else if (template || str) {
        out += `<span class="tok-str">${escapeHtml(full)}</span>`;
      } else if (num) {
        out += `<span class="tok-num">${escapeHtml(full)}</span>`;
      } else if (fnCall) {
        out += `<span class="tok-fn">${escapeHtml(full)}</span>`;
      } else if (ident && KEYWORDS.has(ident)) {
        out += `<span class="tok-kw">${escapeHtml(full)}</span>`;
      } else {
        out += escapeHtml(full);
      }
      lastIndex = match.index + full.length;
    }
    out += escapeHtml(code.slice(lastIndex));
    return out;
  }

  return highlight;
})();