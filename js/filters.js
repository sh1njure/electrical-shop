/* ============================================================
   filters.js — Product filtering, sorting, and search
   ============================================================ */

const Filters = (() => {
  let allProducts = [];
  let activeFilters = { brands: [], colors: [], ipRatings: [], priceMax: Infinity };
  let currentSort = 'featured';
  let searchQuery = '';

  function init(products) {
    allProducts = products;
    buildFilterUI();
    bindEvents();
    render();
  }

  function buildFilterUI() {
    buildGroup('brand-filters', 'brands', [...new Set(allProducts.map(p => p.brand))].sort());
    buildGroup('color-filters', 'colors', [...new Set(allProducts.map(p => p.color).filter(Boolean))].sort());
    buildGroup('ip-filters', 'ipRatings', [...new Set(allProducts.map(p => p.ipRating).filter(Boolean))].sort());

    const prices = allProducts.map(p => p.price);
    const maxPrice = Math.ceil(Math.max(...prices));
    const priceSlider = document.getElementById('price-range');
    const priceDisplay = document.getElementById('price-display');
    if (priceSlider) {
      priceSlider.max = maxPrice;
      priceSlider.value = maxPrice;
      activeFilters.priceMax = maxPrice;
      if (priceDisplay) priceDisplay.textContent = '€' + maxPrice;
      priceSlider.addEventListener('input', () => {
        activeFilters.priceMax = parseFloat(priceSlider.value);
        if (priceDisplay) priceDisplay.textContent = '€' + priceSlider.value;
        render();
      });
    }
  }

  function buildGroup(containerId, filterKey, values) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = values.map(v => `
      <label class="filter-checkbox">
        <input type="checkbox" value="${v}" data-filter="${filterKey}">
        <span class="checkmark"></span>
        ${v}
      </label>
    `).join('');
  }

  function bindEvents() {
    document.addEventListener('change', e => {
      const input = e.target;
      if (input.dataset.filter) {
        const key = input.dataset.filter;
        if (input.checked) {
          if (!activeFilters[key].includes(input.value)) activeFilters[key].push(input.value);
        } else {
          activeFilters[key] = activeFilters[key].filter(v => v !== input.value);
        }
        updateActiveFilterChips();
        render();
      }
    });

    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
      sortSelect.addEventListener('change', () => {
        currentSort = sortSelect.value;
        render();
      });
    }

    const clearBtn = document.getElementById('clear-filters');
    if (clearBtn) {
      clearBtn.addEventListener('click', clearAllFilters);
    }

    const searchInput = document.getElementById('product-search');
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        searchQuery = searchInput.value.toLowerCase();
        render();
      });
    }

    const viewBtns = document.querySelectorAll('[data-view]');
    viewBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        viewBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const grid = document.getElementById('product-grid');
        if (grid) {
          grid.className = btn.dataset.view === 'list' ? 'product-list' : 'product-grid';
        }
      });
    });
  }

  function clearAllFilters() {
    activeFilters = { brands: [], colors: [], ipRatings: [], priceMax: Infinity };
    searchQuery = '';
    document.querySelectorAll('[data-filter]').forEach(input => input.checked = false);
    const priceSlider = document.getElementById('price-range');
    if (priceSlider) {
      const max = parseFloat(priceSlider.max);
      priceSlider.value = max;
      activeFilters.priceMax = max;
      const priceDisplay = document.getElementById('price-display');
      if (priceDisplay) priceDisplay.textContent = '€' + max;
    }
    const searchInput = document.getElementById('product-search');
    if (searchInput) searchInput.value = '';
    updateActiveFilterChips();
    render();
  }

  function filterProducts() {
    return allProducts.filter(p => {
      if (activeFilters.brands.length && !activeFilters.brands.includes(p.brand)) return false;
      if (activeFilters.colors.length && !activeFilters.colors.includes(p.color)) return false;
      if (activeFilters.ipRatings.length && !activeFilters.ipRatings.includes(p.ipRating)) return false;
      if (p.price > activeFilters.priceMax) return false;
      if (searchQuery && !p.name.toLowerCase().includes(searchQuery) && !p.brand.toLowerCase().includes(searchQuery)) return false;
      return true;
    });
  }

  function sortProducts(products) {
    const sorted = [...products];
    switch (currentSort) {
      case 'price-asc': return sorted.sort((a, b) => a.price - b.price);
      case 'price-desc': return sorted.sort((a, b) => b.price - a.price);
      case 'name-asc': return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'rating': return sorted.sort((a, b) => b.rating - a.rating);
      default: return sorted;
    }
  }

  function render() {
    const filtered = sortProducts(filterProducts());
    const grid = document.getElementById('product-grid');
    const countEl = document.getElementById('product-count');
    if (!grid) return;

    if (countEl) countEl.textContent = `${filtered.length} product${filtered.length !== 1 ? 's' : ''}`;

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="no-results">
          <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <h3>No products found</h3>
          <p>Try adjusting your filters or <button onclick="Filters.clearAll()" class="link-btn">clear all filters</button></p>
        </div>`;
      return;
    }

    grid.innerHTML = filtered.map(product => renderProductCard(product)).join('');
  }

  function renderProductCard(product) {
    const stars = renderStars(product.rating);
    const badge = product.badge ? `<span class="product-badge badge-${product.badge.toLowerCase().replace(/\s/g, '-')}">${product.badge}</span>` : '';
    const stockClass = product.inStock ? 'in-stock' : 'out-of-stock';
    const stockText = product.inStock ? 'In Stock' : 'Out of Stock';

    return `
      <article class="product-card" data-id="${product.id}">
        <a href="product.html?id=${product.id}" class="product-card-image">
          ${badge}
          <img src="${product.image}" alt="${product.name}" loading="lazy">
          <div class="product-card-overlay">
            <span class="quick-view-btn">Quick View</span>
          </div>
        </a>
        <div class="product-card-body">
          <p class="product-card-brand">${product.brand}</p>
          <h3 class="product-card-name">
            <a href="product.html?id=${product.id}">${product.name}</a>
          </h3>
          <div class="product-card-rating">
            ${stars}
            <span class="review-count">(${product.reviews})</span>
          </div>
          <div class="product-card-footer">
            <div class="product-card-price">
              <span class="price-exvat">€${product.price.toFixed(2)}</span>
              <span class="price-label">ex. VAT</span>
            </div>
            <button
              class="btn-add-cart"
              onclick="Cart.add(${JSON.stringify(product).replace(/"/g, '&quot;')}, 1)"
              ${!product.inStock ? 'disabled' : ''}
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              ${product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
          <p class="product-card-stock ${stockClass}">
            <span class="stock-dot"></span>${stockText}
          </p>
        </div>
      </article>
    `;
  }

  function renderStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) stars += '<svg class="star filled" viewBox="0 0 24 24" width="14" height="14"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>';
      else if (rating >= i - 0.5) stars += '<svg class="star half" viewBox="0 0 24 24" width="14" height="14"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>';
      else stars += '<svg class="star empty" viewBox="0 0 24 24" width="14" height="14"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>';
    }
    return stars;
  }

  function updateActiveFilterChips() {
    const container = document.getElementById('active-filters');
    if (!container) return;
    const chips = [];
    ['brands', 'colors', 'ipRatings'].forEach(key => {
      activeFilters[key].forEach(val => {
        chips.push(`<span class="filter-chip" data-key="${key}" data-val="${val}">${val} <button onclick="Filters.removeFilter('${key}','${val}')">×</button></span>`);
      });
    });
    container.innerHTML = chips.join('');
    const clearAll = document.getElementById('clear-all-chips');
    if (clearAll) clearAll.style.display = chips.length > 0 ? 'inline-flex' : 'none';
  }

  function removeFilter(key, val) {
    activeFilters[key] = activeFilters[key].filter(v => v !== val);
    const input = document.querySelector(`[data-filter="${key}"][value="${val}"]`);
    if (input) input.checked = false;
    updateActiveFilterChips();
    render();
  }

  return { init, clearAll: clearAllFilters, removeFilter, renderProductCard, renderStars };
})();
