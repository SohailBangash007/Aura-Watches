/* ---------- shared formatting helpers ---------- */

export const money = (n) =>
  '$' + Number(n || 0).toLocaleString('en-US', { maximumFractionDigits: 0 });

/** Join truthy class names. */
export const cn = (...parts) => parts.filter(Boolean).join(' ');

/** e.g. 2450 -> "2,450" */
export const num = (n) => Number(n || 0).toLocaleString('en-US');

/** Email used across the storefront forms. */
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Build a readable "Muhammad Sohail" label from an email. */
export const nameFromEmail = (email = '') =>
  email
    .split('@')[0]
    .replace(/[._-]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

export const slugify = (value = '') =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
