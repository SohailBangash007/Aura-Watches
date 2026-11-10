import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/format';

export default function PageBanner({
  crumb = [],
  eyebrow,
  title,
  text,
  num,
  className = '',
  children
}) {
  return (
    <section className={cn('page-banner', className)}>
      <div className="wrap">
        <div className="pb-inner">
          {crumb.length ? (
            <div className="crumb">
              {crumb.map((item, i) => (
                <Fragment key={`${item.label}-${i}`}>
                  {i > 0 ? <i>/</i> : null}
                  {item.to ? <Link to={item.to}>{item.label}</Link> : <span>{item.label}</span>}
                </Fragment>
              ))}
            </div>
          ) : null}
          {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
          <h1>{title}</h1>
          {text ? <p>{text}</p> : null}
          {children}
        </div>
      </div>
      {num ? <div className="pb-num">{num}</div> : null}
    </section>
  );
}
