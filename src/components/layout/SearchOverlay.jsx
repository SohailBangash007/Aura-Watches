import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import WatchImage from '../WatchImage';
import Icon from '../ui/Icon';
import { useCatalog } from '../../context/CatalogContext';
import { useUI } from '../../context/UIContext';
import { cn, money, slugify } from '../../lib/format';

const POPULAR = ['Chronograph', 'Diver', 'Skeleton'];

export default function SearchOverlay() {
  const { searchOpen, closeSearch } = useUI();
  const { products } = useCatalog();
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (!searchOpen) return;
    setQuery('');
    const timer = setTimeout(() => inputRef.current?.focus(), 220);
    return () => clearTimeout(timer);
  }, [searchOpen]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return products
      .filter((p) =>
        `${p.name} ${p.cat} ${p.metal} ${p.style}`.toLowerCase().includes(q)
      )
      .slice(0, 6);
  }, [products, query]);

  return (
    <div className={cn('search-modal', searchOpen && 'open')} aria-hidden={!searchOpen}>
      <div className="sm-inner">
        <div className="sm-head">
          <span>Search the collection</span>
          <button className="sm-close" type="button" onClick={closeSearch} aria-label="Close search">
            <Icon name="close" size={16} />
          </button>
        </div>

        <div className="sm-field">
          <Icon name="search" size={20} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Try “diver”, “gold” or “chronograph”"
            autoComplete="off"
            aria-label="Search timepieces"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && results[0]) {
                closeSearch();
                window.location.assign(`/product/${results[0].id}`);
              }
            }}
          />
        </div>

        <div className="sm-hint">
          Popular —{' '}
          {POPULAR.map((cat, i) => (
            <span key={cat}>
              {i > 0 ? ' · ' : ''}
              <Link
                to={`/collections/${slugify(cat)}`}
                style={{ color: 'var(--gold-bright)' }}
                onClick={closeSearch}
              >
                {cat}
              </Link>
            </span>
          ))}
        </div>

        <div className="sm-results">
          {query.trim() && !results.length ? (
            <div className="sm-empty">
              No timepieces match “{query.trim()}”. Try “chronograph”, “gold” or “diver”.
            </div>
          ) : null}

          {results.map((p) => (
            <Link className="sm-row" key={p.id} to={`/product/${p.id}`} onClick={closeSearch}>
              <span className="sm-img">
                <WatchImage product={p} />
              </span>
              <span>
                <span className="sm-name">{p.name}</span>
                <span className="sm-cat">
                  {p.cat} · {p.metal}
                </span>
              </span>
              <span className="sm-price">{money(p.price)}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
