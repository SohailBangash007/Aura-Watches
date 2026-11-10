import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import PageBanner from '../components/ui/PageBanner';
import FilterSidebar from '../components/product/FilterSidebar';
import ProductGrid from '../components/product/ProductGrid';
import Reveal from '../components/ui/Reveal';
import Icon from '../components/ui/Icon';
import { useCatalog } from '../context/CatalogContext';
import { cn, money } from '../lib/format';

const PAGE_SIZE = 8;

const SORTS = [
  { value: 'featured', label: 'Sort: Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'name', label: 'Name A–Z' }
];

const initialFilters = {
  cats: [],
  metals: [],
  max: 0,
  limited: false
};

function sortList(list, sort) {
  const out = [...list];
  switch (sort) {
    case 'price-asc':
      return out.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return out.sort((a, b) => b.price - a.price);
    case 'rating':
      return out.sort((a, b) => b.rating - a.rating);
    case 'name':
      return out.sort((a, b) => a.name.localeCompare(b.name));
    default:
      return out;
  }
}

export default function Shop() {
  const { products, categories, metals, priceRange } = useCatalog();
  const location = useLocation();

  const maxPrice = priceRange.max || 3500;
  const minPrice = priceRange.min || 900;

  const [filters, setFilters] = useState({ ...initialFilters, max: maxPrice });
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('featured');
  const [shown, setShown] = useState(PAGE_SIZE);
  const [filtersOpen, setFiltersOpen] = useState(false);

  /* react to ?cat= changes coming from the header / footer / collections */
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat = params.get('cat');
    setFilters((prev) => ({
      ...prev,
      cats: cat ? [cat] : [],
      max: prev.max || maxPrice
    }));
    setShown(PAGE_SIZE);
  }, [location.search, maxPrice]);

  const toggleCat = (name) => {
    setFilters((prev) => ({
      ...prev,
      cats: prev.cats.includes(name)
        ? prev.cats.filter((c) => c !== name)
        : [...prev.cats, name]
    }));
    setShown(PAGE_SIZE);
  };

  const toggleMetal = (key) => {
    setFilters((prev) => ({
      ...prev,
      metals: prev.metals.includes(key)
        ? prev.metals.filter((m) => m !== key)
        : [...prev.metals, key]
    }));
    setShown(PAGE_SIZE);
  };

  const clear = () => {
    setFilters({ ...initialFilters, max: maxPrice });
    setSearch('');
    setSort('featured');
    setShown(PAGE_SIZE);
  };

  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase();
    const list = products.filter((p) => {
      if (filters.cats.length && !filters.cats.includes(p.cat)) return false;
      if (filters.metals.length && !filters.metals.includes(p.metal)) return false;
      if (filters.max && p.price > filters.max) return false;
      if (filters.limited && p.badge !== 'Limited') return false;
      if (needle) {
        const hay = `${p.name} ${p.cat} ${p.metal} ${p.style} ${p.desc}`.toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });
    return sortList(list, sort);
  }, [products, filters, search, sort]);

  const visible = filtered.slice(0, shown);
  const activeCount =
    filters.cats.length +
    filters.metals.length +
    (filters.limited ? 1 : 0) +
    (filters.max < maxPrice ? 1 : 0);

  const hasSelection = Boolean(activeCount || search.trim());
  const recommendations = useMemo(() => {
    if (!hasSelection || filtered.length >= 4) return [];

    const categoryModels = products.filter((product) => filters.cats.includes(product.cat));
    const relatedStyles = new Set(categoryModels.map((product) => product.style));
    const relatedMetals = new Set(categoryModels.map((product) => product.metal));
    const shownIds = new Set(filtered.map((product) => product.id));
    const score = (product) =>
      Number(relatedStyles.has(product.style)) * 3 +
      Number(relatedMetals.has(product.metal)) * 2 +
      Number(filters.metals.includes(product.metal)) * 2 +
      Number(product.price <= filters.max) +
      product.rating / 10;

    return products
      .filter((product) => !shownIds.has(product.id))
      .sort((a, b) => score(b) - score(a))
      .slice(0, 4 - filtered.length);
  }, [hasSelection, filtered, products, filters]);

  const metalLabel = (key) => metals.find((m) => m.key === key)?.label || key;

  return (
    <>
      <PageBanner
        crumb={[{ label: 'Home', to: '/' }, { label: 'Collection' }]}
        eyebrow={`${products.length} references · 2026`}
        title={
          <>
            The <span className="italic">collection</span>
          </>
        }
        text="Every AURA watch is assembled in Geneva and regulated by hand. Filter by discipline, metal or price to find the piece that belongs on your wrist."
        num="01"
      />

      <section className="section">
        <div className="wrap">
          <div className="shop-layout">
            <FilterSidebar
              categories={categories}
              metals={metals}
              maxPrice={maxPrice}
              minPrice={minPrice}
              state={filters}
              open={filtersOpen}
              onToggleCat={toggleCat}
              onToggleMetal={toggleMetal}
              onPrice={(value) => {
                setFilters((prev) => ({ ...prev, max: value }));
                setShown(PAGE_SIZE);
              }}
              onLimited={(value) => {
                setFilters((prev) => ({ ...prev, limited: value }));
                setShown(PAGE_SIZE);
              }}
              onClear={clear}
            />

            <div>
              <div className="shop-toolbar">
                <div className="res">
                  <b>{filtered.length}</b> {filtered.length === 1 ? 'timepiece' : 'timepieces'}
                </div>
                <div className="tool-right">
                  <div className="shop-search">
                    <Icon name="search" size={14} />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value);
                        setShown(PAGE_SIZE);
                      }}
                      placeholder="Search the collection"
                      aria-label="Search timepieces"
                    />
                  </div>
                  <div className="select-wrap">
                    <select
                      className="select"
                      value={sort}
                      onChange={(e) => setSort(e.target.value)}
                      aria-label="Sort products"
                    >
                      {SORTS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    className="btn btn-sm filters-toggle"
                    type="button"
                    onClick={() => setFiltersOpen((open) => !open)}
                  >
                    Filters{activeCount ? ` (${activeCount})` : ''}
                  </button>
                </div>
              </div>

              <div className="chips">
                {filters.cats.map((cat) => (
                  <span className="chip" key={`cat-${cat}`}>
                    {cat}
                    <button type="button" onClick={() => toggleCat(cat)} aria-label={`Remove ${cat} filter`}>
                      ×
                    </button>
                  </span>
                ))}
                {filters.metals.map((metal) => (
                  <span className="chip" key={`metal-${metal}`}>
                    {metalLabel(metal)}
                    <button
                      type="button"
                      onClick={() => toggleMetal(metal)}
                      aria-label={`Remove ${metalLabel(metal)} filter`}
                    >
                      ×
                    </button>
                  </span>
                ))}
                {filters.limited ? (
                  <span className="chip">
                    Limited editions
                    <button
                      type="button"
                      onClick={() => setFilters((prev) => ({ ...prev, limited: false }))}
                      aria-label="Remove limited editions filter"
                    >
                      ×
                    </button>
                  </span>
                ) : null}
                {filters.max < maxPrice ? (
                  <span className="chip">
                    Up to {money(filters.max)}
                    <button
                      type="button"
                      onClick={() => setFilters((prev) => ({ ...prev, max: maxPrice }))}
                      aria-label="Remove price filter"
                    >
                      ×
                    </button>
                  </span>
                ) : null}
                {search.trim() ? (
                  <span className="chip">
                    “{search.trim()}”
                    <button type="button" onClick={() => setSearch('')} aria-label="Clear search">
                      ×
                    </button>
                  </span>
                ) : null}
                {activeCount || search.trim() ? (
                  <button className={cn('chip', 'chip-clear')} type="button" onClick={clear}>
                    Clear all
                  </button>
                ) : null}
              </div>

              <ProductGrid products={visible} className="product-grid-wide" />

              {recommendations.length ? (
                <section className="filter-recommendations" aria-labelledby="filter-recommendations-title">
                  <div className="recommendations-head">
                    <span className="eyebrow">{filtered.length ? 'Keep exploring' : 'A considered edit'}</span>
                    <h2 id="filter-recommendations-title">
                      {filtered.length ? 'Related timepieces' : 'Pieces to discover'}
                    </h2>
                    <p>
                      {filtered.length
                        ? 'A few related references from the wider AURA collection, shown alongside your exact matches.'
                        : 'No exact matches for this combination yet. Here are four considered references to keep exploring.'}
                    </p>
                  </div>
                  <ProductGrid products={recommendations} className="product-grid-wide" />
                </section>
              ) : null}

              {shown < filtered.length ? (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 46 }}>
                  <button
                    className="btn btn-ghost"
                    type="button"
                    onClick={() => setShown((n) => n + PAGE_SIZE)}
                  >
                    Load more timepieces
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="section-tight">
        <div className="wrap">
          <Reveal className="stats">
            <div className="stat">
              <b>Free</b>
              <span>Worldwide shipping</span>
            </div>
            <div className="stat">
              <b>5 yr</b>
              <span>International warranty</span>
            </div>
            <div className="stat">
              <b>30 d</b>
              <span>Complimentary returns</span>
            </div>
            <div className="stat">
              <b>Swiss</b>
              <span>Assembled by hand</span>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
