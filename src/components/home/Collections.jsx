import { Link } from 'react-router-dom';
import WatchImage from '../WatchImage';
import SectionHeading from '../ui/SectionHeading';
import Reveal from '../ui/Reveal';
import Icon from '../ui/Icon';
import { useCatalog } from '../../context/CatalogContext';
import { slugify } from '../../lib/format';

const COLLECTIONS = [
  {
    num: '01 / Chronograph',
    title: 'Precision in motion',
    text: 'Three counters, one tachymeter and a movement regulated to the second.',
    id: 'sovereign-chronograph',
    cat: 'Chronograph',
  },
  {
    num: '02 / Diver',
    title: 'Built for depth',
    text: 'Ceramic bezels, 300 metres of water resistance and lume that never quits.',
    id: 'midnight-diver',
    cat: 'Diver',
  },
  {
    num: '03 / Dress',
    title: 'Quiet elegance',
    text: 'Slim cases and lacquered dials, made to disappear beneath a cuff.',
    id: 'ivory-dress',
    cat: 'Dress',
  }
];

export default function Collections() {
  const { byId, products } = useCatalog();

  return (
    <section className="section section-alt">
      <div className="wrap">
        <Reveal>
          <SectionHeading
            center
            eyebrow="The Collections"
            title={
              <>
                Three <span className="italic">disciplines</span>
              </>
            }
            text="Every AURA watch belongs to one of three worlds — precision timing, deep water, or quiet elegance. Choose yours."
          />
        </Reveal>

        <div className="collections">
          {COLLECTIONS.map((collection, i) => {
            const watch = byId(collection.id);
            const count = products.filter((product) => product.cat === collection.cat).length;
            return (
              <Reveal
                as={Link}
                key={collection.cat}
                to={`/collections/${slugify(collection.cat)}`}
                className="coll-card"
                delay={i + 1}
              >
                {watch ? <WatchImage product={watch} /> : null}
                <div className="cc-inner">
                  <div className="cc-num">
                    {collection.num} · {count} {count === 1 ? 'reference' : 'references'}
                  </div>
                  <h3>{collection.title}</h3>
                  <p>{collection.text}</p>
                  <span className="cc-link">
                    Discover the collection <Icon name="arrow" size={14} className="arw" />
                  </span>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
