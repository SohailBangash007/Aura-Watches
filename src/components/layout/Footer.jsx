import { Link } from 'react-router-dom';
import Logo from '../ui/Logo';
import Icon from '../ui/Icon';
import { useCatalog } from '../../context/CatalogContext';
import { slugify } from '../../lib/format';

const SOCIALS = [
  { name: 'instagram', label: 'Instagram' },
  { name: 'facebook', label: 'Facebook' },
  { name: 'x', label: 'X' },
  { name: 'pinterest', label: 'Pinterest' }
];

export default function Footer() {
  const { categoryNames } = useCatalog();
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-top">
          <div className="footer-brand">
            <Logo as={Link} to="/" aria-label="AURA Watches — home" />
            <p>
              Independent watchmaking since 2009. Designed in Geneva, assembled by hand, delivered
              to collectors in 42 countries.
            </p>
            <div className="socials">
              {SOCIALS.map((s) => (
                <a key={s.name} href="#" aria-label={s.label} onClick={(e) => e.preventDefault()}>
                  <Icon name={s.name} size={15} />
                </a>
              ))}
            </div>
          </div>

          <div className="fcol">
            <h5>Collections</h5>
            <ul>
              {categoryNames.slice(0, 5).map((name) => (
                <li key={name}>
                  <Link to={`/collections/${slugify(name)}`}>{name}</Link>
                </li>
              ))}
              <li>
                <Link to="/collections">All Collections</Link>
              </li>
            </ul>
          </div>

          <div className="fcol">
            <h5>Client Services</h5>
            <ul>
              <li>
                <Link to="/contact">Contact Us</Link>
              </li>
              <li>
                <Link to="/contact#faq">Shipping &amp; Returns</Link>
              </li>
              <li>
                <Link to="/contact#faq">Care &amp; Servicing</Link>
              </li>
              <li>
                <Link to="/about">Our Warranty</Link>
              </li>
              <li>
                <Link to="/wishlist">My Wishlist</Link>
              </li>
              <li>
                <Link to="/login">My Account</Link>
              </li>
            </ul>
          </div>

          <div className="fcol">
            <h5>The Atelier</h5>
            <div className="contact-line">
              <Icon name="pin" size={16} />
              <span>
                12 Rue du Rhône,
                <br />
                1204 Geneva, Switzerland
              </span>
            </div>
            <div className="contact-line">
              <Icon name="phone" size={16} />
              <span>
                <a href="tel:+41225550190">+41 22 555 0190</a>
              </span>
            </div>
            <div className="contact-line">
              <Icon name="mail" size={16} />
              <span>
                <a href="mailto:clients@metra.watch">clients@metra.watch</a>
              </span>
            </div>
            <div className="contact-line">
              <Icon name="clock" size={16} />
              <span>Mon – Sat, 10:00 – 19:00 CET</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {year} AURA Watches. All rights reserved.</p>
          <div className="fb-links">
            <a href="#" onClick={(e) => e.preventDefault()}>Privacy</a>
            <a href="#" onClick={(e) => e.preventDefault()}>Terms</a>
            <a href="#" onClick={(e) => e.preventDefault()}>Cookies</a>
          </div>
          <div className="pay">
            <span>VISA</span>
            <span>MASTERCARD</span>
            <span>AMEX</span>
            <span>PAYPAL</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
