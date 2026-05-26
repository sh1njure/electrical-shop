/* ============================================================
   main.js — Navigation, dark mode, search, product data
   ============================================================ */

/* ── Product Data ─────────────────────────────────────────── */
const PRODUCTS = [
  /* LED Lighting */
  { id: 1,  name: 'Robus 20W LED Panel 600×600mm',             category: 'led-lighting',       sub: 'panels',      brand: 'Robus',            price: 24.99,  image: 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=400&h=320&fit=crop&q=80',  rating: 4.5, reviews: 23,  inStock: true,  sku: 'ROB-LP20-600',   color: 'White',  ipRating: 'IP20', badge: 'Popular',    wattage: '20W',  lumens: '2100lm',  cct: '4000K' },
  { id: 2,  name: 'Kosnic GU10 7W LED Bulb Pack of 10',        category: 'led-lighting',       sub: 'downlights',  brand: 'Kosnic',           price: 18.50,  image: 'https://images.unsplash.com/photo-tvnnomHvv9I?w=400&h=320&fit=crop&q=80',             rating: 4.8, reviews: 67,  inStock: true,  sku: 'KOS-GU10-7W10',  color: 'White',  ipRating: 'IP20', badge: 'Best Seller', wattage: '7W',   lumens: '630lm',   cct: '3000K' },
  { id: 3,  name: 'Ansell 50W LED Floodlight IP65',            category: 'led-lighting',       sub: 'floodlights', brand: 'Ansell',           price: 39.99,  image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&h=320&fit=crop&q=80',  rating: 4.6, reviews: 41,  inStock: true,  sku: 'ANS-FL50-IP65',  color: 'Silver', ipRating: 'IP65', badge: null,          wattage: '50W',  lumens: '4500lm',  cct: '6000K' },
  { id: 4,  name: 'Luceco LED Strip Light 5m 24V',             category: 'led-lighting',       sub: 'strips',      brand: 'Luceco',           price: 22.75,  image: 'https://images.unsplash.com/photo-1509443041565-b5c9c8ab7e55?w=400&h=320&fit=crop&q=80',  rating: 4.3, reviews: 18,  inStock: true,  sku: 'LUC-STR5-24V',   color: 'White',  ipRating: 'IP20', badge: null,          wattage: '24W',  lumens: '2000lm',  cct: '4000K' },
  { id: 5,  name: 'Robus 40W LED Batten 5ft Weatherproof',     category: 'led-lighting',       sub: 'battens',     brand: 'Robus',            price: 32.00,  image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=320&fit=crop&q=80',  rating: 4.4, reviews: 29,  inStock: true,  sku: 'ROB-BAT40-5FT',  color: 'White',  ipRating: 'IP65', badge: null,          wattage: '40W',  lumens: '4200lm',  cct: '4000K' },
  { id: 6,  name: 'Ansell 100W UFO High Bay LED',              category: 'led-lighting',       sub: 'high-bays',   brand: 'Ansell',           price: 89.00,  image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=320&fit=crop&q=80',  rating: 4.7, reviews: 34,  inStock: true,  sku: 'ANS-HB100-UFO',  color: 'Silver', ipRating: 'IP65', badge: 'New',         wattage: '100W', lumens: '12000lm', cct: '5000K' },
  { id: 7,  name: 'Luceco Emergency LED Bulkhead IP65',        category: 'led-lighting',       sub: 'emergency',   brand: 'Luceco',           price: 28.99,  image: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=400&h=320&fit=crop&q=80',  rating: 4.2, reviews: 12,  inStock: true,  sku: 'LUC-BH28-IP65',  color: 'White',  ipRating: 'IP65', badge: null,          wattage: '8W',   lumens: '700lm',   cct: '4000K' },
  { id: 8,  name: 'Collingwood Smart Dimmable LED Downlight',  category: 'led-lighting',       sub: 'downlights',  brand: 'Collingwood',      price: 35.00,  image: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=400&h=320&fit=crop&q=80',  rating: 4.9, reviews: 56,  inStock: false, sku: 'COL-DL35-SMART', color: 'White',  ipRating: 'IP44', badge: 'Sale',        wattage: '12W',  lumens: '1100lm',  cct: '2700K-6500K' },

  /* Wiring Accessories */
  { id: 9,  name: 'Click 13A DP Switched Socket White',        category: 'wiring-accessories', sub: 'sockets',     brand: 'Click',            price: 4.50,   image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=320&fit=crop&q=80',  rating: 4.6, reviews: 88,  inStock: true,  sku: 'CLK-13A-DPWH',   color: 'White',  ipRating: 'IP20', badge: null,          wattage: null, lumens: null, cct: null },
  { id: 10, name: 'Click 1 Gang 2-Way Light Switch',           category: 'wiring-accessories', sub: 'switches',    brand: 'Click',            price: 3.20,   image: 'https://images.unsplash.com/photo-3ci2aJgGi1c?w=400&h=320&fit=crop&q=80',             rating: 4.5, reviews: 102, inStock: true,  sku: 'CLK-1G-2WAY',    color: 'White',  ipRating: 'IP20', badge: 'Popular',    wattage: null, lumens: null, cct: null },
  { id: 11, name: 'MK Electric 400W LED Rotary Dimmer',        category: 'wiring-accessories', sub: 'dimmers',     brand: 'MK Electric',      price: 14.75,  image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&h=320&fit=crop&q=80', rating: 4.4, reviews: 37,  inStock: true,  sku: 'MK-DIM400-LED',  color: 'White',  ipRating: 'IP20', badge: null,          wattage: null, lumens: null, cct: null },
  { id: 12, name: 'MK Electric 20A DP Switch Outdoor IP66',    category: 'wiring-accessories', sub: 'outdoor',     brand: 'MK Electric',      price: 18.00,  image: 'https://images.unsplash.com/photo-y0CQeHoEZbI?w=400&h=320&fit=crop&q=80',             rating: 4.3, reviews: 21,  inStock: true,  sku: 'MK-20A-IP66',    color: 'Grey',   ipRating: 'IP66', badge: null,          wattage: null, lumens: null, cct: null },
  { id: 13, name: 'Click 4-Gang Extension Lead 2m',            category: 'wiring-accessories', sub: 'extension',   brand: 'Click',            price: 12.99,  image: 'https://images.unsplash.com/photo-1625772452859-1c03d884bf0e?w=400&h=320&fit=crop&q=80', rating: 4.7, reviews: 143, inStock: true,  sku: 'CLK-4G-2M',      color: 'White',  ipRating: 'IP20', badge: 'Best Seller', wattage: null, lumens: null, cct: null },
  { id: 14, name: 'Legrand RJ45 Cat6 Keystone Jack',           category: 'wiring-accessories', sub: 'grid',        brand: 'Legrand',          price: 2.50,   image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=320&fit=crop&q=80',  rating: 4.2, reviews: 44,  inStock: true,  sku: 'LEG-RJ45-CAT6',  color: 'White',  ipRating: 'IP20', badge: null,          wattage: null, lumens: null, cct: null },

  /* Cable */
  { id: 15, name: 'Prysmian 2.5mm² T&E Cable 100m',           category: 'cable',              sub: 'te',          brand: 'Prysmian',         price: 89.00,  image: 'https://images.unsplash.com/photo-1601524909162-ae8725290836?w=400&h=320&fit=crop&q=80', rating: 4.8, reviews: 76,  inStock: true,  sku: 'PRY-2.5TE-100',  color: 'Grey',   ipRating: null,   badge: 'Popular',    wattage: null, lumens: null, cct: null },
  { id: 16, name: 'Prysmian 1.5mm² 3-Core Flex 50m',          category: 'cable',              sub: 'flex',        brand: 'Prysmian',         price: 34.99,  image: 'https://images.unsplash.com/photo-hokONTrHIAQ?w=400&h=320&fit=crop&q=80',             rating: 4.6, reviews: 55,  inStock: true,  sku: 'PRY-1.5FL-50',   color: 'White',  ipRating: null,   badge: null,          wattage: null, lumens: null, cct: null },
  { id: 17, name: 'Nexans 6mm² SWA Armoured Cable 25m',       category: 'cable',              sub: 'swa',         brand: 'Nexans',           price: 112.50, image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=320&fit=crop&q=80', rating: 4.7, reviews: 29,  inStock: true,  sku: 'NEX-6SWA-25',    color: 'Black',  ipRating: null,   badge: 'New',         wattage: null, lumens: null, cct: null },
  { id: 18, name: 'Belden Cat6 UTP Cable 305m Grey',           category: 'cable',              sub: 'data',        brand: 'Belden',           price: 125.00, image: 'https://images.unsplash.com/photo-ZoiKsSBoJCc?w=400&h=320&fit=crop&q=80',             rating: 4.5, reviews: 38,  inStock: true,  sku: 'BEL-CAT6-305',   color: 'Grey',   ipRating: null,   badge: null,          wattage: null, lumens: null, cct: null },
  { id: 19, name: 'Prysmian Coaxial RG6 Cable 100m',          category: 'cable',              sub: 'coax',        brand: 'Prysmian',         price: 45.00,  image: 'https://images.unsplash.com/photo-M5tzZtFCOfs?w=400&h=320&fit=crop&q=80',             rating: 4.3, reviews: 17,  inStock: true,  sku: 'PRY-RG6-100',    color: 'White',  ipRating: null,   badge: null,          wattage: null, lumens: null, cct: null },
  { id: 20, name: 'Nexans 16mm² Singles Brown 100m',          category: 'cable',              sub: 'singles',     brand: 'Nexans',           price: 145.00, image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400&h=320&fit=crop&q=80',  rating: 4.4, reviews: 22,  inStock: false, sku: 'NEX-16SG-100',   color: 'Brown',  ipRating: null,   badge: null,          wattage: null, lumens: null, cct: null },

  /* Tools & Fixings */
  { id: 21, name: 'DeWalt VDE Screwdriver Set 6-Piece',        category: 'tools-fixings',      sub: 'hand',        brand: 'DeWalt',           price: 24.99,  image: 'https://images.unsplash.com/photo-VrF2AnqWZlo?w=400&h=320&fit=crop&q=80',             rating: 4.8, reviews: 91,  inStock: true,  sku: 'DWT-VDE-6PC',    color: 'Yellow', ipRating: null,   badge: 'Best Seller', wattage: null, lumens: null, cct: null },
  { id: 22, name: 'Fluke 117 Digital Multimeter Cat III',      category: 'tools-fixings',      sub: 'test',        brand: 'Fluke',            price: 45.00,  image: 'https://images.unsplash.com/photo-PkHf7BUWbtk?w=400&h=320&fit=crop&q=80',             rating: 4.9, reviews: 63,  inStock: true,  sku: 'FLK-117-CIII',   color: 'Yellow', ipRating: null,   badge: 'Popular',    wattage: null, lumens: null, cct: null },
  { id: 23, name: 'Fluke Non-Contact Voltage Tester T5-600',   category: 'tools-fixings',      sub: 'test',        brand: 'Fluke',            price: 22.50,  image: 'https://images.unsplash.com/photo-t5YUoHW6zRo?w=400&h=320&fit=crop&q=80',             rating: 4.7, reviews: 48,  inStock: true,  sku: 'FLK-T5-600',     color: 'Yellow', ipRating: null,   badge: null,          wattage: null, lumens: null, cct: null },
  { id: 24, name: 'CK Tools Fish Rod Conduit Set 10m',         category: 'tools-fixings',      sub: 'fish',        brand: 'CK Tools',         price: 35.00,  image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400&h=320&fit=crop&q=80', rating: 4.5, reviews: 27,  inStock: true,  sku: 'CKT-FISH-10M',   color: 'Yellow', ipRating: null,   badge: null,          wattage: null, lumens: null, cct: null },
  { id: 25, name: 'Hellermann Tyton Cable Ties 200mm 100pc',   category: 'tools-fixings',      sub: 'ties',        brand: 'Hellermann Tyton', price: 6.99,   image: 'https://images.unsplash.com/photo-MzVMsHA35c0?w=400&h=320&fit=crop&q=80',             rating: 4.4, reviews: 209, inStock: true,  sku: 'HLT-CT200-100',  color: 'White',  ipRating: null,   badge: 'Popular',    wattage: null, lumens: null, cct: null },
  { id: 26, name: 'Knipex Electrician Crimping Tool Set',      category: 'tools-fixings',      sub: 'crimp',       brand: 'Knipex',           price: 38.50,  image: 'https://images.unsplash.com/photo-N4FB-VFMNEk?w=400&h=320&fit=crop&q=80',             rating: 4.6, reviews: 32,  inStock: true,  sku: 'KNP-CRIMP-SET',  color: 'Red',    ipRating: null,   badge: 'New',         wattage: null, lumens: null, cct: null },

  /* Switchgear */
  { id: 27, name: 'Hager 100A Main Switch Isolator',           category: 'switchgear',         sub: 'isolators',   brand: 'Hager',            price: 48.00,  image: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=400&h=320&fit=crop&q=80', rating: 4.6, reviews: 19,  inStock: true,  sku: 'HAG-100A-ISO',   color: 'Grey',   ipRating: 'IP40', badge: null,          wattage: null, lumens: null, cct: null },
  { id: 28, name: 'Hager 4-Way Consumer Unit 100A',            category: 'switchgear',         sub: 'cu',          brand: 'Hager',            price: 62.00,  image: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=400&h=320&fit=crop&q=80',  rating: 4.5, reviews: 14,  inStock: true,  sku: 'HAG-CU4-100A',   color: 'White',  ipRating: 'IP20', badge: 'New',         wattage: null, lumens: null, cct: null },
  { id: 29, name: 'Schneider 10A MCB Type B Single Pole',      category: 'switchgear',         sub: 'mcb',         brand: 'Schneider',        price: 8.50,   image: 'https://images.unsplash.com/photo-CcfJ7ZMlNgk?w=400&h=320&fit=crop&q=80',             rating: 4.7, reviews: 77,  inStock: true,  sku: 'SCH-MCB10B-SP',  color: 'White',  ipRating: 'IP20', badge: 'Popular',    wattage: null, lumens: null, cct: null },
  { id: 30, name: 'Hager 30mA RCCB 40A Double Pole',           category: 'switchgear',         sub: 'rccb',        brand: 'Hager',            price: 34.99,  image: 'https://images.unsplash.com/photo-9kKoHD86U2M?w=400&h=320&fit=crop&q=80',             rating: 4.8, reviews: 43,  inStock: true,  sku: 'HAG-RCC40-DP',   color: 'White',  ipRating: 'IP20', badge: null,          wattage: null, lumens: null, cct: null },
];

window.PRODUCTS = PRODUCTS;

/* ── Utility ──────────────────────────────────────────────── */
function getProductById(id) {
  return PRODUCTS.find(p => p.id === parseInt(id));
}

function getProductsByCategory(cat) {
  return PRODUCTS.filter(p => p.category === cat);
}

function getURLParam(key) {
  return new URLSearchParams(window.location.search).get(key);
}

/* ── Dark Mode ────────────────────────────────────────────── */
function initDarkMode() {
  const toggle = document.getElementById('dark-mode-toggle');
  const html = document.documentElement;
  const saved = localStorage.getItem('voltpro_theme');
  if (saved === 'dark') html.setAttribute('data-theme', 'dark');

  if (toggle) {
    toggle.addEventListener('click', () => {
      const isDark = html.getAttribute('data-theme') === 'dark';
      html.setAttribute('data-theme', isDark ? 'light' : 'dark');
      localStorage.setItem('voltpro_theme', isDark ? 'light' : 'dark');
      toggle.setAttribute('aria-label', isDark ? 'Enable dark mode' : 'Disable dark mode');
    });
  }
}

/* ── Sticky Header ────────────────────────────────────────── */
function initStickyHeader() {
  const header = document.getElementById('main-header');
  if (!header) return;
  let lastScrollY = 0;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY > 80) {
      header.classList.add('header-scrolled');
    } else {
      header.classList.remove('header-scrolled');
    }
    if (scrollY > lastScrollY && scrollY > 200) {
      header.classList.add('header-hidden');
    } else {
      header.classList.remove('header-hidden');
    }
    lastScrollY = scrollY;
  }, { passive: true });
}

/* ── Mobile Menu ──────────────────────────────────────────── */
function initMobileMenu() {
  const burger = document.getElementById('burger-btn');
  const nav = document.getElementById('mobile-nav');
  const overlay = document.getElementById('overlay');
  const closeBtn = document.getElementById('mobile-nav-close');

  function openMenu() {
    nav?.classList.add('open');
    overlay?.classList.add('active');
    document.body.classList.add('no-scroll');
    burger?.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    nav?.classList.remove('open');
    overlay?.classList.remove('active');
    document.body.classList.remove('no-scroll');
    burger?.setAttribute('aria-expanded', 'false');
  }

  burger?.addEventListener('click', () => {
    const isOpen = nav?.classList.contains('open');
    isOpen ? closeMenu() : openMenu();
  });

  closeBtn?.addEventListener('click', closeMenu);
  overlay?.addEventListener('click', closeMenu);

  /* Accordion in mobile nav */
  document.querySelectorAll('.mobile-nav-parent').forEach(item => {
    const btn = item.querySelector('.mobile-nav-toggle');
    btn?.addEventListener('click', () => {
      item.classList.toggle('expanded');
    });
  });
}

/* ── Mini Cart Sidebar ────────────────────────────────────── */
function initMiniCart() {
  const cartIcon = document.getElementById('cart-icon-btn');
  const sidebar = document.getElementById('cart-sidebar');
  const overlay = document.getElementById('overlay');
  const closeBtn = document.getElementById('cart-sidebar-close');

  function openCart() {
    sidebar?.classList.add('open');
    overlay?.classList.add('active');
    document.body.classList.add('no-scroll');
  }

  function closeCart() {
    sidebar?.classList.remove('open');
    if (!document.getElementById('mobile-nav')?.classList.contains('open')) {
      overlay?.classList.remove('active');
      document.body.classList.remove('no-scroll');
    }
  }

  cartIcon?.addEventListener('click', openCart);
  closeBtn?.addEventListener('click', closeCart);
  overlay?.addEventListener('click', closeCart);
}

/* ── Header Search ────────────────────────────────────────── */
function initSearch() {
  const input = document.getElementById('header-search');
  const dropdown = document.getElementById('search-dropdown');
  if (!input || !dropdown) return;

  let timer;
  input.addEventListener('input', () => {
    clearTimeout(timer);
    const q = input.value.trim().toLowerCase();
    if (q.length < 2) { dropdown.classList.remove('open'); return; }
    timer = setTimeout(() => {
      const results = PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)
      ).slice(0, 6);
      renderSearchDropdown(results, q, dropdown);
    }, 200);
  });

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const q = input.value.trim();
      if (q) window.location.href = `category.html?search=${encodeURIComponent(q)}`;
    }
  });

  document.addEventListener('click', e => {
    if (!e.target.closest('.search-wrapper')) dropdown.classList.remove('open');
  });
}

function renderSearchDropdown(results, query, dropdown) {
  if (results.length === 0) {
    dropdown.innerHTML = '<p class="search-no-results">No products found</p>';
    dropdown.classList.add('open');
    return;
  }
  dropdown.innerHTML = results.map(p => `
    <a href="product.html?id=${p.id}" class="search-result-item">
      <img src="${p.image}" alt="${p.name}">
      <div>
        <p class="search-result-name">${highlight(p.name, query)}</p>
        <p class="search-result-brand">${p.brand} · €${p.price.toFixed(2)}</p>
      </div>
    </a>
  `).join('') + `<a href="category.html?search=${encodeURIComponent(query)}" class="search-see-all">See all results →</a>`;
  dropdown.classList.add('open');
}

function highlight(text, query) {
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

/* ── Mega Menu ────────────────────────────────────────────── */
function initMegaMenu() {
  const items = document.querySelectorAll('.nav-item-has-mega');
  items.forEach(item => {
    const menu = item.querySelector('.mega-menu');
    if (!menu) return;
    let timer;

    item.addEventListener('mouseenter', () => {
      clearTimeout(timer);
      menu.classList.add('open');
    });
    item.addEventListener('mouseleave', () => {
      timer = setTimeout(() => menu.classList.remove('open'), 150);
    });
  });
}

/* ── Nav Dropdowns ────────────────────────────────────────── */
function initNavDropdowns() {
  document.querySelectorAll('.nav-item-has-dropdown').forEach(item => {
    const menu = item.querySelector('.nav-dropdown');
    if (!menu) return;
    item.addEventListener('mouseenter', () => menu.classList.add('open'));
    item.addEventListener('mouseleave', () => menu.classList.remove('open'));
  });
}

/* ── Newsletter ───────────────────────────────────────────── */
function initNewsletter() {
  const form = document.getElementById('newsletter-form');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const input = form.querySelector('input[type="email"]');
    if (!input?.value) return;
    const btn = form.querySelector('button');
    btn.textContent = 'Subscribed!';
    btn.disabled = true;
    input.value = '';
    setTimeout(() => { btn.textContent = 'Subscribe'; btn.disabled = false; }, 3000);
  });
}

/* ── Homepage: Featured Products ──────────────────────────── */
function initFeaturedProducts() {
  const grid = document.getElementById('featured-grid');
  if (!grid) return;
  const featured = PRODUCTS.filter(p => p.badge).slice(0, 8);
  grid.innerHTML = featured.map(p => Filters.renderProductCard(p)).join('');
}

/* ── Smooth scroll for anchor links ──────────────────────── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

/* ── Quantity Selector (product page) ─────────────────────── */
function initQtySelector() {
  const dec = document.getElementById('qty-dec');
  const inc = document.getElementById('qty-inc');
  const input = document.getElementById('qty-input');
  if (!dec || !inc || !input) return;
  dec.addEventListener('click', () => {
    const v = parseInt(input.value);
    if (v > 1) input.value = v - 1;
  });
  inc.addEventListener('click', () => {
    const v = parseInt(input.value);
    if (v < 999) input.value = v + 1;
  });
}

/* ── Product page VAT toggle ──────────────────────────────── */
function initProductVatToggle() {
  const toggle = document.getElementById('vat-toggle');
  const priceEl = document.getElementById('product-price-display');
  const vatLabelEl = document.getElementById('price-vat-label');
  if (!toggle || !priceEl) return;
  const VAT = 0.23;
  toggle.addEventListener('change', () => {
    const basePrice = parseFloat(priceEl.dataset.basePrice || 0);
    const inclVat = toggle.checked;
    priceEl.textContent = '€' + (basePrice * (inclVat ? 1 + VAT : 1)).toFixed(2);
    if (vatLabelEl) vatLabelEl.textContent = inclVat ? 'inc. VAT' : 'ex. VAT';
  });
}

/* ── Product page tabs ────────────────────────────────────── */
function initProductTabs() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const panel = btn.dataset.tab;
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('tab-' + panel)?.classList.add('active');
    });
  });
}

/* ── Image Gallery (product page) ────────────────────────── */
function initImageGallery() {
  const thumbs = document.querySelectorAll('.thumb-img');
  const mainImg = document.getElementById('main-product-img');
  if (!thumbs.length || !mainImg) return;
  thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      thumbs.forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
      mainImg.src = thumb.src.replace('w=200&h=200', 'w=600&h=600');
    });
  });
}

/* ── Back-to-top button ───────────────────────────────────── */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ── Checkout form ────────────────────────────────────────── */
function initCheckoutForm() {
  const form = document.getElementById('checkout-form');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    btn.textContent = 'Processing…';
    btn.disabled = true;
    setTimeout(() => {
      document.getElementById('order-success')?.classList.add('show');
      Cart.clear();
    }, 1800);
  });
}

/* ── Init ─────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initDarkMode();
  initStickyHeader();
  initMobileMenu();
  initMiniCart();
  initSearch();
  initMegaMenu();
  initNavDropdowns();
  initNewsletter();
  initFeaturedProducts();
  initSmoothScroll();
  initQtySelector();
  initProductVatToggle();
  initProductTabs();
  initImageGallery();
  initBackToTop();
  initCheckoutForm();
});
