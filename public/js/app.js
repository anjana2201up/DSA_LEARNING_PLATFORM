// public/js/app.js
// Vanilla-JS hash router + renderer for DSA Nexus.
// Routes:
//   #/                      -> home
//   #/topic/:id             -> a DSA topic article + compiler
//   #/pattern/:id           -> a 12-Patterns slide deck
//   #/category/:id          -> topic list for a category

const state = {
  categories: [],
  topics: [],
  patterns: [],
  scale: []
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
  window.addEventListener("hashchange", route);
  route();
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
          ${topicsInCat.map(t => `<li><a href="#/topic/${t.id}" data-topic="${t.id}">${t.title}</a></li>`).join("")}
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
      <pre class="slide-code"><code>${escapeHtml(topic.code.js)}</code></pre>
    ` : ""}

    <div id="editorHost"></div>

    <div class="topic-pager">
      ${prev ? `<a class="pager-btn prev" href="#/topic/${prev.id}"><div class="pg-label">← Previous</div><div class="pg-title">${prev.title}</div></a>` : `<span></span>`}
      ${next ? `<a class="pager-btn next" href="#/topic/${next.id}"><div class="pg-label">Next →</div><div class="pg-title">${next.title}</div></a>` : `<span></span>`}
    </div>
  `;

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

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

boot();
