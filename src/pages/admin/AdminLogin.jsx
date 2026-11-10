import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../api/client';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    api.adminSession()
      .then(() => {
        if (active) navigate('/admin', { replace: true });
      })
      .catch((requestError) => {
        if (active && requestError.status !== 401) {
          setError(requestError.message || 'The admin service could not be reached.');
        }
      });
    return () => { active = false; };
  }, [navigate]);

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      await api.adminLogin({ email: email.trim(), password });
      navigate('/admin', { replace: true });
    } catch (requestError) {
      setError(requestError.message || 'Sign in could not be completed.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="admin-login-page">
      <div className="admin-login-shell">
        <aside className="admin-login-story">
          <Link className="admin-brand" to="/">
            <span className="admin-mark">A</span>
            <span><b>AURA</b><small>WATCHES</small></span>
          </Link>
          <div className="admin-login-story-copy">
            <p className="admin-eyebrow">THE PRIVATE ATELIER</p>
            <h1>Care for every <em>detail.</em></h1>
            <p>One secure room to oversee orders, collections and the people entrusted with AURA Watches.</p>
          </div>
          <span className="admin-login-reference">GENEVA · EST. MMXXIV</span>
        </aside>

        <section className="admin-login-panel" aria-labelledby="admin-login-title">
          <Link className="admin-back-link" to="/">← Return to the boutique</Link>
          <div className="admin-login-form-wrap">
            <p className="admin-eyebrow">AURA WATCHES · ADMINISTRATION</p>
            <h2 id="admin-login-title">Welcome back.</h2>
            <p className="admin-login-intro">Sign in with an authorised administrator account.</p>

            <form className="admin-form" onSubmit={submit}>
              <label>
                <span>Admin email</span>
                <input
                  type="email"
                  name="email"
                  autoComplete="username"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="name@youratelier.com"
                />
              </label>
              <label>
                <span>Password</span>
                <input
                  type="password"
                  name="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                />
              </label>
              {error ? <p className="admin-form-message" role="alert">{error}</p> : null}
              <button className="admin-primary-button" type="submit" disabled={busy}>
                {busy ? 'Verifying access…' : 'Sign in securely'}
                <span aria-hidden="true">↗</span>
              </button>
            </form>

            <div className="admin-login-security">
              <span className="admin-security-mark" aria-hidden="true">✓</span>
              <p>Private administrator access. Sessions use an HttpOnly cookie and expire automatically after 8 hours.</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
