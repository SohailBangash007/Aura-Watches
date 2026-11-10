import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api/client';

const currency = (amount) => new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0
}).format(amount || 0);

const dateLabel = (value) => new Intl.DateTimeFormat('en', {
  dateStyle: 'medium',
  timeStyle: 'short'
}).format(new Date(value));

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [overview, setOverview] = useState(null);
  const [admins, setAdmins] = useState([]);
  const [view, setView] = useState('overview');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const [adminForm, setAdminForm] = useState({ name: '', email: '', password: '' });

  const refresh = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const session = await api.adminSession();
      const data = await api.adminOverview();
      const team = session.user.role === 'owner' ? await api.adminUsers() : { users: [] };
      setUser(session.user);
      setOverview(data);
      setAdmins(team.users);
      setError('');
    } catch (requestError) {
      if (requestError.status === 401) {
        navigate('/admin/login', { replace: true });
        return;
      }
      setError(requestError.message || 'The dashboard could not be refreshed.');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    refresh();
    const timer = window.setInterval(() => refresh(false), 30000);
    return () => window.clearInterval(timer);
  }, [refresh]);

  const filteredOrders = useMemo(() => {
    const orders = overview?.orders || [];
    const needle = query.trim().toLowerCase();
    if (!needle) return orders;
    return orders.filter((order) => {
      const haystack = [
        order.orderNumber,
        order.customer.email,
        order.customer.firstName,
        order.customer.lastName,
        order.customer.city,
        ...order.items.map((item) => item.name)
      ].join(' ').toLowerCase();
      return haystack.includes(needle);
    });
  }, [overview, query]);

  const logout = async () => {
    try {
      await api.adminLogout();
    } catch (requestError) {
      if (requestError.status !== 401) setError(requestError.message || 'Could not end the session cleanly.');
    }
    navigate('/admin/login', { replace: true });
  };

  const addAdmin = async (event) => {
    event.preventDefault();
    setBusy(true);
    setNotice('');
    setError('');
    try {
      await api.createAdminUser(adminForm);
      setAdminForm({ name: '', email: '', password: '' });
      setNotice('Admin account added. Share the password privately with its owner.');
      await refresh(false);
    } catch (requestError) {
      setError(requestError.message || 'The admin account could not be created.');
    } finally {
      setBusy(false);
    }
  };

  const removeAdmin = async (admin) => {
    if (!window.confirm(`Remove admin access for ${admin.email}? Their current sessions will end.`)) return;
    setNotice('');
    setError('');
    try {
      await api.removeAdminUser(admin.id);
      setNotice(`${admin.email} no longer has admin access.`);
      await refresh(false);
    } catch (requestError) {
      setError(requestError.message || 'The admin account could not be removed.');
    }
  };

  if (loading && !overview) {
    return (
      <main className="admin-standalone-state">
        <div>
          <span className="admin-mark">M</span>
          <p className="admin-eyebrow">AURA WATCHES · ADMINISTRATION</p>
          <h1>Opening your dashboard.</h1>
          <span className="admin-spinner" aria-label="Loading" />
        </div>
      </main>
    );
  }

  const stats = overview?.stats;

  return (
    <main className="admin-app">
      <aside className="admin-sidebar">
        <a className="admin-brand" href="/admin">
          <span className="admin-mark">A</span>
          <span><b>AURA</b><small>WATCHES · ADMIN</small></span>
        </a>
        <div className="admin-sidebar-label">WORKSPACE</div>
        <nav className="admin-side-nav" aria-label="Admin dashboard">
          <button className={view === 'overview' ? 'active' : ''} onClick={() => setView('overview')}>
            <span className="admin-nav-glyph">◫</span> Overview
          </button>
          <button className={view === 'orders' ? 'active' : ''} onClick={() => setView('orders')}>
            <span className="admin-nav-glyph">↗</span> Orders
            <span className="admin-nav-count">{stats?.orderCount || 0}</span>
          </button>
          {user?.role === 'owner' ? (
            <button className={view === 'team' ? 'active' : ''} onClick={() => setView('team')}>
              <span className="admin-nav-glyph">♙</span> Admin team
              <span className="admin-nav-count">{admins.length}</span>
            </button>
          ) : null}
        </nav>
        <div className="admin-sidebar-bottom">
          <div className="admin-user-card">
            <span className="admin-avatar">{user?.name?.slice(0, 1).toUpperCase() || 'M'}</span>
            <span><b>{user?.name}</b><small>{user?.role === 'owner' ? 'Store owner' : 'Administrator'}</small></span>
          </div>
          <button className="admin-logout" type="button" onClick={logout}>Sign out <span>↗</span></button>
          <a className="admin-store-link" href="/">← View the boutique</a>
        </div>
      </aside>

      <section className="admin-main">
        <header className="admin-topbar">
          <div>
            <p className="admin-eyebrow">AURA WATCHES · GENEVA</p>
            <span>Private administration</span>
          </div>
          <div className="admin-top-actions">
            <span className="admin-live"><i /> Live data</span>
            <button type="button" onClick={() => refresh()} disabled={loading} aria-label="Refresh dashboard">
              <span className={loading ? 'admin-refresh-icon spinning' : 'admin-refresh-icon'}>↻</span>
              Refresh
            </button>
          </div>
        </header>

        <div className="admin-content">
          <div className="admin-page-heading">
            <div>
              <p className="admin-eyebrow">{view === 'team' ? 'ACCESS & PERMISSIONS' : view === 'orders' ? 'CLIENT ACTIVITY' : 'ATELIER OVERVIEW'}</p>
              <h1>{view === 'team' ? 'Admin team' : view === 'orders' ? 'Orders' : 'Welcome back, ' + (user?.role === 'owner' ? 'Owner' : user?.name?.split(' ')[0] || 'Admin') + '.'}</h1>
              <p>{view === 'team' ? 'Only the store owner can grant or revoke administrator access.' : 'A considered view of your AURA Watches boutique, updated as orders arrive.'}</p>
            </div>
            <span className="admin-date">{new Intl.DateTimeFormat('en', { dateStyle: 'full' }).format(new Date())}</span>
          </div>

          {error ? <div className="admin-alert" role="alert">{error}</div> : null}
          {notice ? <div className="admin-notice" role="status">{notice}</div> : null}

          {view !== 'team' ? (
            <>
              <div className="admin-stat-grid">
                <article className="admin-stat-card admin-stat-primary">
                  <span className="admin-stat-label">Gross sales</span>
                  <strong>{currency(stats?.revenue)}</strong>
                  <small>From orders received by this server</small>
                  <span className="admin-stat-mark">01</span>
                </article>
                <article className="admin-stat-card">
                  <span className="admin-stat-label">Orders</span>
                  <strong>{stats?.orderCount || 0}</strong>
                  <small>All recorded orders</small>
                  <span className="admin-stat-mark">02</span>
                </article>
                <article className="admin-stat-card">
                  <span className="admin-stat-label">Average order</span>
                  <strong>{currency(stats?.averageOrder)}</strong>
                  <small>Average value per order</small>
                  <span className="admin-stat-mark">03</span>
                </article>
                <article className="admin-stat-card">
                  <span className="admin-stat-label">Timepieces</span>
                  <strong>{stats?.productCount || 0}</strong>
                  <small>{stats?.limitedCount || 0} limited · {stats?.collections || 0} collections</small>
                  <span className="admin-stat-mark">04</span>
                </article>
              </div>

              <div className="admin-data-note">
                <span>i</span>
                Orders are currently held in server memory and clear when the API restarts. Connect persistent order storage before using this for live fulfilment.
              </div>

              {view === 'overview' ? (
                <div className="admin-overview-grid">
                  <section className="admin-panel admin-orders-panel">
                    <div className="admin-panel-heading">
                      <div><p className="admin-eyebrow">LATEST ACTIVITY</p><h2>Recent orders</h2></div>
                      <button type="button" className="admin-inline-link" onClick={() => setView('orders')}>View all <span>↗</span></button>
                    </div>
                    <OrdersTable orders={(overview?.orders || []).slice(0, 5)} />
                  </section>
                  <section className="admin-panel admin-collections-panel">
                    <div className="admin-panel-heading">
                      <div><p className="admin-eyebrow">THE COLLECTION</p><h2>Timepieces by line</h2></div>
                    </div>
                    <div className="admin-collection-list">
                      {(overview?.collections || []).map((collection) => {
                        const percent = stats?.productCount ? collection.count / stats.productCount * 100 : 0;
                        return (
                          <div className="admin-collection-row" key={collection.name}>
                            <div><span>{collection.name}</span><b>{collection.count}</b></div>
                            <span className="admin-bar"><i style={{ width: `${percent}%` }} /></span>
                          </div>
                        );
                      })}
                    </div>
                    <p className="admin-collection-foot">{stats?.productCount || 0} references currently in the catalogue</p>
                  </section>
                </div>
              ) : (
                <section className="admin-panel admin-orders-full">
                  <div className="admin-panel-heading">
                    <div><p className="admin-eyebrow">CLIENT ACTIVITY</p><h2>Order register</h2></div>
                    <label className="admin-search">
                      <span aria-hidden="true">⌕</span>
                      <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search order, client or watch" aria-label="Search orders" />
                    </label>
                  </div>
                  <OrdersTable orders={filteredOrders} />
                  {overview?.orders?.length === 100 ? <p className="admin-table-foot">Showing the latest 100 orders.</p> : null}
                </section>
              )}
            </>
          ) : (
            <div className="admin-team-grid">
              <section className="admin-panel admin-team-list">
                <div className="admin-panel-heading">
                  <div><p className="admin-eyebrow">AUTHORISED USERS</p><h2>Administrator access</h2></div>
                  <span className="admin-count-badge">{admins.length} / 25</span>
                </div>
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead><tr><th>Administrator</th><th>Role</th><th>Added</th><th aria-label="Actions" /></tr></thead>
                    <tbody>
                      {admins.map((admin) => (
                        <tr key={admin.id}>
                          <td><b>{admin.name}</b><small>{admin.email}</small></td>
                          <td><span className={`admin-role-badge ${admin.role}`}>{admin.role === 'owner' ? 'Owner' : 'Admin'}</span></td>
                          <td>{dateLabel(admin.createdAt)}</td>
                          <td>{admin.role !== 'owner' ? <button className="admin-remove" type="button" onClick={() => removeAdmin(admin)}>Remove</button> : <span className="admin-protected">Protected</span>}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="admin-table-foot">Admin accounts are private and stored on this server. Removed accounts are signed out immediately.</p>
              </section>

              <section className="admin-panel admin-add-panel">
                <p className="admin-eyebrow">GRANT ACCESS</p>
                <h2>Add an administrator</h2>
                <p>Create a secure account for a trusted member of your team. Share the password privately.</p>
                <form className="admin-form" onSubmit={addAdmin}>
                  <label><span>Full name</span><input required minLength={2} maxLength={80} value={adminForm.name} onChange={(event) => setAdminForm((form) => ({ ...form, name: event.target.value }))} placeholder="Administrator name" /></label>
                  <label><span>Email address</span><input type="email" required value={adminForm.email} onChange={(event) => setAdminForm((form) => ({ ...form, email: event.target.value }))} placeholder="name@youratelier.com" /></label>
                  <label><span>Initial password</span><input type="password" autoComplete="new-password" minLength={12} maxLength={1024} required value={adminForm.password} onChange={(event) => setAdminForm((form) => ({ ...form, password: event.target.value }))} placeholder="At least 12 characters" /></label>
                  <button className="admin-primary-button" type="submit" disabled={busy || admins.length >= 25}>
                    {busy ? 'Creating account…' : 'Create admin account'} <span aria-hidden="true">↗</span>
                  </button>
                </form>
                <p className="admin-team-hint">Only you, the store owner, can add or remove administrators. Passwords are securely hashed and never displayed again.</p>
              </section>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function OrdersTable({ orders }) {
  if (!orders.length) {
    return (
      <div className="admin-empty">
        <span className="admin-empty-mark">A</span>
        <b>No orders yet</b>
        <p>New client orders will appear here after checkout is completed.</p>
      </div>
    );
  }
  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead><tr><th>Order</th><th>Client</th><th>Timepiece</th><th>Date</th><th>Status</th><th>Total</th></tr></thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.orderNumber}>
              <td><b>{order.orderNumber}</b></td>
              <td><b>{[order.customer.firstName, order.customer.lastName].filter(Boolean).join(' ') || 'Client'}</b><small>{order.customer.email}</small></td>
              <td>{order.items.map((item) => `${item.name} × ${item.qty}`).join(', ')}</td>
              <td>{dateLabel(order.placedAt)}</td>
              <td><span className="admin-status"><i />{order.status}</span></td>
              <td><b>{currency(order.total)}</b></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
