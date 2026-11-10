/* ============================================================
   METRA — layout.js
   Shared header, footer, cart drawer, search, toasts, reveals
   ============================================================ */
(function (w) {
  const doc = w.document;

  /* ---------- icons ---------- */
  const I = {
    search: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M16.5 16.5 21 21"/></svg>',
    heart: '<svg viewBox="0 0 24 24"><path d="M12 20.7l-1.5-1.4C5.4 14.7 2 11.6 2 7.9 2 5 4.2 2.8 7 2.8c1.7 0 3.3.8 4.4 2.1l.6.8.6-.8C13.7 3.6 15.3 2.8 17 2.8c2.8 0 5 2.2 5 5.1 0 3.7-3.4 6.8-8.5 11.4L12 20.7z"/></svg>',
    user: '<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/></svg>',
    bag: '<svg viewBox="0 0 24 24"><path d="M5 8h14l1 13H4L5 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
    close: '<svg viewBox="0 0 24 24"><path d="M5 5l14 14M19 5L5 19"/></svg>',
    pin: '<svg viewBox="0 0 24 24"><path d="M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>',
    mail: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="1"/><path d="M3 7l9 6 9-6"/></svg>',
    phone: '<svg viewBox="0 0 24 24"><path d="M5 3h4l2 5-3 2a12 12 0 0 0 6 6l2-3 5 2v4a2 2 0 0 1-2 2A17 17 0 0 1 3 5a2 2 0 0 1 2-2z"/></svg>',
    arrow: '<svg class="arw" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M4 12h16M14 6l6 6-6 6"/></svg>',
    truck: '<svg viewBox="0 0 24 24"><path d="M2 7h11v10H2zM13 10h5l4 3v4h-9z"/><circle cx="6" cy="19" r="2"/><circle cx="18" cy="19" r="2"/></svg>',
    shield: '<svg viewBox="0 0 24 24"><path d="M12 3l8 3v6c0 5-3.4 8.2-8 9-4.6-.8-8-4-8-9V6l8-3z"/><path d="M9 12l2 2 4-4"/></svg>',
    refresh: '<svg viewBox="0 0 24 24"><path d="M3 12a9 9 0 0 1 15-6.7L21 8M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16M3 21v-5h5"/></svg>',
    clock: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></svg>',
    instagram: '<svg viewBox="0 0 24 24"><path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.9.3 2.4.5.6.2 1 .5 1.5 1s.8.9 1 1.5c.2.5.4 1.2.5 2.4.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.3 1.9-.5 2.4-.2.6-.5 1-1 1.5s-.9.8-1.5 1c-.5.2-1.2.4-2.4.5-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.9-.3-2.4-.5-.6-.2-1-.5-1.5-1s-.8-.9-1-1.5c-.2-.5-.4-1.2-.5-2.4C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.3-1.9.5-2.4.2-.6.5-1 1-1.5s.9-.8 1.5-1c.5-.2 1.2-.4 2.4-.5C8.4 2.2 8.8 2.2 12 2.2zm0 3.4a6.4 6.4 0 1 0 0 12.8 6.4 6.4 0 0 0 0-12.8zm0 10.5a4.1 4.1 0 1 1 0-8.2 4.1 4.1 0 0 1 0 8.2zm6.6-10.8a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/></svg>',
    facebook: '<svg viewBox="0 0 24 24"><path d="M13.5 22v-8h2.7l.4-3.1h-3.1V8.9c0-.9.3-1.5 1.6-1.5h1.6V4.6c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.4-4 4.1v2.3H7.6V14h2.7v8h3.2z"/></svg>',
    x: '<svg viewBox="0 0 24 24"><path d="M17.5 3h3.2l-7 8 8.2 10h-6.4l-5-6.1L4.7 21H1.5l7.5-8.6L1.1 3h6.6l4.5 5.6L17.5 3zm-1.1 16h1.8L7.7 4.8H5.8L16.4 19z"/></svg>',
    pinterest: '<svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 0 0-3.6 19.3c-.1-.8-.2-2 0-2.9l1.2-5s-.3-.6-.3-1.5c0-1.4.8-2.4 1.8-2.4.9 0 1.3.6 1.3 1.4 0 .9-.6 2.2-.9 3.4-.2 1 .5 1.8 1.5 1.8 1.8 0 3.1-2.3 3.1-5 0-2.1-1.4-3.6-3.9-3.6-2.8 0-4.6 2.1-4.6 4.5 0 .9.3 1.5.7 2 .2.2.2.3.1.6l-.2.9c-.1.3-.3.4-.6.3-1.5-.6-2.2-2.3-2.2-4.1 0-3 2.5-6.6 7.6-6.6 4 0 6.7 2.9 6.7 6 0 4.1-2.3 7.2-5.7 7.2-1.1 0-2.2-.6-2.5-1.3l-.7 2.7c-.2.9-.8 2-1.2 2.6A10 10 0 1 0 12 2z"/></svg>',
    check: '<svg viewBox="0 0 24 24"><path d="M4 12.5 9 17.5 20 6.5"/></svg>'
  };

  /* ---------- logo ---------- */
  function logoSVG(cls) {
    return `<svg class="${cls || 'brand-mark'}" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="msmGold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#f0e0b4"/><stop offset=".5" stop-color="#c9a961"/><stop offset="1" stop-color="#8a6a2f"/>
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="30.5" stroke="url(#msmGold)" stroke-width="1"/>
      <circle cx="32" cy="32" r="26.5" stroke="url(#msmGold)" stroke-width=".5" opacity=".4"/>
      <path d="M32 13.5l2.4 3.6-2.4 3.6-2.4-3.6z" fill="url(#msmGold)"/>
      <path d="M19.5 45.5V28.8L32 39.2l12.5-10.4v16.7" stroke="url(#msmGold)" stroke-width="1.9" stroke-linejoin="round" stroke-linecap="round"/>
      <path d="M19.5 50.5h25" stroke="url(#msmGold)" stroke-width=".7" opacity=".45"/>
    </svg>`;
  }

  const brandHTML = (tag) => {
    tag = tag || 'a';
    return `<a class="brand" href="index.html" aria-label="Muhammad Sohail Metra — home">
      ${logoSVG()}
      <span class="brand-text">
        <span class="bt-top">Muhammad Sohail</span>
        <span class="bt-main">Metra<b>.</b></span>
        <span class="bt-sub">Fine Timepieces</span>
      </span>
    </a>`;
  };

  const NAV = [
    { label: 'Home', href: 'index.html', page: 'home' },
    { label: 'Shop', href: 'shop.html', page: 'shop' },
    { label: 'Collections', href: 'shop.html', page: 'shop', drop: true },
    { label: 'About', href: 'about.html', page: 'about' },
    { label: 'Contact', href: 'contact.html', page: 'contact' }
  ];

  function navHTML(active) {
    return NAV.map(n => {
      if (!n.drop) {
        return `<li><a href="${n.href}" class="${active === n.page ? 'active' : ''}">${n.label}</a></li>`;
      }
      const cats = (w.METRA ? w.METRA.categories : []).slice(0, 10);
      return `<li>
        <a href="${n.href}">${n.label} <i class="caret"></i></a>
        <div class="dropdown">
          <div class="dd-head">Our Collections</div>
          ${cats.map(c => `<a href="shop.html?cat=${encodeURIComponent(c)}">${c}<span>View</span></a>`).join('')}
          <a href="shop.html" style="grid-column:1/-1;border-bottom:0;color:var(--gold-bright);margin-top:6px">Browse all timepieces ${I.arrow}</a>
        </div>
      </li>`;
    }).join('');
  }

  function topbarHTML() {
    return `<div class="topbar">
      <div class="wrap">
        <div class="tb-left">Complimentary worldwide shipping over $500</div>
        <div class="tb-mid"><span class="dot"></span> Handcrafted in Switzerland <span class="dot"></span></div>
        <div class="tb-links">
          <a href="contact.html">Client Care</a>
          <a href="about.html">Our Maison</a>
          <a href="login.html">Sign in</a>
        </div>
      </div>
    </div>`;
  }

  function headerHTML(active) {
    return `<div class="wrap">
      ${brandHTML()}
      <nav aria-label="Main"><ul class="nav">${navHTML(active)}</ul></nav>
      <div class="h-actions">
        <button class="icon-btn" data-open-search aria-label="Search">${I.search}</button>
        <a class="icon-btn hide-sm" href="wishlist.html" aria-label="Wishlist">${I.heart}<span class="badge-count" data-wish-count>0</span></a>
        <div class="h-div hide-sm"></div>
        <a class="icon-btn" href="login.html" aria-label="Account">${I.user}</a>
        <button class="icon-btn" data-open-cart aria-label="Shopping bag">${I.bag}<span class="badge-count" data-cart-count>0</span></button>
        <button class="burger" data-open-menu aria-label="Menu"><span></span><span></span></button>
      </div>
    </div>`;
  }

  function footerHTML() {
    return `<div class="wrap">
      <div class="footer-top">
        <div class="footer-brand">
          ${brandHTML()}
          <p>Independent watchmaking since 2009. Designed in Geneva, assembled by hand, delivered to collectors in 42 countries.</p>
          <div class="socials">
            <a href="#" aria-label="Instagram">${I.instagram}</a>
            <a href="#" aria-label="Facebook">${I.facebook}</a>
            <a href="#" aria-label="X">${I.x}</a>
            <a href="#" aria-label="Pinterest">${I.pinterest}</a>
          </div>
        </div>
        <div class="fcol">
          <h5>Collections</h5>
          <ul>
            <li><a href="shop.html?cat=Chronograph">Chronograph</a></li>
            <li><a href="shop.html?cat=Diver">Diver</a></li>
            <li><a href="shop.html?cat=Dress">Dress</a></li>
            <li><a href="shop.html?cat=Skeleton">Skeleton</a></li>
            <li><a href="shop.html?cat=GMT">GMT &amp; Travel</a></li>
            <li><a href="shop.html">All Timepieces</a></li>
          </ul>
        </div>
        <div class="fcol">
          <h5>Client Services</h5>
          <ul>
            <li><a href="contact.html">Contact Us</a></li>
            <li><a href="contact.html#faq">Shipping &amp; Returns</a></li>
            <li><a href="contact.html#faq">Care &amp; Servicing</a></li>
            <li><a href="about.html">Our Warranty</a></li>
            <li><a href="wishlist.html">My Wishlist</a></li>
            <li><a href="login.html">My Account</a></li>
          </ul>
        </div>
        <div class="fcol">
          <h5>The Atelier</h5>
          <div class="contact-line">${I.pin}<span>12 Rue du Rhône,<br>1204 Geneva, Switzerland</span></div>
          <div class="contact-line">${I.phone}<span><a href="tel:+41225550190">+41 22 555 0190</a></span></div>
          <div class="contact-line">${I.mail}<span><a href="mailto:clients@metra.watch">clients@metra.watch</a></span></div>
          <div class="contact-line">${I.clock}<span>Mon – Sat, 10:00 – 19:00 CET</span></div>
        </div>
      </div>
      <div class="footer-bottom">
        <p>© ${new Date().getFullYear()} METRA Fine Timepieces. Created by Muhammad Sohail Metra. All rights reserved.</p>
        <div class="fb-links">
          <a href="#">Privacy</a><a href="#">Terms</a><a href="#">Cookies</a>
        </div>
        <div class="pay">
          <span>VISA</span><span>MASTERCARD</span><span>AMEX</span><span>PAYPAL</span>
        </div>
      </div>
    </div>`;
  }

  /* ---------- drawer / overlay / search markup ---------- */
  function chromeHTML() {
    return `<div class="overlay" data-overlay></div>

    <aside class="drawer" data-drawer aria-label="Shopping bag">
      <div class="drawer-head">
        <h3>Your Bag <span class="muted small" data-drawer-count style="font-family:var(--sans);font-size:11px;letter-spacing:.1em"></span></h3>
        <button class="close" data-close-cart aria-label="Close">${I.close}</button>
      </div>
      <div class="drawer-body" data-drawer-body></div>
      <div class="drawer-foot" data-drawer-foot></div>
    </aside>

    <div class="search-modal" data-search-modal>
      <div class="sm-inner">
        <div class="sm-head">
          <span>Search the collection</span>
          <button class="sm-close" data-close-search aria-label="Close search">${I.close}</button>
        </div>
        <div class="sm-field">
          ${I.search}
          <input type="text" data-search-input placeholder="Try “diver”, “gold” or “chronograph”" autocomplete="off">
        </div>
        <div class="sm-hint">Popular — <a href="shop.html?cat=Chronograph" style="color:var(--gold-bright)">Chronograph</a> · <a href="shop.html?cat=Diver" style="color:var(--gold-bright)">Diver</a> · <a href="shop.html?cat=Skeleton" style="color:var(--gold-bright)">Skeleton</a></div>
        <div class="sm-results" data-search-results></div>
      </div>
    </div>

    <div class="m-nav" data-mnav>
      ${NAV.map(n => `<a class="m-link" href="${n.href}">${n.label}<span>0${NAV.indexOf(n) + 1}</span></a>`).join('')}
      <div class="m-sub">
        <a href="shop.html?cat=Chronograph">Chronograph</a>
        <a href="shop.html?cat=Diver">Diver</a>
        <a href="shop.html?cat=Dress">Dress</a>
        <a href="shop.html?cat=Skeleton">Skeleton</a>
      </div>
      <div class="m-foot"><a href="login.html">Sign in</a><a href="wishlist.html">Wishlist</a><a href="cart.html">Bag</a></div>
    </div>

    <div class="toast-wrap" data-toasts></div>`;
  }

  /* ---------- toast ---------- */
  function toast(msg, type) {
    const wrap = doc.querySelector('[data-toasts]');
    if (!wrap) return;
    const el = doc.createElement('div');
    el.className = 'toast' + (type === 'error' ? ' err' : '');
    el.innerHTML = `<span class="t-ico">${type === 'error' ? '!' : '✓'}</span><span>${msg}</span>`;
    wrap.appendChild(el);
    setTimeout(() => {
      el.classList.add('out');
      setTimeout(() => el.remove(), 380);
    }, 2600);
  }

  /* ---------- cart ---------- */
  function drawerItemHTML(item) {
    const p = item.product;
    return `<div class="drawer-item">
      <a class="di-img" href="product.html?id=${p.id}">${w.METRA.watchSVG(p)}</a>
      <div>
        <a class="di-name" href="product.html?id=${p.id}">${p.name}</a>
        <div class="di-meta">${p.cat} · ${p.metal}</div>
        <div class="di-price">${w.Store.money(p.price)}</div>
        <div class="di-qty">
          <button data-dq="-1" data-id="${p.id}" aria-label="Decrease">−</button>
          <span>${item.qty}</span>
          <button data-dq="1" data-id="${p.id}" aria-label="Increase">+</button>
        </div>
      </div>
      <button class="di-x" data-remove="${p.id}" aria-label="Remove">${I.close}</button>
    </div>`;
  }

  function renderDrawer() {
    const body = doc.querySelector('[data-drawer-body]');
    const foot = doc.querySelector('[data-drawer-foot]');
    const cnt = doc.querySelector('[data-drawer-count]');
    if (!body || !foot) return;
    const items = w.Store.cartDetailed();
    if (cnt) cnt.textContent = items.length ? `(${w.Store.cartCount()})` : '';
    if (!items.length) {
      body.innerHTML = `<div class="drawer-empty">
        <h4>Your bag is empty</h4>
        <p>Every collection begins with a single piece.</p>
        <a class="btn btn-gold" href="shop.html">Discover timepieces</a>
      </div>`;
      foot.innerHTML = '';
      return;
    }
    body.innerHTML = items.map(drawerItemHTML).join('');
    const sub = w.Store.subtotal();
    const remaining = Math.max(0, 500 - sub);
    const pct = Math.min(100, (sub / 500) * 100);
    foot.innerHTML = `
      <div style="margin-bottom:16px">
        <div style="font-size:9px;letter-spacing:.16em;text-transform:uppercase;color:var(--muted-2);margin-bottom:8px">
          ${remaining > 0 ? `Add ${w.Store.money(remaining)} for complimentary shipping` : '✓ Complimentary shipping unlocked'}
        </div>
        <div style="height:2px;background:rgba(244,240,232,.1)"><div style="height:2px;width:${pct}%;background:var(--gold);transition:width .5s"></div></div>
      </div>
      <div class="df-row"><span>Subtotal</span><b>${w.Store.money(sub)}</b></div>
      <a class="btn btn-gold btn-block" href="checkout.html">Secure checkout</a>
      <a class="btn btn-block" style="margin-top:8px" href="cart.html">View full bag</a>`;
  }

  function openDrawer() {
    renderDrawer();
    doc.querySelector('[data-drawer]').classList.add('open');
    doc.querySelector('[data-overlay]').classList.add('show');
    doc.body.classList.add('no-scroll');
  }
  function closeAll() {
    doc.querySelectorAll('[data-drawer], [data-search-modal], [data-mnav]').forEach(el => el.classList.remove('open'));
    doc.querySelector('[data-overlay]').classList.remove('show');
    doc.body.classList.remove('no-scroll');
    const b = doc.querySelector('.burger'); if (b) b.classList.remove('open');
  }

  /* ---------- search ---------- */
  function renderSearch(q) {
    const box = doc.querySelector('[data-search-results]');
    if (!box) return;
    q = (q || '').trim().toLowerCase();
    if (!q) { box.innerHTML = ''; return; }
    const list = w.METRA.products.filter(p =>
      (p.name + ' ' + p.cat + ' ' + p.metal + ' ' + p.style).toLowerCase().includes(q)
    ).slice(0, 6);
    if (!list.length) {
      box.innerHTML = `<div class="sm-empty">No timepieces match “${q}”. Try “chronograph”, “gold” or “diver”.</div>`;
      return;
    }
    box.innerHTML = list.map(p => `<a class="sm-row" href="product.html?id=${p.id}">
      <span class="sm-img">${w.METRA.watchSVG(p)}</span>
      <span><span class="sm-name">${p.name}</span><span class="sm-cat">${p.cat} · ${p.metal}</span></span>
      <span class="sm-price">${w.Store.money(p.price)}</span>
    </a>`).join('');
  }

  /* ---------- reveals ---------- */
  let observer = null;
  function initReveals() {
    const els = doc.querySelectorAll('.reveal:not(.in)');
    if (!('IntersectionObserver' in w)) {
      els.forEach(el => el.classList.add('in'));
      return;
    }
    if (!observer) {
      observer = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) { e.target.classList.add('in'); observer.unobserve(e.target); }
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    }
    els.forEach(el => observer.observe(el));
  }

  /* ---------- counters ---------- */
  function initCounters() {
    doc.querySelectorAll('[data-count]').forEach(el => {
      if (el.dataset.done) return;
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const io = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (!e.isIntersecting) return;
          io.disconnect();
          el.dataset.done = '1';
          const dur = 1500, t0 = performance.now();
          function tick(t) {
            const p = Math.min(1, (t - t0) / dur);
            const eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(target * eased).toLocaleString('en-US') + suffix;
            if (p < 1) requestAnimationFrame(tick);
          }
          requestAnimationFrame(tick);
        });
      }, { threshold: 0.4 });
      io.observe(el);
    });
  }

  /* ---------- badges ---------- */
  function updateBadges() {
    const c = w.Store.cartCount();
    doc.querySelectorAll('[data-cart-count]').forEach(el => {
      el.textContent = c; el.classList.toggle('show', c > 0);
    });
    const wi = w.Store.wishCount();
    doc.querySelectorAll('[data-wish-count]').forEach(el => {
      el.textContent = wi; el.classList.toggle('show', wi > 0);
    });
  }

  /* ---------- init ---------- */
  function init() {
    const page = doc.body.dataset.page || '';

    const top = doc.getElementById('site-top');
    if (top) top.innerHTML = topbarHTML();
    const head = doc.getElementById('site-header');
    if (head) head.innerHTML = headerHTML(page);
    const foot = doc.getElementById('site-footer');
    if (foot) foot.innerHTML = footerHTML();

    doc.body.insertAdjacentHTML('beforeend', chromeHTML());

    updateBadges();
    renderDrawer();

    /* scroll state */
    const header = doc.getElementById('site-header');
    const onScroll = () => { if (header) header.classList.toggle('scrolled', w.scrollY > 12); };
    onScroll();
    w.addEventListener('scroll', onScroll, { passive: true });

    /* delegated clicks */
    doc.addEventListener('click', e => {
      const add = e.target.closest('[data-add]');
      if (add) {
        const id = add.getAttribute('data-add');
        w.Store.add(id, 1);
        const p = w.METRA.byId(id);
        toast(`${p ? p.name : 'Timepiece'} added to your bag`);
        openDrawer();
        return;
      }
      const wish = e.target.closest('[data-wish]');
      if (wish) {
        const id = wish.getAttribute('data-wish');
        const on = w.Store.toggleWish(id);
        doc.querySelectorAll(`[data-wish="${id}"]`).forEach(b => b.classList.toggle('on', on));
        toast(on ? 'Saved to your wishlist' : 'Removed from your wishlist');
        updateBadges();
        doc.dispatchEvent(new CustomEvent('metra:wish'));
        return;
      }
      const dq = e.target.closest('[data-dq]');
      if (dq) {
        const id = dq.getAttribute('data-id');
        const item = w.Store.cart().find(i => i.id === id);
        if (item) w.Store.setQty(id, item.qty + parseInt(dq.getAttribute('data-dq'), 10));
        return;
      }
      const rm = e.target.closest('[data-remove]');
      if (rm) {
        w.Store.remove(rm.getAttribute('data-remove'));
        toast('Item removed from your bag');
        return;
      }
      if (e.target.closest('[data-open-cart]')) { openDrawer(); return; }
      if (e.target.closest('[data-close-cart]') || e.target.closest('[data-overlay]')) { closeAll(); return; }
      if (e.target.closest('[data-open-search]')) {
        closeAll();
        doc.querySelector('[data-search-modal]').classList.add('open');
        doc.body.classList.add('no-scroll');
        setTimeout(() => { const i = doc.querySelector('[data-search-input]'); if (i) i.focus(); }, 250);
        return;
      }
      if (e.target.closest('[data-close-search]')) { closeAll(); return; }
      if (e.target.closest('[data-open-menu]')) {
        const m = doc.querySelector('[data-mnav]');
        const b = doc.querySelector('.burger');
        const isOpen = m.classList.toggle('open');
        b.classList.toggle('open', isOpen);
        doc.body.classList.toggle('no-scroll', isOpen);
        return;
      }
      const mlink = e.target.closest('[data-mnav] a');
      if (mlink) closeAll();
    });

    doc.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeAll();
    });

    const si = doc.querySelector('[data-search-input]');
    if (si) {
      si.addEventListener('input', () => renderSearch(si.value));
      si.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
          const first = doc.querySelector('[data-search-results] .sm-row');
          if (first) w.location.href = first.getAttribute('href');
        }
      });
    }

    w.addEventListener('metra:store', () => {
      updateBadges();
      renderDrawer();
    });

    initReveals();
    initCounters();

    /* re-observe when dynamic content is injected */
    w.METRA.refresh = () => { initReveals(); initCounters(); updateBadges(); };

    doc.dispatchEvent(new CustomEvent('metra:ready'));
  }

  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', init);
  else init();

  w.METRA_UI = { toast, openDrawer, closeAll, initReveals, updateBadges };
  w.toast = toast;
})(window);
