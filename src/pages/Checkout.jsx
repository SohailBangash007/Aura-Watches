import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import PageBanner from '../components/ui/PageBanner';
import WatchImage from '../components/WatchImage';
import Icon from '../components/ui/Icon';
import Reveal from '../components/ui/Reveal';
import { useStore } from '../context/StoreContext';
import { useToast } from '../context/ToastContext';
import { api } from '../api/client';
import { EMAIL_RE, money } from '../lib/format';

const COUNTRIES = [
  'Pakistan',
  'United Arab Emirates',
  'United Kingdom',
  'United States',
  'Switzerland',
  'Saudi Arabia',
  'Canada',
  'Australia',
  'Germany',
  'France',
  'Singapore',
  'Other'
];

const PAYMENTS = [
  { key: 'card', name: 'Credit / Debit card', sub: 'Visa, Mastercard, Amex' },
  { key: 'paypal', name: 'PayPal', sub: 'Pay securely with your PayPal balance' },
  { key: 'transfer', name: 'Bank transfer', sub: 'Details sent after order confirmation' }
];

const initialForm = {
  email: '',
  phone: '',
  firstName: '',
  lastName: '',
  address: '',
  city: '',
  postal: '',
  country: '',
  notes: '',
  card: '',
  cardName: '',
  exp: '',
  cvc: '',
  terms: false
};

