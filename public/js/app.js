// public/js/app.js
// Vanilla-JS hash router + renderer for DSA Nexus.
// Routes:
//   #/                      -> home
//   #/topic/:id             -> a DSA topic article + compiler
//   #/pattern/:id           -> a 12-Patterns slide deck
//   #/category/:id          -> topic list for a category
//   #/bookmarks             -> saved topics
//   #/dashboard             -> personal dashboard (requires sign-in)
//   #/problems              -> LeetCode-style problem list
//   #/problem/:id           -> problem detail + judge terminal
//   #/terminal               -> free-form multi-language terminal
//   #/feedback              -> feedback form

const state = {
  categories: [],
  topics: [],
  patterns: [],
  scale: [],
  languages: null
};

const contentEl = document.getElementById("content");
const sidebarContentEl = document.getElementById("sidebarContent");

// ---- Toast notification system ----
function showToast(message, type = "info", durationMs = 4000) {
  const container = document.getElementById("toastContainer");
  if (!container) return;
  const icons = { success: "✓", error: "✗", info: "ℹ" };
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span class="toast-icon">${icons[type] || icons.info}</span>${escapeHtml(message)}`;
  toast.style.setProperty('--toast-duration', durationMs + 'ms');
  toast.querySelector('.toast-icon');
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add("toast-exit");
    setTimeout(() => toast.remove(), 300);
  }, durationMs);
}

// ---- Page transition helper ----
function animatePageIn() {
  contentEl.classList.remove("page-enter");
  void contentEl.offsetWidth; // force reflow
  contentEl.classList.add("page-enter");
}

async function boot() {
  const [catRes, topicRes, patternRes] = await Promise.all([
    fetch("/api/categories").then(r => r.json()),
    fetch("/api/topics").then(r => r.json()),
    fetch("/api/patterns").then(r => r.json())
  ]);
  state.categories = catRes.categories;
  state.scale = catRes.scale;
  state.topics = topicRes.topics;
  state.patterns = patternRes.patterns;

  buildSidebar();
  wireSearch();
  wireMobileNav();
  wireTheme();
  wireXpChip();
  wireScrollProgress();
  wireScrollToTop();
  wireCommandPalette();
  wireDailyTip();
  window.addEventListener("xp:changed", wireXpChip);
  window.addEventListener("hashchange", routeWithAnimation);
  window.addEventListener("hashchange", () => { updatePrimaryNavActive(); });
  window.addEventListener("keydown", handleGlobalKeydown);
  route();
  animatePageIn();
  updatePrimaryNavActive();
}

function updatePrimaryNavActive() {
  const hash = window.location.hash || "#/";
  document.querySelectorAll(".spn-link").forEach(link => {
    link.classList.toggle("active", link.getAttribute("href") === hash || (hash === "#/" && link.getAttribute("href") === "#/"));
  });
}

// ---------------- Sidebar ----------------

function buildSidebar() {
  const catGroups = state.categories.map(cat => {
    const topicsInCat = state.topics.filter(t => t.category === cat.id);
    return `
      <div class="cat-group" data-cat="${cat.id}">
        <button class="cat-header" type="button">
          <span>${cat.label}</span>
          <span class="cat-level level-${cat.level}">${cat.level}</span>
          <span class="chevron">›</span>
        </button>
        <ul class="cat-topics">
          ${topicsInCat.map(t => `<li><a href="#/topic/${t.id}" data-topic="${t.id}" class="${Progress.isComplete(t.id) ? "is-complete" : ""}">${t.title}</a></li>`).join("")}
        </ul>
      </div>`;
  }).join("");

  const patternGroup = `
    <div class="cat-group" data-cat="patterns">
      <button class="cat-header" type="button">
        <span>12 Patterns</span>
        <span class="cat-level level-Advanced">PPT</span>
        <span class="chevron">›</span>
      </button>
      <ul class="cat-topics">
        ${state.patterns.map(p => `<li><a href="#/pattern/${p.id}" data-pattern="${p.id}">${p.title}</a></li>`).join("")}
      </ul>
    </div>`;

  sidebarContentEl.innerHTML = catGroups + patternGroup;

  sidebarContentEl.querySelectorAll(".cat-header").forEach(btn => {
    btn.addEventListener("click", () => {
      btn.parentElement.classList.toggle("open");
    });
  });
}

function highlightSidebar(kind, id) {
  sidebarContentEl.querySelectorAll("a.active").forEach(a => a.classList.remove("active"));
  sidebarContentEl.querySelectorAll(".cat-group").forEach(g => g.classList.remove("open"));
  const selector = kind === "pattern" ? `a[data-pattern="${id}"]` : `a[data-topic="${id}"]`;
  const link = sidebarContentEl.querySelector(selector);
  if (link) {
    link.classList.add("active");
    link.closest(".cat-group").classList.add("open");
    link.scrollIntoView({ block: "nearest" });
  }
  closeMobileSidebar();
}

// ---------------- Router ----------------

function route() {
  const hash = window.location.hash || "#/";
  const [, path, id] = hash.split("/");

  if (path === "topic" && id) return renderTopic(id);
  if (path === "pattern" && id) return renderPattern(id);
  if (path === "category" && id) return renderCategory(id);
  if (path === "bookmarks") return renderBookmarks();
  if (path === "dashboard") return renderDashboard();
  if (path === "problems") return renderProblemsList();
  if (path === "problem" && id) return renderProblemDetail(id);
  if (path === "terminal") return renderTerminalPage();
  if (path === "feedback") return renderFeedback();
  return renderHome();
}

// Wrap route calls to animate page transitions
const _originalRoute = route;
// We override the hashchange callback to add animation
function routeWithAnimation() {
  _originalRoute();
  animatePageIn();
}

// ---------------- Home ----------------

// localStorage key for last visited topic
const LAST_TOPIC_KEY = "dsa-nexus:last-topic";
function getLastTopic() {
  try { return JSON.parse(localStorage.getItem(LAST_TOPIC_KEY) || "null"); } catch { return null; }
}
function setLastTopic(id, title, cat) {
  try { localStorage.setItem(LAST_TOPIC_KEY, JSON.stringify({ id, title, cat })); } catch {}
}

function renderHome() {
  const topicCount = state.topics.length;
  const patternCount = state.patterns.length;
  const completedIds = window.Progress ? [...Progress.completedIds()] : [];
  const completedSet = new Set(completedIds);

  // Pick up where you left off
  const lastTopic = getLastTopic();
  const pickupHtml = lastTopic ? `
    <a class="pickup-card" href="#/topic/${lastTopic.id}">
      <div>
        <div class="pickup-label">📍 Pick up where you left off</div>
        <div class="pickup-title">${lastTopic.title}</div>
        <div style="font-size:0.8rem; color:var(--text-muted); margin-top:4px;">${lastTopic.cat || ''}</div>
      </div>
      <span class="pickup-arrow">→</span>
    </a>` : '';

  // Suggest next unfinished topic
  const nextTopic = state.topics.find(t => !completedSet.has(t.id));
  const nextTopicHtml = nextTopic && !lastTopic ? `
    <div class="next-topic-banner">
      <span class="next-topic-icon">🚀</span>
      <div>
        <div class="next-topic-label">Suggested next</div>
        <div class="next-topic-name">${nextTopic.title}</div>
      </div>
      <a href="#/topic/${nextTopic.id}" class="next-topic-link">Start →</a>
    </div>` : '';

  const catCards = state.categories.map(cat => {
    const count = state.topics.filter(t => t.category === cat.id).length;
    const done = state.topics.filter(t => t.category === cat.id && completedSet.has(t.id)).length;
    const first = state.topics.find(t => t.category === cat.id);
    const pct = count > 0 ? Math.round((done / count) * 100) : 0;
    return `
      <a class="cat-card" href="#/topic/${first ? first.id : ''}">
        <span class="cat-level level-${cat.level}">${cat.level}</span>
        <h3>${cat.label}</h3>
        <p>${count} topic${count !== 1 ? 's' : ''}</p>
        <div class="cat-card-footer">
          <span class="cat-card-progress">${done}/${count} done</span>
          <div style="width:60px; height:4px; border-radius:3px; background:var(--surface-3); overflow:hidden; display:inline-block;">
            <div style="height:100%; width:${pct}%; background:linear-gradient(90deg,var(--accent-2),var(--accent)); border-radius:3px;"></div>
          </div>
          <span class="cat-card-arrow">→</span>
        </div>
      </a>`;
  }).join("");

  const patternCards = state.patterns.map((p, i) => `
    <a class="pattern-card" href="#/pattern/${p.id}">
      <div class="p-num">Pattern ${String(i + 1).padStart(2, "0")}</div>
      <h3>${p.title}</h3>
      <p>${p.tagline}</p>
    </a>`).join("");

  const overallPct = topicCount > 0 ? Math.round((completedIds.length / topicCount) * 100) : 0;

  contentEl.innerHTML = `
    <section class="hero">
      <span class="hero-eyebrow">Basic → Advanced · ${topicCount} topics · ${patternCount} interview patterns</span>
      <h1>Learn Data Structures &amp; <span class="accent">Algorithms</span>,<br/>one clear topic at a time.</h1>
      <p class="lead">A free, self-contained DSA course: real explanations, original diagrams, working code, and a live
        JavaScript compiler built right into every page — no sign-up, no ads.</p>
      <div class="hero-ctas">
        <a class="btn btn-primary" href="#/topic/intro-to-dsa">Start with the basics →</a>
        <a class="btn btn-ghost" href="#/pattern/two-pointers">Explore the 12 Patterns</a>
      </div>
    </section>

    <div class="stat-row">
      <div class="stat"><b>${topicCount}</b><span>DSA topics</span></div>
      <div class="stat"><b>${patternCount}</b><span>Interview patterns</span></div>
      <div class="stat"><b>${state.categories.length}</b><span>Learning tracks</span></div>
      <div class="stat"><b>100%</b><span>Free &amp; open</span></div>
    </div>

    ${pickupHtml}
    ${nextTopicHtml}

    <div class="progress-overview">
      <div class="overall-row">
        <span class="overall-pct">${overallPct}%</span>
        <div class="bar-track"><div class="bar-fill" style="width:${overallPct}%"></div></div>
        <span style="font-size:0.8rem; color:var(--text-muted)">${completedIds.length}/${topicCount} topics</span>
      </div>
    </div>

    <h2 style="font-family:var(--font-display); font-size:1.3rem;">Learning tracks</h2>
    <div class="cat-grid">${catCards}</div>

    <h2 style="font-family:var(--font-display); font-size:1.3rem;">The 12 Patterns (interview prep, slide-deck style)</h2>
    <p style="color:var(--text-muted); margin-top:-6px;">Every classic coding-interview pattern, taught as a short swipeable slide deck. Use the arrow keys, the dots, or swipe.</p>
    <div class="pattern-grid">${patternCards}</div>
  `;
  window.scrollTo(0, 0);
}

// ---------------- Category listing ----------------


function renderCategory(catId) {
  const cat = state.categories.find(c => c.id === catId);
  if (!cat) return renderHome();
  const topics = state.topics.filter(t => t.category === catId);
  const completedIds = window.Progress ? window.Progress.completedIds() : new Set();
  
  contentEl.innerHTML = `
    <div class="crumb"><a href="#/">Home</a><span class="sep">/</span>${cat.label}</div>
    <h1 style="font-family:var(--font-display);">${cat.label}</h1>
    <p style="color:var(--text-muted); margin-bottom:20px;">${topics.length} topics in this track</p>
    <div class="cat-grid">
      ${topics.map((t, i) => {
        const isDone = completedIds.has(t.id);
        return `
        <a class="cat-card" href="#/topic/${t.id}">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <h3 style="margin:0;">${t.title}</h3>
            ${isDone ? '<span style="color:var(--accent); font-size:1.1rem; font-weight:bold;">✓</span>' : `<span style="color:var(--text-faint); font-size:0.8rem;">#${i+1}</span>`}
          </div>
          <p style="margin-top:10px;">${t.summary}</p>
        </a>`;
      }).join("")}
    </div>`;
  window.scrollTo(0, 0);
}

// ---------------- Topic page ----------------

async function renderTopic(id) {
  contentEl.innerHTML = `<p style="color:var(--text-muted);">Loading…</p>`;
  const res = await fetch(`/api/topics/${id}`);
  if (!res.ok) {
    contentEl.innerHTML = `<div class="not-found"><h2>Topic not found</h2><p><a href="#/">Return home</a></p></div>`;
    return;
  }
  const topic = await res.json();
  const cat = state.categories.find(c => c.id === topic.category);
  const idx = state.topics.findIndex(t => t.id === id);
  const prev = state.topics[idx - 1];
  const next = state.topics[idx + 1];

  // Track last visited topic
  setLastTopic(id, topic.title, cat ? cat.label : '');

  // Estimate reading time
  const wordCount = (topic.content || '').replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
  const readMins = Math.max(1, Math.round(wordCount / 200));

  // Related topics (same category)
  const related = state.topics.filter(t => t.category === topic.category && t.id !== id).slice(0, 4);
  const relatedHtml = related.length ? `
    <div class="related-topics-section">
      <h3>Related topics in ${cat ? cat.label : 'this track'}</h3>
      <div class="related-grid">
        ${related.map(t => `
          <a class="related-card" href="#/topic/${t.id}">
            <div class="related-card-title">${t.title}</div>
            <div class="related-card-cat">${escapeHtml((t.summary||'').slice(0,60))}${(t.summary||'').length>60?'...':''}</div>
          </a>`).join('')}
      </div>
    </div>` : '';

  const codeHtml = topic.code && topic.code.js ? `
    <h3 style="font-family:var(--font-display); margin-top:30px;">Reference implementation</h3>
    <div class="code-block-wrap">
      <pre class="slide-code"><code id="refCode">${highlightJS(topic.code.js)}</code></pre>
      <button class="copy-code-btn" id="copyCodeBtn" type="button">Copy</button>
    </div>` : '';

  contentEl.innerHTML = `
    <div class="topic-header">
      <div class="crumb"><a href="#/">Home</a><span class="sep">/</span><a href="#/category/${topic.category}">${cat ? cat.label : ""}</a></div>
      <h1>${topic.title} <span class="reading-time-badge">⏱ ${readMins} min read</span></h1>
      <p class="summary">${topic.summary}</p>
      <div class="topic-actions">
        <button class="action-btn bookmark-btn ${Progress.isBookmarked(id) ? "active" : ""}" id="bookmarkBtn" type="button">
          ${Progress.isBookmarked(id) ? "★ Saved" : "☆ Save for later"}
        </button>
        <button class="action-btn complete-btn ${Progress.isComplete(id) ? "active" : ""}" id="completeBtn" type="button">
          ${Progress.isComplete(id) ? "✓ Completed" : "Mark as complete"}
        </button>
      </div>
    </div>

    <div class="topic-visual-row">
      <div class="diagram-card">
        <div class="card-label">Visual</div>
        <div id="diagramHost"></div>
      </div>
      <div class="dial-card">
        <div class="card-label">Complexity Dial</div>
        <div id="dialHost"></div>
        <div class="dial-badge" id="dialBadge"></div>
        <div class="dial-note">${topic.complexity && topic.complexity.note ? topic.complexity.note : ""}</div>
      </div>
    </div>

    <article class="topic-body" id="topicBody">${topic.content}</article>

    ${codeHtml}

    ${topic.practice && topic.practice.length ? `
      <div class="practice-section">
        <h3>Practice problems that use this</h3>
        <p class="hint">Classic problems built on this concept — search these titles on any judge to practice.</p>
        <div class="chip-row">
          ${topic.practice.map(p => `<a class="chip" target="_blank" rel="noopener" href="https://leetcode.com/problemset/?search=${encodeURIComponent(p)}">${p} ↗</a>`).join("")}
        </div>
      </div>
    ` : ""}

    <div id="editorHost"></div>

    ${relatedHtml}

    <div class="topic-pager">
      ${prev ? `<a class="pager-btn prev" href="#/topic/${prev.id}"><div class="pg-label">← Previous</div><div class="pg-title">${prev.title}</div></a>` : `<span></span>`}
      ${next ? `<a class="pager-btn next" href="#/topic/${next.id}"><div class="pg-label">Next →</div><div class="pg-title">${next.title}</div></a>` : `<span></span>`}
    </div>
  `;

  // Auto-generate TOC from h3 headings
  const headings = contentEl.querySelectorAll('#topicBody h3');
  if (headings.length >= 2) {
    headings.forEach((h, i) => { h.id = `toc-${i}`; });
    const tocHtml = `
      <nav class="toc-panel" aria-label="Table of contents">
        <div class="toc-panel-title">📖 Contents</div>
        <ul class="toc-list">
          ${[...headings].map((h, i) => `<li><a href="#toc-${i}">${h.textContent}</a></li>`).join('')}
        </ul>
      </nav>`;
    contentEl.querySelector('#topicBody').insertAdjacentHTML('beforebegin', tocHtml);
  }

  // Copy code button
  const copyBtn = document.getElementById('copyCodeBtn');
  if (copyBtn && topic.code && topic.code.js) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(topic.code.js).then(() => {
        copyBtn.textContent = '✓ Copied!';
        copyBtn.classList.add('copied');
        setTimeout(() => { copyBtn.textContent = 'Copy'; copyBtn.classList.remove('copied'); }, 2000);
      }).catch(() => {});
    });
  }

  document.getElementById("bookmarkBtn").addEventListener("click", (e) => {
    const active = Progress.toggleBookmark(id);
    e.target.classList.toggle("active", active);
    e.target.textContent = active ? "★ Saved" : "☆ Save for later";
    if (active && window.XP) { XP.earn('bookmark', id); showXpPop('+2 XP'); }
  });
  document.getElementById("completeBtn").addEventListener("click", (e) => {
    const active = Progress.toggleComplete(id);
    e.target.classList.toggle("active", active);
    e.target.textContent = active ? "✓ Completed" : "Mark as complete";
    const sidebarLink = sidebarContentEl.querySelector(`a[data-topic="${id}"]`);
    if (sidebarLink) sidebarLink.classList.toggle("is-complete", active);
    if (active) {
      if (window.XP) { XP.earn('topic', id); showXpPop('+10 XP'); }
      launchConfetti();
      showToast('Topic completed! 🎉', 'success');
    }
  });

  // Diagram
  const diagramHost = document.getElementById("diagramHost");
  if (topic.diagram && Diagrams[topic.diagram]) {
    diagramHost.innerHTML = Diagrams[topic.diagram]();
  }

  // Complexity dial
  renderDial(document.getElementById("dialHost"), topic.complexity ? topic.complexity.time : 2);
  const badge = document.getElementById("dialBadge");
  if (topic.complexity && state.scale[topic.complexity.time] !== undefined) {
    badge.textContent = state.scale[topic.complexity.time];
  }

  // Compiler
  Compiler.mount(document.getElementById("editorHost"), topic);

  highlightSidebar("topic", id);
  window.scrollTo(0, 0);
}


