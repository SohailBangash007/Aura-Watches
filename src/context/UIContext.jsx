import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';

const UIContext = createContext(null);

export function UIProvider({ children }) {
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const closeAll = useCallback(() => {
    setCartOpen(false);
    setSearchOpen(false);
    setMenuOpen(false);
  }, []);

  const openCart = useCallback(() => {
    setSearchOpen(false);
    setMenuOpen(false);
    setCartOpen(true);
  }, []);

  const openSearch = useCallback(() => {
    setCartOpen(false);
    setMenuOpen(false);
    setSearchOpen(true);
  }, []);

  const openMenu = useCallback(() => {
    setCartOpen(false);
    setSearchOpen(false);
    setMenuOpen(true);
  }, []);

  useEffect(() => {
    closeAll();
  }, [location.pathname, closeAll]);

  useEffect(() => {
    const anyOpen = cartOpen || searchOpen || menuOpen;
    document.body.classList.toggle('no-scroll', anyOpen);
    return () => document.body.classList.remove('no-scroll');
  }, [cartOpen, searchOpen, menuOpen]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') closeAll();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [closeAll]);

  const value = useMemo(
    () => ({
      cartOpen,
      searchOpen,
      menuOpen,
      openCart,
      closeCart: () => setCartOpen(false),
      openSearch,
      closeSearch: () => setSearchOpen(false),
      openMenu,
      closeMenu: () => setMenuOpen(false),
      closeAll
    }),
    [cartOpen, searchOpen, menuOpen, openCart, openSearch, openMenu, closeAll]
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error('useUI must be used inside <UIProvider>');
  return ctx;
}
