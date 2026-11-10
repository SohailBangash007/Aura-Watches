import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../api/client';
import Logo from '../components/ui/Logo';

const CatalogContext = createContext(null);

function BootScreen({ status, error, onRetry }) {
  return (
    <div className="min-h-screen grid place-items-center px-6 bg-ink text-cream">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-8 animate-pop-in">
          <Logo showText={false} />
        </div>

        {status === 'error' ? (
          <>
            <p className="eyebrow center justify-center">Connection interrupted</p>
            <h1 className="font-serif text-3xl mt-4">The atelier is unreachable.</h1>
            <p className="text-muted text-sm mt-3 leading-relaxed">
              The product API did not respond. Start it with{' '}
              <code className="text-gold-bright">npm run dev</code> — this runs the API and the
              storefront together.
            </p>
            {error ? <p className="text-[11px] text-muted-2 mt-3 break-words">{error}</p> : null}
            <button className="btn btn-gold mt-7" onClick={onRetry} type="button">
              Try again
            </button>
          </>
        ) : (
          <>
            <p className="eyebrow center justify-center">AURA Watches · Geneva</p>
            <h1 className="font-serif text-3xl mt-4">Preparing the collection</h1>
            <div className="mt-8 h-px w-40 mx-auto bg-white/10 overflow-hidden">
              <div className="h-px w-1/2 bg-gold animate-marquee" />
            </div>
            <p className="text-[10px] tracking-[.28em] uppercase text-muted-2 mt-6">
              Fetching timepieces from the API
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export function CatalogProvider({ children }) {
  const [state, setState] = useState({
    status: 'loading',
    error: '',
    products: [],
    categories: [],
    metals: [],
    priceRange: { min: 0, max: 3500 }
  });

  const load = useCallback(async () => {
    setState((s) => ({ ...s, status: 'loading', error: '' }));
    try {
      const data = await api.products({ limit: 100 });
      setState({
        status: 'ready',
        error: '',
        products: data.items || [],
        categories: data.categories || [],
        metals: data.metals || [],
        priceRange: data.priceRange || { min: 0, max: 3500 }
      });
    } catch (err) {
      setState((s) => ({ ...s, status: 'error', error: err.message }));
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const value = useMemo(() => {
    const byId = (id) => state.products.find((p) => p.id === id);
    const categoryNames = state.categories.map((c) => c.name);
    return {
      ...state,
      byId,
      categoryNames,
      featured: state.products.filter((p) => p.badge === 'Bestseller' || p.badge === 'Icon' || p.badge === 'New').slice(0, 4),
      reload: load
    };
  }, [state, load]);

  if (state.status !== 'ready') {
    return <BootScreen status={state.status} error={state.error} onRetry={load} />;
  }

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error('useCatalog must be used inside <CatalogProvider>');
  return ctx;
}
