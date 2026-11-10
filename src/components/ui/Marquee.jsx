export default function Marquee({
  items = [
    'Swiss Automatic Movements',
    'Sapphire Crystal',
    'Hand-Finished Cases',
    'Five-Year Warranty',
    'Complimentary Shipping',
    'Made in Geneva',
    'Limited Editions',
    'Lifetime Servicing'
  ]
}) {
  const row = items.map((text) => (
    <span key={text}>
      {text}
      <i aria-hidden="true">◆</i>
    </span>
  ));

  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {row}
        {row.map((node, i) => (
          <span key={`dup-${i}`}>
            {items[i]}
            <i>◆</i>
          </span>
        ))}
      </div>
    </div>
  );
}
