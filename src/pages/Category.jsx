import { Link, useParams } from 'react-router-dom';
import PageBanner from '../components/ui/PageBanner';
import ProductGrid from '../components/product/ProductGrid';
import SectionHeading from '../components/ui/SectionHeading';
import { useCatalog } from '../context/CatalogContext';
import { slugify } from '../lib/format';

const CATEGORY_COPY = {
  Chronograph: 'Purposeful timing, balanced counters and a precise instrument feel, finished for everyday wear.',
  Diver: 'Robust cases and clear, legible dials designed to move easily between open water and the city.',
  Dress: 'Refined proportions, considered dials and an understated profile for a more formal pace.',
  Skeleton: 'Open-worked architecture that places the movement and its finishing at the centre.',
  GMT: 'A practical second time zone for journeys that keep home and elsewhere in view.',
  Classic: 'Quietly versatile references with the clarity and balance of enduring watch design.',
  Sport: 'Comfortable, purposeful timepieces made for active days and changing plans.',
  Heritage: 'Archive-inspired details reinterpreted with contemporary proportions and materials.',
  Minimal: 'A study in restraint: crisp markers, clean lines and nothing that does not need to be there.',
  Moonphase: 'A poetic complication with a measured, modern approach to the lunar display.',
  Pilot: 'Highly legible, instrument-led design inspired by the cockpit and built for daily use.'
};

export default function Category() {
  const { slug } = useParams();
  const { categories, products } = useCatalog();
  const category = categories.find((item) => slugify(item.name) === slug)?.name;
  const categoryIndex = categories.findIndex((item) => item.name === category);

  if (!category) {
    return (
      <PageBanner
        crumb={[{ label: 'Home', to: '/' }, { label: 'Collections', to: '/collections' }, { label: 'Collection not found' }]}
        eyebrow="A reference to explore"
        title={<>This collection <span className="italic">has moved.</span></>}
        text="Browse the current AURA Watches catalogue and choose another collection."
      >
        <Link className="btn btn-gold" to="/collections" style={{ marginTop: 24 }}>Browse all collections</Link>
      </PageBanner>
    );
  }

  const matching = products.filter((product) => product.cat === category);
  const lead = matching[0];
  const movements = [...new Set(matching.map((product) => product.specs?.Movement?.split(',')[0]?.trim()).filter(Boolean))];
  const averageRating = matching.reduce((total, product) => total + product.rating, 0) / matching.length;
  const lowestPrice = Math.min(...matching.map((product) => product.price));
  const ids = new Set(matching.map((product) => product.id));
  const styles = new Set(matching.map((product) => product.style));
  const metals = new Set(matching.map((product) => product.metal));
  const recommendations = products
    .filter((product) => !ids.has(product.id))
    .sort((a, b) => {
      const score = (product) =>
        Number(styles.has(product.style)) * 2 +
        Number(metals.has(product.metal)) * 2 +
        product.rating / 10;
      return score(b) - score(a);
    })
    .slice(0, Math.max(0, 4 - matching.length));

  return (
    <>
      <PageBanner
        crumb={[
          { label: 'Home', to: '/' },
          { label: 'Collections', to: '/collections' },
          { label: category }
        ]}
        eyebrow={`Collection ${String(categoryIndex + 1).padStart(2, '0')} · AURA Geneva`}
        title={<>{category} <span className="italic">timepieces.</span></>}
        text={CATEGORY_COPY[category] || `Discover the ${category.toLowerCase()} references in the AURA collection, individually selected for considered design and everyday wear.`}
        num={String(categoryIndex + 1).padStart(2, '0')}
      />

      <section className="section category-page">
        <div className="wrap">
          <div className="category-intro">
            <div>
              <span className="eyebrow">Selected references</span>
              <h2>Made to be <span className="italic">worn.</span></h2>
            </div>
            <p>
              {CATEGORY_COPY[category] || `Discover the ${category.toLowerCase()} references in the AURA collection.`}
              {' '}Compare case proportions, movement and strap details across every available model.
            </p>
          </div>
          <div className="category-facts">
            <div><span>In this collection</span><b>{matching.length} {matching.length === 1 ? 'reference' : 'references'}</b></div>
            <div><span>Starting from</span><b>{`$${lowestPrice.toLocaleString('en-US')}`}</b></div>
            <div><span>Collector rating</span><b>{averageRating.toFixed(1)} / 5 <i>· {matching.reduce((n, product) => n + product.reviews, 0)} reviews</i></b></div>
            <div><span>Movement selection</span><b>{movements.length > 1 ? `${movements.length} movement types` : movements[0] || lead.cat}</b></div>
          </div>
          <ProductGrid products={matching} className="product-grid-wide" />
        </div>
      </section>

      {recommendations.length ? (
        <section className="section section-alt category-related">
          <div className="wrap">
            <SectionHeading
              eyebrow="The wider house"
              title={<>More to <span className="italic">discover.</span></>}
              text="A small edit of related AURA references, selected by design, material and movement."
              action={<Link className="link-gold" to="/collections">All collections</Link>}
            />
            <ProductGrid products={recommendations} className="product-grid-wide" />
          </div>
        </section>
      ) : null}
    </>
  );
}
