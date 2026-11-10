/* ============================================================
   AURA Watches — Product & Order API
   Express REST service backing the React storefront.

   GET  /api/health
   GET  /api/products?cat=&metal=&maxPrice=&q=&sort=&limited=&limit=&offset=
   GET  /api/products/:id
   GET  /api/collections
   POST /api/promo        { code }
   POST /api/orders       { items:[{id,qty}], promo, customer }
   POST /api/admin/login { email, password }
   GET  /api/admin/session | /api/admin/overview | /api/admin/users
   POST /api/admin/users { name, email, password } (owner only)
   DELETE /api/admin/users/:id (owner only)
   ============================================================ */

import express from 'express';
import path from 'node:path';
import fs from 'node:fs';
import { promises as fsPromises } from 'node:fs';
import { createHash, randomBytes, randomUUID, scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { getStore } from '@netlify/blobs';

import { products, categories, metals } from '../src/data/products.js';
import { computeTotals, discountFor } from '../src/lib/pricing.js';

const rootDir = process.cwd();
const distDir = path.join(rootDir, 'dist');
const PORT = Number(process.env.PORT) || 8787;
const ADMIN_SESSION_TTL = 8 * 60 * 60 * 1000;
const ADMIN_PASSWORD_MIN_LENGTH = 12;
const adminStorePath = process.env.METRA_ADMIN_STORE
  ? path.resolve(process.env.METRA_ADMIN_STORE)
  : path.join(rootDir, 'data', 'admin-users.json');
const netlifyRuntime = process.env.NETLIFY === 'true';
const adminBlobStore = netlifyRuntime ? getStore('aura-watches-admin') : null;
const sessionBlobStore = netlifyRuntime ? getStore('aura-watches-sessions') : null;
const orderBlobStore = netlifyRuntime ? getStore('aura-watches-orders') : null;

const app = express();
app.disable('x-powered-by');
app.use(express.json({ limit: '200kb' }));

/* ---------- permissive CORS (dev + direct API calls) ---------- */
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

/* ---------- helpers ---------- */
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const publicProduct = (p) => ({
  id: p.id,
  image: p.image,
  name: p.name,
  cat: p.cat,
  style: p.style,
  metal: p.metal,
  strap: p.strap,
  dial: p.dial,
  dial2: p.dial2,
  accent: p.accent,
  price: p.price,
  old: p.old || null,
  rating: p.rating,
  reviews: p.reviews,
  badge: p.badge || '',
  desc: p.desc,
  specs: p.specs
});

const categoryCounts = () =>
  categories.map((name) => ({
    name,
    count: products.filter((p) => p.cat === name).length
  }));

const prices = products.map((p) => p.price);

function sortList(list, sort) {
  const out = [...list];
  switch (sort) {
    case 'price-asc':
      return out.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return out.sort((a, b) => b.price - a.price);
    case 'rating':
      return out.sort((a, b) => b.rating - a.rating);
    case 'name':
      return out.sort((a, b) => a.name.localeCompare(b.name));
    default:
      return out;
  }
}

const orders = new Map();
const scryptAsync = promisify(scrypt);
const adminSessions = new Map();
const loginAttempts = new Map();
let adminUsers = [];
let adminMutationQueue = Promise.resolve();

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const publicAdmin = ({ id, name, email, role, createdAt }) => ({ id, name, email, role, createdAt });

async function loadAdminUsers() {
  if (adminBlobStore) return (await adminBlobStore.get('users', { type: 'json' })) || [];
  try {
    return JSON.parse(await fsPromises.readFile(adminStorePath, 'utf8'));
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
}

async function passwordHash(password, salt = randomBytes(16).toString('hex')) {
  const derived = await scryptAsync(password, salt, 64);
  return { salt, hash: Buffer.from(derived).toString('hex') };
}

async function saveAdminUsers(users, options = {}) {
  if (adminBlobStore) {
    await adminBlobStore.setJSON('users', users, options);
    return;
  }
  const directory = path.dirname(adminStorePath);
  const temporaryPath = `${adminStorePath}.tmp`;
  await fsPromises.mkdir(directory, { recursive: true });
  await fsPromises.writeFile(temporaryPath, JSON.stringify(users, null, 2), { mode: 0o600 });
  await fsPromises.rename(temporaryPath, adminStorePath);
}

function updateAdminUsers(update) {
  const operation = adminMutationQueue.then(async () => {
    adminUsers = await loadAdminUsers();
    const nextUsers = update(adminUsers);
    await saveAdminUsers(nextUsers);
    adminUsers = nextUsers;
    return nextUsers;
  });
  adminMutationQueue = operation.catch(() => undefined);
  return operation;
}

async function initializeAdminUsers() {
  const stored = await loadAdminUsers();
  if (!Array.isArray(stored) || stored.length > 25 || stored.some((user) => (
      !user.id ||
      typeof user.name !== 'string' ||
      !emailPattern.test(user.email || '') ||
      !['owner', 'admin'].includes(user.role) ||
      !/^[a-f0-9]{32}$/i.test(user.passwordSalt || '') ||
      !/^[a-f0-9]{128}$/i.test(user.passwordHash || '')
    ))) {
    throw new Error('The admin user store has an invalid format');
  }
  if (stored.length) {
    if (stored.filter((user) => user.role === 'owner').length !== 1 || new Set(stored.map((user) => user.email)).size !== stored.length) {
      throw new Error('The admin user store must contain one owner and unique email addresses');
    }
    adminUsers = stored;
    return;
  }

  const email = process.env.METRA_ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.METRA_ADMIN_PASSWORD;
  if (!email && !password) {
    adminUsers = [];
    console.warn('[metra-api] Admin portal is disabled until METRA_ADMIN_EMAIL and METRA_ADMIN_PASSWORD are configured.');
    return;
  }
  if (!emailPattern.test(email || '') || typeof password !== 'string' || password.length < ADMIN_PASSWORD_MIN_LENGTH) {
    throw new Error(`Set a valid METRA_ADMIN_EMAIL and a METRA_ADMIN_PASSWORD of at least ${ADMIN_PASSWORD_MIN_LENGTH} characters.`);
  }

  const credentials = await passwordHash(password);
  adminUsers = [{
    id: randomUUID(),
    name: 'Store owner',
    email,
    role: 'owner',
    createdAt: new Date().toISOString(),
    passwordSalt: credentials.salt,
    passwordHash: credentials.hash
  }];
  if (adminBlobStore) {
    await saveAdminUsers(adminUsers, { onlyIfNew: true });
    adminUsers = await loadAdminUsers();
  } else {
    await saveAdminUsers(adminUsers);
  }
  console.log(`[metra-api] Initialized the owner admin account for ${email}`);
}

async function saveAdminSession(tokenHash, session) {
  if (sessionBlobStore) {
    await sessionBlobStore.setJSON(tokenHash, session);
    return;
  }
  adminSessions.set(tokenHash, session);
}

async function loadAdminSession(tokenHash) {
  if (sessionBlobStore) return sessionBlobStore.get(tokenHash, { type: 'json' });
  return adminSessions.get(tokenHash) || null;
}

async function deleteAdminSession(tokenHash) {
  if (sessionBlobStore) {
    await sessionBlobStore.delete(tokenHash);
    return;
  }
  adminSessions.delete(tokenHash);
}

async function loadOrders() {
  if (orderBlobStore) return (await orderBlobStore.get('orders', { type: 'json' })) || [];
  return [...orders.values()];
}

async function saveOrder(order) {
  if (orderBlobStore) {
    const storedOrders = await loadOrders();
    await orderBlobStore.setJSON('orders', [...storedOrders, order]);
    return;
  }
  orders.set(order.orderNumber, order);
}

function readCookie(req, name) {
  const prefix = `${name}=`;
  const value = (req.headers.cookie || '')
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(prefix));
  return value ? value.slice(prefix.length) : '';
}

function setAdminCookie(req, res, token, maxAge) {
  const parts = [
    `metra_admin=${encodeURIComponent(token)}`,
    'HttpOnly',
    'SameSite=Strict',
    'Path=/api/admin',
    `Max-Age=${maxAge}`
  ];
  const forwardedProtocol = req.headers['x-forwarded-proto']?.split(',')[0].trim();
  if (process.env.NODE_ENV === 'production' || forwardedProtocol === 'https') parts.push('Secure');
  res.setHeader('Set-Cookie', parts.join('; '));
}

async function requireAdmin(req, res, next) {
  const token = readCookie(req, 'metra_admin');
  const tokenHash = token ? createHash('sha256').update(token).digest('hex') : '';
  try {
    const session = tokenHash ? await loadAdminSession(tokenHash) : null;
    if (!session || session.expiresAt <= Date.now()) {
      if (tokenHash) await deleteAdminSession(tokenHash);
      return res.status(401).json({ error: 'unauthorized', message: 'Please sign in to the admin portal.' });
    }
    const user = adminUsers.find((entry) => entry.id === session.userId);
    if (!user) {
      await deleteAdminSession(tokenHash);
      return res.status(401).json({ error: 'unauthorized', message: 'This admin account is no longer active.' });
    }
    req.adminUser = user;
    req.adminSession = session;
    req.adminTokenHash = tokenHash;
    next();
  } catch (error) {
    next(error);
  }
}

function requireOwner(req, res, next) {
  if (req.adminUser.role !== 'owner') {
    return res.status(403).json({ error: 'forbidden', message: 'Only the store owner can manage admin accounts.' });
  }
  next();
}

function clearExpiredSessions() {
  const now = Date.now();
  for (const [tokenHash, session] of adminSessions) {
    if (session.expiresAt <= now) adminSessions.delete(tokenHash);
  }
}

/* ---------- routes ---------- */
app.use('/api/admin', async (_req, _res, next) => {
  try {
    adminUsers = await loadAdminUsers();
    if (!adminUsers.length) await initializeAdminUsers();
    next();
  } catch (error) {
    next(error);
  }
});

app.post('/api/admin/login', async (req, res, next) => {
  try {
    if (!adminUsers.length) {
      return res.status(503).json({
        error: 'admin_not_configured',
        message: 'Admin access is not configured. Set METRA_ADMIN_EMAIL and METRA_ADMIN_PASSWORD, then restart the API.'
      });
    }

    const now = Date.now();
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const attempts = loginAttempts.get(ip);
    if (attempts && attempts.resetAt > now && attempts.count >= 5) {
      return res.status(429).json({
        error: 'too_many_attempts',
        message: 'Too many sign-in attempts. Please wait 15 minutes and try again.',
        retryAfter: Math.ceil((attempts.resetAt - now) / 1000)
      });
    }
    if (!attempts || attempts.resetAt <= now) loginAttempts.set(ip, { count: 0, resetAt: now + 15 * 60 * 1000 });

    const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const password = typeof req.body?.password === 'string' ? req.body.password : '';
    const user = adminUsers.find((entry) => entry.email === email);
    const salt = user?.passwordSalt || randomBytes(16).toString('hex');
    const derived = await passwordHash(password.slice(0, 1024), salt);
    const expectedHash = Buffer.from(user?.passwordHash || '0'.repeat(128), 'hex');
    const suppliedHash = Buffer.from(derived.hash, 'hex');
    const passwordMatches = timingSafeEqual(expectedHash, suppliedHash);

    if (!user || !passwordMatches || !emailPattern.test(email) || password.length > 1024) {
      const current = loginAttempts.get(ip);
      current.count += 1;
      return res.status(401).json({ error: 'invalid_credentials', message: 'Email or password is incorrect.' });
    }

    loginAttempts.delete(ip);
    clearExpiredSessions();
    const token = randomBytes(32).toString('base64url');
    const tokenHash = createHash('sha256').update(token).digest('hex');
    const expiresAt = now + ADMIN_SESSION_TTL;
    await saveAdminSession(tokenHash, { userId: user.id, expiresAt });
    setAdminCookie(req, res, token, Math.floor(ADMIN_SESSION_TTL / 1000));
    res.json({ authenticated: true, expiresAt: new Date(expiresAt).toISOString(), user: publicAdmin(user) });
  } catch (error) {
    next(error);
  }
});

app.get('/api/admin/session', requireAdmin, (req, res) => {
  const session = req.adminSession;
  res.setHeader('Cache-Control', 'no-store');
  res.json({ authenticated: true, expiresAt: new Date(session.expiresAt).toISOString(), user: publicAdmin(req.adminUser) });
});

app.post('/api/admin/logout', requireAdmin, async (req, res, next) => {
  try {
    await deleteAdminSession(req.adminTokenHash);
    setAdminCookie(req, res, '', 0);
    res.json({ authenticated: false });
  } catch (error) {
    next(error);
  }
});

app.get('/api/admin/overview', requireAdmin, async (req, res, next) => {
  try {
    const allOrders = (await loadOrders()).sort((a, b) => Date.parse(b.placedAt) - Date.parse(a.placedAt));
    const revenue = allOrders.reduce((sum, order) => sum + order.totals.total, 0);
    res.setHeader('Cache-Control', 'no-store');
    res.json({
      user: publicAdmin(req.adminUser),
      stats: {
        revenue,
        orderCount: allOrders.length,
        averageOrder: allOrders.length ? revenue / allOrders.length : 0,
        productCount: products.length,
        limitedCount: products.filter((product) => product.badge === 'Limited').length,
        collections: categories.length
      },
      collections: categoryCounts(),
      orders: allOrders.slice(0, 100).map((order) => ({
        orderNumber: order.orderNumber,
        placedAt: order.placedAt,
        status: order.status,
        total: order.totals.total,
        customer: {
          firstName: order.customer.firstName,
          lastName: order.customer.lastName,
          email: order.customer.email,
          city: order.customer.city,
          country: order.customer.country
        },
        items: order.items.map(({ name, qty }) => ({ name, qty }))
      }))
    });
  } catch (error) {
    next(error);
  }
});

app.get('/api/admin/users', requireAdmin, requireOwner, (_req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.json({ users: adminUsers.map(publicAdmin) });
});

app.post('/api/admin/users', requireAdmin, requireOwner, async (req, res, next) => {
  try {
    const name = typeof req.body?.name === 'string' ? req.body.name.trim() : '';
    const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const password = typeof req.body?.password === 'string' ? req.body.password : '';
    if (name.length < 2 || name.length > 80 || !emailPattern.test(email) || password.length < ADMIN_PASSWORD_MIN_LENGTH || password.length > 1024) {
      return res.status(422).json({
        error: 'invalid_admin',
        message: `Enter a name, a valid email address, and a password of at least ${ADMIN_PASSWORD_MIN_LENGTH} characters.`
      });
    }

    const credentials = await passwordHash(password);
    const newUser = {
      id: randomUUID(),
      name,
      email,
      role: 'admin',
      createdAt: new Date().toISOString(),
      passwordSalt: credentials.salt,
      passwordHash: credentials.hash
    };
    await updateAdminUsers((users) => {
      if (users.length >= 25) {
        const error = new Error('The admin account limit has been reached.');
        error.status = 409;
        throw error;
      }
      if (users.some((user) => user.email === email)) {
        const error = new Error('An admin account already exists for that email.');
        error.status = 409;
        throw error;
      }
      return [...users, newUser];
    });
    res.status(201).json({ user: publicAdmin(newUser) });
  } catch (error) {
    if (error.status) return res.status(error.status).json({ error: 'admin_conflict', message: error.message });
    next(error);
  }
});

app.delete('/api/admin/users/:id', requireAdmin, requireOwner, async (req, res, next) => {
  try {
    const target = adminUsers.find((user) => user.id === req.params.id);
    if (!target) return res.status(404).json({ error: 'not_found', message: 'Admin account not found.' });
    if (target.role === 'owner') {
      return res.status(403).json({ error: 'protected_owner', message: 'The owner account cannot be removed here.' });
    }

    await updateAdminUsers((users) => users.filter((user) => user.id !== target.id));
    for (const [tokenHash, session] of adminSessions) {
      if (session.userId === target.id) adminSessions.delete(tokenHash);
    }
    res.json({ removed: true });
  } catch (error) {
    next(error);
  }
});

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'metra-api',
    version: '1.0.0',
    products: products.length,
    uptime: Math.round(process.uptime())
  });
});

