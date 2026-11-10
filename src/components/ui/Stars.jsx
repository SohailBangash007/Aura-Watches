import { cn } from '../../lib/format';

export default function Stars({ rating = 5, className = '' }) {
  const full = Math.round(rating);
  return (
    <span className={cn('stars', className)} aria-label={`${rating} out of 5`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} viewBox="0 0 24 24" style={{ opacity: i < full ? 1 : 0.22 }} aria-hidden="true">
          <path d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.3 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8z" />
        </svg>
      ))}
    </span>
  );
}
