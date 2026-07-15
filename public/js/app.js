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
  wireAuthArea();
  wireAuthModal();
  window.addEventListener("hashchange", route);
  window.addEventListener("hashchange", updatePrimaryNavActive);
  window.addEventListener("auth:changed", wireAuthArea);
  window.addEventListener("keydown", handleGlobalKeydown);
  route();
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

// ---------------- Home ----------------

function renderHome() {
  const topicCount = state.topics.length;
  const patternCount = state.patterns.length;
  const catCards = state.categories.map(cat => {
    const count = state.topics.filter(t => t.category === cat.id).length;
    const first = state.topics.find(t => t.category === cat.id);
    return `
      <a class="cat-card" href="#/topic/${first ? first.id : ''}">
        <span class="cat-level level-${cat.level}">${cat.level}</span>
        <h3>${cat.label}</h3>
        <p>${count} topic${count !== 1 ? "s" : ""} covered</p>
        <div class="count">→ start learning</div>
      </a>`;
  }).join("");

  const patternCards = state.patterns.map((p, i) => `
    <a class="pattern-card" href="#/pattern/${p.id}">
      <div class="p-num">Pattern ${String(i + 1).padStart(2, "0")}</div>
      <h3>${p.title}</h3>
      <p>${p.tagline}</p>
    </a>`).join("");

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
  contentEl.innerHTML = `
    <div class="crumb"><a href="#/">Home</a><span class="sep">/</span>${cat.label}</div>
    <h1 style="font-family:var(--font-display);">${cat.label}</h1>
    <div class="cat-grid">
      ${topics.map(t => `
        <a class="cat-card" href="#/topic/${t.id}">
          <h3>${t.title}</h3>
          <p>${t.summary}</p>
        </a>`).join("")}
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

  contentEl.innerHTML = `
    <div class="topic-header">
      <div class="crumb"><a href="#/">Home</a><span class="sep">/</span><a href="#/category/${topic.category}">${cat ? cat.label : ""}</a></div>
      <h1>${topic.title}</h1>
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

    <article class="topic-body">${topic.content}</article>

    ${topic.code && topic.code.js ? `
      <h3 style="font-family:var(--font-display); margin-top:30px;">Reference implementation</h3>
      <pre class="slide-code"><code>${highlightJS(topic.code.js)}</code></pre>
    ` : ""}

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

    <div class="topic-pager">
      ${prev ? `<a class="pager-btn prev" href="#/topic/${prev.id}"><div class="pg-label">← Previous</div><div class="pg-title">${prev.title}</div></a>` : `<span></span>`}
      ${next ? `<a class="pager-btn next" href="#/topic/${next.id}"><div class="pg-label">Next →</div><div class="pg-title">${next.title}</div></a>` : `<span></span>`}
    </div>
  `;

  document.getElementById("bookmarkBtn").addEventListener("click", (e) => {
    const active = Progress.toggleBookmark(id);
    e.target.classList.toggle("active", active);
    e.target.textContent = active ? "★ Saved" : "☆ Save for later";
  });
  document.getElementById("completeBtn").addEventListener("click", (e) => {
    const active = Progress.toggleComplete(id);
    e.target.classList.toggle("active", active);
    e.target.textContent = active ? "✓ Completed" : "Mark as complete";
    const sidebarLink = sidebarContentEl.querySelector(`a[data-topic="${id}"]`);
    if (sidebarLink) sidebarLink.classList.toggle("is-complete", active);
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

// ---------------- Dashboard ----------------

const AVATAR_CHOICES = ["🧑‍💻","🧑‍🎓","🦉","🐙","🐢","🦊","🐼","🚀","🔥","⚡","🌙","🫧"];

async function renderDashboard() {
  if (!window.Auth || !Auth.isSignedIn()) {
    contentEl.innerHTML = `
      <div class="signed-out-panel">
        <h2>Sign in to see your dashboard</h2>
        <p style="color:var(--text-muted); margin-bottom:20px;">Track completed topics, saved bookmarks, and solved problems across sessions.</p>
        <button class="btn btn-primary" id="dashSignInBtn" type="button">Sign In</button>
      </div>`;
    document.getElementById("dashSignInBtn").addEventListener("click", () => openAuthModal("login"));
    return;
  }

  contentEl.innerHTML = `<p style="color:var(--text-muted);">Loading your dashboard…</p>`;
  let data;
  try { data = await Auth.fetchDashboard(); }
  catch { contentEl.innerHTML = `<div class="not-found"><h2>Couldn't load dashboard</h2><p><a href="#/">Return home</a></p></div>`; return; }

  const { user, stats } = data;
  const recent = Object.entries(user.progress.completedAt || {})
    .sort((a, b) => new Date(b[1]) - new Date(a[1])).slice(0, 8);

  contentEl.innerHTML = `
    <div class="dash-header">
      <div class="dash-avatar">${user.avatar || "🧑‍💻"}</div>
      <div>
        <div class="dash-name-row">
          <h1>${user.name}</h1>
          <button class="dash-edit-btn" id="editProfileBtn" type="button">Edit</button>
        </div>
        <div class="dash-email">${user.email} · member since ${new Date(user.createdAt).toLocaleDateString()}</div>
      </div>
      <button class="btn btn-ghost dash-signout" id="signOutBtn" type="button">Sign out</button>
    </div>

    <div id="editProfilePanel" style="display:none; margin-bottom:26px; background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); padding:18px;">
      <label style="font-size:0.8rem; color:var(--text-muted); font-weight:600;">Display name</label>
      <input id="editNameInput" type="text" value="${user.name}" style="width:100%; margin:8px 0 14px; padding:9px 12px; border-radius:8px; border:1px solid var(--border-strong); background:var(--surface-2); color:var(--text);" />
      <label style="font-size:0.8rem; color:var(--text-muted); font-weight:600;">Avatar</label>
      <div class="avatar-picker">
        ${AVATAR_CHOICES.map(a => `<span class="avatar-option ${a === user.avatar ? "selected" : ""}" data-avatar="${a}">${a}</span>`).join("")}
      </div>
      <button class="btn btn-primary" id="saveProfileBtn" type="button">Save changes</button>
    </div>

    <div class="dash-stat-grid">
      <div class="dash-stat-card"><b>${stats.percentComplete}%</b><span>Overall progress</span></div>
      <div class="dash-stat-card"><b>${stats.completedCount}/${stats.totalTopics}</b><span>Topics completed</span></div>
      <div class="dash-stat-card"><b>${stats.bookmarkCount}</b><span>Saved topics</span></div>
      <div class="dash-stat-card"><b>${stats.solvedProblemCount}/18</b><span>Problems solved</span></div>
    </div>

    <h2 style="font-family:var(--font-display); font-size:1.1rem; margin-bottom:14px;">Progress by track</h2>
    <div class="mini-bar-grid" style="margin-bottom:34px;">
      ${state.categories.map(cat => {
        const c = stats.byCategory[cat.id] || { total: 0, done: 0 };
        const pct = c.total ? Math.round((c.done / c.total) * 100) : 0;
        return `<div class="mini-bar-card">
          <div class="mb-label"><span>${cat.label}</span><span>${c.done}/${c.total}</span></div>
          <div class="bar-track"><div class="bar-fill" style="width:${pct}%"></div></div>
        </div>`;
      }).join("")}
    </div>

    <h2 style="font-family:var(--font-display); font-size:1.1rem; margin-bottom:14px;">Recent activity</h2>
    ${recent.length ? `<ul class="activity-list">
      ${recent.map(([topicId, ts]) => {
        const t = state.topics.find(x => x.id === topicId);
        return `<li><a href="#/topic/${topicId}">${t ? t.title : topicId}</a><span class="act-date">${new Date(ts).toLocaleDateString()}</span></li>`;
      }).join("")}
    </ul>` : `<p style="color:var(--text-muted);">Nothing completed yet — head to <a href="#/" style="color:var(--accent);">the topics</a> and mark your first one!</p>`}
  `;

  document.getElementById("signOutBtn").addEventListener("click", () => {
    Auth.signOut();
    window.location.hash = "#/";
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
    try { await Auth.updateProfile({ name, avatar: selectedAvatar }); renderDashboard(); wireAuthArea(); }
    catch (err) { alert(err.message); }
  });

  window.scrollTo(0, 0);
}

