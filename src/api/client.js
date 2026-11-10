/* ============================================================
   AURA Watches — API client
   Thin fetch wrapper around the Express product API.
   ============================================================ */

const BASE = import.meta.env.VITE_API_BASE || '/api';

function qs(params = {}) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '' || value === false) return;
    search.set(key, String(value));
  });
  const s = search.toString();
  return s ? `?${s}` : '';
}

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    const error = new Error(data?.message || `Request failed (${res.status})`);
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  health: () => request('/health'),
  products: (params) => request(`/products${qs(params)}`),
  product: (id) => request(`/products/${encodeURIComponent(id)}`),
  collections: () => request('/collections'),
  promo: (code) =>
    request('/promo', {
      method: 'POST',
      body: JSON.stringify({ code })
    }),
  createOrder: (payload) =>
    request('/orders', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
  adminSession: () => request('/admin/session'),
  adminLogin: (payload) =>
    request('/admin/login', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
  adminLogout: () => request('/admin/logout', { method: 'POST' }),
  adminOverview: () => request('/admin/overview'),
  adminUsers: () => request('/admin/users'),
  createAdminUser: (payload) =>
    request('/admin/users', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
  removeAdminUser: (id) =>
    request(`/admin/users/${encodeURIComponent(id)}`, { method: 'DELETE' })
};
