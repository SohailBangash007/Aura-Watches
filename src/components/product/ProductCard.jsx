import { Link } from 'react-router-dom';
import WatchImage from '../WatchImage';
import Icon from '../ui/Icon';
import Stars from '../ui/Stars';
import Reveal from '../ui/Reveal';
import { useStore } from '../../context/StoreContext';
import { useUI } from '../../context/UIContext';
import { useToast } from '../../context/ToastContext';
import { cn, money } from '../../lib/format';

export default function ProductCard({ product, index = 0 }) {
  const { add, isWished, toggleWish } = useStore();
  const { openCart } = useUI();
  const toast = useToast();
  const wished = isWished(product.id);
  const caseDetail = product.specs?.Case?.split(',')[0]?.trim();
  const movementDetail = product.specs?.Movement?.split(',')[0]?.trim();
  const description = product.desc?.split(/(?<=[.!?])\s/)[0];

  return (
    <Reveal as="article" className="product-card" delay={(index % 4) + 1} data-id={product.id}>
      <div className="pc-media" data-metal={product.metal} data-style={product.style}>
        {product.badge ? (
          <span className={cn('pc-badge', product.badge === 'Sale' && 'sale')}>{product.badge}</span>
        ) : null}

        <button
          className={cn('pc-wish', wished && 'on')}
          type="button"
          aria-label={wished ? 'Remove from wishlist' : 'Save to wishlist'}
          aria-pressed={wished}
          onClick={() => {
            const on = toggleWish(product.id);
            toast(on ? 'Saved to your wishlist' : 'Removed from your wishlist');
          }}
        >
          <Icon name="heart" size={15} />
        </button>

        <Link
          className="pc-image-link"
          to={`/product/${product.id}`}
          aria-label={`View ${product.name}`}
          tabIndex={-1}
        >
          <WatchImage product={product} />
        </Link>
        <span className="pc-media-mark">AURA · {product.cat}</span>
      </div>

      <div className="pc-body">
        <div className="pc-heading">
          <div>
            <div className="pc-cat">{product.cat}</div>
            <Link className="pc-name" to={`/product/${product.id}`}>
              {product.name}
            </Link>
          </div>
          <div className="pc-price">
            {product.old ? <span className="old">{money(product.old)}</span> : null}
            <span className="now">{money(product.price)}</span>
          </div>
        </div>
        <p className="pc-summary">{description}</p>
        <div className="pc-specs" aria-label="Watch specifications">
          {caseDetail ? <span>{caseDetail} case</span> : null}
          {movementDetail ? <span>{movementDetail}</span> : null}
        </div>
        <div className="pc-rating">
          <Stars rating={product.rating} />
          <span>{product.rating.toFixed(1)} <i>·</i> {product.reviews} reviews</span>
        </div>
        <div className="pc-quick">
          <button
            type="button"
            onClick={() => {
              add(product.id, 1);
              toast(`${product.name} added to your bag`);
              openCart();
            }}
          >
            <span>Add to bag</span>
            <span>{money(product.price)}</span>
          </button>
        </div>
      </div>
    </Reveal>
  );
}
