import { useEffect, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import WatchImage from '../components/WatchImage';
import Icon from '../components/ui/Icon';
import Stars from '../components/ui/Stars';
import Reveal from '../components/ui/Reveal';
import Accordion from '../components/ui/Accordion';
import ProductGrid from '../components/product/ProductGrid';
import SectionHeading from '../components/ui/SectionHeading';
import { useCatalog } from '../context/CatalogContext';
import { useStore } from '../context/StoreContext';
import { useUI } from '../context/UIContext';
import { useToast } from '../context/ToastContext';
import { api } from '../api/client';
import { cn, money, slugify } from '../lib/format';

export default function Product() {
  const { id } = useParams();
  const { byId, products, metals } = useCatalog();
  const { add, isWished, toggleWish } = useStore();
  const { openCart } = useUI();
  const toast = useToast();
  const reduceMotion = useReducedMotion();

  const [product, setProduct] = useState(() => byId(id) || null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(!byId(id));
  const [qty, setQty] = useState(1);

  /* fetch the detail endpoint, falling back to the catalogue already in memory */
  useEffect(() => {
    let alive = true;
    setLoading(true);
    setQty(1);

    api
      .product(id)
      .then((data) => {
        if (!alive) return;
        setProduct(data.product);
        setRelated(data.related || []);
      })
      .catch(() => {
        if (!alive) return;
        const fallback = byId(id) || null;
        setProduct(fallback);
        setRelated(
          products
            .filter((p) => p.id !== id)
            .sort((a, b) => (b.cat === fallback?.cat) - (a.cat === fallback?.cat))
            .slice(0, 4)
        );
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [id, byId, products]);

  const metalLabel = useMemo(() => {
    if (!product) return '';
    return metals.find((m) => m.key === product.metal)?.label || product.metal;
  }, [metals, product]);

  const strapLabel = product
    ? product.strap.type === 'bracelet'
      ? 'Steel link bracelet'
      : product.strap.type === 'rubber'
        ? 'Soft-touch rubber'
        : 'Calfskin leather'
    : '';
  const highlightSpecs = product
    ? ['Case', 'Movement', 'Crystal', 'Water resistance']
        .filter((key) => product.specs?.[key])
        .slice(0, 3)
        .map((key) => ({ label: key, value: product.specs[key] }))
    : [];

  if (loading && !product) {
    return (
      <section className="section">
        <div className="wrap">
          <div className="empty-state" style={{ marginTop: 60 }}>
            <h3>Fetching the timepiece…</h3>
            <p>One moment while the atelier opens the case.</p>
          </div>
        </div>
      </section>
    );
  }

  if (!product) {
    return (
      <section className="section">
        <div className="wrap">
          <div className="empty-state" style={{ marginTop: 60 }}>
            <h3>Timepiece not found</h3>
            <p>This reference may have been retired from the collection.</p>
            <Link className="btn btn-gold" to="/shop" style={{ marginTop: 22 }}>
              Browse the collection
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const wished = isWished(product.id);
  const accordionItems = [
    {
      title: 'The story',
      content: (
        <>
          {product.desc} Each reference is delivered in a signed presentation box with its
          certificate of origin, a travel pouch and a hand-numbered warranty card.
        </>
      )
    },
    {
      title: 'Specifications',
      content: (
        <table className="spec-table">
          <tbody>
            {Object.entries(product.specs || {}).map(([key, value]) => (
              <tr key={key}>
                <td>{key}</td>
                <td>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )
    },
    {
      title: 'Shipping & returns',
      content:
        'Complimentary insured shipping worldwide on orders above $500, dispatched within 24 hours from Geneva. Returns are accepted within 30 days in unworn condition, with a prepaid return label included in every parcel.'
    },
    {
      title: 'Care & servicing',
      content:
        'We recommend a full service every five to seven years. AURA owners receive priority servicing at our Geneva atelier and a complimentary ultrasonic clean each year.'
    }
  ];

  return (
    <>
      <motion.section
        className="section product-detail-section"
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 0.61, 0.36, 1] }}
      >
        <div className="wrap">
          <motion.div
            className="crumb product-crumb"
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08 }}
          >
            <Link to="/">Home</Link>
            <i>/</i>
            <Link to={`/collections/${slugify(product.cat)}`}>{product.cat}</Link>
            <i>/</i>
            <span>{product.name}</span>
          </motion.div>

          <div className="pd-layout">
            <motion.div
              className="pd-gallery"
              initial={reduceMotion ? false : { opacity: 0, y: 26, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.75, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="pd-main">
                <div className="pd-gallery-top">
                  <span>AURA <i>·</i> {product.cat}</span>
                  {product.badge ? <span className="pd-edition">{product.badge}</span> : null}
                </div>
                <motion.div
                  className="pd-image-motion"
                  animate={reduceMotion ? undefined : { y: [0, -5, 0] }}
                  transition={reduceMotion ? undefined : { duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <WatchImage product={product} />
                </motion.div>
                <span className="pd-photo-note">Representative watch photography</span>
                <div className="pd-gallery-bottom">
                  <span>Swiss design <i>·</i> AURA Geneva</span>
                  <span>01 <i>/</i> 01</span>
                </div>
              </div>
              <div className="pd-gallery-caption">
                <span className="pd-caption-mark" aria-hidden="true">M</span>
                <div>
                  <span>The AURA collection</span>
                  <b>{product.name}</b>
                </div>
                <span className="pd-caption-category">{product.cat}</span>
              </div>
            </motion.div>

            <motion.div
              className="pd-info"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: { staggerChildren: reduceMotion ? 0 : 0.075, delayChildren: reduceMotion ? 0 : 0.18 }
                }
              }}
            >
              <motion.div
                className="pd-info-kicker"
                variants={reduceMotion ? {} : { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
              >
                <span className="pd-cat">{product.cat} <i>·</i> {metalLabel}</span>
                <span className="pd-reference">REF. {product.id.slice(0, 3).toUpperCase()}-{product.id.slice(-3).toUpperCase()}</span>
              </motion.div>
              <motion.h1 variants={reduceMotion ? {} : { hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } }}>
                {product.name}
              </motion.h1>
              <motion.div
                className="pd-rating"
                variants={reduceMotion ? {} : { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
              >
                <Stars rating={product.rating} />
                <span>
                  {product.rating} · {product.reviews} verified reviews
                </span>
              </motion.div>
              <motion.div
                className="pd-price"
                variants={reduceMotion ? {} : { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
              >
                <span className="now">{money(product.price)}</span>
                {product.old ? <span className="old">{money(product.old)}</span> : null}
                {product.old ? <span className="save">Save {money(product.old - product.price)}</span> : null}
                <span className="pd-price-note">Complimentary insured delivery</span>
              </motion.div>
              <motion.p
                className="pd-desc"
                variants={reduceMotion ? {} : { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
              >
                {product.desc}
              </motion.p>

              <motion.div
                className="pd-stock"
                variants={reduceMotion ? {} : { hidden: { opacity: 0 }, visible: { opacity: 1 } }}
              >
                <span className="pd-stock-dot" />
                In stock <i>·</i> Ships from Geneva within 24 hours
              </motion.div>

              <motion.div
                className="pd-highlights"
                variants={reduceMotion ? {} : { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
              >
                {highlightSpecs.map((spec, index) => (
                  <div className="pd-highlight" key={spec.label}>
                    <span>0{index + 1} <i>·</i> {spec.label}</span>
                    <b>{spec.value}</b>
                  </div>
                ))}
              </motion.div>

              <motion.div
                className="pd-opt"
                variants={reduceMotion ? {} : { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
              >
                <div className="ol">Included strap <b>{strapLabel}</b></div>
                <div className="pd-strap-card">
                  <span className="pd-strap-swatch" />
                  <span>{strapLabel}</span>
                  <span className="pd-strap-note">Fitted to this reference</span>
                </div>
                <p className="pd-fit-note">
                  Complimentary strap fitting at any AURA Watches boutique.
                </p>
              </motion.div>

              <motion.div
                className="pd-buy"
                variants={reduceMotion ? {} : { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
              >
                <div className="qty">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    onClick={() => setQty((n) => Math.max(1, n - 1))}
                  >
                    −
                  </button>
                  <span>{qty}</span>
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    onClick={() => setQty((n) => Math.min(9, n + 1))}
                  >
                    +
                  </button>
                </div>
                <motion.button
                  className="btn btn-gold"
                  type="button"
                  whileHover={reduceMotion ? undefined : { y: -2, boxShadow: '0 12px 24px rgba(20,36,58,.17)' }}
                  whileTap={reduceMotion ? undefined : { scale: 0.985 }}
                  onClick={() => {
                    add(product.id, qty);
                    toast(`${qty > 1 ? `${qty} × ` : ''}${product.name} added to your bag`);
                    openCart();
                  }}
                >
                  Add to bag — {money(product.price * qty)}
                </motion.button>
                <motion.button
                  className={cn('btn', wished && 'on')}
                  type="button"
                  whileHover={reduceMotion ? undefined : { y: -2 }}
                  whileTap={reduceMotion ? undefined : { scale: 0.94 }}
                  aria-label={wished ? 'Remove from wishlist' : 'Save to wishlist'}
                  aria-pressed={wished}
                  onClick={() => {
                    const on = toggleWish(product.id);
                    toast(on ? 'Saved to your wishlist' : 'Removed from your wishlist');
                  }}
                >
                  <Icon name="heart" size={16} />
                </motion.button>
              </motion.div>

              <motion.div
                className="pd-assure"
                variants={reduceMotion ? {} : { hidden: { opacity: 0 }, visible: { opacity: 1 } }}
              >
                <div>
                  <Icon name="truck" size={17} />
                  Complimentary
                  <br />
                  insured delivery
                </div>
                <div>
                  <Icon name="shield" size={17} />
                  5-year
                  <br />
                  international warranty
                </div>
                <div>
                  <Icon name="refresh" size={17} />
                  30-day
                  <br />
                  complimentary returns
                </div>
              </motion.div>

              <motion.div
                className="pd-accordion-wrap"
                variants={reduceMotion ? {} : { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
              >
                <Accordion items={accordionItems} />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      <section className="section section-alt">
        <div className="wrap">
          <Reveal className="product-related-heading">
            <SectionHeading
              eyebrow="Continue exploring"
              title={
                <>
                  You may also <span className="italic">admire</span>
                </>
              }
              action={
                <Link className="link-gold" to="/shop">
                  All timepieces <Icon name="arrow" size={14} className="arw" />
                </Link>
              }
            />
          </Reveal>
          <ProductGrid products={related} />
        </div>
      </section>
    </>
  );
}
