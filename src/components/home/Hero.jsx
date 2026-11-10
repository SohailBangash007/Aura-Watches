import { Link } from 'react-router-dom';
import WatchImage from '../WatchImage';
import { useCatalog } from '../../context/CatalogContext';

export default function Hero() {
  const { byId, products } = useCatalog();
  const watch = byId('sovereign-chronograph') || products[0];

  return (
    <section className="hero">
      <div className="wrap">
        <div className="hero-copy">
          <span className="eyebrow">AURA Watches — Est. 2009</span>
          <h1>
            <span className="line">
              <span>Mark the</span>
            </span>
            <span className="line">
              <span>moments</span>
            </span>
            <span className="line">
              <span>
                <em>that matter.</em>
              </span>
            </span>
          </h1>
          <p>
            Thoughtful design. Swiss watchmaking. A timepiece to mark the moments you will remember.
          </p>
          <div className="hero-cta">
            <Link className="btn btn-gold btn-lg" to="/shop">
              Explore the collection
            </Link>
            <Link className="btn btn-lg" to="/about">
              Our story
            </Link>
          </div>
          <div className="hero-meta">
            <div>
              <b>42</b>
              <span>Countries served</span>
            </div>
            <div>
              <b>5</b>
              <span>Year warranty</span>
            </div>
            <div>
              <b>100%</b>
              <span>Swiss assembled</span>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-watch">{watch ? <WatchImage product={watch} /> : null}</div>
          <div className="price-tag">
            <div className="pt-label">A considered collection</div>
            <div className="pt-name">Made to be kept.</div>
            <Link className="pt-link" to="/shop">Discover the watches <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
      </div>
      <div className="hero-scroll"><span className="bar" /> Scroll to discover</div>
    </section>
  );
}
