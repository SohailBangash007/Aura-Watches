/* ============================================================
   METRA — wishlist page
   ============================================================ */
(function () {
  const { byId, cardHTML } = window.METRA;
  const grid = document.getElementById('wish-grid');
  const total = document.querySelector('[data-wish-total]');

  function render() {
    const ids = window.Store.wish();
    const items = ids.map(byId).filter(Boolean);
    if (total) total.textContent = items.length;

    if (!items.length) {
      grid.innerHTML = `<div class="empty-state" style="padding:80px 24px">
        <h3>Nothing saved yet</h3>
        <p style="margin-bottom:24px">Tap the heart on any timepiece to keep it here.</p>
        <a class="btn btn-gold" href="shop.html">Discover the collection</a>
      </div>`;
      return;
    }
    grid.innerHTML = items.map((p, i) => cardHTML(p, i)).join('');
    if (window.METRA.refresh) requestAnimationFrame(window.METRA.refresh);
  }

  document.addEventListener('click', e => {
    if (e.target.closest('[data-add-all]')) {
      const ids = window.Store.wish();
      if (!ids.length) { window.toast('Your wishlist is empty', 'error'); return; }
      ids.forEach(id => window.Store.add(id, 1));
      window.toast(`${ids.length} timepiece${ids.length > 1 ? 's' : ''} added to your bag`);
      window.METRA_UI.openDrawer();
    }
  });

  document.addEventListener('metra:wish', render);
  document.addEventListener('metra:store', render);

  const nl = document.querySelector('[data-newsletter]');
  if (nl) {
    nl.addEventListener('submit', e => {
      e.preventDefault();
      const input = nl.querySelector('input');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(input.value.trim())) {
        window.toast('Please enter a valid email address', 'error');
        return;
      }
      window.toast('You are on the list — welcome');
      input.value = '';
    });
  }

  render();
})();
