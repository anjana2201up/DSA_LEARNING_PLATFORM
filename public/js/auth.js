// public/js/auth.js
// Client-side auth: JWT stored in localStorage, a tiny fetch wrapper that
// attaches it, and progress-sync so local (anonymous) progress merges into
// the account the moment someone signs in.

const Auth = (() => {
  const TOKEN_KEY = "dsa-nexus:token";
  const USER_KEY = "dsa-nexus:user";
  let googleConfig = null;

  let memToken = null;
  let memUser = null;

  function getToken() {
    if (memToken) return memToken;
    try {
      return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
    } catch { return null; }
  }
  function getUser() {
    if (memUser) return memUser;
    try {
      const raw = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  }
  function isSignedIn() { return !!getToken(); }

  // remember=true (default) survives browser restarts (localStorage).
  // remember=false clears on tab close (sessionStorage) — for shared/public
  // devices where the "Remember me" checkbox was left unchecked.
  function persistSession(token, user, remember = true) {
    memToken = token;
    memUser = user;
    try {
      const store = remember ? localStorage : sessionStorage;
      const other = remember ? sessionStorage : localStorage;
      store.setItem(TOKEN_KEY, token);
      store.setItem(USER_KEY, JSON.stringify(user));
      // Avoid a stale copy lingering in the other storage from a previous session.
      other.removeItem(TOKEN_KEY);
      other.removeItem(USER_KEY);
    } catch { /* storage unavailable */ }
  }

  function signOut() {
    memToken = null;
    memUser = null;
    try {
      localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(USER_KEY);
      sessionStorage.removeItem(TOKEN_KEY); sessionStorage.removeItem(USER_KEY);
    } catch { /* ignore */ }
    window.dispatchEvent(new CustomEvent("auth:changed"));
  }

  async function authedFetch(url, options = {}) {
    const token = getToken();
    const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
    if (token) headers.Authorization = `Bearer ${token}`;
    const res = await fetch(url, { ...options, headers });
    return res;
  }

  async function register({ name, email, password, remember = true }) {
    let res;
    try {
      res = await fetch("/api/auth/register", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });
    } catch {
      throw new Error("Network error — couldn't reach the server. Check your connection and try again.");
    }
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Registration failed.");
    persistSession(data.token, data.user, remember);
    await syncLocalProgressToServer();
    window.dispatchEvent(new CustomEvent("auth:changed"));
    return data.user;
  }

  async function login({ email, password, remember = true }) {
    let res;
    try {
      res = await fetch("/api/auth/login", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
    } catch {
      throw new Error("Network error — couldn't reach the server. Check your connection and try again.");
    }
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Login failed.");
    persistSession(data.token, data.user, remember);
    await syncLocalProgressToServer();
    window.dispatchEvent(new CustomEvent("auth:changed"));
    return data.user;
  }

  async function loginWithGoogleIdToken(idToken, remember = true) {
    let res;
    try {
      res = await fetch("/api/auth/google", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken })
      });
    } catch {
      throw new Error("Network error — couldn't reach the server. Check your connection and try again.");
    }
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Google sign-in failed.");
    persistSession(data.token, data.user, remember);
    await syncLocalProgressToServer();
    window.dispatchEvent(new CustomEvent("auth:changed"));
    return data.user;
  }

  async function fetchGoogleConfig() {
    if (googleConfig) return googleConfig;
    try {
      const res = await fetch("/api/auth/config");
      googleConfig = await res.json();
    } catch {
      googleConfig = { googleEnabled: false };
    }
    return googleConfig;
  }

  // Push whatever's in localStorage progress (Progress module) into the
  // freshly-signed-in account, so anonymous browsing isn't lost.
  async function syncLocalProgressToServer() {
    if (!window.Progress) return;
    const completed = [...Progress.completedIds()];
    const bookmarks = [...Progress.bookmarkedIds()];
    if (!completed.length && !bookmarks.length) return;
    try {
      await authedFetch("/api/me/progress", { method: "PUT", body: JSON.stringify({ completed, bookmarks }) });
    } catch { /* best-effort */ }
  }

  async function fetchDashboard() {
    const res = await authedFetch("/api/me");
    if (!res.ok) {
      if (res.status === 401) {
        signOut();
        window.location.href = "/login.html?reason=session_expired";
        // throw to prevent further execution in the current tab before the redirect happens
        throw new Error("Session expired.");
      }
      throw new Error("Could not load your dashboard.");
    }
    return res.json();
  }

  async function updateProfile(patch) {
    const res = await authedFetch("/api/me", { method: "PUT", body: JSON.stringify(patch) });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Update failed.");
    // Preserve whichever storage this session already lives in (don't
    // silently upgrade a session-only login to a persistent one).
    let stillRemembered = true;
    try { stillRemembered = !!localStorage.getItem(TOKEN_KEY); } catch { /* default true */ }
    persistSession(getToken(), data.user, stillRemembered);
    window.dispatchEvent(new CustomEvent("auth:changed"));
    return data.user;
  }

  async function pushProgress({ completed, bookmarks, solvedProblemId } = {}) {
    if (!isSignedIn()) return null;
    try {
      const res = await authedFetch("/api/me/progress", {
        method: "PUT", body: JSON.stringify({ completed, bookmarks, solvedProblemId })
      });
      return res.ok ? res.json() : null;
    } catch { return null; }
  }

  return {
    getToken, getUser, isSignedIn, signOut, authedFetch,
    register, login, loginWithGoogleIdToken, fetchGoogleConfig,
    fetchDashboard, updateProfile, pushProgress
  };
})();