function renderDial(host, scaleIndex) {
  const scale = state.scale && state.scale.length ? state.scale : ["O(1)","O(log n)","O(n)","O(n log n)","O(n^2)","O(2^n)","O(n!)"];
  const n = scale.length;
  const cx = 110, cy = 100, r = 78;
  const angleFor = (i) => Math.PI - (i / (n - 1)) * Math.PI; // 180deg -> 0deg
  const ticks = scale.map((label, i) => {
    const a = angleFor(i);
    const x1 = cx + Math.cos(a) * (r - 8), y1 = cy - Math.sin(a) * (r - 8);
    const x2 = cx + Math.cos(a) * r, y2 = cy - Math.sin(a) * r;
    const lx = cx + Math.cos(a) * (r + 16), ly = cy - Math.sin(a) * (r + 16);
    return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="var(--border-strong)" stroke-width="2"/>
      <text x="${lx}" y="${ly}" text-anchor="middle" font-family="var(--font-mono)" font-size="9" fill="var(--text-faint)">${label}</text>`;
  }).join("");
  const clampedIndex = Math.max(0, Math.min(n - 1, scaleIndex));
  const needleAngle = angleFor(clampedIndex);
  const nx = cx + Math.cos(needleAngle) * (r - 20);
  const ny = cy - Math.sin(needleAngle) * (r - 20);

  host.innerHTML = `<svg viewBox="0 0 220 150" xmlns="http://www.w3.org/2000/svg">
    <path d="M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}" fill="none" stroke="var(--border)" stroke-width="3"/>
    ${ticks}
    <line x1="${cx}" y1="${cy}" x2="${nx}" y2="${ny}" stroke="var(--accent)" stroke-width="3" stroke-linecap="round"/>
    <circle cx="${cx}" cy="${cy}" r="5" fill="var(--accent)"/>
  </svg>`;
}

// ---------------- Pattern (slide deck) page ----------------

async function renderPattern(id) {
  contentEl.innerHTML = `<p style="color:var(--text-muted);">Loading…</p>`;
  const res = await fetch(`/api/patterns/${id}`);
  if (!res.ok) {
    contentEl.innerHTML = `<div class="not-found"><h2>Pattern not found</h2><p><a href="#/">Return home</a></p></div>`;
    return;
  }
  const pattern = await res.json();
  const idx = state.patterns.findIndex(p => p.id === id);
  const prev = state.patterns[idx - 1];
  const next = state.patterns[idx + 1];

  contentEl.innerHTML = `
    <div class="pattern-header">
      <div class="crumb"><a href="#/">Home</a><span class="sep">/</span>12 Patterns</div>
      <h1 style="font-family:var(--font-display);">${pattern.title}</h1>
      <p class="tagline">${pattern.tagline}</p>
    </div>
    <div id="deckHost"></div>
    <div class="topic-pager">
      ${prev ? `<a class="pager-btn prev" href="#/pattern/${prev.id}"><div class="pg-label">← Previous pattern</div><div class="pg-title">${prev.title}</div></a>` : `<span></span>`}
      ${next ? `<a class="pager-btn next" href="#/pattern/${next.id}"><div class="pg-label">Next pattern →</div><div class="pg-title">${next.title}</div></a>` : `<span></span>`}
    </div>
  `;

  Slides.mount(document.getElementById("deckHost"), pattern);
  highlightSidebar("pattern", id);
  window.scrollTo(0, 0);
}

// ---------------- Search ----------------

function wireSearch() {
  const input = document.getElementById("searchInput");
  const resultsBox = document.getElementById("searchResults");
  let debounceTimer;

  input.addEventListener("input", () => {
    clearTimeout(debounceTimer);
    const q = input.value.trim();
    if (!q) { resultsBox.classList.add("hidden"); return; }
    debounceTimer = setTimeout(async () => {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      renderSearchResults(data.results);
    }, 180);
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".search-wrap")) resultsBox.classList.add("hidden");
  });

  function renderSearchResults(results) {
    if (!results.length) {
      resultsBox.innerHTML = `<div class="search-empty">No matching topics or patterns.</div>`;
    } else {
      resultsBox.innerHTML = results.slice(0, 8).map(r => `
        <div class="search-result-item" data-type="${r.type}" data-id="${r.id}">
          <div class="sr-title">${r.title}</div>
          <div class="sr-cat">${r.type === "pattern" ? "12 Patterns" : r.category}</div>
        </div>`).join("");
      resultsBox.querySelectorAll(".search-result-item").forEach(item => {
        item.addEventListener("click", () => {
          const type = item.dataset.type;
          const rid = item.dataset.id;
          window.location.hash = type === "pattern" ? `#/pattern/${rid}` : `#/topic/${rid}`;
          resultsBox.classList.add("hidden");
          input.value = "";
        });
      });
    }
    resultsBox.classList.remove("hidden");
  }
}

