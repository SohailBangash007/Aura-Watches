import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import PageBanner from '../components/ui/PageBanner';
import Reveal from '../components/ui/Reveal';
import WatchImage from '../components/WatchImage';
import Icon from '../components/ui/Icon';
import { useCatalog } from '../context/CatalogContext';
import { money, slugify } from '../lib/format';

export default function CollectionsPage() {
  const { categories, products } = useCatalog();
  const [query, setQuery] = useState('');

  const collections = useMemo(
    () =>
      categories
        .map(({ name }) => {
          const models = products.filter((product) => product.cat === name);
          return {
            name,
            models,
            count: models.length,
            startingAt: Math.min(...models.map((product) => product.price))
          };
        })
        .filter((collection) => collection.name.toLowerCase().includes(query.trim().toLowerCase())),
    [categories, products, query]
  );

  return (
    <>
      <PageBanner
        crumb={[{ label: 'Home', to: '/' }, { label: 'Collections' }]}
        eyebrow="The AURA edit · Geneva"
        title={<>Find your <span className="italic">discipline.</span></>}
        text="Explore the full house of timepieces, from measured chronographs to quiet dress watches. Each collection brings together its own character, materials and movement."
        num="02"
      />

      <section className="section collection-index">
        <div className="wrap">
          <div className="collection-intro">
            <div>
              <span className="eyebrow">A considered catalogue</span>
              <h2>One house. <span className="italic">Many expressions.</span></h2>
            </div>
            <p>
              Start with a discipline that suits your day. Open any collection to see its featured
              reference and related pieces selected from across the AURA catalogue.
            </p>
          </div>

          <div className="collection-toolbar">
            <label className="collection-search">
              <Icon name="search" size={16} />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Find a collection"
                aria-label="Find a collection"
              />
            </label>
            <span>{collections.length} {collections.length === 1 ? 'collection' : 'collections'}</span>
          </div>

          {collections.length ? (
            <div className="collection-index-grid">
              {collections.map((collection, index) => {
                const lead = collection.models[0];
                return (
                  <Reveal
                    as={Link}
                    className="collection-index-card"
                    key={collection.name}
                    to={`/collections/${slugify(collection.name)}`}
                    delay={(index % 4) + 1}
                  >
                    <div className="collection-index-image">
                      {lead ? <WatchImage product={lead} /> : null}
                      <span className="ci-index">{String(index + 1).padStart(2, '0')}</span>
                      <span className="ci-count">{collection.count} {collection.count === 1 ? 'reference' : 'references'}</span>
                    </div>
                    <div className="collection-index-copy">
                      <div>
                        <span className="ci-kicker">The collection</span>
                        <h3>{collection.name}</h3>
                      </div>
                      <span className="ci-price">From {money(collection.startingAt)}</span>
                      <span className="ci-link">Explore collection <Icon name="arrow" size={15} /></span>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          ) : (
            <div className="empty-state collection-empty">
              <h3>No matching collection</h3>
              <p>Try a different search, or return to the complete AURA edit.</p>
              <button className="btn btn-ghost" type="button" onClick={() => setQuery('')}>Show all collections</button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