// ---------------- Problems list + detail ----------------

async function renderProblemsList() {
  contentEl.innerHTML = `<p style="color:var(--text-muted);">Loading problems…</p>`;
  const res = await fetch("/api/problems");
  const data = await res.json();
  const solved = window.Auth && Auth.isSignedIn() ? (Auth.getUser()?.progress?.solvedProblems || []) : [];

  contentEl.innerHTML = `
    <div class="crumb"><a href="#/">Home</a><span class="sep">/</span>Problems</div>
    <h1 style="font-family:var(--font-display);">🧩 Practice Problems</h1>
    <p style="color:var(--text-muted); margin-bottom:24px;">${data.total} classic problems. JavaScript submissions are auto-graded against hidden test cases; other available languages can be run freely.</p>
    <div class="problem-grid">
      ${data.problems.map(p => `
        <a class="problem-row" href="#/problem/${p.id}">
          <span class="diff-badge diff-${p.difficulty}">${p.difficulty}</span>
          <span class="pr-title">${p.title}</span>
          <span class="pr-tags">${p.tags.map(t => `<span class="pr-tag">${t}</span>`).join("")}</span>
          ${solved.includes(p.id) ? `<span class="pr-solved">✓ Solved</span>` : ""}
        </a>`).join("")}
    </div>`;
  window.scrollTo(0, 0);
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
      contentEl.innerHTML = `<div class="feedback-thanks"><h2>🙏 Thank you!</h2><p style="color:var(--text-muted);">Your feedback helps make this better.</p><a href="#/" class="btn btn-primary" style="margin-top:16px; display:inline-flex;">Back home</a></div>`;
    } catch (err) {
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

// ---------------- Auth area (topbar) + modal ----------------

function wireAuthArea() {
  const area = document.getElementById("authArea");
  if (!window.Auth || !Auth.isSignedIn()) {
    area.innerHTML = `<button class="auth-signin-btn" id="topbarSignInBtn" type="button">Sign In</button>`;
    document.getElementById("topbarSignInBtn").addEventListener("click", () => openAuthModal("login"));
    return;
  }
  const user = Auth.getUser();
  area.innerHTML = `<a class="user-chip" href="#/dashboard"><span class="avatar-circle">${user.avatar || "🧑‍💻"}</span><span>${(user.name || "").split(" ")[0]}</span></a>`;
}

function openAuthModal(tab) {
  const backdrop = document.getElementById("authModalBackdrop");
  backdrop.classList.remove("hidden");
  switchAuthTab(tab || "login");
}
function closeAuthModal() {
  document.getElementById("authModalBackdrop").classList.add("hidden");
  document.getElementById("authError").classList.add("hidden");
  document.getElementById("authForm").reset();
}
function switchAuthTab(tab) {
  document.querySelectorAll(".auth-tab").forEach(t => t.classList.toggle("active", t.dataset.tab === tab));
  document.getElementById("nameRow").style.display = tab === "register" ? "flex" : "none";
  document.getElementById("authModalTitle").textContent = tab === "register" ? "Create your account" : "Welcome back";
  document.getElementById("authSubmitBtn").textContent = tab === "register" ? "Create account" : "Sign In";
  document.getElementById("authForm").dataset.mode = tab;
  document.getElementById("authError").classList.add("hidden");
}

function wireAuthModal() {
  document.getElementById("authModalClose").addEventListener("click", closeAuthModal);
  document.getElementById("authModalBackdrop").addEventListener("click", (e) => {
    if (e.target.id === "authModalBackdrop") closeAuthModal();
  });
  document.querySelectorAll(".auth-tab").forEach(tab => {
    tab.addEventListener("click", () => switchAuthTab(tab.dataset.tab));
  });

  document.getElementById("authForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const mode = e.target.dataset.mode || "login";
    const errBox = document.getElementById("authError");
    errBox.classList.add("hidden");
    const email = document.getElementById("authEmail").value.trim();
    const password = document.getElementById("authPassword").value;
    const name = document.getElementById("authName").value.trim();
    try {
      if (mode === "register") await Auth.register({ name, email, password });
      else await Auth.login({ email, password });
      closeAuthModal();
      wireAuthArea();
      route();
    } catch (err) {
      errBox.textContent = err.message;
      errBox.classList.remove("hidden");
    }
  });

  initGoogleButton();
}

