import { cn } from '../../lib/format';

export function LogoMark({ className = 'brand-mark' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="32" cy="32" r="30.5" stroke="currentColor" strokeWidth="1" />
      <path d="M32 13.5l2.4 3.6-2.4 3.6-2.4-3.6z" fill="currentColor" />
      <path
        d="M19.5 45.5V28.8L32 39.2l12.5-10.4v16.7"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path d="M19.5 50.5h25" stroke="currentColor" strokeWidth=".7" opacity=".45" />
    </svg>
  );
}

/**
 * AURA Watches wordmark. Renders a <span> by default; pass `as={Link}` and `to="/"`
 * in the header/footer to make it a navigable brand lock-up.
 */
export default function Logo({
  showText = true,
  className = '',
  markClassName = 'brand-mark',
  as: Tag = 'span',
  ...rest
}) {
  return (
    <Tag className={cn('brand', className)} {...rest}>
      <LogoMark className={markClassName} />
      {showText ? (
        <span className="brand-text">
          <span className="bt-top">Swiss Watchmaking</span>
          <span className="bt-main">
            AURA<b>.</b>
          </span>
          <span className="bt-sub">Watches</span>
        </span>
      ) : null}
    </Tag>
  );
}
