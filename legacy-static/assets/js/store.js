/* ============================================================
   METRA — store.js
   Cart + wishlist persistence, formatting helpers
   ============================================================ */
(function (w) {
  const CART = 'metra:cart:v1';
  const WISH = 'metra:wish:v1';
  const PROMO = { METRA10: 0.10, SOHAIL15: 0.15, WELCOME5: 0.05 };

  function read(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return fallback;
      const val = JSON.parse(raw);
      return val == null ? fallback : val;
    } catch (e) { return fallback; }
  }
  function write(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {}
    w.dispatchEvent(new CustomEvent('metra:store'));
  }
  function money(n) {
    return '$' + Number(n || 0).toLocaleString('en-US', { maximumFractionDigits: 0 });
  }

  const Store = {
    money,
    promo: PROMO,

    cart() { return read(CART, []); },
    cartCount() { return this.cart().reduce((s, i) => s + i.qty, 0); },
    cartDetailed() {
      const products = (w.METRA && w.METRA.products) || [];
      return this.cart().map(it => {
        const p = products.find(x => x.id === it.id);
        return p ? { ...it, product: p, line: p.price * it.qty } : null;
      }).filter(Boolean);
    },
    subtotal() { return this.cartDetailed().reduce((s, i) => s + i.line, 0); },
    add(id, qty) {
      qty = Math.max(1, qty || 1);
      const cart = this.cart();
      const found = cart.find(i => i.id === id);
      if (found) found.qty = Math.min(9, found.qty + qty);
      else cart.push({ id, qty: Math.min(9, qty) });
      write(CART, cart);
      return true;
    },
    setQty(id, qty) {
      const cart = this.cart();
      const item = cart.find(i => i.id === id);
      if (!item) return;
      item.qty = Math.max(0, Math.min(9, qty));
      const next = cart.filter(i => i.qty > 0);
      write(CART, next);
    },
    remove(id) { write(CART, this.cart().filter(i => i.id !== id)); },
    clear() { write(CART, []); },

    discount(code) {
      const key = String(code || '').trim().toUpperCase();
      const rate = PROMO[key] || 0;
      return { valid: !!rate, rate, code: key };
    },
    totals(code) {
      const sub = this.subtotal();
      const d = this.discount(code);
      const off = Math.round(sub * d.rate);
      const shipping = sub === 0 || sub >= 500 ? 0 : 25;
      return { sub, off, shipping, total: Math.max(0, sub - off + shipping), rate: d.rate };
    },

    wish() { return read(WISH, []); },
    isWished(id) { return this.wish().indexOf(id) > -1; },
    toggleWish(id) {
      const list = this.wish();
      const i = list.indexOf(id);
      if (i > -1) list.splice(i, 1); else list.push(id);
      write(WISH, list);
      return i === -1;
    },
    wishCount() { return this.wish().length; }
  };

  w.Store = Store;
})(window);