app.get('/api/products', async (req, res) => {
  const {
    cat = '',
    metal = '',
    maxPrice,
    q = '',
    sort = 'featured',
    limited,
    limit,
    offset
  } = req.query;

  const cats = String(cat).split(',').map((s) => s.trim()).filter(Boolean);
  const metalList = String(metal).split(',').map((s) => s.trim()).filter(Boolean);
  const needle = String(q).trim().toLowerCase();
  const max = maxPrice ? Number(maxPrice) : null;

  let list = products.filter((p) => {
    if (cats.length && !cats.includes(p.cat)) return false;
    if (metalList.length && !metalList.includes(p.metal)) return false;
    if (Number.isFinite(max) && p.price > max) return false;
    if (String(limited) === 'true' && p.badge !== 'Limited') return false;
    if (needle) {
      const hay = `${p.name} ${p.cat} ${p.metal} ${p.style} ${p.desc}`.toLowerCase();
      if (!hay.includes(needle)) return false;
    }
    return true;
  });

  list = sortList(list, String(sort));

  const total = list.length;
  const start = Math.max(0, Number(offset) || 0);
  const take = limit ? Math.max(1, Number(limit)) : total;
  const items = list.slice(start, start + take).map(publicProduct);

  // A little latency makes loading states visible in development.
  if (process.env.METRA_SLOW_API === '1') await wait(400);

  res.json({
    items,
    total,
    offset: start,
    limit: take,
    categories: categoryCounts(),
    metals,
    priceRange: { min: Math.min(...prices), max: Math.max(...prices) },
    promos: ['AURA10', 'METRA10', 'SOHAIL15', 'WELCOME5']
  });
});

