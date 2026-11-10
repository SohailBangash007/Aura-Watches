/* ============================================================
   METRA — shop page
   ============================================================ */
(function () {
  const { products, categories, metals, cardHTML, money } = window.METRA;
  const $ = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));

  const params = new URLSearchParams(location.search);
  const state = {
    cats: new Set(params.get('cat') ? [params.get('cat')] : []),
    metals: new Set(),
    max: 3500,
    q: params.get('q') || '',
    sort: 'featured',
    limited: false,
    visible: 8
  };

  /* ---- filter UI ---- */
  const catList = $('[data-cat-list]');
  if (catList) {
    catList.innerHTML = categories.map(c => {
      const n = products.filter(p => p.cat === c).length;
      return `<li><label><span class="fl-name"><input type="checkbox" value="${c}" data-cat ${state.cats.has(c) ? 'checked' : ''}>${c}</span><span class="cnt">${n}</span></label></li>`;
    }).join('');
  }
  const metalList = $('[data-metal-list]');
  if (metalList) {
    metalList.innerHTML = metals.map(m =>
      `<button class="sw" data-metal="${m.key}" title="${m.label}" aria-label="${m.label}" style="background:${m.color}"></button>`
    ).join('');
  }

  const search = $('[data-search]');
  if (search) search.value = state.q;
  const price = $('[data-price]');
  const priceOut = $('[data-price-out]');

  /* ---- render ---- */
  function filtered() {
    let list = products.filter(p => {
      if (state.cats.size && !state.cats.has(p.cat)) return false;
      if (state.metals.size && !state.metals.has(p.metal)) return false;
      if (p.price > state.max) return false;
      if (state.limited && p.badge !== 'Limited') return false;
      if (state.q) {
        const hay = (p.name + ' ' + p.cat + ' ' + p.metal + ' ' + p.style).toLowerCase();
        if (!hay.includes(state.q.toLowerCase())) return false;
      }
      return true;
    });
    switch (state.sort) {
      case 'price-asc': list.sort((a, b) => a.price - b.price); break;
      case 'price-desc': list.sort((a, b) => b.price - a.price); break;
      case 'rating': list.sort((a, b) => b.rating - a.rating); break;
      case 'name': list.sort((a, b) => a.name.localeCompare(b.name)); break;
      default: break;
    }
    return list;
  }

  function chipsHTML() {
    const chips = [];
    state.cats.forEach(c => chips.push(`<span class="chip">${c}<button data-chip-cat="${c}" aria-label="Remove">×</button></span>`));
    state.metals.forEach(m => {
      const label = (metals.find(x => x.key === m) || {}).label || m;
      chips.push(`<span class="chip">${label}<button data-chip-metal="${m}" aria-label="Remove">×</button></span>`);
    });
    if (state.max < 3500) chips.push(`<span class="chip">Under ${money(state.max)}<button data-chip-price aria-label="Remove">×</button></span>`);
    if (state.limited) chips.push(`<span class="chip">Limited<button data-chip-limited aria-label="Remove">×</button></span>`);
    if (state.q) chips.push(`<span class="chip">“${state.q}”<button data-chip-q aria-label="Remove">×</button></span>`);
    return chips.join('');
  }

  function render() {
    const list = filtered();
    const grid = $('#shop-grid');
    const countEl = $('[data-count]');
    if (countEl) countEl.textContent = list.length;

    const shown = list.slice(0, state.visible);
    grid.innerHTML = shown.length
      ? shown.map((p, i) => cardHTML(p, i)).join('')
      : `<div class="empty-state"><h3>No timepieces found</h3><p>Try widening your filters, or <a href="shop.html" style="color:var(--gold-bright)">browse the full collection</a>.</p></div>`;

    const chips = $('[data-chips]');
    if (chips) chips.innerHTML = chipsHTML();

    const more = $('[data-loadmore]');
    if (more) more.style.display = list.length > state.visible ? '' : 'none';

    /* sync URL */
    try {
      const u = new URL(location.href);
      u.search = '';
      if (state.cats.size === 1) u.searchParams.set('cat', [...state.cats][0]);
      if (state.q) u.searchParams.set('q', state.q);
      history.replaceState(null, '', u.toString());
    } catch (e) {}

    if (window.METRA.refresh) requestAnimationFrame(window.METRA.refresh);
  }

  /* ---- events ---- */
  document.addEventListener('change', e => {
    if (e.target.matches('[data-cat]')) {
      const v = e.target.value;
      if (e.target.checked) state.cats.add(v); else state.cats.delete(v);
      state.visible = 8;
      render();
    }
    if (e.target.matches('[data-limited]')) {
      state.limited = e.target.checked;
      state.visible = 8;
      render();
    }
    if (e.target.matches('[data-sort]')) {
      state.sort = e.target.value;
      render();
    }
  });

  document.addEventListener('input', e => {
    if (e.target.matches('[data-price]')) {
      state.max = parseInt(e.target.value, 10);
      if (priceOut) priceOut.textContent = money(state.max);
      state.visible = 8;
      render();
    }
    if (e.target.matches('[data-search]')) {
      state.q = e.target.value.trim();
      state.visible = 8;
      render();
    }
  });

  document.addEventListener('click', e => {
    const metal = e.target.closest('[data-metal]');
    if (metal) {
      const key = metal.getAttribute('data-metal');
      if (state.metals.has(key)) { state.metals.delete(key); metal.classList.remove('active'); }
      else { state.metals.add(key); metal.classList.add('active'); }
      state.visible = 8;
      render();
      return;
    }
    const cc = e.target.closest('[data-chip-cat]');
    if (cc) {
      const v = cc.getAttribute('data-chip-cat');
      state.cats.delete(v);
      const box = document.querySelector(`[data-cat][value="${v}"]`);
      if (box) box.checked = false;
      render(); return;
    }
    const cm = e.target.closest('[data-chip-metal]');
    if (cm) {
      const v = cm.getAttribute('data-chip-metal');
      state.metals.delete(v);
      const sw = document.querySelector(`[data-metal="${v}"]`);
      if (sw) sw.classList.remove('active');
      render(); return;
    }
    if (e.target.closest('[data-chip-price]')) {
      state.max = 3500;
      if (price) price.value = 3500;
      if (priceOut) priceOut.textContent = money(3500);
      render(); return;
    }
    if (e.target.closest('[data-chip-limited]')) {
      state.limited = false;
      const box = document.querySelector('[data-limited]');
      if (box) box.checked = false;
      render(); return;
    }
    if (e.target.closest('[data-chip-q]')) {
      state.q = '';
      if (search) search.value = '';
      render(); return;
    }
    if (e.target.closest('[data-clear]')) {
      state.cats.clear(); state.metals.clear(); state.max = 3500;
      state.q = ''; state.limited = false; state.sort = 'featured'; state.visible = 8;
      $$('[data-cat]').forEach(b => b.checked = false);
      $$('[data-metal]').forEach(b => b.classList.remove('active'));
      $$('[data-limited]').forEach(b => b.checked = false);
      if (price) price.value = 3500;
      if (priceOut) priceOut.textContent = money(3500);
      if (search) search.value = '';
      const sortEl = $('[data-sort]'); if (sortEl) sortEl.value = 'featured';
      render(); return;
    }
    if (e.target.closest('[data-loadmore]')) {
      state.visible += 4;
      render();
      return;
    }
    if (e.target.closest('[data-toggle-filters]')) {
      $('[data-filters]').classList.toggle('open');
      return;
    }
  });

  render();
})();
