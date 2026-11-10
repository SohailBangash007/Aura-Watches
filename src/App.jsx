import { Route, Routes } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ScrollToTop from './components/layout/ScrollToTop';
import Account from './pages/Account';
import About from './pages/About';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Contact from './pages/Contact';
import Category from './pages/Category';
import CollectionsPage from './pages/Collections';
import Home from './pages/Home';
import Product from './pages/Product';
import Shop from './pages/Shop';
import Wishlist from './pages/Wishlist';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminGuard from './pages/admin/AdminGuard';
import PageBanner from './components/ui/PageBanner';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <PageBanner
      crumb={[{ label: 'Home', to: '/' }, { label: 'Not found' }]}
      eyebrow="A misplaced timepiece"
      title="This page isn't here."
      text="The address may have changed, or the page may no longer be available."
    >
      <Link className="btn btn-gold" to="/shop" style={{ marginTop: 24 }}>
        Explore the collection
      </Link>
    </PageBanner>
  );
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="admin/login" element={<AdminLogin />} />
        <Route path="admin" element={<AdminGuard />}>
          <Route index element={<AdminDashboard />} />
        </Route>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="shop" element={<Shop />} />
          <Route path="collections" element={<CollectionsPage />} />
          <Route path="collections/:slug" element={<Category />} />
          <Route path="category/:slug" element={<Category />} />
          <Route path="product/:id" element={<Product />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="login" element={<Account />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}
