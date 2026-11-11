import { Link } from 'react-router-dom';
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import WatchImage from '../WatchImage';
import Icon from '../ui/Icon';
import Stars from '../ui/Stars';
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
  const reduce = useReducedMotion();

  /* Jeweller's tilt — the card leans toward the cursor like a vitrine. */
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const springX = useSpring(tiltX, { stiffness: 200, damping: 20 });
  const springY = useSpring(tiltY, { stiffness: 200, damping: 20 });
  const rotateX = useTransform(springX, [-0.5, 0.5], [4, -4]);
  const rotateY = useTransform(springY, [-0.5, 0.5], [-4.5, 4.5]);

  const onMove = (event) => {
    if (reduce) return;
    const el = event.currentTarget;
    const box = el.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width;
    const y = (event.clientY - box.top) / box.height;
    tiltX.set(y - 0.5);
    tiltY.set(x - 0.5);
    /* cursor spotlight position for the vitrine glow */
    el.style.setProperty('--mx', `${(x * 100).toFixed(1)}%`);
    el.style.setProperty('--my', `${(y * 100).toFixed(1)}%`);
  };
  const onLeave = () => {
    tiltX.set(0);
    tiltY.set(0);
  };

  return (
    <motion.article
      className="product-card"
      data-id={product.id}
      style={reduce ? undefined : { rotateX, rotateY, transformPerspective: 950 }}
      initial={reduce ? false : { opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -36px 0px' }}
      transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: (index % 4) * 0.08 }}
      whileHover={reduce ? undefined : { y: -10, scale: 1.014 }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <div className="pc-media" data-metal={product.metal} data-style={product.style}>
        <span className="pc-frame" aria-hidden="true" />
        <span className="pc-index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
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
    </motion.article>
  );
}
