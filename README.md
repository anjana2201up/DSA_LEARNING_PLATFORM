# DSA Nexus

A W3Schools-style learning platform for Data Structures & Algorithms —
basic to advanced — built with **Node.js, Express, HTML, CSS, and
vanilla JavaScript only** (no frontend framework, no build step).

## Features
- 35 DSA topics from Foundations → Advanced, each with an explanation,
  a complexity reference table, an original SVG diagram, a "Complexity
  Dial" gauge, and a runnable reference implementation.
- **12 Patterns** module: the classic coding-interview patterns (Two
  Pointers, Sliding Window, Fast & Slow Pointers, Merge Intervals,
  Cyclic Sort, In-place Linked List Reversal, Tree BFS/DFS, Two Heaps,
  Subsets/Backtracking, Modified Binary Search, Top K Elements) — each
  taught as a swipeable, keyboard-navigable "PPT" slide deck.
- **Built-in compiler**: every topic page has a "Try it Yourself" editor
  that runs real JavaScript in a sandboxed, timeboxed server-side
  environment (`server.js` → `/api/compile`, using Node's `vm` module).
- Fully responsive layout (mobile hamburger nav, collapsing sidebar,
  responsive grids) plus an animated, responsive particle/network
  background (`public/js/background.js`) that respects
  `prefers-reduced-motion`.
- All diagrams are original inline SVGs generated in
  `public/js/diagrams.js` — nothing scraped or copied from elsewhere.

## Run it

```bash
npm install
npm start
```

Then open http://localhost:3000

## Project structure

```
dsa-platform/
├── server.js              Express server: static files + JSON APIs + compiler sandbox
├── package.json
├── data/
│   ├── topics.js           35 DSA topics (edit/add here to scale toward 100)
│   └── patterns.js         12 pattern slide decks
└── public/
    ├── index.html
    ├── css/
    │   └── style.css       All design tokens + responsive rules
    └── js/
        ├── app.js           Hash router, sidebar, home/topic/pattern rendering, search
        ├── compiler.js      "Try it Yourself" editor <-> /api/compile wiring
        ├── slides.js        PPT-style slide deck viewer (used by the 12 Patterns)
        ├── diagrams.js      Original SVG diagram generator library
        └── background.js    Animated responsive particle-network background
```

## Scaling from 35 topics to 100+
Everything reads from `data/topics.js`. To add a topic:
1. Add one object to the `TOPICS` array (id, category, title, summary,
   diagram key, complexity, HTML content, optional code sample).
2. That's it — the sidebar, routing, complexity dial, and compiler all
   pick it up automatically. No other file needs to change.

## Notes on the compiler
`/api/compile` runs submitted code in a fresh V8 context via Node's
built-in `vm` module: no `require`, `process`, or filesystem access is
exposed inside the sandbox, output is captured (not printed to the
real console), there's a 3-second wall-clock timeout, and output is
capped in size. This safely supports **JavaScript only**. To support
other languages (Python, C++, Java...), the cleanest path is swapping
the `/api/compile` handler to call an external code-execution API
(e.g. Judge0 or Piston) — the frontend editor doesn't need to change.

## A note on "images from Google"
This project does not scrape or embed third-party/Google images —
that would raise copyright and reliability problems (broken hotlinks,
licensing). Instead every diagram is an original, theme-matched SVG
generated in `public/js/diagrams.js`, so the platform stays fully
self-contained and legally clean while still being visual.
