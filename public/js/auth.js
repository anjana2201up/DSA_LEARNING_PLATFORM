// public/js/auth.js
// Client-side auth: JWT stored in localStorage, a tiny fetch wrapper that
// attaches it, and progress-sync so local (anonymous) progress merges into
// the account the moment someone signs in.

const Auth = (() => {
  const TOKEN_KEY = "dsa-nexus:token";
  const USER_KEY = "dsa-nexus:user";
  let googleConfig = null;

  function getToken() { try { return localStorage.getItem(TOKEN_KEY); } catch { return null; } }
  function getUser() {
    try { const raw = localStorage.getItem(USER_KEY); return raw ? JSON.parse(raw) : null; } catch { return null; }
  }
  function isSignedIn() { return !!getToken(); }

  function persistSession(token, user) {
    try {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch { /* storage unavailable */ }
  }

  function signOut() {
    try { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(USER_KEY); } catch { /* ignore */ }
    window.dispatchEvent(new CustomEvent("auth:changed"));
  }

  async function authedFetch(url, options = {}) {
    const token = getToken();
    const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
    if (token) headers.Authorization = `Bearer ${token}`;
    const res = await fetch(url, { ...options, headers });
    return res;
  }

  async function register({ name, email, password }) {
    const res = await fetch("/api/auth/register", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Registration failed.");
    persistSession(data.token, data.user);
    await syncLocalProgressToServer();
    window.dispatchEvent(new CustomEvent("auth:changed"));
    return data.user;
  }

  async function login({ email, password }) {
    const res = await fetch("/api/auth/login", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Login failed.");
    persistSession(data.token, data.user);
    await syncLocalProgressToServer();
    window.dispatchEvent(new CustomEvent("auth:changed"));
    return data.user;
  }

  async function loginWithGoogleIdToken(idToken) {
    const res = await fetch("/api/auth/google", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Google sign-in failed.");
    persistSession(data.token, data.user);
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
    if (!res.ok) { if (res.status === 401) signOut(); throw new Error("Could not load your dashboard."); }
    return res.json();
  }

  async function updateProfile(patch) {
    const res = await authedFetch("/api/me", { method: "PUT", body: JSON.stringify(patch) });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Update failed.");
    persistSession(getToken(), data.user);
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
