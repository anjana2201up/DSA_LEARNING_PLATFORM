// public/js/xp.js
// XP & Leveling system — stored entirely in localStorage.
// Earns XP for: completing topics, solving problems, bookmarking.
// Fires "xp:changed" CustomEvent so any UI piece can react.

const XP = (() => {
  const KEY = "dsa-nexus:xp";
  const KEY_HISTORY = "dsa-nexus:xp-history"; // {topicId|problemId: xpEarned}

  const LEVELS = [
    { min: 0,    title: "Novice",      color: "#8B90AA", icon: "🌱" },
    { min: 100,  title: "Apprentice",  color: "#3DDBD9", icon: "📚" },
    { min: 300,  title: "Coder",       color: "#6FCF97", icon: "💻" },
    { min: 600,  title: "Expert",      color: "#E8A33D", icon: "⚡" },
    { min: 1100, title: "Master",      color: "#E85DA8", icon: "🔥" },
    { min: 2000, title: "Legend",      color: "#FFD700", icon: "🏆" },
  ];

  const XP_TABLE = {
    topic:          10,
    "problem-easy": 20,
    "problem-medium": 35,
    "problem-hard": 50,
    bookmark:       2,
  };

  function getTotal() {
    try { return parseInt(localStorage.getItem(KEY) || "0", 10) || 0; }
    catch { return 0; }
  }

  function getHistory() {
    try { return JSON.parse(localStorage.getItem(KEY_HISTORY) || "{}"); }
    catch { return {}; }
  }

  function _save(total, history) {
    try {
      localStorage.setItem(KEY, String(total));
      localStorage.setItem(KEY_HISTORY, JSON.stringify(history));
    } catch { /* storage unavailable */ }
  }

  function earn(type, id) {
    // Don't give XP for the same item twice
    const history = getHistory();
    const histKey = `${type}:${id}`;
    if (history[histKey]) return 0;

    const amount = XP_TABLE[type] || 0;
    if (!amount) return 0;

    const newTotal = getTotal() + amount;
    history[histKey] = amount;
    _save(newTotal, history);
    window.dispatchEvent(new CustomEvent("xp:changed", { detail: { total: newTotal, earned: amount, type, id } }));
    return amount;
  }

  function getLevel(xp) {
    let level = LEVELS[0];
    for (const l of LEVELS) {
      if (xp >= l.min) level = l;
    }
    return level;
  }

  function getNextLevel(xp) {
    for (let i = LEVELS.length - 1; i >= 0; i--) {
      if (xp >= LEVELS[i].min) {
        return LEVELS[i + 1] || null; // null = max level
      }
    }
    return LEVELS[1];
  }

  // Returns 0–1 progress to next level (or 1 if max)
  function getLevelProgress(xp) {
    const current = getLevel(xp);
    const next = getNextLevel(xp);
    if (!next) return 1;
    const range = next.min - current.min;
    const earned = xp - current.min;
    return Math.min(1, earned / range);
  }

  // Render a compact XP chip for the topbar
  function renderChip() {
    const xp = getTotal();
    const level = getLevel(xp);
    const next = getNextLevel(xp);
    const progress = getLevelProgress(xp) * 100;
    return `
      <a href="#/dashboard" class="xp-chip" id="xpChip" title="${xp} XP · ${level.title}${next ? ' · ' + next.min + ' for next level' : ''}">
        <span class="xp-icon">${level.icon}</span>
        <span class="xp-level-text">${level.title}</span>
        <span class="xp-amount">${xp} XP</span>
        <span class="xp-bar-wrap"><span class="xp-bar-fill" style="width:${progress}%"></span></span>
      </a>`;
  }

  return { getTotal, getLevel, getNextLevel, getLevelProgress, earn, renderChip, LEVELS, XP_TABLE };
})();

window.XP = XP;