app.get('/api/products/:id', (req, res) => {
  const product = products.find((p) => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'not_found', message: 'Timepiece not found' });
  }
  const related = products
    .filter((p) => p.id !== product.id)
    .sort((a, b) => (b.cat === product.cat) - (a.cat === product.cat))
    .slice(0, 4)
    .map(publicProduct);

  res.json({ product: publicProduct(product), related });
});

app.get('/api/collections', (_req, res) => {
  res.json({ collections: categoryCounts(), metals });
});

app.post('/api/promo', (req, res) => {
  const d = discountFor(req.body?.code);
  if (!d.valid) {
    return res.status(422).json({
      valid: false,
      message: 'That code is not valid',
      hints: ['AURA10', 'METRA10', 'SOHAIL15', 'WELCOME5']
    });
  }
  res.json({ valid: true, code: d.code, rate: d.rate, message: `${Math.round(d.rate * 100)}% discount applied` });
});

app.post('/api/orders', async (req, res, next) => {
  try {
  const body = req.body || {};
  const items = Array.isArray(body.items) ? body.items : [];
  const promo = body.promo || '';
  const customer = body.customer || {};

  if (!items.length) {
    return res.status(422).json({ error: 'empty_cart', message: 'Your bag is empty' });
  }

  const lines = [];
  for (const raw of items) {
    const product = products.find((p) => p.id === raw.id);
    if (!product) {
      return res.status(422).json({ error: 'invalid_item', message: `Unknown timepiece: ${raw.id}` });
    }
    const qty = Math.max(1, Math.min(9, Number(raw.qty) || 1));
    lines.push({ product, qty, line: product.price * qty });
  }

  const subtotal = lines.reduce((sum, l) => sum + l.line, 0);
  const totals = computeTotals(subtotal, promo);
  const orderNumber = `MSM-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 899999)}`;

  const order = {
    orderNumber,
    placedAt: new Date().toISOString(),
    status: 'confirmed',
    items: lines.map((l) => ({
      id: l.product.id,
      name: l.product.name,
      qty: l.qty,
      price: l.product.price,
      line: l.line
    })),
    totals,
    customer: {
      email: customer.email || '',
      firstName: customer.firstName || '',
      lastName: customer.lastName || '',
      city: customer.city || '',
      country: customer.country || ''
    },
    etaDays: [3, 6],
    paymentMethod: body.paymentMethod || 'card'
  };

  await saveOrder(order);
  console.log(`[metra-api] order ${orderNumber} · ${lines.length} line(s) · $${totals.total}`);

  res.status(201).json({ ok: true, order });
  } catch (error) {
    next(error);
  }
});

/* ---------- serve the built storefront (production) ---------- */
if (fs.existsSync(path.join(distDir, 'index.html'))) {
  app.use(express.static(distDir, { maxAge: '1h', index: false }));
  app.use((req, res, next) => {
    if (req.method !== 'GET' || req.path.startsWith('/api')) return next();
    res.sendFile(path.join(distDir, 'index.html'));
  });
}

/* ---------- 404 + error handling ---------- */
app.use('/api', (_req, res) => {
  res.status(404).json({ error: 'not_found', message: 'Unknown API endpoint' });
});

app.use((err, _req, res, _next) => {
  console.error('[metra-api]', err);
  res.status(500).json({ error: 'server_error', message: 'Something went wrong at the atelier' });
});

export { app };

if (!netlifyRuntime) {
  initializeAdminUsers()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`\n  AURA API  →  http://127.0.0.1:${PORT}/api/products`);
        console.log(`  ${products.length} timepieces · ${categories.length} collections\n`);
      });
    })
    .catch((error) => {
      console.error('[metra-api] Could not initialize admin accounts:', error.message);
      process.exitCode = 1;
    });
}
