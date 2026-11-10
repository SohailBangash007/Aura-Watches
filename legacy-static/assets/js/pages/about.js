/* ============================================================
   METRA — about page
   ============================================================ */
(function () {
  const { watchSVG, byId } = window.METRA;
  const a = document.querySelector('[data-about-watch]');
  if (a) a.innerHTML = watchSVG(byId('emerald-heritage'));
  const b = document.querySelector('[data-atelier-watch]');
  if (b) b.innerHTML = watchSVG(byId('sovereign-chronograph'));
})();
