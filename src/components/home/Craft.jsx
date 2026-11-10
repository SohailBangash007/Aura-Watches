import { Link } from 'react-router-dom';
import WatchImage from '../WatchImage';
import Reveal from '../ui/Reveal';
import { useCatalog } from '../../context/CatalogContext';

const CRAFT = [
  {
    num: '01',
    title: 'Hand-finished movements',
    text: 'Swiss automatic calibres, regulated in five positions and finished with Côtes de Genève.'
  },
  {
    num: '02',
    title: 'Sapphire, front and back',
    text: 'Anti-reflective crystal on both sides, so the movement is as legible as the dial.'
  },
  {
    num: '03',
    title: 'Assembled in Geneva',
    text: 'Each timepiece is built, tested and signed by a single watchmaker — never a production line.'
  }
];

export default function Craft() {
  const { byId, products } = useCatalog();
  const watch = byId('obsidian-skeleton') || products[0];

  return (
    <section className="section">
      <div className="wrap">
        <div className="split">
          <Reveal className="split-visual">
            <div className="frame">{watch ? <WatchImage product={watch} /> : null}</div>
            <span className="tag">Est. 2009 · Geneva</span>
          </Reveal>

          <div className="as-copy">
            <span className="eyebrow reveal in">Inside the atelier</span>
            <Reveal delay={1}>
              <h2>
                Nothing is rushed.
                <br />
                Nothing is <span className="italic">ordinary.</span>
              </h2>
            </Reveal>
            <Reveal as="p" className="lead" delay={2}>
              Our watchmakers assemble no more than eight movements a day. Bridges are bevelled by
              hand, screws are polished, and every dial is inspected under magnification before it is
              cased.
            </Reveal>

            <div className="craft-list">
              {CRAFT.map((item, i) => (
                <Reveal className="craft-item" key={item.num} delay={i + 1}>
                  <span className="ci-num">{item.num}</span>
                  <div>
                    <h4>{item.title}</h4>
                    <p>{item.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal style={{ marginTop: 34 }} delay={3}>
              <Link className="btn" to="/about">
                Discover the maison
              </Link>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
