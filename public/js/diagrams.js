// public/js/diagrams.js
// Original, hand-built SVG diagrams (no third-party images) keyed by name.
// Each function returns a responsive <svg> string using the site's CSS
// variables for color, so diagrams stay on-theme automatically.

const Diagrams = {
  array(values = [12, 27, 5, 41, 9, 33]) {
    const w = 340, h = 140, boxW = 46, gap = 8;
    const startX = (w - (values.length * boxW + (values.length - 1) * gap)) / 2;
    const boxes = values.map((v, i) => {
      const x = startX + i * (boxW + gap);
      return `
        <rect x="${x}" y="40" width="${boxW}" height="46" rx="8"
              fill="var(--surface-3)" stroke="var(--accent)" stroke-opacity="0.5"/>
        <text x="${x + boxW/2}" y="68" text-anchor="middle" fill="var(--text)"
              font-family="var(--font-mono)" font-size="15">${v}</text>
        <text x="${x + boxW/2}" y="104" text-anchor="middle" fill="var(--text-faint)"
              font-family="var(--font-mono)" font-size="11">${i}</text>`;
    }).join("");
    return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">${boxes}</svg>`;
  },

  bars(values = [5, 3, 8, 2, 9, 4, 7]) {
    const w = 340, h = 150, gap = 10;
    const barW = (w - gap * (values.length + 1)) / values.length;
    const max = Math.max(...values);
    const bars = values.map((v, i) => {
      const bh = (v / max) * 90;
      const x = gap + i * (barW + gap);
      const y = 120 - bh;
      return `<rect x="${x}" y="${y}" width="${barW}" height="${bh}" rx="4"
                fill="${i % 2 === 0 ? 'var(--accent)' : 'var(--accent-2)'}" fill-opacity="0.75"/>`;
    }).join("");
    return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
      <line x1="0" y1="120" x2="${w}" y2="120" stroke="var(--border-strong)"/>
      ${bars}</svg>`;
  },

  "linked-list"(count = 4) {
    const w = 360, h = 130, nodeW = 60, nodeH = 46, gap = 34;
    let nodes = "", arrows = "";
    const startX = 15;
    for (let i = 0; i < count; i++) {
      const x = startX + i * (nodeW + gap);
      nodes += `
        <rect x="${x}" y="42" width="${nodeW}" height="${nodeH}" rx="8"
              fill="var(--surface-3)" stroke="var(--accent-2)" stroke-opacity="0.6"/>
        <line x1="${x + nodeW*0.62}" y1="42" x2="${x + nodeW*0.62}" y2="88" stroke="var(--border-strong)"/>
        <text x="${x + nodeW*0.3}" y="70" text-anchor="middle" fill="var(--text)"
              font-family="var(--font-mono)" font-size="14">${i + 1}</text>`;
      if (i < count - 1) {
        const ax = x + nodeW;
        arrows += `<line x1="${ax}" y1="65" x2="${ax + gap - 6}" y2="65" stroke="var(--accent)" stroke-width="1.6" marker-end="url(#arrow)"/>`;
      }
    }
    const lastX = startX + (count - 1) * (nodeW + gap) + nodeW;
    return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
      <defs><marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
        <path d="M0,0 L6,3 L0,6 Z" fill="var(--accent)"/></marker></defs>
      ${nodes}${arrows}
      <text x="${lastX + 14}" y="70" fill="var(--text-faint)" font-family="var(--font-mono)" font-size="12">null</text>
    </svg>`;
  },

  stack(values = [1, 2, 3, 4]) {
    const w = 200, h = 160, boxH = 32, boxW = 110;
    const startX = (w - boxW) / 2;
    let boxes = "";
    values.forEach((v, i) => {
      const y = 130 - (i + 1) * (boxH + 4);
      boxes += `
        <rect x="${startX}" y="${y}" width="${boxW}" height="${boxH}" rx="6"
              fill="${i === values.length - 1 ? 'var(--accent)' : 'var(--surface-3)'}"
              fill-opacity="${i === values.length - 1 ? '0.85' : '1'}"
              stroke="var(--border-strong)"/>
        <text x="${w/2}" y="${y + boxH/2 + 5}" text-anchor="middle"
              fill="${i === values.length - 1 ? '#1A1305' : 'var(--text)'}"
              font-family="var(--font-mono)" font-size="13">${v}</text>`;
    });
    return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
      ${boxes}
      <line x1="${startX - 10}" y1="134" x2="${startX + boxW + 10}" y2="134" stroke="var(--border-strong)"/>
      <text x="${w/2}" y="152" text-anchor="middle" fill="var(--text-faint)" font-family="var(--font-mono)" font-size="11">top → last pushed</text>
    </svg>`;
  },

  queue(values = [1, 2, 3, 4]) {
    const w = 320, h = 120, boxW = 56, boxH = 40, gap = 6;
    const startX = (w - (values.length * (boxW + gap))) / 2;
    let boxes = "";
    values.forEach((v, i) => {
      const x = startX + i * (boxW + gap);
      boxes += `
        <rect x="${x}" y="30" width="${boxW}" height="${boxH}" rx="6"
              fill="var(--surface-3)" stroke="var(--accent-2)" stroke-opacity="0.6"/>
        <text x="${x + boxW/2}" y="55" text-anchor="middle" fill="var(--text)"
              font-family="var(--font-mono)" font-size="13">${v}</text>`;
    });
    return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
      ${boxes}
      <text x="${startX}" y="90" fill="var(--accent)" font-family="var(--font-mono)" font-size="11">front (dequeue)</text>
      <text x="${startX + values.length*(boxW+gap) - 90}" y="90" fill="var(--accent-2)" font-family="var(--font-mono)" font-size="11">rear (enqueue)</text>
    </svg>`;
  },

  tree() {
    const w = 320, h = 200;
    const nodes = [
      { x: 160, y: 26, v: 8 },
      { x: 90, y: 92, v: 4 },
      { x: 230, y: 92, v: 12 },
      { x: 55, y: 160, v: 2 },
      { x: 125, y: 160, v: 6 },
      { x: 195, y: 160, v: 10 },
      { x: 265, y: 160, v: 14 }
    ];
    const edges = [[0,1],[0,2],[1,3],[1,4],[2,5],[2,6]];
    const lines = edges.map(([a,b]) => {
      const A = nodes[a], B = nodes[b];
      return `<line x1="${A.x}" y1="${A.y}" x2="${B.x}" y2="${B.y}" stroke="var(--border-strong)"/>`;
    }).join("");
    const circles = nodes.map((n, i) => `
      <circle cx="${n.x}" cy="${n.y}" r="18" fill="${i===0?'var(--accent)':'var(--surface-3)'}"
              stroke="var(--accent-2)" stroke-opacity="0.6"/>
      <text x="${n.x}" y="${n.y+5}" text-anchor="middle"
            fill="${i===0?'#1A1305':'var(--text)'}" font-family="var(--font-mono)" font-size="13">${n.v}</text>`
    ).join("");
    return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">${lines}${circles}</svg>`;
  },

  graph() {
    const w = 320, h = 200;
    const nodes = [
      { x: 60, y: 40, l: "A" }, { x: 200, y: 30, l: "B" }, { x: 270, y: 110, l: "C" },
      { x: 170, y: 170, l: "D" }, { x: 50, y: 140, l: "E" }
    ];
    const edges = [[0,1],[1,2],[2,3],[3,4],[4,0],[0,3]];
    const lines = edges.map(([a,b]) => {
      const A = nodes[a], B = nodes[b];
      return `<line x1="${A.x}" y1="${A.y}" x2="${B.x}" y2="${B.y}" stroke="var(--accent)" stroke-opacity="0.35" stroke-width="1.6"/>`;
    }).join("");
    const circles = nodes.map(n => `
      <circle cx="${n.x}" cy="${n.y}" r="17" fill="var(--surface-3)" stroke="var(--accent-2)" stroke-opacity="0.7"/>
      <text x="${n.x}" y="${n.y+5}" text-anchor="middle" fill="var(--text)" font-family="var(--font-mono)" font-size="13">${n.l}</text>`
    ).join("");
    return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">${lines}${circles}</svg>`;
  },

  "graph-curve"() {
    const w = 320, h = 160;
    const path = `M10,150 C 90,150 110,40 150,40 S 260,10 310,10`;
    return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
      <line x1="10" y1="10" x2="10" y2="150" stroke="var(--border-strong)"/>
      <line x1="10" y1="150" x2="310" y2="150" stroke="var(--border-strong)"/>
      <path d="${path}" fill="none" stroke="var(--accent)" stroke-width="2.5"/>
      <text x="14" y="26" fill="var(--text-faint)" font-family="var(--font-mono)" font-size="10">cost</text>
      <text x="270" y="146" fill="var(--text-faint)" font-family="var(--font-mono)" font-size="10">n</text>
    </svg>`;
  }
};
