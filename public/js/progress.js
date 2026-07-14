// public/js/progress.js
// Client-side persistence for: completed topics, bookmarked topics, and
// light/dark theme preference. Uses localStorage (safe here — this is a
// real app running in the user's own browser, not a sandboxed preview).
// Exposed as window.Progress so app.js, and any future page, can use it.

const Progress = (() => {
  const KEYS = {
    completed: "dsa-nexus:completed",
    bookmarks: "dsa-nexus:bookmarks",
    theme: "dsa-nexus:theme"
  };

  function readSet(key) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? new Set(JSON.parse(raw)) : new Set();
    } catch {
      return new Set();
    }
  }
  function writeSet(key, set) {
    try { localStorage.setItem(key, JSON.stringify([...set])); } catch { /* storage unavailable — fail silently */ }
  }

  // ---- Completion ----
  function isComplete(topicId) { return readSet(KEYS.completed).has(topicId); }
  function toggleComplete(topicId) {
    const set = readSet(KEYS.completed);
    set.has(topicId) ? set.delete(topicId) : set.add(topicId);
    writeSet(KEYS.completed, set);
    return set.has(topicId);
  }
  function completedIds() { return readSet(KEYS.completed); }

  // ---- Bookmarks ----
  function isBookmarked(topicId) { return readSet(KEYS.bookmarks).has(topicId); }
  function toggleBookmark(topicId) {
    const set = readSet(KEYS.bookmarks);
    set.has(topicId) ? set.delete(topicId) : set.add(topicId);
    writeSet(KEYS.bookmarks, set);
    return set.has(topicId);
  }
  function bookmarkedIds() { return readSet(KEYS.bookmarks); }

  // ---- Theme ----
  function getTheme() {
    try { return localStorage.getItem(KEYS.theme) || "dark"; } catch { return "dark"; }
  }
  function setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem(KEYS.theme, theme); } catch { /* ignore */ }
  }
  function applyStoredTheme() { setTheme(getTheme()); }

  return {
    isComplete, toggleComplete, completedIds,
    isBookmarked, toggleBookmark, bookmarkedIds,
    getTheme, setTheme, applyStoredTheme
  };
})();

// Apply theme as early as possible (before first paint) to avoid a flash.
Progress.applyStoredTheme();