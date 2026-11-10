/* ============================================================
   METRA — product detail page
   ============================================================ */
(function () {
  const { products, byId, watchSVG, stars, money, cardHTML, metals } = window.METRA;
  const $ = s => document.querySelector(s);
  const root = $('#pd-root');
  const params = new URLSearchParams(location.search);
  const p = byId(params.get('id')) || products[0];

  const metalLabel = (metals.find(m => m.key === p.metal) || {}).label || p.metal;
  const strapLabel = p.strap.type === 'bracelet' ? 'steel link bracelet'
    : p.strap.type === 'rubber' ? 'soft-touch rubber' : 'calfskin leather';

  const dials = [
    { name: 'As shown', dial: p.dial, dial2: p.dial2 },
    { name: 'Onyx', dial: '#131317', dial2: '#000000' },
    { name: 'Champagne', dial: '#e9ddc0', dial2: '#a08c62' }
  ];

  const HEART = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M12 20.7l-1.5-1.4C5.4 14.7 2 11.6 2 7.9 2 5 4.2 2.8 7 2.8c1.7 0 3.3.8 4.4 2.1l.6.8.6-.8C13.7 3.6 15.3 2.8 17 2.8c2.8 0 5 2.2 5 5.1 0 3.7-3.4 6.8-8.5 11.4L12 20.7z"/></svg>';
  const ASSURE = {
    truck: '<svg viewBox="0 0 24 24"><path d="M2 7h11v10H2zM13 10h5l4 3v4h-9z"/><circle cx="6" cy="19" r="2"/><circle cx="18" cy="19" r="2"/></svg>',
    shield: '<svg viewBox="0 0 24 24"><path d="M12 3l8 3v6c0 5-3.4 8.2-8 9-4.6-.8-8-4-8-9V6l8-3z"/><path d="M9 12l2 2 4-4"/></svg>',
    refresh: '<svg viewBox="0 0 24 24"><path d="M3 12a9 9 0 0 1 15-6.7L21 8M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16M3 21v-5h5"/></svg>'
  };

  document.title = p.name + ' — METRA Fine Timepieces';
  const crumbName = $('[data-crumb-name]');
  if (crumbName) crumbName.textContent = p.name;

  const wished = window.Store.isWished(p.id);
  const priceHTML = p.old
    ? `<span class="now">${money(p.price)}</span><span class="old">${money(p.old)}</span><span class="save">Save ${money(p.old - p.price)}</span>`
    : `<span class="now">${money(p.price)}</span>`;

  const specsRows = Object.entries(p.specs).map(([k, v]) => `<tr><td>${k}</td><td>${v}</td></tr>`).join('');

  root.innerHTML = `
    <div class="pd-gallery reveal">
      <div class="pd-main" data-pd-main>
        ${watchSVG(p)}
        <span class="pd-zoom-hint">Hover to inspect</span>
      </div>
      <div class="pd-thumbs">
        <button class="pd-thumb active" data-view="1" aria-label="Front view">${watchSVG(p)}</button>
        <button class="pd-thumb" data-view="2" aria-label="Angled view">${watchSVG(p)}</button>
        <button class="pd-thumb" data-view="3" aria-label="Close up">${watchSVG(p)}</button>
        <button class="pd-thumb" data-view="4" aria-label="Profile view">${watchSVG(p)}</button>
      </div>
    </div>

    <div class="pd-info reveal" data-delay="1">
      <div class="pd-cat">${p.cat} · ${metalLabel}</div>
      <h1>${p.name}</h1>
      <div class="pd-rating">${stars(p.rating)}<span>${p.rating} · ${p.reviews} verified reviews</span></div>
      <div class="pd-price">${priceHTML}</div>
      <p class="pd-desc">${p.desc}</p>

      <div style="display:flex;align-items:center;gap:8px;font-size:9.5px;letter-spacing:.18em;text-transform:uppercase;color:var(--green);margin-top:18px">
        <span style="width:5px;height:5px;border-radius:50%;background:var(--green);box-shadow:0 0 8px var(--green)"></span>
        In stock — ships within 24 hours
      </div>

      <div class="pd-opt">
        <div class="ol">Dial preview <b data-dial-name>As shown</b></div>
        <div class="opt-row" data-dials>
          ${dials.map((d, i) => `<button class="sw${i === 0 ? ' active' : ''}" data-dial-index="${i}" title="${d.name}" aria-label="${d.name}" style="width:30px;height:30px;background:linear-gradient(135deg,${d.dial},${d.dial2})"></button>`).join('')}
        </div>
      </div>

      <div class="pd-opt">
        <div class="ol">Strap <b>${strapLabel}</b></div>
        <div class="opt-row">
          <span class="opt active">${p.strap.type === 'bracelet' ? 'Steel bracelet' : p.strap.type === 'rubber' ? 'Rubber' : 'Leather'}</span>
          <span class="opt" style="opacity:.45;cursor:not-allowed">Alligator + $180</span>
        </div>
        <p style="font-size:10.5px;color:var(--muted-2);margin-top:9px;letter-spacing:.04em">Complimentary strap fitting at any METRA boutique.</p>
      </div>

      <div class="pd-buy">
        <div class="qty" data-qty>
          <button data-q="-1" aria-label="Decrease quantity">−</button>
          <span data-qval>1</span>
          <button data-q="1" aria-label="Increase quantity">+</button>
        </div>
        <button class="btn btn-gold" data-buy="${p.id}">Add to bag — ${money(p.price)}</button>
        <button class="btn${wished ? ' on' : ''}" data-wish="${p.id}" style="width:54px;padding:0" aria-label="Save to wishlist">${HEART}</button>
      </div>

      <div class="pd-assure">
        <div>${ASSURE.truck} Complimentary<br>insured delivery</div>
        <div>${ASSURE.shield} 5-year<br>international warranty</div>
        <div>${ASSURE.refresh} 30-day<br>complimentary returns</div>
      </div>

      <div class="acc">
        <div class="acc-item open">
          <button class="acc-btn">The story <span class="pm"></span></button>
          <div class="acc-panel"><div class="ap-in">${p.desc} Each reference is delivered in a signed presentation box with its certificate of origin, a travel pouch and a hand-numbered warranty card.</div></div>
        </div>
        <div class="acc-item">
          <button class="acc-btn">Specifications <span class="pm"></span></button>
          <div class="acc-panel"><div class="ap-in"><table class="spec-table">${specsRows}</table></div></div>
        </div>
        <div class="acc-item">
          <button class="acc-btn">Shipping &amp; returns <span class="pm"></span></button>
          <div class="acc-panel"><div class="ap-in">Complimentary insured shipping worldwide on orders above $500, dispatched within 24 hours from Geneva. Returns are accepted within 30 days in unworn condition, with a prepaid return label included in every parcel.</div></div>
        </div>
        <div class="acc-item">
          <button class="acc-btn">Care &amp; servicing <span class="pm"></span></button>
          <div class="acc-panel"><div class="ap-in">We recommend a full service every five to seven years. METRA owners receive priority servicing at our Geneva atelier and a complimentary ultrasonic clean each year.</div></div>
        </div>
      </div>
    </div>`;

  /* ---------- gallery views ---------- */
  const main = $('[data-pd-main]');
  const views = {
    '1': '',
    '2': 'rotate(-10deg) scale(.92)',
    '3': 'scale(1.5) translateY(3%)',
    '4': 'rotate(8deg) scale(1.03)'
  };
  document.querySelectorAll('[data-view]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-view]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const svg = main.querySelector('svg');
      if (svg) svg.style.transform = views[btn.dataset.view] || '';
    });
  });

  /* ---------- dial preview ---------- */
  let current = p;
  document.querySelectorAll('[data-dial-index]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-dial-index]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const d = dials[+btn.dataset.dialIndex];
      current = { ...p, dial: d.dial, dial2: d.dial2 };
      main.innerHTML = watchSVG(current) + '<span class="pd-zoom-hint">Hover to inspect</span>';
      document.querySelectorAll('[data-view]').forEach(b => {
        b.innerHTML = watchSVG(current);
        b.classList.toggle('active', b.dataset.view === '1');
      });
      const label = $('[data-dial-name]');
      if (label) label.textContent = d.name;
    });
  });

  /* ---------- quantity + add ---------- */
  let qty = 1;
  document.querySelectorAll('[data-q]').forEach(btn => {
    btn.addEventListener('click', () => {
      qty = Math.max(1, Math.min(9, qty + parseInt(btn.dataset.q, 10)));
      const el = $('[data-qval]');
      if (el) el.textContent = qty;
    });
  });

  const buy = $('[data-buy]');
  if (buy) {
    buy.addEventListener('click', () => {
      window.Store.add(p.id, qty);
      window.toast(`${qty > 1 ? qty + ' × ' : ''}${p.name} added to your bag`);
      window.METRA_UI.openDrawer();
    });
  }

  /* ---------- accordions ---------- */
  document.querySelectorAll('.acc-btn').forEach(btn => {
    const item = btn.parentElement;
    const panel = item.querySelector('.acc-panel');
    if (item.classList.contains('open')) panel.style.maxHeight = panel.scrollHeight + 'px';
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.acc-item').forEach(it => {
        it.classList.remove('open');
        const pn = it.querySelector('.acc-panel');
        if (pn) pn.style.maxHeight = '';
      });
      if (!isOpen) {
        item.classList.add('open');
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  });

  /* ---------- related ---------- */
  const related = products.filter(x => x.id !== p.id)
    .sort((a, b) => (b.cat === p.cat) - (a.cat === p.cat))
    .slice(0, 4);
  const rg = $('#related-grid');
  if (rg) rg.innerHTML = related.map((x, i) => cardHTML(x, i)).join('');
  if (window.METRA.refresh) requestAnimationFrame(window.METRA.refresh);
})();