async function initGoogleButton() {
  const host = document.getElementById("googleSignInHost");
  const config = await Auth.fetchGoogleConfig();
  if (!config.googleEnabled) {
    host.innerHTML = `<div class="google-signin-fallback">Sign in with Google isn't configured on this server yet — see README.md to enable it.</div>`;
    return;
  }
  const script = document.createElement("script");
  script.src = "https://accounts.google.com/gsi/client";
  script.async = true;
  script.onload = () => {
    google.accounts.id.initialize({
      client_id: config.googleClientId,
      callback: async (response) => {
        try {
          await Auth.loginWithGoogleIdToken(response.credential);
          closeAuthModal(); wireAuthArea(); route();
        } catch (err) {
          const errBox = document.getElementById("authError");
          errBox.textContent = err.message; errBox.classList.remove("hidden");
        }
      }
    });
    google.accounts.id.renderButton(host, { theme: "outline", size: "large", width: 320 });
  };
  document.head.appendChild(script);
}

// ---------------- Keyboard shortcuts ----------------

function handleGlobalKeydown(e) {
  const tag = (document.activeElement && document.activeElement.tagName) || "";
  const typing = tag === "INPUT" || tag === "TEXTAREA";
  if (e.key === "/" && !typing) {
    e.preventDefault();
    document.getElementById("searchInput").focus();
  } else if (e.key === "Escape") {
    document.getElementById("searchResults").classList.add("hidden");
    closeMobileSidebar();
    if (!document.getElementById("authModalBackdrop").classList.contains("hidden")) closeAuthModal();
    if (typing) document.activeElement.blur();
  }
}

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

boot();