// ---------------- Mobile nav ----------------

function wireMobileNav() {
  const hamburger = document.getElementById("hamburger");
  const sidebar = document.getElementById("sidebar");
  const backdrop = document.getElementById("sidebarBackdrop");
  hamburger.addEventListener("click", () => {
    sidebar.classList.toggle("open");
    backdrop.classList.toggle("show");
  });
  backdrop.addEventListener("click", closeMobileSidebar);
}

function closeMobileSidebar() {
  document.getElementById("sidebar").classList.remove("open");
  document.getElementById("sidebarBackdrop").classList.remove("show");
}

// ---------------- Bookmarks page ----------------

function renderBookmarks() {
  const ids = [...Progress.bookmarkedIds()];
  const topics = ids.map(id => state.topics.find(t => t.id === id)).filter(Boolean);
  contentEl.innerHTML = `
    <div class="crumb"><a href="#/">Home</a><span class="sep">/</span>Saved topics</div>
    <h1 style="font-family:var(--font-display);">★ Saved topics</h1>
    ${topics.length ? `<div class="bookmark-grid">${topics.map(t => `
      <a class="cat-card" href="#/topic/${t.id}"><h3>${t.title}</h3><p>${t.summary}</p></a>`).join("")}</div>`
      : `<div class="bookmark-empty">You haven't saved any topics yet. Open a topic and tap <strong>☆ Save for later</strong>.</div>`}
  `;
  window.scrollTo(0, 0);
}

const AVATAR_CHOICES = ["🧑‍💻","🧑‍🎓","🦉","🐙","🐢","🦊","🐼","🚀","🔥","⚡","🌙","🫧"];

async function renderDashboard() {
  let user, stats;

  if (window.Auth && Auth.isSignedIn()) {
    try {
      contentEl.innerHTML = `<p style="color:var(--text-muted);">Loading your dashboard…</p>`;
      const data = await Auth.fetchDashboard();
      user = data.user;
      stats = data.stats;
    } catch (err) {
      console.warn("Failed to fetch dashboard, falling back to guest mode", err);
    }
  }

  // Fallback to Guest Mode if not signed in or if fetch failed
  if (!user || !stats) {
    user = {
      name: "Guest Developer",
      email: "guest@dsanexus.com",
      avatar: "🧑‍💻",
      createdAt: new Date().toISOString(),
      progress: { completedAt: {} }
    };
    stats = {
      percentComplete: 0,
      completedCount: 0,
      totalTopics: state.topics.length || 35,
      solvedProblemCount: 0,
      bookmarkCount: 0,
      totalProblems: 0,
      difficulties: { easy: {total: 0, solved: 0}, medium: {total: 0, solved: 0}, hard: {total: 0, solved: 0} },
      byCategory: {},
      recentSubmissions: [],
      totalSubmissions: 0,
      acceptanceRate: 0,
      solvedAt: {}
    };
  }

  const recent = Object.entries(user.progress.completedAt || {})
    .sort((a, b) => new Date(b[1]) - new Date(a[1])).slice(0, 8);

  // Build heatmap data (last 20 weeks)
  const heatmapWeeks = 20;
  const today = new Date();
  today.setHours(0,0,0,0);
  const dayMs = 86400000;
  // Start from the most recent Sunday, then go back heatmapWeeks weeks
  const todayDay = today.getDay(); // 0=Sun
  const endDate = new Date(today.getTime());
  const startDate = new Date(endDate.getTime() - ((heatmapWeeks * 7 - 1 + todayDay) * dayMs));
  startDate.setHours(0,0,0,0);

  // Count activities per day
  const activityMap = {};
  const allTimestamps = Object.values(user.progress.completedAt || {});
  for (const ts of allTimestamps) {
    const d = new Date(ts);
    d.setHours(0,0,0,0);
    const key = d.toISOString().slice(0,10);
    activityMap[key] = (activityMap[key] || 0) + 1;
  }

  // Generate heatmap cells grouped by week (column) then day (row)
  let heatmapCells = "";
  const totalDays = heatmapWeeks * 7 + todayDay + 1;
  const cellStart = new Date(startDate.getTime());
  // Align to Sunday
  cellStart.setDate(cellStart.getDate() - cellStart.getDay());
  for (let d = 0; d < totalDays; d++) {
    const cellDate = new Date(cellStart.getTime() + d * dayMs);
    const key = cellDate.toISOString().slice(0,10);
    const count = activityMap[key] || 0;
    const isFuture = cellDate > today;
    let level = 0;
    if (count === 1) level = 1;
    else if (count === 2) level = 2;
    else if (count >= 3) level = 3;
    heatmapCells += `<div class="lc-heatmap-cell lc-heat-${isFuture ? 'empty' : level}" title="${key}: ${count} activities"></div>`;
  }

  // Streak calculation
  let currentStreak = 0;
  let checkDate = new Date(today.getTime());
  while (true) {
    const key = checkDate.toISOString().slice(0,10);
    if (activityMap[key]) { currentStreak++; checkDate.setDate(checkDate.getDate() - 1); }
    else break;
  }

  const diff = stats.difficulties || { easy: {total:0,solved:0}, medium: {total:0,solved:0}, hard: {total:0,solved:0} };
  const totalProblems = stats.totalProblems || (diff.easy.total + diff.medium.total + diff.hard.total);

  // XP level section
  const xpTotal = window.XP ? XP.getTotal() : 0;
  const xpLevel = window.XP ? XP.getLevel(xpTotal) : { title: 'Novice', icon: '🌱', color: '#8B90AA' };
  const xpNext = window.XP ? XP.getNextLevel(xpTotal) : null;
  const xpPct = window.XP ? Math.round(XP.getLevelProgress(xpTotal) * 100) : 0;

  contentEl.innerHTML = `
    <!-- XP Level Section -->
    <div class="xp-level-section">
      <div class="xp-level-header">
        <div class="xp-level-badge">
          <span class="xp-level-icon">${xpLevel.icon}</span>
          <div>
            <div class="xp-level-name" style="color:${xpLevel.color}">${xpLevel.title}</div>
            <div class="xp-level-total">${xpTotal} XP total</div>
          </div>
        </div>
        ${xpNext ? `<span style="font-size:0.78rem; color:var(--text-faint)">${xpNext.min - xpTotal} XP to ${xpNext.icon} ${xpNext.title}</span>` : '<span style="font-size:0.78rem;color:var(--accent)">🏆 Max Level!</span>'}
      </div>
      <div class="xp-level-bar-wrap"><div class="xp-level-bar-fill" style="width:${xpPct}%"></div></div>
      <div class="xp-level-sub"><span>Level progress</span><span>${xpPct}%</span></div>
    </div>

    <!-- Profile Header -->
    <div class="lc-profile-header">
      <div class="lc-profile-left">
        <div class="lc-avatar">${user.avatar || "🧑‍💻"}</div>
        <div class="lc-profile-info">
          <div class="lc-name-row">
            <h1 class="lc-username">${user.name}</h1>
            <button class="lc-edit-btn" id="editProfileBtn" type="button">✏️ Edit</button>
          </div>
          <div class="lc-meta">${user.email}</div>
          <div class="lc-meta">Member since ${new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</div>
          ${user.socials && (user.socials.github || user.socials.linkedin || user.socials.leetcode) ? `
          <div class="lc-socials" style="margin-top:8px; display:flex; gap:12px; font-size:0.9rem;">
            ${user.socials.github ? `<a href="${escapeHtml(user.socials.github)}" target="_blank" rel="noopener" style="color:var(--text-faint); text-decoration:none;">GitHub ↗</a>` : ''}
            ${user.socials.linkedin ? `<a href="${escapeHtml(user.socials.linkedin)}" target="_blank" rel="noopener" style="color:var(--text-faint); text-decoration:none;">LinkedIn ↗</a>` : ''}
            ${user.socials.leetcode ? `<a href="${escapeHtml(user.socials.leetcode)}" target="_blank" rel="noopener" style="color:var(--text-faint); text-decoration:none;">LeetCode ↗</a>` : ''}
          </div>` : ''}
        </div>
      </div>
      <div class="lc-profile-right">
        <div class="lc-rank-badge">
          <span class="lc-rank-icon">⭐</span>
          <div>
            <div class="lc-rank-label">Current Streak</div>
            <div class="lc-rank-value">${currentStreak} day${currentStreak !== 1 ? "s" : ""}</div>
          </div>
        </div>
        <button class="btn btn-ghost dash-signout" id="signOutBtn" type="button">Sign out</button>
      </div>
    </div>

    <!-- Edit Profile Panel -->
    <div id="editProfilePanel" class="lc-edit-panel" style="display:none;">
      <label class="lc-edit-label">Display name</label>
      <input id="editNameInput" type="text" value="${user.name}" class="lc-edit-input" />
      <label class="lc-edit-label">Email</label>
      <input id="editEmailInput" type="email" value="${user.email}" class="lc-edit-input" />
      <label class="lc-edit-label">GitHub URL</label>
      <input id="editGithubInput" type="url" value="${user.socials?.github || ''}" placeholder="https://github.com/yourusername" class="lc-edit-input" />
      <label class="lc-edit-label">LinkedIn URL</label>
      <input id="editLinkedinInput" type="url" value="${user.socials?.linkedin || ''}" placeholder="https://linkedin.com/in/yourusername" class="lc-edit-input" />
      <label class="lc-edit-label">LeetCode URL</label>
      <input id="editLeetcodeInput" type="url" value="${user.socials?.leetcode || ''}" placeholder="https://leetcode.com/u/yourusername" class="lc-edit-input" />
      <label class="lc-edit-label">Avatar</label>
      <div class="avatar-picker">
        ${AVATAR_CHOICES.map(a => `<span class="avatar-option ${a === user.avatar ? "selected" : ""}" data-avatar="${a}">${a}</span>`).join("")}
      </div>
      <button class="btn btn-primary" id="saveProfileBtn" type="button">Save changes</button>
    </div>

    <!-- Stat Cards Row -->
    <div class="lc-stat-row">
      <div class="lc-stat-card lc-stat-accent">
        <div class="lc-stat-number">${stats.percentComplete}%</div>
        <div class="lc-stat-label">Overall Progress</div>
        <div class="lc-stat-bar"><div class="lc-stat-bar-fill" style="width:${stats.percentComplete}%"></div></div>
      </div>
      <div class="lc-stat-card">
        <div class="lc-stat-number">${stats.completedCount}<span class="lc-stat-total">/${stats.totalTopics}</span></div>
        <div class="lc-stat-label">Topics Completed</div>
      </div>
      <div class="lc-stat-card">
        <div class="lc-stat-number">${stats.solvedProblemCount}<span class="lc-stat-total">/${totalProblems}</span></div>
        <div class="lc-stat-label">Problems Solved</div>
      </div>
      <div class="lc-stat-card">
        <div class="lc-stat-number">${stats.bookmarkCount}</div>
        <div class="lc-stat-label">Bookmarks</div>
      </div>
    </div>

    <!-- Charts Row: Doughnut + Bar -->
    <div class="lc-charts-row">
      <div class="lc-chart-card lc-doughnut-card">
        <h2 class="lc-section-title">Problem Solving</h2>
        <div class="lc-doughnut-wrap">
          <canvas id="difficultyChart" width="220" height="220"></canvas>
          <div class="lc-doughnut-center">
            <div class="lc-doughnut-num">${stats.solvedProblemCount}</div>
            <div class="lc-doughnut-sub">Solved</div>
          </div>
        </div>
        <div class="lc-diff-legend">
          <div class="lc-diff-item"><span class="lc-diff-dot" style="background:#00B8A3;"></span>Easy <b>${diff.easy.solved}/${diff.easy.total}</b></div>
          <div class="lc-diff-item"><span class="lc-diff-dot" style="background:#FFC01E;"></span>Medium <b>${diff.medium.solved}/${diff.medium.total}</b></div>
          <div class="lc-diff-item"><span class="lc-diff-dot" style="background:#FF375F;"></span>Hard <b>${diff.hard.solved}/${diff.hard.total}</b></div>
        </div>
      </div>
      <div class="lc-chart-card lc-bar-card">
        <h2 class="lc-section-title">Topic Progress by Track</h2>
        <canvas id="progressChart" width="400" height="220"></canvas>
      </div>
    </div>

    <!-- Activity Heatmap -->
    <div class="lc-heatmap-card">
      <h2 class="lc-section-title">📅 Activity Heatmap <span class="lc-heatmap-subtitle">(last ${heatmapWeeks} weeks)</span></h2>
      <div class="lc-heatmap-grid" style="grid-template-columns: repeat(${Math.ceil(totalDays/7)}, 1fr);">${heatmapCells}</div>
      <div class="lc-heatmap-legend">
        <span class="lc-heatmap-leg-label">Less</span>
        <div class="lc-heatmap-cell lc-heat-0"></div>
        <div class="lc-heatmap-cell lc-heat-1"></div>
        <div class="lc-heatmap-cell lc-heat-2"></div>
        <div class="lc-heatmap-cell lc-heat-3"></div>
        <span class="lc-heatmap-leg-label">More</span>
      </div>
    </div>

    <!-- Recent Submissions -->
    ${(stats.recentSubmissions && stats.recentSubmissions.length) ? `
    <div class="lc-chart-card" style="margin-bottom:24px;">
      <h2 class="lc-section-title">📝 Recent Submissions</h2>
      <div style="overflow-x:auto;">
        <table class="submissions-table">
          <thead><tr><th>Problem</th><th>Difficulty</th><th>Language</th><th>Status</th><th>Time</th></tr></thead>
          <tbody>
            ${stats.recentSubmissions.slice(0, 10).map(s => `
              <tr>
                <td>${escapeHtml(s.title || s.problemId)}</td>
                <td><span class="diff-badge diff-${s.difficulty}" style="font-size:0.7rem;">${s.difficulty}</span></td>
                <td style="font-family:var(--font-mono); font-size:0.8rem;">${s.language}</td>
                <td><span class="sub-status ${s.pass ? 'pass' : 'fail'}">${s.pass ? '✓ Accepted' : '✗ Failed'}</span></td>
                <td style="color:var(--text-faint); font-size:0.8rem; white-space:nowrap;">${new Date(s.timestamp).toLocaleDateString()}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
      <p style="color:var(--text-faint); font-size:0.8rem; margin-top:10px;">Acceptance rate: <b style="color:var(--accent);">${stats.acceptanceRate}%</b> (${stats.totalSubmissions} total)</p>
    </div>` : ``}

    <!-- Two-column: Recent Activity + Leaderboard -->
    <div class="lc-bottom-row">
      <div class="lc-chart-card">
        <h2 class="lc-section-title">📋 Recently Completed Topics</h2>
        ${recent.length ? `<ul class="lc-activity-list">
          ${recent.map(([topicId, ts]) => {
            const t = state.topics.find(x => x.id === topicId);
            return `<li class="lc-activity-item"><span class="lc-activity-check">✓</span><a href="#/topic/${topicId}">${t ? t.title : topicId}</a><span class="lc-activity-date">${new Date(ts).toLocaleDateString()}</span></li>`;
          }).join("")}
        </ul>` : `<p style="color:var(--text-muted);">Nothing completed yet — head to <a href="#/" style="color:var(--accent);">the topics</a> and start learning!</p>`}
      </div>
      <div class="lc-chart-card">
        <h2 class="lc-section-title">🏆 Global Leaderboard</h2>
        <div id="leaderboardHost"><p style="color:var(--text-muted);">Loading leaderboard...</p></div>
      </div>
    </div>
  `;

  // --- Doughnut Chart (Problem Difficulty) ---
  const dctx = document.getElementById('difficultyChart').getContext('2d');
  const solvedData = [diff.easy.solved, diff.medium.solved, diff.hard.solved];
  const unsolvedTotal = totalProblems - stats.solvedProblemCount;
  new Chart(dctx, {
    type: 'doughnut',
    data: {
      labels: ['Easy', 'Medium', 'Hard', 'Unsolved'],
      datasets: [{
        data: [...solvedData, Math.max(unsolvedTotal, 0)],
        backgroundColor: ['#00B8A3', '#FFC01E', '#FF375F', 'rgba(255,255,255,0.06)'],
        borderWidth: 0,
        hoverOffset: 6
      }]
    },
    options: {
      responsive: true,
      cutout: '75%',
      plugins: {
        legend: { display: false },
        tooltip: {
          filter: (item) => item.dataIndex < 3
        }
      }
    }
  });

  // --- Bar Chart (Topics by Category) ---
  const bctx = document.getElementById('progressChart').getContext('2d');
  const catLabels = [];
  const catDone = [];
  const catTotal = [];
  state.categories.forEach(cat => {
    const c = (stats.byCategory || {})[cat.id] || { total: 0, done: 0 };
    catLabels.push(cat.label);
    catDone.push(c.done);
    catTotal.push(c.total - c.done);
  });
  new Chart(bctx, {
    type: 'bar',
    data: {
      labels: catLabels,
      datasets: [
        { label: 'Completed', data: catDone, backgroundColor: '#00B8A3', borderRadius: 4 },
        { label: 'Remaining', data: catTotal, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 4 }
      ]
    },
    options: {
      responsive: true,
      scales: {
        x: { stacked: true, ticks: { color: 'gray', font: { size: 10 } }, grid: { display: false } },
        y: { stacked: true, beginAtZero: true, ticks: { stepSize: 1, color: 'gray' }, grid: { color: 'rgba(255,255,255,0.05)' } }
      },
      plugins: { legend: { labels: { color: 'gray', font: { size: 11 } } } }
    }
  });

  // --- Leaderboard ---
  fetch('/api/me/leaderboard')
    .then(res => res.json())
    .then(lb => {
      const host = document.getElementById('leaderboardHost');
      if (!lb.leaderboard || lb.leaderboard.length === 0) {
        host.innerHTML = `<p style="color:var(--text-muted);">No users ranked yet. Be the first!</p>`;
        return;
      }
      const medals = ['🥇','🥈','🥉'];
      host.innerHTML = `
        <div class="lc-leaderboard">
          ${lb.leaderboard.map((u, i) => {
            const isMe = u.id === user.id;
            return `<div class="lc-lb-row ${isMe ? 'lc-lb-me' : ''}">
              <span class="lc-lb-rank">${i < 3 ? medals[i] : '#' + (i+1)}</span>
              <span class="lc-lb-avatar">${u.avatar || '🧑‍💻'}</span>
              <span class="lc-lb-name">${u.name}${isMe ? ' <span class="lc-lb-you">(you)</span>' : ''}</span>
              <span class="lc-lb-score">${u.solvedCount + u.completedCount} pts</span>
            </div>`;
          }).join("")}
        </div>
      `;
    })
    .catch(() => {
      document.getElementById('leaderboardHost').innerHTML = `<p style="color:var(--text-muted);">Failed to load leaderboard.</p>`;
    });

  // --- Event Listeners ---
  document.getElementById("signOutBtn").addEventListener("click", () => {
    window.location.href = "/";
  });
  document.getElementById("editProfileBtn").addEventListener("click", () => {
    const panel = document.getElementById("editProfilePanel");
    panel.style.display = panel.style.display === "none" ? "block" : "none";
  });
  let selectedAvatar = user.avatar;
  document.querySelectorAll(".avatar-option").forEach(opt => {
    opt.addEventListener("click", () => {
      document.querySelectorAll(".avatar-option").forEach(o => o.classList.remove("selected"));
      opt.classList.add("selected");
      selectedAvatar = opt.dataset.avatar;
    });
  });
  document.getElementById("saveProfileBtn").addEventListener("click", async () => {
    const name = document.getElementById("editNameInput").value.trim();
    const email = document.getElementById("editEmailInput").value.trim();
    const github = document.getElementById("editGithubInput").value.trim();
    const linkedin = document.getElementById("editLinkedinInput").value.trim();
    const leetcode = document.getElementById("editLeetcodeInput").value.trim();
    try {
      await Auth.updateProfile({ name, email, github, linkedin, leetcode, avatar: selectedAvatar });
      showToast("Profile updated successfully!", "success");
      renderDashboard();
    } catch (err) {
      showToast(err.message, "error");
    }
  });

  window.scrollTo(0, 0);
}

// ---------------- Problems list + detail ----------------

async function renderProblemsList() {
  contentEl.innerHTML = `<p style="color:var(--text-muted);">Loading problems…</p>`;
  const res = await fetch("/api/problems");
  const data = await res.json();
  const solved = [];

  const easyCount = data.problems.filter(p => p.difficulty.toLowerCase() === 'easy').length;
  const mediumCount = data.problems.filter(p => p.difficulty.toLowerCase() === 'medium').length;
  const hardCount = data.problems.filter(p => p.difficulty.toLowerCase() === 'hard').length;

  contentEl.innerHTML = `
    <div class="crumb"><a href="#/">Home</a><span class="sep">/</span>Problems</div>
    <h1 style="font-family:var(--font-display);">🧩 Practice Problems</h1>
    <p style="color:var(--text-muted); margin-bottom:20px;">${data.total} classic problems. JavaScript submissions are auto-graded against hidden test cases; other available languages can be run freely.</p>
    <div class="problem-filters">
      <div class="diff-filter-tabs">
        <button class="diff-filter-tab active" data-diff="all" type="button">All<span class="filter-count">${data.total}</span></button>
        <button class="diff-filter-tab" data-diff="easy" type="button">Easy<span class="filter-count">${easyCount}</span></button>
        <button class="diff-filter-tab" data-diff="medium" type="button">Medium<span class="filter-count">${mediumCount}</span></button>
        <button class="diff-filter-tab" data-diff="hard" type="button">Hard<span class="filter-count">${hardCount}</span></button>
      </div>
      <input type="text" class="problem-search" id="problemSearch" placeholder="Search problems…" />
      <button class="solved-filter" id="solvedFilter" type="button">✓ Show Solved Only</button>
    </div>
    <div class="problem-grid" id="problemGrid">
      ${renderProblemRows(data.problems, solved)}
    </div>`;

  // Wire up filters
  const grid = document.getElementById("problemGrid");
  let currentDiff = "all";
  let currentSearch = "";
  let showSolvedOnly = false;

  function applyFilters() {
    const filtered = data.problems.filter(p => {
      const matchDiff = currentDiff === "all" || p.difficulty.toLowerCase() === currentDiff;
      const matchSearch = !currentSearch || p.title.toLowerCase().includes(currentSearch) || p.tags.some(t => t.toLowerCase().includes(currentSearch));
      const matchSolved = !showSolvedOnly || solved.includes(p.id);
      return matchDiff && matchSearch && matchSolved;
    });
    grid.innerHTML = renderProblemRows(filtered, solved);
  }

  document.querySelectorAll(".diff-filter-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".diff-filter-tab").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      currentDiff = tab.dataset.diff;
      applyFilters();
    });
  });

  document.getElementById("problemSearch").addEventListener("input", (e) => {
    currentSearch = e.target.value.toLowerCase().trim();
    applyFilters();
  });

  document.getElementById("solvedFilter").addEventListener("click", (e) => {
    showSolvedOnly = !showSolvedOnly;
    e.currentTarget.classList.toggle("active", showSolvedOnly);
    applyFilters();
  });

  window.scrollTo(0, 0);
}

