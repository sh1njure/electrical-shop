/* ============================================================
   cart.js — Cart state management (localStorage-backed)
   ============================================================ */

const Cart = (() => {
  const STORAGE_KEY = 'voltpro_cart';
  const VAT_RATE = 0.23;

  function load() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  }

  function save(items) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    updateCartUI();
  }

  function getAll() {
    return load();
  }

  function getCount() {
    return load().reduce((sum, item) => sum + item.qty, 0);
  }

  function getSubtotal(inclVat = false) {
    const items = load();
    const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
    return inclVat ? subtotal * (1 + VAT_RATE) : subtotal;
  }

  function add(product, qty = 1) {
    const items = load();
    const existing = items.find(i => i.id === product.id);
    if (existing) {
      existing.qty += qty;
    } else {
      items.push({
        id: product.id,
        name: product.name,
        brand: product.brand,
        price: product.price,
        image: product.image,
        sku: product.sku,
        qty
      });
    }
    save(items);
    showCartToast(product.name, qty);
  }

  function remove(id) {
    save(load().filter(i => i.id !== id));
  }

  function updateQty(id, qty) {
    const items = load();
    const item = items.find(i => i.id === id);
    if (!item) return;
    if (qty < 1) {
      remove(id);
      return;
    }
    item.qty = qty;
    save(items);
  }

  function clear() {
    save([]);
  }

  function updateCartUI() {
    const count = getCount();
    document.querySelectorAll('.cart-count').forEach(el => {
      el.textContent = count;
      el.style.display = count > 0 ? 'flex' : 'none';
    });
    renderMiniCart();
  }

  function renderMiniCart() {
    const container = document.getElementById('mini-cart-items');
    const totalEl = document.getElementById('mini-cart-total');
    if (!container) return;

    const items = load();
    if (items.length === 0) {
      container.innerHTML = `
        <div class="cart-empty">
          <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 01-8 0"/>
          </svg>
          <p>Your cart is empty</p>
        </div>`;
      if (totalEl) totalEl.textContent = '€0.00';
      return;
    }

    container.innerHTML = items.map(item => `
      <div class="mini-cart-item" data-id="${item.id}">
        <img src="${item.image}" alt="${item.name}" loading="lazy">
        <div class="mini-cart-item-info">
          <p class="mini-cart-item-name">${item.name}</p>
          <p class="mini-cart-item-brand">${item.brand || ''}</p>
          <div class="mini-cart-item-qty">
            <button class="qty-btn" onclick="Cart.updateQty(${item.id}, ${item.qty - 1})">−</button>
            <span>${item.qty}</span>
            <button class="qty-btn" onclick="Cart.updateQty(${item.id}, ${item.qty + 1})">+</button>
          </div>
        </div>
        <div class="mini-cart-item-right">
          <span class="mini-cart-item-price">€${(item.price * item.qty).toFixed(2)}</span>
          <button class="mini-cart-remove" onclick="Cart.remove(${item.id})" aria-label="Remove">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      </div>
    `).join('');

    if (totalEl) totalEl.textContent = '€' + getSubtotal().toFixed(2);
  }

  function showCartToast(name, qty) {
    let toast = document.getElementById('cart-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'cart-toast';
      toast.className = 'cart-toast';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
      <span><strong>${qty}x</strong> ${name.length > 35 ? name.substring(0, 35) + '…' : name} added to cart</span>
    `;
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('show'), 3000);
  }

  function initCartPage() {
    const container = document.getElementById('cart-items-container');
    if (!container) return;

    renderCartPage();

    document.addEventListener('click', e => {
      if (e.target.closest('[data-cart-remove]')) {
        const id = parseInt(e.target.closest('[data-cart-remove]').dataset.cartRemove);
        remove(id);
        renderCartPage();
      }
      if (e.target.closest('[data-qty-dec]')) {
        const id = parseInt(e.target.closest('[data-qty-dec]').dataset.qtyDec);
        const items = load();
        const item = items.find(i => i.id === id);
        if (item) updateQty(id, item.qty - 1);
        renderCartPage();
      }
      if (e.target.closest('[data-qty-inc]')) {
        const id = parseInt(e.target.closest('[data-qty-inc]').dataset.qtyInc);
        const items = load();
        const item = items.find(i => i.id === id);
        if (item) updateQty(id, item.qty + 1);
        renderCartPage();
      }
    });

    const vatToggle = document.getElementById('cart-vat-toggle');
    if (vatToggle) {
      vatToggle.addEventListener('change', renderCartPage);
    }
  }

  function renderCartPage() {
    const container = document.getElementById('cart-items-container');
    if (!container) return;

    const items = load();
    const vatToggle = document.getElementById('cart-vat-toggle');
    const inclVat = vatToggle ? vatToggle.checked : false;
    const multiplier = inclVat ? (1 + VAT_RATE) : 1;
    const vatLabel = inclVat ? 'inc. VAT' : 'ex. VAT';

    const emptyState = document.getElementById('cart-empty-state');
    const cartContent = document.getElementById('cart-content');

    if (items.length === 0) {
      if (emptyState) emptyState.style.display = 'block';
      if (cartContent) cartContent.style.display = 'none';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';
    if (cartContent) cartContent.style.display = 'grid';

    container.innerHTML = items.map(item => {
      const lineTotal = item.price * item.qty * multiplier;
      const unitPrice = item.price * multiplier;
      return `
        <div class="cart-row" data-id="${item.id}">
          <div class="cart-row-img">
            <img src="${item.image}" alt="${item.name}" loading="lazy">
          </div>
          <div class="cart-row-info">
            <h3 class="cart-row-name">${item.name}</h3>
            <p class="cart-row-sku">SKU: ${item.sku || 'N/A'} | ${item.brand || ''}</p>
            <p class="cart-row-unit-price">€${unitPrice.toFixed(2)} ${vatLabel}</p>
            <div class="cart-row-controls">
              <div class="qty-control">
                <button class="qty-btn" data-qty-dec="${item.id}">−</button>
                <span class="qty-value">${item.qty}</span>
                <button class="qty-btn" data-qty-inc="${item.id}">+</button>
              </div>
              <button class="btn-remove" data-cart-remove="${item.id}">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
                </svg>
                Remove
              </button>
            </div>
          </div>
          <div class="cart-row-total">€${lineTotal.toFixed(2)}</div>
        </div>
      `;
    }).join('');

    const subtotal = getSubtotal() * multiplier;
    const shipping = subtotal >= 150 * (inclVat ? 1 + VAT_RATE : 1) ? 0 : 8.99;
    const total = subtotal + shipping;

    const summaryEl = document.getElementById('order-summary-values');
    if (summaryEl) {
      document.getElementById('summary-subtotal').textContent = '€' + subtotal.toFixed(2);
      document.getElementById('summary-shipping').textContent = shipping === 0 ? 'FREE' : '€' + shipping.toFixed(2);
      document.getElementById('summary-total').textContent = '€' + total.toFixed(2);
      document.getElementById('summary-vat-label').textContent = vatLabel;
      document.getElementById('summary-count').textContent = getCount() + ' item' + (getCount() !== 1 ? 's' : '');
    }
  }

  return { add, remove, updateQty, clear, getAll, getCount, getSubtotal, updateCartUI, renderMiniCart, initCartPage };
})();

document.addEventListener('DOMContentLoaded', () => {
  Cart.updateCartUI();
  Cart.initCartPage();
});
