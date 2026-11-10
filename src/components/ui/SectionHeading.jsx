import { cn } from '../../lib/format';

export default function SectionHeading({
  eyebrow,
  title,
  text,
  center = false,
  action,
  className = ''
}) {
  return (
    <div className={cn('section-head', center && 'center', className)}>
      <div className="titles">
        {eyebrow ? <span className={cn('eyebrow', center && 'center')}>{eyebrow}</span> : null}
        <h2>{title}</h2>
        {text ? <p>{text}</p> : null}
      </div>
      {action}
    </div>
  );
}