export default function Checkout() {
  const { cart, cartDetailed, cartCount, subtotal, totals, promo, clear, clearPromo } = useStore();
  const toast = useToast();

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [payment, setPayment] = useState('card');
  const [busy, setBusy] = useState(false);
  const [order, setOrder] = useState(null);

  const set = (key) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => (prev[key] ? { ...prev, [key]: '' } : prev));
  };

  const setCard = (event) => {
    const digits = event.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = digits.replace(/(.{4})/g, '$1 ').trim();
    setForm((prev) => ({ ...prev, card: formatted }));
    setErrors((prev) => (prev.card ? { ...prev, card: '' } : prev));
  };

  const setExp = (event) => {
    const digits = event.target.value.replace(/\D/g, '').slice(0, 4);
    const formatted = digits.length > 2 ? `${digits.slice(0, 2)} / ${digits.slice(2)}` : digits;
    setForm((prev) => ({ ...prev, exp: formatted }));
    setErrors((prev) => (prev.exp ? { ...prev, exp: '' } : prev));
  };

  const setCvc = (event) => {
    const digits = event.target.value.replace(/\D/g, '').slice(0, 4);
    setForm((prev) => ({ ...prev, cvc: digits }));
    setErrors((prev) => (prev.cvc ? { ...prev, cvc: '' } : prev));
  };

  const validate = () => {
    const next = {};
    if (!EMAIL_RE.test(form.email.trim())) next.email = 'Please enter a valid email address.';
    if (form.phone.replace(/\D/g, '').length < 7) next.phone = 'Please enter a contact number.';
    if (!form.firstName.trim()) next.firstName = 'Required.';
    if (!form.lastName.trim()) next.lastName = 'Required.';
    if (!form.address.trim()) next.address = 'Required.';
    if (!form.city.trim()) next.city = 'Required.';
    if (!form.postal.trim()) next.postal = 'Required.';
    if (!form.country) next.country = 'Please select a country.';

    if (payment === 'card') {
      if (form.card.replace(/\D/g, '').length < 15) next.card = 'Enter a valid card number.';
      if (!form.cardName.trim()) next.cardName = 'Required.';
      if (!/^(\d{2})\s*\/\s*(\d{2})$/.test(form.exp) || +form.exp.slice(0, 2) < 1 || +form.exp.slice(0, 2) > 12) {
        next.exp = 'Use MM / YY.';
      }
      if (!/^\d{3,4}$/.test(form.cvc)) next.cvc = '3 or 4 digits.';
    }

    if (!form.terms) next.terms = 'Please accept the terms to continue.';

    setErrors(next);
    if (Object.keys(next).length) {
      const first = document.querySelector('.field.invalid');
      if (first) first.scrollIntoView({ behavior: 'smooth', block: 'center' });
      toast('Please check the highlighted fields', 'error');
      return false;
    }
    return true;
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!cart.length) {
      toast('Your bag is empty', 'error');
      return;
    }
    if (!validate()) return;

    setBusy(true);
    try {
      const result = await api.createOrder({
        items: cart.map((item) => ({ id: item.id, qty: item.qty })),
        promo,
        paymentMethod: payment,
        customer: {
          email: form.email.trim(),
          phone: form.phone.trim(),
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          address: form.address.trim(),
          city: form.city.trim(),
          postal: form.postal.trim(),
          country: form.country,
          notes: form.notes.trim()
        }
      });

      setOrder(result.order);
      clear();
      clearPromo();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      toast('Order placed — welcome to AURA Watches');
    } catch (err) {
      toast(err.message || 'We could not place your order', 'error');
    } finally {
      setBusy(false);
    }
  };

  const fieldClass = (key) => `field${errors[key] ? ' invalid' : ''}`;
  const errText = (key, fallback) => errors[key] || fallback;

  const itemCount = useMemo(() => cartCount, [cartCount]);

  if (order) {
    return (
      <>
        <PageBanner
          crumb={[{ label: 'Home', to: '/' }, { label: 'Order confirmed' }]}
          eyebrow="Step 03 of 03"
          title={
            <>
              Welcome to the <span className="italic">maison</span>
            </>
          }
          num="04"
        />
        <section className="section">
          <div className="wrap">
            <div className="order-success">
              <div className="os-ico">
                <Icon name="check" size={26} />
              </div>
              <span className="eyebrow center">Order confirmed</span>
              <h2 style={{ marginTop: 14 }}>Thank you, {order.customer.firstName}.</h2>
              <p>
                Your timepiece is reserved and our atelier has begun preparing it. A confirmation has
                been sent to{' '}
                <strong style={{ color: 'var(--cream)', fontWeight: 400 }}>{order.customer.email}</strong>.
              </p>
              <div className="os-num">ORDER {order.orderNumber}</div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: 14,
                  marginTop: 34,
                  textAlign: 'left'
                }}
              >
                <div className="cc-card">
                  <h4>01 · Prepared</h4>
                  <p>Inspected and wrapped in the atelier within 24 hours.</p>
                </div>
                <div className="cc-card">
                  <h4>02 · Shipped</h4>
                  <p>Insured courier with live tracking, signature required.</p>
                </div>
                <div className="cc-card">
                  <h4>03 · Delivered</h4>
                  <p>3–6 business days, duties and taxes included.</p>
                </div>
              </div>

              <p style={{ marginTop: 26, fontSize: 12, color: 'var(--muted-2)' }}>
                {order.items.reduce((sum, item) => sum + item.qty, 0)} piece
                {order.items.reduce((sum, item) => sum + item.qty, 0) === 1 ? '' : 's'} · Order total{' '}
                {money(order.totals.total)}
              </p>

              <div
                style={{
                  display: 'flex',
                  gap: 12,
                  justifyContent: 'center',
                  marginTop: 28,
                  flexWrap: 'wrap'
                }}
              >
                <Link className="btn btn-gold" to="/shop">
                  Continue exploring
                </Link>
                <Link className="btn" to="/contact">
                  Contact client care
                </Link>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  if (!cartDetailed.length) {
    return (
      <>
        <PageBanner
          crumb={[{ label: 'Home', to: '/' }, { label: 'Checkout' }]}
          eyebrow="Step 02 of 03"
          title={
            <>
              Almost <span className="italic">yours</span>
            </>
          }
          num="03"
        />
        <section className="section">
          <div className="wrap">
            <div className="empty-state">
              <h3>Your bag is empty</h3>
              <p>Add a timepiece before proceeding to checkout.</p>
              <Link className="btn btn-gold" to="/shop" style={{ marginTop: 24 }}>
                Browse the collection
              </Link>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageBanner
        crumb={[
          { label: 'Home', to: '/' },
          { label: 'Bag', to: '/cart' },
          { label: 'Checkout' }
        ]}
        eyebrow="Step 02 of 03 · Secure checkout"
        title={
          <>
            Almost <span className="italic">yours</span>
          </>
        }
        text="Complete your details below. Your order is insured in transit and arrives in our signed presentation box."
        num="03"
      />

      <section className="section">
        <div className="wrap">
          <div className="co-layout">
            <form onSubmit={submit} noValidate>
              <div className="co-card reveal in">
                <div className="co-head">
                  <span className="n">01</span>
                  <h3>Contact details</h3>
                </div>
                <div className="co-grid">
                  <div className={`${fieldClass('email')} full`}>
                    <label>
                      Email address <span className="req">*</span>
                    </label>
                    <input
                      className="input"
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={set('email')}
                      placeholder="you@example.com"
                      autoComplete="email"
                    />
                    <span className="err">{errText('email', 'Please enter a valid email address.')}</span>
                  </div>
                  <div className={`${fieldClass('phone')} full`}>
                    <label>
                      Phone number <span className="req">*</span>
                    </label>
                    <input
                      className="input"
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={set('phone')}
                      placeholder="+92 300 0000000"
                      autoComplete="tel"
                    />
                    <span className="err">{errText('phone', 'Please enter a contact number.')}</span>
                  </div>
                </div>
              </div>

              <div className="co-card reveal in">
                <div className="co-head">
                  <span className="n">02</span>
                  <h3>Delivery address</h3>
                </div>
                <div className="co-grid">
                  <div className={fieldClass('firstName')}>
                    <label>
                      First name <span className="req">*</span>
                    </label>
                    <input
                      className="input"
                      name="firstName"
                      value={form.firstName}
                      onChange={set('firstName')}
                      placeholder="Muhammad"
                      autoComplete="given-name"
                    />
                    <span className="err">Required.</span>
                  </div>
                  <div className={fieldClass('lastName')}>
                    <label>
                      Last name <span className="req">*</span>
                    </label>
                    <input
                      className="input"
                      name="lastName"
                      value={form.lastName}
                      onChange={set('lastName')}
                      placeholder="Sohail"
                      autoComplete="family-name"
                    />
                    <span className="err">Required.</span>
                  </div>
                  <div className={`${fieldClass('address')} full`}>
                    <label>
                      Address <span className="req">*</span>
                    </label>
                    <input
                      className="input"
                      name="address"
                      value={form.address}
                      onChange={set('address')}
                      placeholder="House / street"
                      autoComplete="address-line1"
                    />
                    <span className="err">Required.</span>
                  </div>
                  <div className={fieldClass('city')}>
                    <label>
                      City <span className="req">*</span>
                    </label>
                    <input
                      className="input"
                      name="city"
                      value={form.city}
                      onChange={set('city')}
                      placeholder="Karachi"
                      autoComplete="address-level2"
                    />
                    <span className="err">Required.</span>
                  </div>
                  <div className={fieldClass('postal')}>
                    <label>
                      Postal code <span className="req">*</span>
                    </label>
                    <input
                      className="input"
                      name="postal"
                      value={form.postal}
                      onChange={set('postal')}
                      placeholder="75500"
                      autoComplete="postal-code"
                    />
                    <span className="err">Required.</span>
                  </div>
                  <div className={`${fieldClass('country')} full`}>
                    <label>
                      Country <span className="req">*</span>
                    </label>
                    <div className="select-wrap">
                      <select
                        className="select"
                        name="country"
                        value={form.country}
                        onChange={set('country')}
                        autoComplete="country-name"
                      >
                        <option value="">Select your country</option>
                        {COUNTRIES.map((country) => (
                          <option key={country} value={country}>
                            {country}
                          </option>
                        ))}
                      </select>
                    </div>
                    <span className="err">Please select a country.</span>
                  </div>
                  <div className="field full">
                    <label>
                      Delivery notes{' '}
                      <span style={{ textTransform: 'none', letterSpacing: 0, color: 'var(--muted-2)' }}>
                        (optional)
                      </span>
                    </label>
                    <input
                      className="input"
                      name="notes"
                      value={form.notes}
                      onChange={set('notes')}
                      placeholder="Gift message, delivery instructions…"
                    />
                  </div>
                </div>
              </div>

              <div className="co-card reveal in">
                <div className="co-head">
                  <span className="n">03</span>
                  <h3>Payment</h3>
                </div>

                <div className="pay-opts">
                  {PAYMENTS.map((option) => (
                    <label
                      key={option.key}
                      className={`pay-opt${payment === option.key ? ' active' : ''}`}
                      onClick={() => setPayment(option.key)}
                    >
                      <span className="radio" />
                      <span>
                        <span className="po-name">{option.name}</span>
                        <span className="po-sub">{option.sub}</span>
                      </span>
                      {option.key === 'card' ? (
                        <span className="po-ico">
                          <span>VISA</span>
                          <span>MC</span>
                          <span>AMEX</span>
                        </span>
                      ) : null}
                    </label>
                  ))}
                </div>

                {payment === 'card' ? (
                  <div style={{ marginTop: 24 }}>
                    <div className="card-visual">
                      <div className="cv-top">
                        <span>AURA Watches · Fine timepieces</span>
                        <span>World Elite</span>
                      </div>
                      <div className="cv-chip" />
                      <div className="cv-num">{form.card || '•••• •••• •••• ••••'}</div>
                      <div className="cv-bottom">
                        <span>{form.cardName ? form.cardName.toUpperCase() : 'Cardholder name'}</span>
                        <span>{form.exp || 'MM / YY'}</span>
                      </div>
                    </div>

                    <div className="co-grid">
                      <div className={`${fieldClass('card')} full`}>
                        <label>
                          Card number <span className="req">*</span>
                        </label>
                        <input
                          className="input"
                          name="card"
                          inputMode="numeric"
                          value={form.card}
                          onChange={setCard}
                          placeholder="1234 5678 9012 3456"
                          autoComplete="cc-number"
                          maxLength={19}
                        />
                        <span className="err">{errText('card', 'Enter a valid card number.')}</span>
                      </div>
                      <div className={`${fieldClass('cardName')} full`}>
                        <label>
                          Name on card <span className="req">*</span>
                        </label>
                        <input
                          className="input"
                          name="cardName"
                          value={form.cardName}
                          onChange={set('cardName')}
                          placeholder="MUHAMMAD SOHAIL METRA"
                          autoComplete="cc-name"
                        />
                        <span className="err">Required.</span>
                      </div>
                      <div className={fieldClass('exp')}>
                        <label>
                          Expiry <span className="req">*</span>
                        </label>
                        <input
                          className="input"
                          name="exp"
                          value={form.exp}
                          onChange={setExp}
                          placeholder="MM / YY"
                          autoComplete="cc-exp"
                          maxLength={7}
                        />
                        <span className="err">{errText('exp', 'Use MM / YY.')}</span>
                      </div>
                      <div className={fieldClass('cvc')}>
                        <label>
                          CVC <span className="req">*</span>
                        </label>
                        <input
                          className="input"
                          name="cvc"
                          inputMode="numeric"
                          value={form.cvc}
                          onChange={setCvc}
                          placeholder="123"
                          autoComplete="cc-csc"
                          maxLength={4}
                        />
                        <span className="err">{errText('cvc', '3 or 4 digits.')}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      padding: 18,
                      border: '1px dashed var(--line)',
                      fontSize: 12,
                      color: 'var(--muted)',
                      lineHeight: 1.8,
                      marginTop: 22
                    }}
                  >
                    {payment === 'paypal'
                      ? 'You will be redirected to PayPal to complete payment securely after placing your order. No card details are required.'
                      : 'Our client care team will email bank transfer instructions within one business hour. Your piece is reserved for 48 hours.'}
                  </div>
                )}

                <div style={{ marginTop: 20 }}>
                  <label className="check">
                    <input type="checkbox" checked={form.terms} onChange={set('terms')} />
                    <span>
                      I agree to the <a href="#" onClick={(e) => e.preventDefault()}>Terms of Sale</a>,{' '}
                      <a href="#" onClick={(e) => e.preventDefault()}>Privacy Policy</a> and confirm my billing
                      details are correct.
                    </span>
                  </label>
                  {errors.terms ? (
                    <span style={{ display: 'block', fontSize: 11, color: 'var(--red)', marginTop: 8 }}>
                      {errors.terms}
                    </span>
                  ) : null}
                </div>
              </div>

              <button className="btn btn-gold btn-block btn-lg" type="submit" disabled={busy}>
                {busy ? 'Processing…' : 'Place order securely'}
              </button>
              <p
                style={{
                  textAlign: 'center',
                  fontSize: 10,
                  letterSpacing: '.12em',
                  color: 'var(--muted-2)',
                  marginTop: 14
                }}
              >
                256-bit SSL encrypted · Your card details are never stored
              </p>
            </form>

            <aside className="summary reveal in">
              <h3>Your order</h3>

              <div style={{ marginBottom: 16 }}>
                {cartDetailed.map((item) => (
                  <div className="order-mini" key={item.product.id}>
                    <span className="om-img">
                      <WatchImage product={item.product} />
                    </span>
                    <span>
                      <span className="om-name">{item.product.name}</span>
                      <span className="om-meta">
                        {item.product.cat} · Qty {item.qty}
                      </span>
                    </span>
                    <span className="om-price">{money(item.line)}</span>
                  </div>
                ))}
              </div>

              <div className="s-row">
                <span>Subtotal ({itemCount} {itemCount === 1 ? 'piece' : 'pieces'})</span>
                <b>{money(subtotal)}</b>
              </div>
              <div className="s-row">
                <span>Shipping</span>
                <b>{totals.shipping ? money(totals.shipping) : 'Complimentary'}</b>
              </div>
              {totals.off ? (
                <div className="s-row discount">
                  <span>Discount · {promo}</span>
                  <b>−{money(totals.off)}</b>
                </div>
              ) : null}
              <div className="s-total">
                <span>Total</span>
                <b>{money(totals.total)}</b>
              </div>
              <p className="s-note" style={{ textAlign: 'left' }}>
                Includes all duties and taxes.
                <br />
                Delivered by insured courier.
              </p>

              <div className="trust" style={{ marginTop: 22 }}>
                <div>
                  <Icon name="shield" size={16} />
                  Secure payment
                </div>
                <div>
                  <Icon name="truck" size={16} />
                  Insured delivery
                </div>
                <div>
                  <Icon name="refresh" size={16} />
                  30-day returns
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
