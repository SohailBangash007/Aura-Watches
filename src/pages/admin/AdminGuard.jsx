import { useCallback, useEffect, useState } from 'react';
import { Link, Navigate, Outlet } from 'react-router-dom';
import { api } from '../../api/client';

export default function AdminGuard() {
  const [status, setStatus] = useState('checking');
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);

  const checkSession = useCallback(() => {
    let active = true;
    setStatus('checking');
    setError('');
    api.adminSession()
      .then(() => {
        if (active) setStatus('ready');
      })
      .catch((requestError) => {
        if (!active) return;
        if (requestError.status === 401) {
          setStatus('denied');
        } else {
          setError(requestError.message || 'The admin service could not be reached.');
          setStatus('error');
        }
      });
    return () => { active = false; };
  }, []);

  useEffect(() => checkSession(), [checkSession, attempt]);

  if (status === 'denied') return <Navigate to="/admin/login" replace />;
  if (status === 'error') {
    return (
      <main className="admin-standalone-state">
        <div>
          <span className="admin-mark">A</span>
          <p className="admin-eyebrow">AURA WATCHES · ADMINISTRATION</p>
          <h1>Dashboard unavailable.</h1>
          <p>{error}</p>
          <button className="admin-primary-button" type="button" onClick={() => setAttempt((value) => value + 1)}>
            Try again
          </button>
          <Link className="admin-text-link" to="/admin/login">Return to admin sign in</Link>
        </div>
      </main>
    );
  }
  if (status !== 'ready') {
    return (
      <main className="admin-standalone-state">
        <div>
          <span className="admin-mark">A</span>
          <p className="admin-eyebrow">AURA WATCHES · ADMINISTRATION</p>
          <h1>Verifying your access.</h1>
          <span className="admin-spinner" aria-label="Loading" />
        </div>
      </main>
    );
  }
  return <Outlet />;
}
