import { Link } from 'react-router-dom';
import WatchImage from '../WatchImage';
import Icon from '../ui/Icon';
import { useStore } from '../../context/StoreContext';
import { useUI } from '../../context/UIContext';
import { useToast } from '../../context/ToastContext';
import { cn, money } from '../../lib/format';

export default function CartDrawer() {
  const { cartOpen, closeCart } = useUI();
  const {
    cartDetailed,
    cartCount,
    subtotal,
    shippingRemaining,
    shippingProgress,
    setQty,
    remove
  } = useStore();
  const toast = useToast();

  return (
    <>
      <div className={cn('overlay', cartOpen && 'show')} onClick={closeCart} aria-hidden="true" />

      <aside className={cn('drawer', cartOpen && 'open')} aria-label="Shopping bag" aria-hidden={!cartOpen}>
        <div className="drawer-head">
          <h3>
            Your Bag{' '}
            {cartDetailed.length ? (
              <span className="muted small" style={{ fontFamily: 'var(--sans)', fontSize: 11, letterSpacing: '.1em' }}>
                ({cartCount})
              </span>
            ) : null}
          </h3>
          <button className="close" type="button" onClick={closeCart} aria-label="Close bag">
            <Icon name="close" size={18} />
          </button>
        </div>

        <div className="drawer-body">
          {!cartDetailed.length ? (
            <div className="drawer-empty">
              <h4>Your bag is empty</h4>
              <p>Every collection begins with a single piece.</p>
              <Link className="btn btn-gold" to="/shop" onClick={closeCart}>
                Discover timepieces
              </Link>
            </div>
          ) : (
            cartDetailed.map((item) => (
              <div className="drawer-item" key={item.product.id}>
                <Link
                  className="di-img"
                  to={`/product/${item.product.id}`}
                  onClick={closeCart}
                  aria-label={item.product.name}
                >
                  <WatchImage product={item.product} />
                </Link>
                <div>
                  <Link className="di-name" to={`/product/${item.product.id}`} onClick={closeCart}>
                    {item.product.name}
                  </Link>
                  <div className="di-meta">
                    {item.product.cat} · {item.product.metal}
                  </div>
                  <div className="di-price">{money(item.product.price)}</div>
                  <div className="di-qty">
                    <button
                      type="button"
                      onClick={() => setQty(item.product.id, item.qty - 1)}
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span>{item.qty}</span>
                    <button
                      type="button"
                      onClick={() => setQty(item.product.id, item.qty + 1)}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  className="di-x"
                  type="button"
                  onClick={() => {
                    remove(item.product.id);
                    toast('Item removed from your bag');
                  }}
                  aria-label="Remove item"
                >
                  <Icon name="close" size={14} />
                </button>
              </div>
            ))
          )}
        </div>

        {cartDetailed.length ? (
          <div className="drawer-foot">
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
            <div className="df-row">
              <span>Subtotal</span>
              <b>{money(subtotal)}</b>
            </div>
            <Link className="btn btn-gold btn-block" to="/checkout" onClick={closeCart}>
              Secure checkout
            </Link>
            <Link className="btn btn-block" style={{ marginTop: 8 }} to="/cart" onClick={closeCart}>
              View full bag
            </Link>
          </div>
        ) : null}
      </aside>
    </>
  );
}