function renderProblemRows(problems, solved) {
  if (!problems.length) return `<p style="color:var(--text-muted); padding:20px 0;">No problems match your filters.</p>`;
  return problems.map(p => `
    <a class="problem-row" href="#/problem/${p.id}">
      <span class="diff-badge diff-${p.difficulty}">${p.difficulty}</span>
      <span class="pr-title">${p.title}</span>
      <span class="pr-tags">${p.tags.map(t => `<span class="pr-tag">${t}</span>`).join("")}</span>
      ${solved.includes(p.id) ? `<span class="pr-solved">✓ Solved</span>` : ""}
    </a>`).join("");
}

async function renderProblemDetail(id) {
  contentEl.innerHTML = `<p style="color:var(--text-muted);">Loading…</p>`;
  const res = await fetch(`/api/problems/${id}`);
  if (!res.ok) {
    contentEl.innerHTML = `<div class="not-found"><h2>Problem not found</h2><p><a href="#/problems">Back to problems</a></p></div>`;
    return;
  }
  const problem = await res.json();

  contentEl.innerHTML = `
    <div class="crumb"><a href="#/">Home</a><span class="sep">/</span><a href="#/problems">Problems</a><span class="sep">/</span>${problem.title}</div>
    <div class="problem-detail-layout">
      <div class="problem-statement">
        <span class="diff-badge diff-${problem.difficulty}">${problem.difficulty}</span>
        <h1>${problem.title}</h1>
        <div>${problem.description}</div>
        ${problem.examples.map((ex, i) => `
          <div class="example-block">
            <b>Example ${i + 1}:</b><br/>
            Input: ${escapeHtml(ex.input)}<br/>
            Output: ${escapeHtml(ex.output)}
            ${ex.explanation ? `<br/>Explanation: ${escapeHtml(ex.explanation)}` : ""}
          </div>`).join("")}
        <h3 style="font-family:var(--font-display); font-size:0.95rem;">Constraints</h3>
        <ul class="constraint-list">${problem.constraints.map(c => `<li>${escapeHtml(c)}</li>`).join("")}</ul>
      </div>
      <div id="judgeHost"></div>
    </div>
  `;
  Terminal.mountJudge(document.getElementById("judgeHost"), problem);
  window.scrollTo(0, 0);
}

