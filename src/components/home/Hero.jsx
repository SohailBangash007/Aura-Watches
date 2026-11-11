import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import WatchImage from '../WatchImage';
import Counter from '../ui/Counter';
import { useCatalog } from '../../context/CatalogContext';

const EASE = [0.16, 1, 0.3, 1];

export default function Hero() {
  const { byId, products } = useCatalog();
  const watch = byId('sovereign-chronograph') || products[0];
  const reduce = useReducedMotion();
  const stage = useRef(null);

  /* Cursor parallax — the stage drifts gently toward the pointer. */
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 55, damping: 16, mass: 0.7 });
  const sy = useSpring(py, { stiffness: 55, damping: 16, mass: 0.7 });
  const watchX = useTransform(sx, [-0.5, 0.5], [-18, 18]);
  const watchY = useTransform(sy, [-0.5, 0.5], [-11, 11]);
  const ringX = useTransform(sx, [-0.5, 0.5], [12, -12]);
  const ringY = useTransform(sy, [-0.5, 0.5], [8, -8]);
  const haloX = useTransform(sx, [-0.5, 0.5], [-30, 30]);
  const haloY = useTransform(sy, [-0.5, 0.5], [-20, 20]);

  const trackPointer = (event) => {
    if (reduce) return;
    const box = stage.current?.getBoundingClientRect();
    if (!box) return;
    px.set((event.clientX - box.left) / box.width - 0.5);
    py.set((event.clientY - box.top) / box.height - 0.5);
  };
  const resetPointer = () => {
    px.set(0);
    py.set(0);
  };

  /* Masked line reveal for the headline. */
  const line = (i) => ({
    initial: reduce ? false : { y: '112%' },
    animate: { y: '0%' },
    transition: { type: 'spring', stiffness: 64, damping: 17, delay: 0.15 + i * 0.13 }
  });
  const fade = (delay) => reduce
    ? {}
    : {
        initial: { opacity: 0, y: 24 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.9, ease: EASE, delay }
      };

  return (
    <section className="hero hero-center">
      <div className="wrap">
        <div className="hero-copy">
          <motion.span className="eyebrow center" {...fade(0.05)}>
            AURA Watches — Est. 2009
          </motion.span>
          <h1>
            <span className="line">
              <motion.span {...line(0)}>Mark the</motion.span>
            </span>
            <span className="line">
              <motion.span {...line(1)}>moments</motion.span>
            </span>
            <span className="line">
              <motion.span {...line(2)}>
                <em>that matter.</em>
              </motion.span>
            </span>
          </h1>
          <motion.p {...fade(0.5)}>
            Thoughtful design. Swiss watchmaking. A timepiece to mark the moments you will remember.
          </motion.p>
          <motion.div className="hero-cta" {...fade(0.62)}>
            <Link className="btn btn-gold btn-lg" to="/shop">
              Explore the collection
            </Link>
            <Link className="btn btn-lg" to="/about">
              Our story
            </Link>
          </motion.div>
        </div>

        <div
          className="hero-visual"
          ref={stage}
          onMouseMove={trackPointer}
          onMouseLeave={resetPointer}
        >
          <motion.div className="halo" style={reduce ? undefined : { x: haloX, y: haloY }} />
          <motion.div className="ring r1" style={reduce ? undefined : { x: ringX, y: ringY }} />
          <motion.div className="ring r2" style={reduce ? undefined : { x: ringX, y: ringY }} />
          <motion.div className="hero-stage" style={reduce ? undefined : { x: watchX, y: watchY }}>
            <motion.div
              className="hero-float"
              animate={reduce ? undefined : { y: [0, -13, 0] }}
              transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="hero-watch">{watch ? <WatchImage product={watch} /> : null}</div>
            </motion.div>
          </motion.div>
          <motion.div className="price-tag" {...fade(0.55)}>
            <div className="pt-label">A considered collection</div>
            <div className="pt-name">Made to be kept.</div>
            <Link className="pt-link" to="/shop">Discover the watches <span aria-hidden="true">↗</span></Link>
          </motion.div>
        </div>

        <motion.div className="hero-meta" {...fade(0.8)}>
          <div>
            <Counter value={42} />
            <span>Countries served</span>
          </div>
          <div>
            <Counter value={5} />
            <span>Year warranty</span>
          </div>
          <div>
            <Counter value={100} suffix="%" />
            <span>Swiss assembled</span>
          </div>
        </motion.div>
      </div>
      <div className="hero-scroll"><span className="bar" /> Scroll to discover</div>
    </section>
  );
}
