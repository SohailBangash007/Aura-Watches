import { Link } from 'react-router-dom';
import { useCatalog } from '../../context/CatalogContext';
import { useUI } from '../../context/UIContext';
import { cn, slugify } from '../../lib/format';

const LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/shop' },
  { label: 'Collections', to: '/collections' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
  { label: 'Admin dashboard', to: '/admin/login' }
];

export default function MobileMenu() {
  const { menuOpen, closeMenu } = useUI();
  const { categoryNames } = useCatalog();

  return (
    <div className={cn('m-nav', menuOpen && 'open')} aria-hidden={!menuOpen}>
      {LINKS.map((link, i) => (
        <Link className="m-link" key={link.label} to={link.to} onClick={closeMenu}>
          {link.label}
          <span>0{i + 1}</span>
        </Link>
      ))}

      <div className="m-sub">
        {categoryNames.slice(0, 6).map((name) => (
          <Link key={name} to={`/collections/${slugify(name)}`} onClick={closeMenu}>
            {name}
          </Link>
        ))}
      </div>

      <div className="m-foot">
        <Link to="/login" onClick={closeMenu}>Sign in</Link>
        <Link to="/wishlist" onClick={closeMenu}>Wishlist</Link>
        <Link to="/cart" onClick={closeMenu}>Bag</Link>
      </div>
    </div>
  );
}
