import { useEffect, useRef, useState } from 'react';
import { cn } from '../../lib/format';

/**
 * Scroll-triggered reveal. Adds the `in` class once the element enters
 * the viewport, mirroring the original IntersectionObserver behaviour.
 */
export default function Reveal({
  as: Tag = 'div',
  delay = 0,
  className = '',
  children,
  once = true,
  ...rest
}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            if (once) io.unobserve(entry.target);
          } else if (!once) {
            setInView(false);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [once]);

  return (
    <Tag
      ref={ref}
      className={cn('reveal', inView && 'in', delay ? `delay-${delay}` : '', className)}
      {...rest}
    >
      {children}
    </Tag>
  );
}
