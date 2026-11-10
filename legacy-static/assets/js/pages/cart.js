/* ============================================================
   METRA — cart page
   ============================================================ */
(function () {
  const { watchSVG, products, cardHTML, money, metals } = window.METRA;
  const $ = s => document.querySelector(s);
  const listEl = $('#cart-list');
  const sumEl = $('[data-summary-body]');
  let promo = '';
  try { promo = sessionStorage.getItem('metra:promo') || ''; } catch (e) {}

  const TRUST = `
    <div class="trust">
      <div><svg viewBox="0 0 24 24"><path d="M12 3l8 3v6c0 5-3.4 8.2-8 9-4.6-.8-8-4-8-9V6l8-3z"/><path d="M9 12l2 2 4-4"/></svg>Secure payment</div>
      <div><svg viewBox="0 0 24 24"><path d="M2 7h11v10H2zM13 10h5l4 3v4h-9z"/><circle cx="6" cy="19" r="2"/><circle cx="18" cy="19" r="2"/></svg>Insured delivery</div>
      <div><svg viewBox="0 0 24 24"><path d="M3 12a9 9 0 0 1 15-6.7L21 8M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16M3 21v-5h5"/></svg>30-day returns</div>
    </div>`;

  function rowHTML(item) {
    const p = item.product;
    const ml = (metals.find(m => m.key === p.metal) || {}).label || p.metal;
    return `<div class="cart-row">
      <a class="cart-thumb" href="product.html?id=${p.id}">${watchSVG(p)}</a>
      <div>
        <div class="ci-cat">${p.cat}</div>
        <a class="ci-name" href="product.html?id=${p.id}">${p.name}</a>
        <div class="ci-meta">${ml} · ${p.strap.type === 'bracelet' ? 'Steel bracelet' : p.strap.type === 'rubber' ? 'Rubber strap' : 'Leather strap'}</div>
        <div class="ci-actions">
          <div class="qty">
            <button data-dq="-1" data-id="${p.id}" aria-label="Decrease">−</button>
            <span>${item.qty}</span>
            <button data-dq="1" data-id="${p.id}" aria-label="Increase">+</button>
          </div>
          <button class="ci-remove" data-remove="${p.id}">Remove</button>
        </div>
      </div>
      <div class="ci-right">
        <div class="ci-price">${money(item.line)}</div>
        <div class="small muted">${item.qty > 1 ? money(p.price) + ' each' : 'In stock'}</div>
      </div>
    </div>`;
  }

  function summaryHTML(items) {
    const t = window.Store.totals(promo);
    const count = items.reduce((s, i) => s + i.qty, 0);
    return `
      <div class="s-row"><span>Subtotal · ${count} item${count === 1 ? '' : 's'}</span><b>${money(t.sub)}</b></div>
      <div class="s-row"><span>Shipping</span><b>${t.shipping === 0 ? 'Complimentary' : money(t.shipping)}</b></div>
      ${t.off ? `<div class="s-row discount"><span>Discount · ${promo.toUpperCase()}</span><b>− ${money(t.off)}</b></div>` : ''}
      <div class="s-total"><span>Total</span><b>${money(t.total)}</b></div>
      <div class="promo">
        <input type="text" placeholder="Promo code" value="${promo}" data-promo-input aria-label="Promo code">
        <button data-apply-promo>Apply</button>
      </div>
      <div class="small" style="margin-top:9px;color:${promo ? 'var(--green)' : 'var(--muted-2)'};letter-spacing:.08em">
        ${promo ? '✓ Code applied — ' + Math.round(t.rate * 100) + '% off' : 'Try METRA10 for 10% off your first order'}
      </div>
      <a class="btn btn-gold btn-block" href="checkout.html">Proceed to checkout</a>
      <p class="s-note">Taxes and duties included.<br>Secure 256-bit SSL encrypted payment.</p>
      ${TRUST}`;
  }

  function render() {
    const items = window.Store.cartDetailed();

    if (!items.length) {
      listEl.innerHTML = `<div class="empty-state" style="border:0;border-bottom:1px solid var(--line-soft);padding:70px 20px">
        <h3>Your bag is empty</h3>
        <p style="margin-bottom:24px">The finest things begin with a single choice.</p>
        <a class="btn btn-gold" href="shop.html">Discover the collection</a>
      </div>`;
      sumEl.innerHTML = `
        <div class="s-row"><span>Subtotal</span><b>${money(0)}</b></div>
        <div class="s-total"><span>Total</span><b>${money(0)}</b></div>
        <p class="s-note" style="margin-top:20px">Add a timepiece to continue to checkout.</p>
        ${TRUST}`;
    } else {
      listEl.innerHTML = items.map(rowHTML).join('');
      sumEl.innerHTML = summaryHTML(items);
    }

    /* recommendations */
    const recs = products.filter(p => !items.some(i => i.id === p.id)).slice(0, 4);
    const rg = $('#cart-recs');
    if (rg) rg.innerHTML = recs.map((p, i) => cardHTML(p, i)).join('');
    if (window.METRA.refresh) requestAnimationFrame(window.METRA.refresh);
  }

  document.addEventListener('click', e => {
    if (e.target.closest('[data-apply-promo]')) {
      const input = document.querySelector('[data-promo-input]');
      const code = input ? input.value.trim().toUpperCase() : '';
      const res = window.Store.discount(code);
      if (res.valid) {
        promo = code;
        try { sessionStorage.setItem('metra:promo', code); } catch (err) {}
        window.toast(`${Math.round(res.rate * 100)}% discount applied`);
      } else {
        promo = '';
        try { sessionStorage.removeItem('metra:promo'); } catch (err) {}
        window.toast('That code is not valid', 'error');
      }
      render();
    }
  });

  document.addEventListener('metra:store', render);
  render();
})();
