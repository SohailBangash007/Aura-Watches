import { useState } from 'react';
import { Link } from 'react-router-dom';
import WatchImage from '../components/WatchImage';
import PageBanner from '../components/ui/PageBanner';
import { useCatalog } from '../context/CatalogContext';

export default function Account() {
  const { products } = useCatalog();
  const [mode, setMode] = useState('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const featured = products.find((product) => product.id === 'sovereign-chronograph') || products[0];
  const creating = mode === 'create';

  const submit = (event) => {
    event.preventDefault();
    setMessage(
      'Private account access is not connected yet. Your details were not sent or stored. Please contact Client Care for assistance.'
    );
  };

  return (
    <>
      <PageBanner
        crumb={[{ label: 'Home', to: '/' }, { label: 'Private client' }]}
        eyebrow="AURA WATCHES · Private client"
        title={<>A more personal <span className="italic">service.</span></>}
        text="Your place for considered care, saved timepieces and a closer relationship with the AURA atelier."
        num="05"
      />

      <section className="section account-section">
        <div className="wrap">
          <div className="account-layout">
            <aside className="account-story">
              <span className="eyebrow">The private client room</span>
              <div className="account-watch">{featured ? <WatchImage product={featured} /> : null}</div>
              <div className="account-story-copy">
                <span>Made to be kept</span>
                <h2>Every detail, <em>remembered.</em></h2>
                <p>
                  An AURA account is designed around the pieces you love: personal assistance,
                  servicing guidance and a quiet place to keep your collection in view.
                </p>
              </div>
            </aside>

            <div className="account-panel">
              <span className="eyebrow">Welcome to AURA Watches</span>
              <h2>{creating ? 'Create your account.' : 'Welcome back.'}</h2>
              <p className="account-sub">
                {creating
                  ? 'Begin your private client profile and keep your favourite references close.'
                  : 'Sign in to revisit the pieces and care notes you have saved.'}
              </p>

              <div className="account-tabs" role="tablist" aria-label="Account options">
                <button
                  type="button"
                  className={!creating ? 'active' : ''}
                  role="tab"
                  aria-selected={!creating}
                  onClick={() => { setMode('signin'); setMessage(''); }}
                >
                  Sign in
                </button>
                <button
                  type="button"
                  className={creating ? 'active' : ''}
                  role="tab"
                  aria-selected={creating}
                  onClick={() => { setMode('create'); setMessage(''); }}
                >
                  Create account
                </button>
              </div>

              <form className="account-form" onSubmit={submit}>
                {creating ? (
                  <label className="field">
                    <span>Your name</span>
                    <input className="input" type="text" name="name" autoComplete="name" required placeholder="Full name" />
                  </label>
                ) : null}
                <label className="field">
                  <span>Email address</span>
                  <input className="input" type="email" name="email" autoComplete="email" required placeholder="you@example.com" />
                </label>
                <label className="field">
                  <span>Password</span>
                  <span className="account-password">
                    <input
                      className="input"
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      autoComplete={creating ? 'new-password' : 'current-password'}
                      minLength={8}
                      required
                      placeholder="At least 8 characters"
                    />
                    <button type="button" onClick={() => setShowPassword((value) => !value)}>
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </span>
                </label>
                {!creating ? (
                  <button
                    className="account-forgot"
                    type="button"
                    onClick={() => setMessage('Password recovery is not connected yet. Contact Client Care and we will help you securely.')}
                  >
                    Forgot your password?
                  </button>
                ) : null}
                <button className="btn btn-gold account-submit" type="submit">
                  {creating ? 'Create private account' : 'Sign in to your account'}
                </button>
                {message ? <p className="account-message" role="status">{message}</p> : null}
              </form>

              <div className="account-help">
                <span>Prefer a personal conversation?</span>
                <Link to="/contact">Speak with Client Care <span aria-hidden="true">↗</span></Link>
              </div>
              <p className="account-privacy">Your details stay private. We never store your password on this page.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
