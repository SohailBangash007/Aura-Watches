import { useState } from 'react';
import { cn } from '../../lib/format';

export function AccordionItem({ title, children, open, onToggle }) {
  return (
    <div className={cn('acc-item', open && 'open')}>
      <button className="acc-btn" type="button" onClick={onToggle} aria-expanded={open}>
        {title} <span className="pm" aria-hidden="true" />
      </button>
      <div className="acc-panel">
        <div className="ap-in">{children}</div>
      </div>
    </div>
  );
}

/**
 * items: [{ title, content }]
 * single — only one panel open at a time (product page)
 * multiple — independent panels (contact FAQ)
 */
export default function Accordion({
  items = [],
  single = true,
  defaultOpen = 0,
  className = 'acc'
}) {
  const [open, setOpen] = useState(() => {
    if (defaultOpen === null || defaultOpen === undefined) return [];
    return single ? [defaultOpen] : [defaultOpen];
  });

  const toggle = (index) => {
    setOpen((prev) => {
      if (single) return prev.includes(index) ? [] : [index];
      return prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index];
    });
  };

  return (
    <div className={className}>
      {items.map((item, index) => (
        <AccordionItem
          key={item.title || index}
          title={item.title}
          open={open.includes(index)}
          onToggle={() => toggle(index)}
        >
          {item.content}
        </AccordionItem>
      ))}
    </div>
  );
}
