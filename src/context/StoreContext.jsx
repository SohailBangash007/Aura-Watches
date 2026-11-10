import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useCatalog } from './CatalogContext';
import { api } from '../api/client';
import { computeTotals, discountFor, FREE_SHIPPING_FROM } from '../lib/pricing';

const CART_KEY = 'metra:cart:v1';
const WISH_KEY = 'metra:wish:v1';
const PROMO_KEY = 'metra:promo';

const StoreContext = createContext(null);

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const value = JSON.parse(raw);
    return value == null ? fallback : value;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable — keep the in-memory state */
  }
}

export function StoreProvider({ children }) {
  const { byId } = useCatalog();
  const [cart, setCart] = useState(() => read(CART_KEY, []));
  const [wish, setWish] = useState(() => read(WISH_KEY, []));
  const [promo, setPromo] = useState(() => {
    try {
      return sessionStorage.getItem(PROMO_KEY) || '';
    } catch {
      return '';
    }
  });

  useEffect(() => write(CART_KEY, cart), [cart]);
  useEffect(() => write(WISH_KEY, wish), [wish]);
  useEffect(() => {
    try {
      if (promo) sessionStorage.setItem(PROMO_KEY, promo);
      else sessionStorage.removeItem(PROMO_KEY);
    } catch {
      /* ignore */
    }
  }, [promo]);

  /* ---------- cart ---------- */
  const add = useCallback((id, qty = 1) => {
    const amount = Math.max(1, Math.min(9, Number(qty) || 1));
    setCart((prev) => {
      const found = prev.find((i) => i.id === id);
      if (found) {
        return prev.map((i) =>
          i.id === id ? { ...i, qty: Math.min(9, i.qty + amount) } : i
        );
      }
      return [...prev, { id, qty: amount }];
    });
    return true;
  }, []);

  const setQty = useCallback((id, qty) => {
    const next = Math.max(0, Math.min(9, Number(qty) || 0));
    setCart((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, qty: next } : i))
        .filter((i) => i.qty > 0)
    );
  }, []);

  const remove = useCallback((id) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const clear = useCallback(() => setCart([]), []);

  /* ---------- wishlist ---------- */
  const toggleWish = useCallback(
    (id) => {
      const on = !wish.includes(id);
      setWish((prev) => (on ? [...prev, id] : prev.filter((x) => x !== id)));
      return on;
    },
    [wish]
  );

  const isWished = useCallback((id) => wish.includes(id), [wish]);

  /* ---------- promo ---------- */
  const applyPromo = useCallback(async (code) => {
    const key = String(code || '').trim().toUpperCase();
    if (!key) {
      setPromo('');
      return { valid: false, message: 'Enter a promo code' };
    }
    try {
      const res = await api.promo(key);
      setPromo(res.code);
      return res;
    } catch (err) {
      // The API is the source of truth; fall back locally only if it is offline.
      if (err.status) {
        setPromo('');
        return { valid: false, message: err.message || 'That code is not valid' };
      }
      const local = discountFor(key);
      if (local.valid) {
        setPromo(local.code);
        return { valid: true, code: local.code, rate: local.rate };
      }
      setPromo('');
      return { valid: false, message: 'That code is not valid' };
    }
  }, []);

  const clearPromo = useCallback(() => setPromo(''), []);

  const value = useMemo(() => {
    const detailed = cart
      .map((item) => {
        const product = byId(item.id);
        return product ? { ...item, product, line: product.price * item.qty } : null;
      })
      .filter(Boolean);

    const subtotal = detailed.reduce((sum, item) => sum + item.line, 0);
    const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
    const totals = computeTotals(subtotal, promo);
    const shippingRemaining = Math.max(0, FREE_SHIPPING_FROM - subtotal);

    return {
      cart,
      cartDetailed: detailed,
      cartCount,
      subtotal,
      totals,
      promo,
      shippingRemaining,
      shippingProgress: Math.min(100, (subtotal / FREE_SHIPPING_FROM) * 100),
      add,
      setQty,
      remove,
      clear,
      applyPromo,
      clearPromo,
      wish,
      wishCount: wish.length,
      isWished,
      toggleWish
    };
  }, [
    cart,
    wish,
    promo,
    byId,
    add,
    setQty,
    remove,
    clear,
    applyPromo,
    clearPromo,
    isWished,
    toggleWish
  ]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside <StoreProvider>');
  return ctx;
}
