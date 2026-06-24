/* ── Supabase config ── paste your values from Settings → API ── */
const SUPABASE_URL = 'https://ocprpfijgfwcikhifxys.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_Hvvd-s6Qb4bsB3u8NxZEaA_AkyMSCTA';

/* ─────────────────────────────────────────────────────────────── */
const Reviews = (() => {
  const HEADERS = {
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
    'Content-Type': 'application/json',
  };

  const configured = () =>
    SUPABASE_URL !== 'YOUR_SUPABASE_URL' && SUPABASE_ANON_KEY !== 'YOUR_SUPABASE_ANON_KEY';

  /* ── Supabase API calls ──────────────────────────────────────── */
  async function fetchReviews(pid) {
    if (!configured()) return localGet(pid);
    const res = await fetch(
      SUPABASE_URL + '/rest/v1/reviews?product_id=eq.' + pid + '&order=created_at.desc',
      { headers: HEADERS }
    );
    if (!res.ok) throw new Error('Fetch failed');
    return res.json();
  }

  async function postReview(pid, { name, rating, title, body }) {
    if (!configured()) {
      localAdd(pid, { name, rating, title, body });
      return;
    }
    const res = await fetch(SUPABASE_URL + '/rest/v1/reviews', {
      method: 'POST',
      headers: { ...HEADERS, 'Prefer': 'return=minimal' },
      body: JSON.stringify({ product_id: pid, name, rating: +rating, title, body }),
    });
    if (!res.ok) throw new Error('Post failed');
  }

  /* ── LocalStorage fallback (when Supabase not configured) ────── */
  const LS_KEY = 'wcew_reviews';
  function lsLoad() { try { return JSON.parse(localStorage.getItem(LS_KEY) || '{}'); } catch { return {}; } }
  function localGet(pid) { return (lsLoad()[pid] || []).slice().sort((a, b) => b.id - a.id); }
  function localAdd(pid, data) {
    const all = lsLoad();
    if (!all[pid]) all[pid] = [];
    all[pid].push({
      id: Date.now(), product_id: pid,
      name: data.name, rating: +data.rating, title: data.title, body: data.body,
      created_at: new Date().toISOString()
    });
    localStorage.setItem(LS_KEY, JSON.stringify(all));
  }

  /* ── Helpers ─────────────────────────────────────────────────── */
  function esc(s) {
    return String(s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function starsHtml(rating, size) {
    size = size || 16;
    const star = '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>';
    let html = '';
    for (let i = 1; i <= 5; i++) {
      const fill = i <= Math.floor(rating) ? '#25B872'
        : (rating - Math.floor(rating) >= 0.5 && i === Math.floor(rating) + 1 ? '#5ccf9a' : '#d1d5db');
      html += '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="' + fill + '" stroke="none">' + star + '</svg>';
    }
    return html;
  }

  function formatDate(iso) {
    try {
      return new Date(iso).toLocaleDateString('en-IE', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch { return ''; }
  }

  function cardHtml(r) {
    const initial = esc((r.name || '?').charAt(0).toUpperCase());
    return '<div class="review-card">' +
      '<div class="review-card-header">' +
        '<div class="review-avatar">' + initial + '</div>' +
        '<div class="review-meta">' +
          '<div class="review-author">' + esc(r.name) + '</div>' +
          '<div class="review-date">' + formatDate(r.created_at) + '</div>' +
        '</div>' +
        '<div class="review-card-stars">' + starsHtml(r.rating, 14) + '</div>' +
      '</div>' +
      (r.title ? '<div class="review-title">' + esc(r.title) + '</div>' : '') +
      '<p class="review-body">' + esc(r.body) + '</p>' +
    '</div>';
  }

  /* ── Render list ─────────────────────────────────────────────── */
  function renderList(pid, reviews) {
    const list       = document.getElementById('reviews-list');
    const countEl    = document.getElementById('reviews-count');
    const avgStarsEl = document.getElementById('reviews-avg-stars');
    const avgNumEl   = document.getElementById('reviews-avg-num');
    if (!list) return;

    const count = reviews.length;
    const avg   = count ? reviews.reduce((s, r) => s + r.rating, 0) / count : 0;

    if (countEl)    countEl.textContent  = count === 1 ? '1 review' : count + ' reviews';
    if (avgStarsEl) avgStarsEl.innerHTML = starsHtml(avg, 20);
    if (avgNumEl)   avgNumEl.textContent = count ? avg.toFixed(1) : '';

    list.innerHTML = count
      ? reviews.map(cardHtml).join('')
      : '<p class="reviews-empty">No reviews yet — be the first!</p>';
  }

  async function loadAndRender(pid) {
    document.getElementById('reviews-list').innerHTML =
      '<p class="reviews-empty" style="opacity:.5">Loading reviews…</p>';
    try {
      const reviews = await fetchReviews(pid);
      renderList(pid, reviews);
    } catch (e) {
      document.getElementById('reviews-list').innerHTML =
        '<p class="reviews-empty">Could not load reviews.</p>';
    }
  }

  /* ── Star picker ─────────────────────────────────────────────── */
  function highlightStars(container, n) {
    container.querySelectorAll('button svg').forEach((svg, i) => {
      svg.setAttribute('fill', i < n ? '#25B872' : '#d1d5db');
    });
  }

  /* ── Messages ────────────────────────────────────────────────── */
  function showMsg(form, text, type) {
    let el = form.querySelector('.review-form-msg');
    if (!el) { el = document.createElement('p'); el.className = 'review-form-msg'; form.appendChild(el); }
    el.textContent = text;
    el.className = 'review-form-msg review-form-msg--' + type;
    clearTimeout(el._t);
    el._t = setTimeout(() => el.remove(), 5000);
  }

  /* ── Init form ───────────────────────────────────────────────── */
  function initForm(pid) {
    const form      = document.getElementById('review-form');
    const toggleBtn = document.getElementById('write-review-btn');
    const formWrap  = document.getElementById('review-form-wrap');
    if (!form) return;

    if (toggleBtn && formWrap) {
      toggleBtn.addEventListener('click', () => {
        const open = formWrap.style.display !== 'none';
        formWrap.style.display = open ? 'none' : 'block';
        toggleBtn.textContent  = open ? 'Write a Review' : 'Cancel';
      });
    }

    /* Build star picker */
    const starInput = form.querySelector('.star-picker');
    let selected = 0;
    const star = '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>';
    if (starInput) {
      for (let i = 1; i <= 5; i++) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.setAttribute('aria-label', i + ' star' + (i > 1 ? 's' : ''));
        btn.innerHTML = '<svg width="30" height="30" viewBox="0 0 24 24" fill="#d1d5db" stroke="none">' + star + '</svg>';
        btn.addEventListener('mouseenter', () => highlightStars(starInput, i));
        btn.addEventListener('mouseleave', () => highlightStars(starInput, selected));
        btn.addEventListener('click', () => {
          selected = i;
          highlightStars(starInput, i);
          form.querySelector('[name="rating"]').value = i;
        });
        starInput.appendChild(btn);
      }
    }

    /* Submit */
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const name   = form.querySelector('[name="name"]').value.trim();
      const rating = +form.querySelector('[name="rating"]').value;
      const title  = form.querySelector('[name="title"]').value.trim();
      const body   = form.querySelector('[name="body"]').value.trim();

      if (!name)   { showMsg(form, 'Please enter your name.', 'error'); return; }
      if (!rating) { showMsg(form, 'Please select a star rating.', 'error'); return; }
      if (!body)   { showMsg(form, 'Please write your review.', 'error'); return; }

      const submitBtn = form.querySelector('[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Posting…';

      try {
        await postReview(pid, { name, rating, title, body });
        await loadAndRender(pid);
        form.reset();
        selected = 0;
        if (starInput) highlightStars(starInput, 0);
        form.querySelector('[name="rating"]').value = 0;
        if (formWrap)  { formWrap.style.display = 'none'; }
        if (toggleBtn) { toggleBtn.textContent = 'Write a Review'; }
        document.getElementById('reviews-list').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } catch {
        showMsg(form, 'Failed to post review. Please try again.', 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Post Review';
      }
    });
  }

  return { loadAndRender, initForm, starsHtml };
})();
