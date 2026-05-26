/* ── WCEW Auth Module ─────────────────────────────────────────── */
const Auth = (() => {
  const USERS_KEY = 'wcew_users';
  const SESSION_KEY = 'wcew_session';

  function getUsers() {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  }

  function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  function hashPw(pw) {
    return btoa(unescape(encodeURIComponent(pw)));
  }

  function register({ name, email, password }) {
    const users = getUsers();
    const exists = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (exists) return { ok: false, error: 'An account with this email already exists.' };
    users.push({ name, email: email.toLowerCase(), password: hashPw(password), createdAt: new Date().toISOString() });
    saveUsers(users);
    localStorage.setItem(SESSION_KEY, JSON.stringify({ name, email: email.toLowerCase() }));
    return { ok: true };
  }

  function login({ email, password }) {
    const users = getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) return { ok: false, error: 'No account found with this email.' };
    if (user.password !== hashPw(password)) return { ok: false, error: 'Incorrect password.' };
    localStorage.setItem(SESSION_KEY, JSON.stringify({ name: user.name, email: user.email }));
    return { ok: true };
  }

  function logout() {
    localStorage.removeItem(SESSION_KEY);
  }

  function getUser() {
    return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
  }

  function isLoggedIn() {
    return getUser() !== null;
  }

  function init() {
    const user = getUser();
    const btn = document.getElementById('account-btn');
    if (!btn) return;
    if (user) {
      btn.setAttribute('href', 'auth.html');
      btn.setAttribute('aria-label', user.name);
      btn.innerHTML = `<span class="account-initial">${user.name.charAt(0).toUpperCase()}</span>`;
    }
  }

  return { register, login, logout, getUser, isLoggedIn, init };
})();

document.addEventListener('DOMContentLoaded', () => Auth.init());
