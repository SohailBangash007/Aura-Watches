import { Outlet } from 'react-router-dom';
import Topbar from './Topbar';
import Header from './Header';
import Footer from './Footer';
import MobileMenu from './MobileMenu';
import CartDrawer from './CartDrawer';
import SearchOverlay from './SearchOverlay';

export default function Layout() {
  return (
    <>
      <Topbar />
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <MobileMenu />
      <CartDrawer />
      <SearchOverlay />
    </>
  );
}
