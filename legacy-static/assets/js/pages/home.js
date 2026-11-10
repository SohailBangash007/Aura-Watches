/* ============================================================
   METRA — home page
   ============================================================ */
(function () {
  const { products, watchSVG, cardHTML, stars, byId } = window.METRA;
  const $ = s => document.querySelector(s);

  /* hero watch */
  const hero = $('[data-hero-watch]');
  if (hero) hero.innerHTML = watchSVG(byId('sovereign-chronograph'));

  /* craft watch */
  const craft = $('[data-craft-watch]');
  if (craft) craft.innerHTML = watchSVG(byId('obsidian-skeleton'));

  /* marquee */
  const mq = $('[data-marquee]');
  if (mq) {
    const items = [
      'Swiss Automatic Movements', 'Sapphire Crystal', 'Hand-Finished Cases',
      'Five-Year Warranty', 'Complimentary Shipping', 'Made in Geneva',
      'Limited Editions', 'Lifetime Servicing'
    ];
    const row = items.map(t => `<span>${t}<i>◆</i></span>`).join('');
    mq.innerHTML = row + row;
  }

  /* featured grid */
  const featured = ['sovereign-chronograph', 'midnight-diver', 'emerald-heritage', 'obsidian-skeleton'];
  const fg = $('#featured-grid');
  if (fg) fg.innerHTML = featured.map((id, i) => cardHTML(byId(id), i)).join('');

  /* collections */
  const colls = [
    { num: '01 / Chronograph', title: 'Precision in motion', text: 'Three counters, one tachymeter and a movement regulated to the second.', id: 'sovereign-chronograph', cat: 'Chronograph', count: '4 references' },
    { num: '02 / Diver', title: 'Built for depth', text: 'Ceramic bezels, 300 metres of water resistance and lume that never quits.', id: 'midnight-diver', cat: 'Diver', count: '3 references' },
    { num: '03 / Dress', title: 'Quiet elegance', text: 'Slim cases and lacquered dials, made to disappear beneath a cuff.', id: 'emerald-heritage', cat: 'Dress', count: '5 references' }
  ];
  const cg = $('#collections-grid');
  if (cg) {
    cg.innerHTML = colls.map((c, i) => `
      <a class="coll-card reveal" data-delay="${i + 1}" href="shop.html?cat=${c.cat}">
        ${watchSVG(byId(c.id))}
        <div class="cc-inner">
          <div class="cc-num">${c.num} · ${c.count}</div>
          <h3>${c.title}</h3>
          <p>${c.text}</p>
          <span class="cc-link">Discover the collection <span class="arw">→</span></span>
        </div>
      </a>`).join('');
  }

  /* testimonial stars */
  document.querySelectorAll('.q-stars').forEach(el => { el.innerHTML = stars(5).replace('class="stars"', 'class="stars"'); });

  /* newsletter */
  const nl = document.querySelector('[data-newsletter]');
  if (nl) {
    nl.addEventListener('submit', e => {
      e.preventDefault();
      const input = nl.querySelector('input');
      const val = (input.value || '').trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val)) {
        window.toast('Please enter a valid email address', 'error');
        input.focus();
        return;
      }
      window.toast('Welcome to the inner circle — check your inbox');
      input.value = '';
    });
  }
})();
