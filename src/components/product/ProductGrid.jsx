import ProductCard from './ProductCard';

export default function ProductGrid({ products = [], empty, className = '' }) {
  if (!products.length) {
    return (
      <div className={`grid-products ${className}`.trim()}>
        {empty || (
          <div className="empty-state">
            <h3>No timepieces found</h3>
            <p>Try widening your filters, or browse the full collection.</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`grid-products ${className}`.trim()}>
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} index={index} />
      ))}
    </div>
  );
}