// ---------------- Free-form terminal page ----------------

function renderTerminalPage() {
  contentEl.innerHTML = `
    <div class="crumb"><a href="#/">Home</a><span class="sep">/</span>Terminal</div>
    <h1 style="font-family:var(--font-display);">⌨️ Terminal</h1>
    <p style="color:var(--text-muted); margin-bottom:20px;">Run a snippet in any language available on this server. Nothing is graded here — for graded problems, see <a href="#/problems" style="color:var(--accent);">Problems</a>.</p>
    <div class="terminal-page-layout" id="freeTerminalHost"></div>
  `;
  Terminal.mountFree(document.getElementById("freeTerminalHost"));
  window.scrollTo(0, 0);
}

// ---------------- Feedback page ----------------

function renderFeedback() {
  contentEl.innerHTML = `
    <div class="crumb"><a href="#/">Home</a><span class="sep">/</span>Feedback</div>
    <h1 style="font-family:var(--font-display);">💬 Feedback</h1>
    <p style="color:var(--text-muted); margin-bottom:20px;">Something confusing, broken, or missing? Tell us.</p>
    <form class="feedback-form" id="feedbackForm">
      <div class="form-row" style="margin-bottom:14px;">
        <label style="font-size:0.8rem; color:var(--text-muted); font-weight:600;">Your rating</label>
        <div class="star-picker" id="starPicker">${[1,2,3,4,5].map(n => `<span data-val="${n}">★</span>`).join("")}</div>
      </div>
      <div class="form-row" style="margin-bottom:14px; display:flex; flex-direction:column; gap:6px;">
        <label style="font-size:0.8rem; color:var(--text-muted); font-weight:600;">Message</label>
        <textarea id="feedbackMessage" required rows="5" style="padding:10px 12px; border-radius:8px; border:1px solid var(--border-strong); background:var(--surface-2); color:var(--text); font-family:var(--font-body); resize:vertical;" placeholder="What worked, what didn't, what you'd like to see…"></textarea>
      </div>
      <div class="auth-error hidden" id="feedbackError"></div>
      <button type="submit" class="btn btn-primary">Send feedback</button>
    </form>
  `;

  let rating = 0;
  document.querySelectorAll("#starPicker span").forEach(star => {
    star.addEventListener("click", () => {
      rating = Number(star.dataset.val);
      document.querySelectorAll("#starPicker span").forEach(s => s.classList.toggle("active", Number(s.dataset.val) <= rating));
    });
  });

  document.getElementById("feedbackForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const errBox = document.getElementById("feedbackError");
    errBox.classList.add("hidden");
    const message = document.getElementById("feedbackMessage").value.trim();
    if (!rating) { errBox.textContent = "Please pick a star rating."; errBox.classList.remove("hidden"); return; }
    try {
      const token = window.Auth ? Auth.getToken() : null;
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ message, rating })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not send feedback.");
      showToast("Thank you for your feedback!", "success");
      contentEl.innerHTML = `<div class="feedback-thanks"><h2>🙏 Thank you!</h2><p style="color:var(--text-muted);">Your feedback helps make this better.</p><a href="#/" class="btn btn-primary" style="margin-top:16px; display:inline-flex;">Back home</a></div>`;
    } catch (err) {
      showToast(err.message, "error");
      errBox.textContent = err.message; errBox.classList.remove("hidden");
    }
  });
  window.scrollTo(0, 0);
}

