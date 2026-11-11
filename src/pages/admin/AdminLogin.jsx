import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../api/client';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const STRENGTH_LABELS = ['Too weak', 'Weak', 'Fair', 'Strong', 'Excellent'];

function emailIssue(value) {
  if (!value.trim()) return 'Enter your admin email address.';
  if (!EMAIL_PATTERN.test(value.trim())) return 'Enter a valid email address, like name@youratelier.com.';
  return '';
}

function passwordRules(value) {
  return [
    { label: 'At least 12 characters', pass: value.length >= 12 },
    { label: 'An uppercase letter', pass: /[A-Z]/.test(value) },
    { label: 'A lowercase letter', pass: /[a-z]/.test(value) },
    { label: 'A number', pass: /[0-9]/.test(value) }
  ];
}

export default function AdminLogin() {
  const navigate = useNavigate();
  const [view, setView] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [reveal, setReveal] = useState({ password: false, newPassword: false, confirmPassword: false });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [issued, setIssued] = useState(null);
  const [touched, setTouched] = useState({});

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

  /* ---------- helpers ---------- */
  const switchView = (next) => {
    setView(next);
    setError('');
    setTouched({});
  };
  const markTouched = (field) => setTouched((state) => (state[field] ? state : { ...state, [field]: true }));
  const toggleReveal = (field) => setReveal((state) => ({ ...state, [field]: !state[field] }));

  /* ---------- live validation ---------- */
  const emailError = touched.email ? emailIssue(email) : '';
  const codeError = touched.code ? (/^\d{6}$/.test(code) ? '' : 'Enter the six-digit reset code.') : '';
  const rules = useMemo(() => passwordRules(newPassword), [newPassword]);
  const newPasswordError = touched.newPassword && !rules.every((rule) => rule.pass)
    ? 'Your new password does not meet every rule below.'
    : '';
  const confirmError = touched.confirmPassword && newPassword !== confirmPassword
    ? 'The passwords do not match.'
    : '';
  const strength = useMemo(() => {
    if (!newPassword) return 0;
    const passed = rules.filter((rule) => rule.pass).length;
    if (passed < 3) return 1;
    if (passed === 3) return 2;
    return /[^A-Za-z0-9]/.test(newPassword) && newPassword.length >= 14 ? 4 : 3;
  }, [newPassword, rules]);

  /* ---------- submit handlers ---------- */
  const submitSignIn = async (event) => {
    event.preventDefault();
    const emailProblem = emailIssue(email);
    if (emailProblem) { markTouched('email'); setError(emailProblem); return; }
    if (!password) { setError('Enter your password.'); return; }
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

  const submitForgot = async (event) => {
    event.preventDefault();
    const emailProblem = emailIssue(email);
    if (emailProblem) { markTouched('email'); setError(emailProblem); return; }
    setBusy(true);
    setError('');
    try {
      const response = await api.adminForgotPassword({ email: email.trim() });
      const minutes = Math.max(1, Math.round((Date.parse(response.expiresAt) - Date.now()) / 60000));
      const delivery = response.delivery === 'inline' ? 'inline' : 'email';
      setIssued({ code: String(response.resetCode || ''), minutes, delivery });
      setCode(delivery === 'inline' ? String(response.resetCode || '') : '');
      setView('reset');
      setTouched({});
    } catch (requestError) {
      setError(requestError.message || 'The reset code could not be issued.');
    } finally {
      setBusy(false);
    }
  };

  const submitReset = async (event) => {
    event.preventDefault();
    const emailProblem = emailIssue(email);
    if (emailProblem) { markTouched('email'); setError(emailProblem); return; }
    if (!/^\d{6}$/.test(code)) { markTouched('code'); setError('Enter the six-digit reset code.'); return; }
    if (!rules.every((rule) => rule.pass)) { markTouched('newPassword'); setError('Your new password does not meet every rule.'); return; }
    if (newPassword !== confirmPassword) { markTouched('confirmPassword'); setError('The passwords do not match.'); return; }
    setBusy(true);
    setError('');
    try {
      await api.adminResetPassword({ email: email.trim(), code: code.trim(), password: newPassword });
      setPassword('');
      setCode('');
      setNewPassword('');
      setConfirmPassword('');
      setIssued(null);
      setTouched({});
      setView('done');
    } catch (requestError) {
      if (requestError.status === 401) setCode('');
      setError(requestError.message || 'The password could not be updated.');
    } finally {
      setBusy(false);
    }
  };

  /* ---------- render ---------- */
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
            <h1>Every second, <em>secured.</em></h1>
            <p>One quiet room to oversee orders, collections and the people entrusted with AURA Watches.</p>
            <ul className="admin-story-points">
              <li><span aria-hidden="true">✓</span> Scrypt-hashed credentials, never plain text</li>
              <li><span aria-hidden="true">✓</span> HttpOnly sessions · eight-hour expiry</li>
              <li><span aria-hidden="true">✓</span> Rate-limited sign-in and recovery</li>
            </ul>
          </div>
          <span className="admin-login-reference">GENEVA · EST. MMXXIV</span>
        </aside>

        <section className="admin-login-panel" aria-labelledby="admin-login-title">
          <Link className="admin-back-link" to="/">← Return to the boutique</Link>
          <div className="admin-login-form-wrap">
            {view === 'signin' ? (
              <div className="admin-step" key="signin">
                <p className="admin-eyebrow">AURA WATCHES · ADMINISTRATION</p>
                <h2 id="admin-login-title">Welcome back.</h2>
                <p className="admin-login-intro">Sign in with an authorised administrator account.</p>

                <form className="admin-form" onSubmit={submitSignIn} noValidate>
                  <label className="admin-field">
                    <span>Admin email</span>
                    <input
                      type="email"
                      name="email"
                      autoComplete="username"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      onBlur={() => markTouched('email')}
                      className={emailError ? 'invalid' : ''}
                      placeholder="name@youratelier.com"
                      autoFocus
                    />
                    {emailError ? <em className="admin-field-error" role="alert">{emailError}</em> : null}
                  </label>
                  <label className="admin-field">
                    <span>Password</span>
                    <span className="admin-input-wrap">
                      <input
                        type={reveal.password ? 'text' : 'password'}
                        name="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="Enter your password"
                      />
                      <button className="admin-reveal" type="button" onClick={() => toggleReveal('password')}>
                        {reveal.password ? 'Hide' : 'Show'}
                      </button>
                    </span>
                  </label>

                  <div className="admin-form-row">
                    <button
                      className="admin-link-button"
                      type="button"
                      onClick={() => switchView('forgot')}
                    >
                      Forgot your password?
                    </button>
                  </div>

                  {error ? <p className="admin-form-message" role="alert">{error}</p> : null}
                  <button className="admin-primary-button" type="submit" disabled={busy}>
                    {busy ? 'Verifying access…' : 'Sign in securely'}
                    <span aria-hidden="true">↗</span>
                  </button>
                </form>

                <div className="admin-login-security">
                  <span className="admin-security-mark" aria-hidden="true">✓</span>
                  <p>
                    Private administrator access. Passwords are scrypt-hashed and stored server-side in
                    <b> data/admin-users.json</b> — never in plain text. Sessions use an HttpOnly cookie and expire after 8 hours.
                  </p>
                </div>
              </div>
            ) : null}

            {view === 'forgot' ? (
              <div className="admin-step" key="forgot">
                <p className="admin-eyebrow">AURA WATCHES · RECOVERY</p>
                <h2>Reset your access.</h2>
                <p className="admin-login-intro">
                  Enter the email of an administrator account and we will issue a reset code.
                </p>

                <form className="admin-form" onSubmit={submitForgot} noValidate>
                  <label className="admin-field">
                    <span>Admin email</span>
                    <input
                      type="email"
                      name="email"
                      autoComplete="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      onBlur={() => markTouched('email')}
                      className={emailError ? 'invalid' : ''}
                      placeholder="name@youratelier.com"
                      autoFocus
                    />
                    {emailError ? <em className="admin-field-error" role="alert">{emailError}</em> : null}
                  </label>

                  {error ? <p className="admin-form-message" role="alert">{error}</p> : null}
                  <button className="admin-primary-button" type="submit" disabled={busy}>
                    {busy ? 'Issuing your code…' : 'Send reset code'}
                    <span aria-hidden="true">↗</span>
                  </button>
                  <button className="admin-link-button admin-link-center" type="button" onClick={() => switchView('signin')}>
                    ← Back to sign in
                  </button>
                </form>
              </div>
            ) : null}

            {view === 'reset' ? (
              <div className="admin-step" key="reset">
                <p className="admin-eyebrow">AURA WATCHES · RECOVERY</p>
                <h2>Set a new password.</h2>
                <p className="admin-login-intro">Confirm the code and choose a strong new password.</p>

                {issued ? (
                  <div className="admin-code-delivery" role="status">
                    <p className="admin-eyebrow">RESET CODE · VALID {issued.minutes} MIN</p>
                    {issued.delivery === 'inline' && issued.code ? (
                      <>
                        <span className="admin-code-chip">{issued.code}</span>
                        <p>
                          Issued for <b>{email.trim()}</b>. This atelier has no mail service, so the code
                          is shown here instead of being emailed.
                        </p>
                      </>
                    ) : (
                      <p>
                        Issued for <b>{email.trim()}</b>. A code was created for this address, but this
                        deployment does not show codes on screen and has no email delivery. Ask the site
                        operator to email the code or to enable on-screen delivery while you recover access.
                      </p>
                    )}
                  </div>
                ) : null}

                <form className="admin-form" onSubmit={submitReset} noValidate>
                  <label className="admin-field">
                    <span>Reset code</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      name="code"
                      maxLength={6}
                      value={code}
                      onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, 6))}
                      onBlur={() => markTouched('code')}
                      className={codeError ? 'invalid' : ''}
                      placeholder="Six-digit code"
                      autoFocus
                    />
                    {codeError ? <em className="admin-field-error" role="alert">{codeError}</em> : null}
                  </label>

                  <label className="admin-field">
                    <span>New password</span>
                    <span className="admin-input-wrap">
                      <input
                        type={reveal.newPassword ? 'text' : 'password'}
                        name="newPassword"
                        autoComplete="new-password"
                        value={newPassword}
                        onChange={(event) => setNewPassword(event.target.value)}
                        onBlur={() => markTouched('newPassword')}
                        className={newPasswordError ? 'invalid' : ''}
                        placeholder="At least 12 characters"
                      />
                      <button className="admin-reveal" type="button" onClick={() => toggleReveal('newPassword')}>
                        {reveal.newPassword ? 'Hide' : 'Show'}
                      </button>
                    </span>
                    {newPasswordError ? <em className="admin-field-error" role="alert">{newPasswordError}</em> : null}
                  </label>

                  {newPassword ? (
                    <div className="admin-strength-meter">
                      <div className="admin-strength-bars" aria-hidden="true">
                        {[1, 2, 3, 4].map((step) => (
                          <i key={step} className={strength >= step ? 'on' : ''} />
                        ))}
                      </div>
                      <span className="admin-strength-label">{STRENGTH_LABELS[strength]}</span>
                      <ul className="admin-rules">
                        {rules.map((rule) => (
                          <li key={rule.label} className={rule.pass ? 'pass' : ''}>
                            <span aria-hidden="true">{rule.pass ? '✓' : '·'}</span> {rule.label}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  <label className="admin-field">
                    <span>Confirm new password</span>
                    <span className="admin-input-wrap">
                      <input
                        type={reveal.confirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={(event) => setConfirmPassword(event.target.value)}
                        onBlur={() => markTouched('confirmPassword')}
                        className={confirmError ? 'invalid' : ''}
                        placeholder="Repeat your new password"
                      />
                      <button className="admin-reveal" type="button" onClick={() => toggleReveal('confirmPassword')}>
                        {reveal.confirmPassword ? 'Hide' : 'Show'}
                      </button>
                    </span>
                    {confirmError ? <em className="admin-field-error" role="alert">{confirmError}</em> : null}
                  </label>

                  {error ? <p className="admin-form-message" role="alert">{error}</p> : null}
                  <button className="admin-primary-button" type="submit" disabled={busy}>
                    {busy ? 'Updating password…' : 'Set new password'}
                    <span aria-hidden="true">↗</span>
                  </button>
                  <button className="admin-link-button admin-link-center" type="button" onClick={() => switchView('signin')}>
                    ← Back to sign in
                  </button>
                </form>
              </div>
            ) : null}

            {view === 'done' ? (
              <div className="admin-step admin-done" key="done">
                <span className="admin-done-mark" aria-hidden="true">✓</span>
                <h2>Password updated.</h2>
                <p className="admin-login-intro">
                  Your new password is ready. Sign in to continue to the private atelier.
                </p>
                <button className="admin-primary-button" type="button" onClick={() => switchView('signin')}>
                  Back to sign in
                  <span aria-hidden="true">↗</span>
                </button>
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}
