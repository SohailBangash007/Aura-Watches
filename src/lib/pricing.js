/* ---------- pricing rules shared by the client and the API ---------- */

export const PROMOS = {
  AURA10: 0.1,
  // Keep the previous code active for existing customers.
  METRA10: 0.1,
  SOHAIL15: 0.15,
  WELCOME5: 0.05
};

export const FREE_SHIPPING_FROM = 500;
export const SHIPPING_FEE = 25;

export function discountFor(code) {
  const key = String(code || '').trim().toUpperCase();
  const rate = PROMOS[key] || 0;
  return { valid: rate > 0, rate, code: key };
}

export function computeTotals(subtotal, code) {
  const sub = Number(subtotal) || 0;
  const d = discountFor(code);
  const off = Math.round(sub * d.rate);
  const shipping = sub === 0 || sub >= FREE_SHIPPING_FROM ? 0 : SHIPPING_FEE;
  return {
    sub,
    off,
    shipping,
    rate: d.rate,
    code: d.code,
    total: Math.max(0, sub - off + shipping)
  };
}