// ---------------- Theme toggle (dark -> aurora -> light -> dark) ----------------

function wireTheme() {
  const btn = document.getElementById("themeToggle");
  const order = ["dark", "aurora", "light"];
  btn.addEventListener("click", () => {
    const current = Progress.getTheme();
    const next = order[(order.indexOf(current) + 1) % order.length];
    Progress.setTheme(next);
  });
}


// ---------------- Keyboard shortcuts ----------------

function handleGlobalKeydown(e) {
  const tag = (document.activeElement && document.activeElement.tagName) || "";
  const typing = tag === "INPUT" || tag === "TEXTAREA";
  // Ctrl+K or Cmd+K → open command palette
  if ((e.ctrlKey || e.metaKey) && e.key === "k") {
    e.preventDefault();
    openCommandPalette();
    return;
  }
  if (e.key === "/" && !typing) {
    e.preventDefault();
    openCommandPalette();
  } else if (e.key === "Escape") {
    document.getElementById("searchResults").classList.add("hidden");
    closeCommandPalette();
    closeMobileSidebar();
    if (typing) document.activeElement.blur();
  }
}

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// ---- XP Chip ----
function wireXpChip() {
  const host = document.getElementById('xpChipHost');
  if (!host || !window.XP) return;
  host.innerHTML = XP.renderChip();
}

