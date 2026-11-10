/* ============================================================
   METRA — checkout page
   ============================================================ */
(function () {
  const { money, watchSVG } = window.METRA;
  const $ = s => document.querySelector(s);
  const form = $('#checkout-form');
  const root = $('#checkout-root');
  let promo = '';
  try { promo = sessionStorage.getItem('metra:promo') || ''; } catch (e) {}
  let payMethod = 'card';

  /* ---------- summary ---------- */
  function renderSummary() {
    const items = window.Store.cartDetailed();
    const box = $('[data-co-items]');
    const tot = $('[data-co-totals]');
    if (!box || !tot) return;

    if (!items.length) {
      box.innerHTML = `<p class="small muted">Your bag is empty. <a href="shop.html" style="color:var(--gold-bright)">Find a timepiece →</a></p>`;
      tot.innerHTML = '';
      return;
    }

    box.innerHTML = items.map(i => `<div class="order-mini">
      <span class="om-img">${watchSVG(i.product)}</span>
      <span><span class="om-name">${i.product.name}</span><span class="om-meta">${i.product.cat} · Qty ${i.qty}</span></span>
      <span class="om-price">${money(i.line)}</span>
    </div>`).join('');

    const t = window.Store.totals(promo);
    tot.innerHTML = `
      <div class="s-row"><span>Subtotal</span><b>${money(t.sub)}</b></div>
      <div class="s-row"><span>Shipping</span><b>${t.shipping === 0 ? 'Complimentary' : money(t.shipping)}</b></div>
      ${t.off ? `<div class="s-row discount"><span>Discount</span><b>− ${money(t.off)}</b></div>` : ''}
      <div class="s-total"><span>Total</span><b>${money(t.total)}</b></div>
      <p class="s-note" style="text-align:left">Includes all duties and taxes.<br>Delivered by insured courier.</p>`;
  }

  /* ---------- payment method ---------- */
  document.querySelectorAll('[data-pay]').forEach(opt => {
    opt.addEventListener('click', () => {
      document.querySelectorAll('[data-pay]').forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
      payMethod = opt.dataset.pay;
      const cardFields = $('[data-card-fields]');
      const alt = $('[data-alt-pay]');
      if (payMethod === 'card') {
        cardFields.style.display = '';
        alt.style.display = 'none';
      } else {
        cardFields.style.display = 'none';
        alt.style.display = '';
        alt.innerHTML = payMethod === 'paypal'
          ? 'You will be redirected to PayPal to complete payment securely after placing your order. No card details are required.'
          : 'Our client care team will email bank transfer instructions within one business hour. Your piece is reserved for 48 hours.';
      }
    });
  });

  /* ---------- card formatting ---------- */
  const cardInput = $('[data-card]');
  const cardNum = $('[data-card-num]');
  if (cardInput) {
    cardInput.addEventListener('input', () => {
      let v = cardInput.value.replace(/\D/g, '').slice(0, 16);
      cardInput.value = v.replace(/(.{4})/g, '$1 ').trim();
      if (cardNum) cardNum.textContent = cardInput.value || '•••• •••• •••• ••••';
    });
  }
  const expInput = $('[data-exp]');
  if (expInput) {
    expInput.addEventListener('input', () => {
      let v = expInput.value.replace(/\D/g, '').slice(0, 4);
      expInput.value = v.length > 2 ? v.slice(0, 2) + ' / ' + v.slice(2) : v;
      const el = $('[data-card-exp]');
      if (el) el.textContent = expInput.value || 'MM / YY';
    });
  }
  const nameInput = $('[data-cardname]');
  if (nameInput) {
    nameInput.addEventListener('input', () => {
      const el = $('[data-card-name]');
      if (el) el.textContent = (nameInput.value || 'Cardholder name').toUpperCase();
    });
  }

  /* ---------- validation ---------- */
  function setInvalid(el, bad) {
    const field = el.closest('.field');
    if (field) field.classList.toggle('invalid', bad);
  }

  function validate() {
    let ok = true;
    document.querySelectorAll('.field.invalid').forEach(f => f.classList.remove('invalid'));

    document.querySelectorAll('[data-required]').forEach(el => {
      const val = (el.value || '').trim();
      let bad = !val;
      if (!bad && el.type === 'email') bad = !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val);
      if (!bad && el.name === 'phone') bad = val.replace(/\D/g, '').length < 7;
      setInvalid(el, bad);
      if (bad) ok = false;
    });

    if (payMethod === 'card') {
      const digits = (cardInput.value || '').replace(/\D/g, '');
      if (digits.length < 15) { setInvalid(cardInput, true); ok = false; }
      const exp = (expInput.value || '').trim();
      const m = exp.match(/^(\d{2})\s*\/\s*(\d{2})$/);
      const validExp = m && +m[1] >= 1 && +m[1] <= 12;
      if (!validExp) { setInvalid(expInput, true); ok = false; }
      const cvc = $('[data-cvc]');
      if (!/^\d{3,4}$/.test((cvc.value || '').trim())) { setInvalid(cvc, true); ok = false; }
    }

    const terms = $('[data-terms]');
    const termsErr = $('[data-terms-err]');
    if (!terms.checked) {
      termsErr.style.display = 'block';
      ok = false;
    } else {
      termsErr.style.display = 'none';
    }

    if (!ok) {
      const firstBad = document.querySelector('.field.invalid');
      if (firstBad) firstBad.scrollIntoView({ behavior: 'smooth', block: 'center' });
      window.toast('Please check the highlighted fields', 'error');
    }
    return ok;
  }

  /* ---------- submit ---------- */
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const items = window.Store.cartDetailed();
      if (!items.length) {
        window.toast('Your bag is empty', 'error');
        return;
      }
      if (!validate()) return;

      const email = form.querySelector('[name="email"]').value.trim();
      const first = form.querySelector('[name="first"]').value.trim();
      const t = window.Store.totals(promo);
      const num = 'MSM-' + new Date().getFullYear() + '-' + Math.floor(100000 + Math.random() * 899999);

      const btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      btn.textContent = 'Processing…';

      setTimeout(() => {
        window.Store.clear();
        try { sessionStorage.removeItem('metra:promo'); } catch (err) {}
        root.innerHTML = `
          <div class="order-success reveal in" style="max-width:820px;margin-inline:auto">
            <div class="os-ico"><svg viewBox="0 0 24 24"><path d="M4 12.5 9 17.5 20 6.5"/></svg></div>
            <span class="eyebrow center">Order confirmed</span>
            <h2 style="margin-top:14px">Thank you, ${first}.</h2>
            <p>Your timepiece is reserved and our atelier has begun preparing it. A confirmation has been sent to <strong style="color:var(--cream);font-weight:400">${email}</strong>.</p>
            <div class="os-num">ORDER ${num}</div>
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:34px;text-align:left">
              <div class="cc-card"><h4>01 · Prepared</h4><p>Inspected and wrapped in the atelier within 24 hours.</p></div>
              <div class="cc-card"><h4>02 · Shipped</h4><p>Insured courier with live tracking, signature required.</p></div>
              <div class="cc-card"><h4>03 · Delivered</h4><p>3–6 business days, duties and taxes included.</p></div>
            </div>
            <p style="margin-top:26px;font-size:12px;color:var(--muted-2)">Order total · ${money(t.total)}</p>
            <div style="display:flex;gap:12px;justify-content:center;margin-top:28px;flex-wrap:wrap">
              <a class="btn btn-gold" href="shop.html">Continue exploring</a>
              <a class="btn" href="contact.html">Contact client care</a>
            </div>
          </div>`;
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (window.METRA_UI) window.METRA_UI.updateBadges();
        window.toast('Order placed — welcome to METRA');
      }, 1100);
    });
  }

  /* live clear of invalid state */
  document.addEventListener('input', e => {
    if (e.target.closest('.field')) {
      const f = e.target.closest('.field');
      if (f.classList.contains('invalid')) f.classList.remove('invalid');
    }
  });

  renderSummary();
})();
