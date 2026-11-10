import { Link } from 'react-router-dom';

export default function Topbar() {
  return (
    <div className="topbar">
      <div className="wrap">
        <div className="tb-left">Complimentary worldwide shipping over $500</div>
        <div className="tb-mid">
          <span className="dot" /> Handcrafted in Switzerland <span className="dot" />
        </div>
        <div className="tb-links">
          <Link to="/contact">Client Care</Link>
          <Link to="/about">Our Maison</Link>
          <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