// ---- Scroll Progress Bar ----
function wireScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const pct = scrollable > 0 ? window.scrollY / scrollable : 0;
    bar.style.transform = `scaleX(${pct})`;
  }, { passive: true });
}

// ---- Scroll To Top ----
function wireScrollToTop() {
  const btn = document.getElementById('scrollToTopBtn');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ---- Command Palette ----
let cmdPaletteOpen = false;
let cmdFocusedIndex = -1;

function openCommandPalette() {
  const pal = document.getElementById('cmdPalette');
  const inp = document.getElementById('cmdInput');
  if (!pal) return;
  cmdPaletteOpen = true;
  pal.classList.add('open');
  inp.value = '';
  cmdFocusedIndex = -1;
  renderCmdResults('');
  setTimeout(() => inp.focus(), 50);
}

function closeCommandPalette() {
  const pal = document.getElementById('cmdPalette');
  if (!pal) return;
  cmdPaletteOpen = false;
  pal.classList.remove('open');
}

function renderCmdResults(query) {
  const host = document.getElementById('cmdResults');
  if (!host) return;
  const q = query.toLowerCase().trim();

  const topicResults = state.topics.filter(t =>
    t.title.toLowerCase().includes(q) || (t.summary||'').toLowerCase().includes(q)
  ).slice(0, 5);

  const patternResults = state.patterns.filter(p =>
    p.title.toLowerCase().includes(q) || (p.tagline||'').toLowerCase().includes(q)
  ).slice(0, 3);

  if (!q && topicResults.length === 0 && patternResults.length === 0) {
    host.innerHTML = `<div class="cmd-empty">Start typing to search topics, patterns &amp; problems…</div>`;
    return;
  }

  let html = '';
  if (topicResults.length) {
    html += `<div class="cmd-section-label">Topics</div>`;
    html += topicResults.map(t => `
      <div class="cmd-item" data-href="#/topic/${t.id}" tabindex="-1">
        <span class="cmd-item-icon topic">📚</span>
        <div><div class="cmd-item-title">${t.title}</div><div class="cmd-item-sub">${(t.summary||'').slice(0,60)}</div></div>
      </div>`).join('');
  }
  if (patternResults.length) {
    html += `<div class="cmd-section-label">Patterns</div>`;
    html += patternResults.map(p => `
      <div class="cmd-item" data-href="#/pattern/${p.id}" tabindex="-1">
        <span class="cmd-item-icon pattern">⚡</span>
        <div><div class="cmd-item-title">${p.title}</div><div class="cmd-item-sub">${p.tagline||''}</div></div>
      </div>`).join('');
  }
  if (!html) {
    html = `<div class="cmd-empty">No results for "<strong>${escapeHtml(query)}</strong>"</div>`;
  }
  host.innerHTML = html;
  cmdFocusedIndex = -1;

  host.querySelectorAll('.cmd-item').forEach(item => {
    item.addEventListener('click', () => {
      const href = item.dataset.href;
      if (href) window.location.hash = href.replace('#', '');
      closeCommandPalette();
    });
  });
}

function wireCommandPalette() {
  const pal = document.getElementById('cmdPalette');
  const inp = document.getElementById('cmdInput');
  const host = document.getElementById('cmdResults');
  if (!pal || !inp) return;

  pal.addEventListener('click', (e) => {
    if (e.target === pal) closeCommandPalette();
  });

  inp.addEventListener('input', () => renderCmdResults(inp.value));

  inp.addEventListener('keydown', (e) => {
    const items = host ? [...host.querySelectorAll('.cmd-item')] : [];
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      cmdFocusedIndex = Math.min(cmdFocusedIndex + 1, items.length - 1);
      items.forEach((el, i) => el.classList.toggle('focused', i === cmdFocusedIndex));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      cmdFocusedIndex = Math.max(cmdFocusedIndex - 1, 0);
      items.forEach((el, i) => el.classList.toggle('focused', i === cmdFocusedIndex));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (cmdFocusedIndex >= 0 && items[cmdFocusedIndex]) {
        const href = items[cmdFocusedIndex].dataset.href;
        if (href) window.location.hash = href.replace('#', '');
        closeCommandPalette();
      }
    } else if (e.key === 'Escape') {
      closeCommandPalette();
    }
  });
}

