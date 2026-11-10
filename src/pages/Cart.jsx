import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import PageBanner from '../components/ui/PageBanner';
import WatchImage from '../components/WatchImage';
import Icon from '../components/ui/Icon';
import Reveal from '../components/ui/Reveal';
import SectionHeading from '../components/ui/SectionHeading';
import ProductGrid from '../components/product/ProductGrid';
import { useCatalog } from '../context/CatalogContext';
import { useStore } from '../context/StoreContext';
import { useToast } from '../context/ToastContext';
import { money } from '../lib/format';

export default function Cart() {
  const { products } = useCatalog();
  const {
    cartDetailed,
    cartCount,
    subtotal,
    totals,
    promo,
    applyPromo,
    clearPromo,
    setQty,
    remove,
    shippingRemaining,
    shippingProgress
  } = useStore();
  const toast = useToast();

  const [code, setCode] = useState('');
  const [promoMsg, setPromoMsg] = useState(null);
  const [busy, setBusy] = useState(false);

  const recommendations = useMemo(() => {
    const inCart = new Set(cartDetailed.map((item) => item.product.id));
    return products.filter((p) => !inCart.has(p.id)).slice(0, 4);
  }, [products, cartDetailed]);

  const submitPromo = async (event) => {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    const result = await applyPromo(code);
    setPromoMsg(result);
    setBusy(false);
    if (result.valid) {
      setCode('');
      toast(result.message || 'Promo code applied');
    }
  };

  return (
    <>
      <PageBanner
        crumb={[{ label: 'Home', to: '/' }, { label: 'Shopping bag' }]}
        eyebrow="Step 01 of 03"
        title={
          <>
            Your <span className="italic">bag</span>
          </>
        }
        text="Every piece is inspected, wrapped and dispatched from our Geneva atelier within 24 hours."
        num="02"
      />

      <section className="section">
        <div className="wrap">
          {!cartDetailed.length ? (
            <div className="empty-state">
              <h3>Your bag is empty</h3>
              <p>Every collection begins with a single piece.</p>
              <Link className="btn btn-gold" to="/shop" style={{ marginTop: 24 }}>
                Discover timepieces
              </Link>
            </div>
          ) : (
            <div className="cart-layout">
              <div>
                <div className="cart-list">
                  {cartDetailed.map((item) => (
                    <div className="cart-row" key={item.product.id}>
                      <Link className="cart-thumb" to={`/product/${item.product.id}`} aria-label={item.product.name}>
                        <WatchImage product={item.product} />
                      </Link>

                      <div>
                        <div className="ci-cat">{item.product.cat}</div>
                        <Link className="ci-name" to={`/product/${item.product.id}`}>
                          {item.product.name}
                        </Link>
                        <div className="ci-meta">
                          {item.product.metal} · {item.product.strap.type === 'bracelet' ? 'bracelet' : item.product.strap.type}
                        </div>
                        <div className="ci-actions">
                          <div className="qty">
                            <button
                              type="button"
                              aria-label="Decrease quantity"
                              onClick={() => setQty(item.product.id, item.qty - 1)}
                            >
                              −
                            </button>
                            <span>{item.qty}</span>
                            <button
                              type="button"
                              aria-label="Increase quantity"
                              onClick={() => setQty(item.product.id, item.qty + 1)}
                            >
                              +
                            </button>
                          </div>
                          <button
                            className="ci-remove"
                            type="button"
                            onClick={() => {
                              remove(item.product.id);
                              toast('Item removed from your bag');
                            }}
                          >
                            <Icon name="close" size={12} /> Remove
                          </button>
                        </div>
                      </div>

                      <div className="ci-right">
                        <div className="ci-price">{money(item.line)}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 20,
                    marginTop: 26,
                    flexWrap: 'wrap'
                  }}
                >
                  <Link className="link-gold" to="/shop">
                    ← Continue shopping
                  </Link>
                  <span className="small muted">Prices include all applicable duties.</span>
                </div>
              </div>

              <aside className="summary">
                <h3>Order summary</h3>

                <div style={{ marginBottom: 16 }}>
                  <div
                    style={{
                      fontSize: 9,
                      letterSpacing: '.16em',
                      textTransform: 'uppercase',
                      color: 'var(--muted-2)',
                      marginBottom: 8
                    }}
                  >
                    {shippingRemaining > 0
                      ? `Add ${money(shippingRemaining)} for complimentary shipping`
                      : '✓ Complimentary shipping unlocked'}
                  </div>
                  <div style={{ height: 2, background: 'rgba(244,240,232,.1)' }}>
                    <div
                      style={{
                        height: 2,
                        width: `${shippingProgress}%`,
                        background: 'var(--gold)',
                        transition: 'width .5s'
                      }}
                    />
                  </div>
                </div>

                <div className="s-row">
                  <span>Subtotal ({cartCount} {cartCount === 1 ? 'piece' : 'pieces'})</span>
                  <b>{money(subtotal)}</b>
                </div>
                {totals.off > 0 ? (
                  <div className="s-row discount">
                    <span>
                      Discount · {promo}{' '}
                      <button
                        type="button"
                        onClick={() => {
                          clearPromo();
                          setPromoMsg(null);
                          toast('Promo code removed');
                        }}
                        aria-label="Remove promo code"
                        style={{ color: 'var(--muted-2)', marginLeft: 4 }}
                      >
                        ×
                      </button>
                    </span>
                    <b>−{money(totals.off)}</b>
                  </div>
                ) : null}
                <div className="s-row">
                  <span>Shipping</span>
                  <b>{totals.shipping ? money(totals.shipping) : 'Complimentary'}</b>
                </div>

                <form className="promo" onSubmit={submitPromo}>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Promo code"
                    aria-label="Promo code"
                  />
                  <button type="submit" disabled={busy}>
                    {busy ? '…' : 'Apply'}
                  </button>
                </form>
                {promoMsg && !promoMsg.valid ? (
                  <p style={{ fontSize: 10.5, color: 'var(--red)', marginTop: 8, letterSpacing: '.04em' }}>
                    {promoMsg.message}
                  </p>
                ) : null}
                {promoMsg && promoMsg.valid ? (
                  <p style={{ fontSize: 10.5, color: 'var(--green)', marginTop: 8, letterSpacing: '.04em' }}>
                    {promoMsg.message}
                  </p>
                ) : null}

                <div className="s-total">
                  <span>Total</span>
                  <b>{money(totals.total)}</b>
                </div>

                <Link className="btn btn-gold btn-block" to="/checkout">
                  Proceed to checkout
                </Link>
                <p className="s-note">
                  256-bit SSL encrypted · Insured delivery
                  <br />
                  Try AURA10, SOHAIL15 or WELCOME5
                </p>

                <div className="trust">
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
          )}
        </div>
      </section>

      {recommendations.length ? (
        <section className="section-tight section-alt">
          <div className="wrap">
            <Reveal>
              <SectionHeading
                eyebrow="Complete the collection"
                title={
                  <>
                    Pairs beautifully <span className="italic">with</span>
                  </>
                }
              />
            </Reveal>
            <ProductGrid products={recommendations} />
          </div>
        </section>
      ) : null}
    </>
  );
}
