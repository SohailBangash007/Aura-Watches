import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from '../ui/Logo';
import Icon from '../ui/Icon';
import { useCatalog } from '../../context/CatalogContext';
import { useStore } from '../../context/StoreContext';
import { useUI } from '../../context/UIContext';
import { cn, slugify } from '../../lib/format';

const NAV = [
  { label: 'Home', to: '/', page: 'home' },
  { label: 'Shop', to: '/shop', page: 'shop' },
  { label: 'Collections', to: '/collections', page: 'collections', drop: true },
  { label: 'About', to: '/about', page: 'about' },
  { label: 'Contact', to: '/contact', page: 'contact' },
  { label: 'Admin', to: '/admin/login', page: 'admin' }
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState(() => {
    try {
      // The dark atelier is the house presentation; the light salon stays a choice.
      return localStorage.getItem('metra:theme:v2') === 'light' ? 'light' : 'dark';
    } catch {
      return 'dark';
    }
  });
  const { categories } = useCatalog();
  const { cartCount, wishCount } = useStore();
  const { openCart, openSearch, openMenu, menuOpen } = useUI();
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem('metra:theme:v2', theme);
    } catch {
      // Keep the selected theme for this page even when storage is unavailable.
    }
  }, [theme]);

  const activePage = pathname.startsWith('/shop') || pathname.startsWith('/product')
    ? 'shop'
    : pathname.startsWith('/collections') || pathname.startsWith('/category')
      ? 'collections'
    : pathname.startsWith('/admin')
      ? 'admin'
    : pathname === '/'
      ? 'home'
      : pathname.slice(1).split('/')[0];

  return (
    <header className={cn('site-header', scrolled && 'scrolled')}>
      <div className="wrap">
        <Logo as={Link} to="/" aria-label="AURA Watches — home" />

        <nav aria-label="Main">
          <ul className="nav">
            {NAV.map((item) =>
              item.drop ? (
                <li key={item.label}>
                  <Link to={item.to} className={activePage === item.page ? 'active' : ''}>
                    {item.label} <i className="caret" />
                  </Link>
                  <div className="dropdown">
                    <div className="dd-head">Our Collections</div>
                    {categories.map((cat) => (
                      <Link key={cat.name} to={`/collections/${slugify(cat.name)}`}>
                        {cat.name}
                        <span>View</span>
                      </Link>
                    ))}
                    <Link className="dd-all" to="/shop">
                      Browse all timepieces <Icon name="arrow" size={14} />
                    </Link>
                  </div>
                </li>
              ) : (
                <li key={item.label}>
                  <Link to={item.to} className={activePage === item.page ? 'active' : ''}>
                    {item.label}
                  </Link>
                </li>
              )
            )}
          </ul>
        </nav>

        <div className="h-actions">
          <button
            className="icon-btn theme-toggle"
            type="button"
            onClick={() => setTheme((current) => current === 'light' ? 'dark' : 'light')}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
            aria-pressed={theme === 'dark'}
          >
            <Icon name={theme === 'light' ? 'moon' : 'sun'} size={18} />
          </button>

          <button className="icon-btn" type="button" onClick={openSearch} aria-label="Search">
            <Icon name="search" size={18} />
          </button>

          <Link className="icon-btn hide-sm" to="/wishlist" aria-label="Wishlist">
            <Icon name="heart" size={18} />
            <span className={cn('badge-count', wishCount > 0 && 'show')}>{wishCount}</span>
          </Link>

          <div className="h-div hide-sm" />

          <Link className="icon-btn hide-xs" to="/login" aria-label="Account">
            <Icon name="user" size={18} />
          </Link>

          <button
            className="icon-btn"
            type="button"
            onClick={openCart}
            aria-label={`Shopping bag, ${cartCount} item${cartCount === 1 ? '' : 's'}`}
          >
            <Icon name="bag" size={18} />
            <span className={cn('badge-count', cartCount > 0 && 'show')}>{cartCount}</span>
          </button>

          <button
            className={cn('burger', menuOpen && 'open')}
            type="button"
            onClick={openMenu}
            aria-label="Open menu"
            aria-expanded={menuOpen}
          >
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  );
}
