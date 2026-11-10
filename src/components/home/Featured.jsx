import { Link } from 'react-router-dom';
import SectionHeading from '../ui/SectionHeading';
import Reveal from '../ui/Reveal';
import Icon from '../ui/Icon';
import ProductGrid from '../product/ProductGrid';
import { useCatalog } from '../../context/CatalogContext';

const FEATURED_IDS = [
  'sovereign-chronograph',
  'midnight-diver',
  'emerald-heritage',
  'obsidian-skeleton'
];

export default function Featured() {
  const { products, byId } = useCatalog();
  const featured = FEATURED_IDS.map(byId).filter(Boolean);
  const list = featured.length ? featured : products.slice(0, 4);

  return (
    <section className="section">
      <div className="wrap">
        <Reveal>
          <SectionHeading
            eyebrow="The Edit"
            title={
              <>
                Signature <span className="italic">timepieces</span>
              </>
            }
            text="Four pieces that define the house. Each one assembled, regulated and inspected by hand before it leaves Geneva."
            action={
              <Link className="link-gold" to="/shop">
                View all timepieces <Icon name="arrow" size={14} className="arw" />
              </Link>
            }
          />
        </Reveal>
        <ProductGrid products={list} />
      </div>
    </section>
  );
}