// ---- Daily Tip Rotation ----
const DSA_TIPS = [
  "Always clarify constraints before writing code in an interview.",
  "Two Pointers can reduce O(n²) nested loops to O(n) for sorted arrays.",
  "BFS is best for shortest path in unweighted graphs; Dijkstra for weighted.",
  "Memoization = top-down DP. Tabulation = bottom-up DP. Both are valid.",
  "Sliding Window avoids recomputing overlapping sub-arrays — think O(n) not O(n²).",
  "Hash Maps give O(1) average lookup. Use them to trade memory for speed.",
  "Recursion always has a call-stack cost. Consider iteration for deep trees.",
  "Binary Search works on any monotonic function, not just sorted arrays.",
  "Heaps (priority queues) are the go-to for 'top K elements' problems.",
  "Union-Find (Disjoint Set) is perfect for cycle detection and connected components.",
  "Think about edge cases: empty input, single element, duplicates, overflow.",
  "Start with brute force, then optimize. Never start with the optimal solution.",
];

let tipTimer = null;
function wireDailyTip() {
  const host = document.getElementById('sidebarTipHost');
  if (!host) return;
  let idx = Math.floor(Math.random() * DSA_TIPS.length);
  const render = () => {
    host.innerHTML = `<div class="sidebar-tip"><strong>💡 DSA Tip</strong>${DSA_TIPS[idx]}</div>`;
    idx = (idx + 1) % DSA_TIPS.length;
  };
  render();
  if (tipTimer) clearInterval(tipTimer);
  tipTimer = setInterval(render, 30000);
}

// ---- Confetti ----
function launchConfetti() {
  const canvas = document.getElementById('confettiCanvas');
  if (!canvas) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx = canvas.getContext('2d');
  const pieces = [];
  const COLORS = ['#E8A33D','#3DDBD9','#6FCF97','#E85DA8','#9D8CFF','#FFD700'];
  for (let i = 0; i < 120; i++) {
    pieces.push({
      x: Math.random() * canvas.width,
      y: -10 - Math.random() * 200,
      w: 6 + Math.random() * 8,
      h: 10 + Math.random() * 10,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      rot: Math.random() * Math.PI * 2,
      vx: (Math.random() - 0.5) * 3,
      vy: 2 + Math.random() * 4,
      vr: (Math.random() - 0.5) * 0.2,
    });
  }
  let frame;
  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;
    for (const p of pieces) {
      p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.vy += 0.05;
      if (p.y < canvas.height + 20) alive = true;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0, 1 - p.y / canvas.height);
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    }
    if (alive) frame = requestAnimationFrame(draw);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  };
  if (frame) cancelAnimationFrame(frame);
  draw();
}

// ---- XP Popup ----
function showXpPop(text) {
  const el = document.createElement('div');
  el.className = 'xp-earned-pop';
  el.textContent = text;
  el.style.left = (window.innerWidth / 2 - 30) + 'px';
  el.style.top = (window.innerHeight * 0.4) + 'px';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1000);
}

boot();