export default function WatchImage({ product, className = 'watch-svg', style }) {
  if (!product?.image) return null;

  return (
    <img
      className={className}
      style={style}
      src={product.image}
      alt={`Representative photo of the ${product.name} ${product.cat.toLowerCase()} watch`}
      loading="lazy"
      decoding="async"
    />
  );
}
