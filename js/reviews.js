const Reviews = (() => {
  const KEY = 'voltpro_reviews';

  function load() {
    try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch { return {}; }
  }

  function save(data) {
    localStorage.setItem(KEY, JSON.stringify(data));
  }

  function getForProduct(pid) {
    return (load()[pid] || []).slice().sort((a, b) => b.id - a.id);
  }

  function addReview(pid, { name, rating, title, body }) {
    const all = load();
    if (!all[pid]) all[pid] = [];
    all[pid].push({
      id: Date.now(),
      name: name.trim(),
      rating: +rating,
      title: title.trim(),
      body: body.trim(),
      date: new Date().toLocaleDateString('en-IE', { day: 'numeric', month: 'short', year: 'numeric' })
    });
    save(all);
  }

  function avgRating(pid) {
    const list = getForProduct(pid);
    if (!list.length) return 0;
    return list.reduce((s, r) => s + r.rating, 0) / list.length;
  }

  function starsHtml(rating, size) {
    size = size || 16;
    const full = Math.floor(rating);
    const half = rating - full >= 0.5;
    const star = '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>';
    let html = '';
    for (let i = 1; i <= 5; i++) {
      const fill = i <= full ? '#f97316' : (half && i === full + 1 ? 'url(#half-' + i + ')' : '#d1d5db');
      const defs = (half && i === full + 1)
        ? '<defs><linearGradient id="half-' + i + '"><stop offset="50%" stop-color="#f97316"/><stop offset="50%" stop-color="#d1d5db"/></linearGradient></defs>'
        : '';
      html += '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="' + fill + '" stroke="none">' + defs + star + '</svg>';
    }
    return html;
  }

  function esc(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function cardHtml(r) {
    return '<div class="review-card">' +
      '<div class="review-card-header">' +
        '<div class="review-avatar">' + esc(r.name.charAt(0).toUpperCase()) + '</div>' +
        '<div class="review-meta">' +
          '<div class="review-author">' + esc(r.name) + '</div>' +
          '<div class="review-date">' + esc(r.date) + '</div>' +
        '</div>' +
        '<div class="review-card-stars">' + starsHtml(r.rating, 14) + '</div>' +
      '</div>' +
      (r.title ? '<div class="review-title">' + esc(r.title) + '</div>' : '') +
      '<p class="review-body">' + esc(r.body) + '</p>' +
    '</div>';
  }

  function renderList(pid) {
    const list = document.getElementById('reviews-list');
    const countEl = document.getElementById('reviews-count');
    const avgStarsEl = document.getElementById('reviews-avg-stars');
    const avgNumEl = document.getElementById('reviews-avg-num');
    if (!list) return;

    const reviews = getForProduct(pid);
    const avg = avgRating(pid);
    const count = reviews.length;

    if (countEl) countEl.textContent = count === 1 ? '1 review' : count + ' reviews';
    if (avgStarsEl) avgStarsEl.innerHTML = starsHtml(avg, 20);
    if (avgNumEl) avgNumEl.textContent = count ? avg.toFixed(1) : '';

    list.innerHTML = count
      ? reviews.map(cardHtml).join('')
      : '<p class="reviews-empty">No reviews yet — be the first to share your experience!</p>';
  }

  function highlightStars(container, n) {
    container.querySelectorAll('button svg').forEach((svg, i) => {
      svg.setAttribute('fill', i < n ? '#f97316' : '#d1d5db');
    });
  }

  function showMsg(form, text, type) {
    let el = form.querySelector('.review-form-msg');
    if (!el) { el = document.createElement('p'); el.className = 'review-form-msg'; form.appendChild(el); }
    el.textContent = text;
    el.className = 'review-form-msg review-form-msg--' + type;
    setTimeout(() => el.remove(), 4000);
  }

  function initForm(pid) {
    const form = document.getElementById('review-form');
    const toggleBtn = document.getElementById('write-review-btn');
    const formWrap = document.getElementById('review-form-wrap');
    if (!form) return;

    if (toggleBtn && formWrap) {
      toggleBtn.addEventListener('click', () => {
        const open = formWrap.style.display !== 'none';
        formWrap.style.display = open ? 'none' : 'block';
        toggleBtn.textContent = open ? 'Write a Review' : 'Cancel';
      });
    }

    /* Build star picker */
    const starInput = form.querySelector('.star-picker');
    let selected = 0;
    if (starInput) {
      const star = '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>';
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

    form.addEventListener('submit', e => {
      e.preventDefault();
      const name   = form.querySelector('[name="name"]').value.trim();
      const rating = +form.querySelector('[name="rating"]').value;
      const title  = form.querySelector('[name="title"]').value.trim();
      const body   = form.querySelector('[name="body"]').value.trim();

      if (!name)   { showMsg(form, 'Please enter your name.', 'error'); return; }
      if (!rating) { showMsg(form, 'Please select a star rating.', 'error'); return; }
      if (!body)   { showMsg(form, 'Please write your review.', 'error'); return; }

      addReview(pid, { name, rating, title, body });
      renderList(pid);

      form.reset();
      selected = 0;
      if (starInput) highlightStars(starInput, 0);
      form.querySelector('[name="rating"]').value = 0;
      showMsg(form, 'Thank you! Your review has been posted.', 'success');

      if (formWrap) { formWrap.style.display = 'none'; }
      if (toggleBtn) toggleBtn.textContent = 'Write a Review';
      document.getElementById('reviews-list').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }

  return { renderList, initForm, starsHtml };
})();
