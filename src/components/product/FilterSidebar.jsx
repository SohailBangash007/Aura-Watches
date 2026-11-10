import { cn, money } from '../../lib/format';

export default function FilterSidebar({
  categories = [],
  metals = [],
  maxPrice = 3500,
  minPrice = 900,
  state,
  onToggleCat,
  onToggleMetal,
  onPrice,
  onLimited,
  onClear,
  open = false
}) {
  return (
    <aside className={cn('filters', open && 'open')} aria-label="Filters">
      <div className="filter-heading">
        <span className="eyebrow">Refine your edit</span>
        <p>Choose a collection, material or price to find your timepiece.</p>
      </div>
      <div className="f-block">
        <h4>Collection</h4>
        <ul className="f-list">
          {categories.map((cat) => (
            <li key={cat.name}>
              <label>
                <span className="fl-name">
                  <input
                    type="checkbox"
                    value={cat.name}
                    checked={state.cats.includes(cat.name)}
                    onChange={() => onToggleCat(cat.name)}
                  />
                  {cat.name}
                </span>
                <span className="cnt">{cat.count}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      <div className="f-block">
        <h4>Case metal</h4>
        <div className="swatches">
          {metals.map((metal) => (
            <button
              key={metal.key}
              className={cn('sw', state.metals.includes(metal.key) && 'active')}
              type="button"
              title={metal.label}
              aria-label={metal.label}
              aria-pressed={state.metals.includes(metal.key)}
              style={{ background: metal.color }}
              onClick={() => onToggleMetal(metal.key)}
            />
          ))}
        </div>
      </div>

      <div className="f-block">
        <h4>Price</h4>
        <div className="range-wrap">
          <div className="range-val">
            <span>Up to</span>
            <b>{money(state.max)}</b>
          </div>
          <input
            type="range"
            min={minPrice}
            max={maxPrice}
            step="50"
            value={state.max}
            onChange={(e) => onPrice(Number(e.target.value))}
            aria-label="Maximum price"
          />
        </div>
      </div>

      <div className="f-block">
        <h4>Availability</h4>
        <label className="check" style={{ marginBottom: 10 }}>
          <input type="checkbox" checked disabled /> In stock
        </label>
        <label className="check">
          <input type="checkbox" checked={state.limited} onChange={(e) => onLimited(e.target.checked)} />
          Limited editions only
        </label>
      </div>

      <div className="f-block" style={{ borderBottom: 0 }}>
        <button className="btn btn-sm btn-block" type="button" onClick={onClear}>
          Clear all filters
        </button>
      </div>
    </aside>
  );
}
