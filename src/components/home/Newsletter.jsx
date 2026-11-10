import { useState } from 'react';
import Reveal from '../ui/Reveal';
import { useToast } from '../../context/ToastContext';
import { EMAIL_RE } from '../../lib/format';

export default function Newsletter({
  eyebrow = 'The inner circle',
  title = 'Be first to know.',
  text = 'Limited editions sell out quietly. Join our list for private previews, atelier stories and early access to new references.',
  note = 'No noise. Unsubscribe at any time.',
  success = 'Welcome to the inner circle — check your inbox'
}) {
  const [email, setEmail] = useState('');
  const toast = useToast();

  const submit = (e) => {
    e.preventDefault();
    if (!EMAIL_RE.test(email.trim())) {
      toast('Please enter a valid email address', 'error');
      return;
    }
    toast(success);
    setEmail('');
  };

  return (
    <section className="section-tight">
      <div className="wrap">
        <Reveal className="newsletter">
          <div className="nl-inner">
            <div>
              <span className="eyebrow">{eyebrow}</span>
              <h2>{title}</h2>
              <p>{text}</p>
            </div>
            <div>
              <form className="nl-form" onSubmit={submit} noValidate>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  aria-label="Email address"
                  required
                />
                <button type="submit" aria-label="Subscribe">
                  →
                </button>
              </form>
              <p className="nl-note">{note}</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
