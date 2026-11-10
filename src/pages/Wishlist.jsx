import { Link } from 'react-router-dom';
import PageBanner from '../components/ui/PageBanner';
import ProductGrid from '../components/product/ProductGrid';
import Newsletter from '../components/home/Newsletter';
import { useCatalog } from '../context/CatalogContext';
import { useStore } from '../context/StoreContext';
import { useUI } from '../context/UIContext';
import { useToast } from '../context/ToastContext';

export default function Wishlist() {
  const { products } = useCatalog();
  const { wish, add } = useStore();
  const { openCart } = useUI();
  const toast = useToast();

  const saved = products.filter((product) => wish.includes(product.id));

  const addAll = () => {
    if (!saved.length) return;
    saved.forEach((product) => add(product.id, 1));
    toast(`${saved.length} ${saved.length === 1 ? 'piece' : 'pieces'} added to your bag`);
    openCart();
  };

  return (
    <>
      <PageBanner
        crumb={[{ label: 'Home', to: '/' }, { label: 'Wishlist' }]}
        eyebrow="Saved for later"
        title={
          <>
            Your <span className="italic">wishlist</span>
          </>
        }
        text="Pieces you have set aside. Saved to this device — they will be here when you return."
        num="04"
      />

      <section className="section">
        <div className="wrap">
          <div className="shop-toolbar">
            <div className="res">
              <b>{saved.length}</b> saved {saved.length === 1 ? 'timepiece' : 'timepieces'}
            </div>
            <div className="tool-right">
              {saved.length ? (
                <button className="btn btn-sm" type="button" onClick={addAll}>
                  Add all to bag
                </button>
              ) : null}
              <Link className="btn btn-sm btn-ghost" to="/shop">
                Continue browsing
              </Link>
            </div>
          </div>

          {saved.length ? (
            <ProductGrid products={saved} />
          ) : (
            <div className="empty-state">
              <h3>Nothing saved yet</h3>
              <p>Tap the heart on any timepiece to keep it here for later.</p>
              <Link className="btn btn-gold" to="/shop" style={{ marginTop: 24 }}>
                Discover the collection
              </Link>
            </div>
          )}
        </div>
      </section>

      <Newsletter
        eyebrow="A private invitation"
        title="See it first."
        text="Wishlist pieces often sell out before they reach the boutique. Join the list and we will tell you before anyone else."
      />
    </>
  );
}
