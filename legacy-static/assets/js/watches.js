/* ============================================================
   METRA — watches.js
   Procedural SVG timepiece renderer + product catalogue
   ============================================================ */
(function (w) {
  let uid = 0;

  const METALS = {
    gold:   { a: '#f6e7bb', b: '#c9a961', c: '#7d5f2a' },
    steel:  { a: '#f4f7fa', b: '#b7bec6', c: '#5f666d' },
    rose:   { a: '#f8d9c1', b: '#d59c77', c: '#8c5840' },
    black:  { a: '#565660', b: '#232329', c: '#08080a' },
    bronze: { a: '#e6c49a', b: '#a9784a', c: '#5d3a1f' }
  };

  /* ---------- colour helpers ---------- */
  function hexToRgb(h) {
    h = h.replace('#', '');
    if (h.length === 3) h = h.split('').map(c => c + c).join('');
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
  }
  function mix(hex, target, amt) {
    const a = hexToRgb(hex), b = hexToRgb(target);
    const r = a.map((v, i) => Math.round(v + (b[i] - v) * amt));
    return '#' + r.map(v => v.toString(16).padStart(2, '0')).join('');
  }
  const lighten = (h, a) => mix(h, '#ffffff', a);
  const darken = (h, a) => mix(h, '#000000', a);

  function gear(x, y, r, teeth, fill, stroke) {
    let s = `<g transform="translate(${x} ${y})">`;
    s += `<circle r="${r}" fill="${fill}" stroke="${stroke}" stroke-width=".9" opacity=".95"/>`;
    for (let i = 0; i < teeth; i++) {
      s += `<rect x="-2" y="${-r - 3.5}" width="4" height="6" rx="1" fill="${fill}" stroke="${stroke}" stroke-width=".6" transform="rotate(${(i * 360 / teeth).toFixed(2)})"/>`;
    }
    s += `<circle r="${(r * 0.64).toFixed(1)}" fill="none" stroke="${stroke}" stroke-width=".7" opacity=".7"/>`;
    s += `<circle r="${(r * 0.15).toFixed(1)}" fill="${stroke}" opacity=".85"/>`;
    for (let i = 0; i < 5; i++) {
      s += `<line x1="0" y1="${-r * 0.16}" x2="0" y2="${-r * 0.62}" stroke="${stroke}" stroke-width="1.2" transform="rotate(${i * 72})" opacity=".8"/>`;
    }
    s += `</g>`;
    return s;
  }

  /* ---------- the watch ---------- */
  function watchSVG(p) {
    const id = 'wg' + (++uid);
    const m = METALS[p.metal] || METALS.gold;
    const style = p.style || 'dress';
    const dial = p.dial || '#14141a';
    const dial2 = p.dial2 || darken(dial, 0.75);
    const dial3 = p.dial3 || lighten(dial, 0.30);
    const accent = p.accent || '#c9a961';
    const cx = 210, cy = 280, R = 150;

    const strap = p.strap || { type: 'leather', color: '#3a2418' };
    const bracelet = strap.type === 'bracelet';
    const strapColor = strap.color || '#3a2418';

    const P = [];
    P.push(`<svg class="watch-svg" viewBox="0 0 420 560" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${p.name || 'Luxury watch'}">`);
    P.push(`<defs>
      <linearGradient id="${id}-case" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${m.a}"/><stop offset=".34" stop-color="${m.b}"/>
        <stop offset=".56" stop-color="${m.a}"/><stop offset=".82" stop-color="${m.b}"/><stop offset="1" stop-color="${m.c}"/>
      </linearGradient>
      <linearGradient id="${id}-strap" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="${darken(strapColor, .35)}"/><stop offset=".4" stop-color="${strapColor}"/>
        <stop offset=".75" stop-color="${lighten(strapColor, .10)}"/><stop offset="1" stop-color="${darken(strapColor, .4)}"/>
      </linearGradient>
      <radialGradient id="${id}-dial" cx=".36" cy=".3" r=".92">
        <stop offset="0" stop-color="${dial3}"/><stop offset=".48" stop-color="${dial}"/><stop offset="1" stop-color="${dial2}"/>
      </radialGradient>
      <linearGradient id="${id}-glass" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#ffffff" stop-opacity=".16"/><stop offset=".45" stop-color="#ffffff" stop-opacity="0"/>
      </linearGradient>
      <radialGradient id="${id}-moon" cx=".4" cy=".35" r=".8">
        <stop offset="0" stop-color="#20365c"/><stop offset="1" stop-color="#060a14"/>
      </radialGradient>
      <clipPath id="${id}-dialclip"><circle cx="${cx}" cy="${cy}" r="122"/></clipPath>
      <clipPath id="${id}-st"><path d="M162 0 H258 L268 180 H152 Z"/></clipPath>
      <clipPath id="${id}-sb"><path d="M152 380 H268 L258 560 H162 Z"/></clipPath>
    </defs>`);

    /* ---- straps ---- */
    const topPath = 'M162 0 H258 L268 180 H152 Z';
    const botPath = 'M152 380 H268 L258 560 H162 Z';

    if (bracelet) {
      P.push(`<g><path d="${topPath}" fill="url(#${id}-strap)"/>`);
      P.push(`<g clip-path="url(#${id}-st)" stroke="${darken(m.b, .45)}" stroke-width="1.1" opacity=".85">`);
      for (let y = 4; y < 180; y += 17) P.push(`<line x1="140" y1="${y}" x2="280" y2="${y}"/>`);
      P.push(`</g><line x1="210" y1="0" x2="210" y2="180" stroke="${darken(m.c, .3)}" stroke-width="1.4" opacity=".6"/></g>`);
      P.push(`<g><path d="${botPath}" fill="url(#${id}-strap)"/>`);
      P.push(`<g clip-path="url(#${id}-sb)" stroke="${darken(m.b, .45)}" stroke-width="1.1" opacity=".85">`);
      for (let y = 384; y < 560; y += 17) P.push(`<line x1="140" y1="${y}" x2="280" y2="${y}"/>`);
      P.push(`</g><line x1="210" y1="380" x2="210" y2="560" stroke="${darken(m.c, .3)}" stroke-width="1.4" opacity=".6"/></g>`);
    } else {
      const rubber = strap.type === 'rubber';
      P.push(`<g><path d="${topPath}" fill="url(#${id}-strap)"/>`);
      if (!rubber) {
        P.push(`<g clip-path="url(#${id}-st)" stroke="${lighten(strapColor, .22)}" stroke-width=".7" stroke-dasharray="3 4" opacity=".55">
          <line x1="163" y1="0" x2="153" y2="180"/><line x1="257" y1="0" x2="267" y2="180"/>
        </g>`);
      } else {
        P.push(`<g clip-path="url(#${id}-st)" stroke="${lighten(strapColor, .12)}" stroke-width=".8" opacity=".5">
          <line x1="172" y1="0" x2="164" y2="180"/><line x1="188" y1="0" x2="182" y2="180"/>
          <line x1="232" y1="0" x2="238" y2="180"/><line x1="248" y1="0" x2="256" y2="180"/>
        </g>`);
      }
      P.push(`</g>`);
      P.push(`<g><path d="${botPath}" fill="url(#${id}-strap)"/>`);
      if (!rubber) {
        P.push(`<g clip-path="url(#${id}-sb)" stroke="${lighten(strapColor, .22)}" stroke-width=".7" stroke-dasharray="3 4" opacity=".55">
          <line x1="153" y1="380" x2="163" y2="560"/><line x1="267" y1="380" x2="257" y2="560"/>
        </g>`);
      }
      P.push(`</g>`);
      /* buckle */
      P.push(`<g opacity=".95">
        <rect x="188" y="492" width="44" height="26" rx="3" fill="none" stroke="${m.b}" stroke-width="3"/>
        <line x1="210" y1="492" x2="210" y2="518" stroke="${m.b}" stroke-width="2.5"/>
        <circle cx="210" cy="536" r="2.6" fill="${darken(strapColor, .5)}"/>
        <circle cx="210" cy="548" r="2.6" fill="${darken(strapColor, .5)}"/>
      </g>`);
    }

    /* ---- case ---- */
    P.push(`<ellipse cx="${cx}" cy="${cy + 168}" rx="86" ry="10" fill="#000" opacity=".45"/>`);
    P.push(`<circle cx="${cx}" cy="${cy}" r="${R}" fill="url(#${id}-case)"/>`);
    P.push(`<circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="${m.c}" stroke-opacity=".55" stroke-width="1"/>`);
    P.push(`<circle cx="${cx}" cy="${cy}" r="142" fill="none" stroke="${m.a}" stroke-opacity=".35" stroke-width="1.5"/>`);

    /* crown + pushers */
    P.push(`<g>
      <rect x="356" y="266" width="16" height="28" rx="4" fill="url(#${id}-case)" stroke="${m.c}" stroke-width=".7"/>
      <line x1="360" y1="270" x2="360" y2="290" stroke="${m.c}" stroke-opacity=".6"/>
      <line x1="365" y1="270" x2="365" y2="290" stroke="${m.c}" stroke-opacity=".6"/>
      <line x1="370" y1="270" x2="370" y2="290" stroke="${m.c}" stroke-opacity=".6"/>
    </g>`);
    if (style === 'chrono' || style === 'gmt') {
      P.push(`<rect x="350" y="234" width="13" height="19" rx="3" fill="url(#${id}-case)" stroke="${m.c}" stroke-width=".6"/>`);
      P.push(`<rect x="350" y="307" width="13" height="19" rx="3" fill="url(#${id}-case)" stroke="${m.c}" stroke-width=".6"/>`);
    }

    /* ---- bezel ---- */
    const bezelFill = style === 'diver' ? '#0b0b0e' : darken(m.c, .55);
    P.push(`<circle cx="${cx}" cy="${cy}" r="139" fill="${bezelFill}"/>`);
    P.push(`<circle cx="${cx}" cy="${cy}" r="139" fill="none" stroke="${m.b}" stroke-opacity=".45" stroke-width="1"/>`);

    if (style === 'diver' || style === 'gmt' || style === 'sport') {
      const step = style === 'gmt' ? 24 : 60;
      for (let i = 0; i < step; i++) {
        const major = step === 24 ? (i % 6 === 0) : (i % 5 === 0);
        const len = major ? 9 : 4.5;
        const col = major ? accent : '#8f8b84';
        P.push(`<line x1="${cx}" y1="${cy - 138}" x2="${cx}" y2="${cy - 138 + len}" stroke="${col}" stroke-width="${major ? 1.7 : 1}" opacity="${major ? .95 : .55}" transform="rotate(${i * (360 / step)} ${cx} ${cy})"/>`);
      }
      if (style === 'diver') {
        P.push(`<path d="M210 152 l-7 13 h14 z" fill="${accent}"/>`);
        P.push(`<circle cx="210" cy="180" r="3.4" fill="${accent}" opacity=".9"/>`);
      }
      if (style === 'gmt') {
        P.push(`<path d="M210 150 l-6 11 h12 z" fill="${accent}"/>`);
      }
    } else {
      for (let i = 0; i < 60; i++) {
        if (i % 5 === 0) {
          P.push(`<line x1="${cx}" y1="${cy - 138}" x2="${cx}" y2="${cy - 130}" stroke="${m.b}" stroke-width="1.2" opacity=".55" transform="rotate(${i * 6} ${cx} ${cy})"/>`);
        }
      }
      P.push(`<circle cx="${cx}" cy="${cy}" r="133" fill="none" stroke="${accent}" stroke-opacity=".28" stroke-width=".8"/>`);
    }

    /* ---- dial ---- */
    P.push(`<circle cx="${cx}" cy="${cy}" r="126" fill="url(#${id}-dial)"/>`);

    if (style === 'skeleton') {
      P.push(`<g clip-path="url(#${id}-dialclip)" opacity=".9">
        ${gear(cx + 4, cy + 22, 42, 18, darken(dial, .35), accent)}
        ${gear(cx - 46, cy - 30, 26, 14, darken(dial, .45), darken(accent, .25))}
        ${gear(cx + 44, cy - 34, 30, 16, darken(dial, .4), darken(accent, .2))}
      </g>`);
      P.push(`<circle cx="${cx}" cy="${cy}" r="126" fill="${dial}" opacity=".18"/>`);
    }

    /* sunburst texture */
    P.push(`<g clip-path="url(#${id}-dialclip)" opacity=".16">`);
    for (let i = 0; i < 48; i++) {
      P.push(`<line x1="${cx}" y1="${cy}" x2="${cx}" y2="${cy - 122}" stroke="${dial3}" stroke-width="${i % 2 ? 1 : 2.6}" opacity=".5" transform="rotate(${i * 7.5} ${cx} ${cy})"/>`);
    }
    P.push(`</g>`);

    /* minute track */
    P.push(`<circle cx="${cx}" cy="${cy}" r="117" fill="none" stroke="${lighten(dial, .5)}" stroke-opacity=".22" stroke-width=".7"/>`);

    /* indices */
    const ix = (i, width, height, fill, stroke) => {
      const y = cy - 116;
      return `<rect x="${cx - width / 2}" y="${y}" width="${width}" height="${height}" rx="${width / 2}" fill="${fill}" ${stroke ? `stroke="${stroke}" stroke-width=".7"` : ''} transform="rotate(${i * 30} ${cx} ${cy})"/>`;
    };

    if (style === 'pilot') {
      P.push(`<path d="M210 158 l-9 16 h18 z" fill="${accent}"/>`);
      [[12, cx, cy - 88], [3, cx + 90, cy + 6], [6, cx, cy + 100], [9, cx - 90, cy + 6]].forEach(([n, x, y]) => {
        P.push(`<text x="${x}" y="${y}" text-anchor="middle" font-family="Georgia, serif" font-size="25" fill="${accent}">${n}</text>`);
      });
      for (let i = 0; i < 12; i++) {
        if (i % 3 === 0) continue;
        P.push(ix(i, 5, 8, accent));
      }
    } else if (style === 'diver') {
      for (let i = 0; i < 12; i++) {
        if (i === 0) {
          P.push(`<path d="M210 162 l-9 16 h18 z" fill="${accent}"/>`);
        } else {
          P.push(ix(i, 8, 20, '#efeadd', accent));
          P.push(ix(i, 4, 13, accent, null));
        }
      }
    } else if (style === 'dress' || style === 'moon') {
      for (let i = 0; i < 12; i++) {
        if (i === 0) {
          P.push(ix(0, 2.6, 17, accent).replace('x="208.7"', 'x="205.7"'));
          P.push(ix(0, 2.6, 17, accent).replace('x="208.7"', 'x="211.7"'));
        } else if (i % 3 === 0) {
          P.push(ix(i, 4.5, 17, accent));
        } else {
          P.push(ix(i, 2.2, 13, lighten(accent, .25)));
        }
      }
    } else if (style === 'chrono' || style === 'sport' || style === 'gmt') {
      for (let i = 0; i < 12; i++) {
        if (i === 0) {
          P.push(`<path d="M210 160 l-8 15 h16 z" fill="${accent}"/>`);
        } else {
          P.push(ix(i, i % 3 === 0 ? 4 : 2.4, i % 3 === 0 ? 16 : 11, accent));
        }
      }
    } else {
      for (let i = 0; i < 12; i++) P.push(ix(i, i % 3 === 0 ? 4 : 2.4, i % 3 === 0 ? 15 : 10, accent));
    }

    /* dial branding */
    const brandFill = lighten(dial, .72);
    P.push(`<g clip-path="url(#${id}-dialclip)">
      <text x="${cx}" y="${cy - 74}" text-anchor="middle" font-family="Jost, Arial, sans-serif" font-size="4.4" letter-spacing="2.6" fill="${brandFill}" opacity=".65">MUHAMMAD SOHAIL</text>
      <text x="${cx}" y="${cy - 60}" text-anchor="middle" font-family="Georgia, serif" font-size="13" letter-spacing="3.6" fill="${accent}">METRA</text>
      <text x="${cx}" y="${cy - 48}" text-anchor="middle" font-family="Jost, Arial, sans-serif" font-size="3.6" letter-spacing="1.8" fill="${brandFill}" opacity=".5">FINE TIME PIECES</text>
    </g>`);

    /* complications */
    if (style === 'chrono' || style === 'sport') {
      const subs = [[cx - 58, cy + 2, 27], [cx + 58, cy + 2, 27], [cx, cy + 64, 27]];
      subs.forEach(([x, y, r], k) => {
        P.push(`<g>
          <circle cx="${x}" cy="${y}" r="${r}" fill="${darken(dial, .25)}" opacity=".75"/>
          <circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${accent}" stroke-opacity=".5" stroke-width=".7"/>
          <circle cx="${x}" cy="${y}" r="${r - 4}" fill="none" stroke="${lighten(dial, .4)}" stroke-opacity=".2" stroke-width=".6"/>
        </g>`);
        for (let t = 0; t < 12; t++) {
          P.push(`<line x1="${x}" y1="${y - r + 3}" x2="${x}" y2="${y - r + (t % 3 === 0 ? 7 : 5)}" stroke="${accent}" stroke-width=".6" opacity=".6" transform="rotate(${t * 30} ${x} ${y})"/>`);
        }
        P.push(`<line x1="${x}" y1="${y}" x2="${x}" y2="${y - r + 8}" stroke="${accent}" stroke-width="1.1" transform="rotate(${k === 0 ? 210 : k === 1 ? 60 : 300} ${x} ${y})"/>`);
        P.push(`<circle cx="${x}" cy="${y}" r="1.4" fill="${accent}"/>`);
      });
      P.push(`<rect x="${cx - 14}" y="${cy + 92}" width="28" height="15" rx="1.5" fill="#f4f0e8"/>`);
      P.push(`<text x="${cx}" y="${cy + 103}" text-anchor="middle" font-family="Georgia, serif" font-size="9" fill="#1a1a1a">10</text>`);
    } else if (style === 'moon') {
      P.push(`<g clip-path="url(#${id}-dialclip)">
        <circle cx="${cx}" cy="${cy + 66}" r="27" fill="url(#${id}-moon)" stroke="${accent}" stroke-opacity=".55" stroke-width=".8"/>
        <circle cx="${cx - 9}" cy="${cy + 58}" r="11" fill="#e9dcb6" opacity=".92"/>
        <circle cx="${cx + 12}" cy="${cy + 76}" r="2" fill="#fff" opacity=".5"/>
        <circle cx="${cx + 4}" cy="${cy + 52}" r="1.3" fill="#fff" opacity=".45"/>
        <circle cx="${cx - 16}" cy="${cy + 78}" r="1.6" fill="#fff" opacity=".35"/>
        <path d="M${cx - 27} ${cy + 66} a27 27 0 0 0 54 0" fill="none" stroke="${accent}" stroke-opacity=".3" stroke-width=".7"/>
      </g>`);
      P.push(`<text x="${cx}" y="${cy + 112}" text-anchor="middle" font-family="Jost, Arial, sans-serif" font-size="3.4" letter-spacing="1.6" fill="${brandFill}" opacity=".55">SWISS MADE</text>`);
    } else if (style !== 'skeleton') {
      P.push(`<rect x="${cx + 72}" y="${cy - 12}" width="30" height="23" rx="2" fill="#f4f0e8"/>`);
      P.push(`<text x="${cx + 87}" y="${cy + 4}" text-anchor="middle" font-family="Georgia, serif" font-size="11" fill="#16161a">10</text>`);
    }

    /* hands */
    P.push(`<g>
      <g transform="rotate(305 ${cx} ${cy})">
        <rect x="${cx - 4.5}" y="${cy - 64}" width="9" height="70" rx="4.5" fill="${lighten(dial, .82)}"/>
        <rect x="${cx - 4.5}" y="${cy - 64}" width="9" height="30" rx="4.5" fill="${accent}" opacity=".85"/>
      </g>
      <g transform="rotate(60 ${cx} ${cy})">
        <rect x="${cx - 3}" y="${cy - 100}" width="6" height="106" rx="3" fill="${lighten(dial, .9)}"/>
        <rect x="${cx - 3}" y="${cy - 100}" width="6" height="42" rx="3" fill="${accent}" opacity=".8"/>
      </g>
      <g transform="rotate(180 ${cx} ${cy})">
        <rect x="${cx - .8}" y="${cy - 108}" width="1.6" height="126" fill="${accent}"/>
        <rect x="${cx - 3.2}" y="${cy + 12}" width="6.4" height="16" rx="3" fill="${accent}"/>
      </g>
      <circle cx="${cx}" cy="${cy}" r="7" fill="${accent}"/>
      <circle cx="${cx}" cy="${cy}" r="3.2" fill="${darken(dial, .6)}"/>
    </g>`);

    /* glass */
    P.push(`<g clip-path="url(#${id}-dialclip)">
      <ellipse cx="${cx - 40}" cy="${cy - 62}" rx="62" ry="40" fill="url(#${id}-glass)" transform="rotate(-26 ${cx - 40} ${cy - 62})"/>
      <path d="M${cx - 112} ${cy - 30} a116 116 0 0 1 44 -70" fill="none" stroke="#fff" stroke-opacity=".14" stroke-width="13" stroke-linecap="round"/>
    </g>`);
    P.push(`<circle cx="${cx}" cy="${cy}" r="126" fill="none" stroke="${m.a}" stroke-opacity=".18" stroke-width="1.2"/>`);

    P.push(`</svg>`);
    return P.join('');
  }

  /* ---------- star rating ---------- */
  function stars(rating, count) {
    const full = Math.round(rating || 5);
    let s = '<span class="stars">';
    for (let i = 0; i < 5; i++) {
      s += `<svg viewBox="0 0 24 24" style="opacity:${i < full ? 1 : .22}"><path d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.3 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8z"/></svg>`;
    }
    s += '</span>';
    return s;
  }

  const ICON_HEART = '<svg viewBox="0 0 24 24"><path d="M12 20.7l-1.5-1.4C5.4 14.7 2 11.6 2 7.9 2 5 4.2 2.8 7 2.8c1.7 0 3.3.8 4.4 2.1l.6.8.6-.8C13.7 3.6 15.3 2.8 17 2.8c2.8 0 5 2.2 5 5.1 0 3.7-3.4 6.8-8.5 11.4L12 20.7z"/></svg>';

  /* ---------- catalogue ---------- */
  const products = [
    {
      id: 'sovereign-chronograph', name: 'Sovereign Chronograph', cat: 'Chronograph',
      style: 'chrono', metal: 'gold', strap: { type: 'leather', color: '#5b3320' },
      dial: '#e9ddc0', dial2: '#a08c62', accent: '#6b4f22',
      price: 2450, rating: 4.9, reviews: 128, badge: 'Bestseller',
      desc: 'A champagne dial framed in solid 18k gold plating, the Sovereign is our signature chronograph. Three hand-finished counters, a tachymeter scale and a hand-stitched cognac strap make it the definitive dress chronograph.',
      specs: { Case: '40 mm, 18k gold plated steel', Movement: 'Swiss automatic, 42h reserve', Crystal: 'Domed sapphire, AR coated', 'Water resistance': '100 m / 10 ATM', Strap: 'Hand-stitched cognac calfskin', Warranty: '5 years international' }
    },
    {
      id: 'midnight-diver', name: 'Midnight Diver 300', cat: 'Diver',
      style: 'diver', metal: 'steel', strap: { type: 'bracelet' },
      dial: '#0d2138', dial2: '#040a14', accent: '#c9a961',
      price: 1890, rating: 4.8, reviews: 96, badge: 'New',
      desc: 'Built for the deep and dressed for the city. A 300-metre dive watch with a unidirectional ceramic bezel, Super-LumiNova indices and a brushed steel bracelet that tapers to a signed clasp.',
      specs: { Case: '42 mm, 316L brushed steel', Movement: 'Swiss automatic, 38h reserve', Crystal: 'Sapphire, double AR', 'Water resistance': '300 m / 30 ATM', Bezel: 'Unidirectional ceramic', Warranty: '5 years international' }
    },
    {
      id: 'ivory-dress', name: 'Ivory Dress Automatic', cat: 'Dress',
      style: 'dress', metal: 'gold', strap: { type: 'leather', color: '#1a1a1e' },
      dial: '#f2ecdb', dial2: '#c4b898', accent: '#8a6a2f',
      price: 1620, rating: 4.9, reviews: 74, badge: '',
      desc: 'Quiet confidence in its purest form. An ivory lacquer dial, slim gold batons and a 7.2 mm case that slips beneath any cuff — with a black alligator strap finished by hand.',
      specs: { Case: '38 mm, 18k gold plated steel', Movement: 'Swiss automatic, 40h reserve', Crystal: 'Domed sapphire', 'Water resistance': '50 m / 5 ATM', Strap: 'Black alligator leather', Warranty: '5 years international' }
    },
    {
      id: 'obsidian-skeleton', name: 'Obsidian Skeleton', cat: 'Skeleton',
      style: 'skeleton', metal: 'black', strap: { type: 'leather', color: '#141418' },
      dial: '#0b0b10', dial2: '#000000', accent: '#c9a961',
      price: 3200, rating: 5.0, reviews: 41, badge: 'Limited',
      desc: 'The movement is the dial. Bridges are open-worked and anglage-finished by hand, revealing 38 jewels and a skeletonised rotor. Only 250 pieces will ever be made.',
      specs: { Case: '41 mm, DLC-coated steel', Movement: 'Hand-wound skeleton, 60h', Crystal: 'Sapphire front and back', 'Water resistance': '50 m / 5 ATM', Edition: '250 pieces, numbered', Warranty: '8 years international' }
    },
    {
      id: 'rosewood-gmt', name: 'Rosewood GMT', cat: 'GMT',
      style: 'gmt', metal: 'rose', strap: { type: 'leather', color: '#4a2b1c' },
      dial: '#45261c', dial2: '#170b07', accent: '#f0d0a8',
      price: 2100, rating: 4.7, reviews: 63, badge: '',
      desc: 'Two time zones, one elegant answer. A warm rose-gold case, chocolate sunburst dial and a 24-hour bezel for the traveller who never loses track of home.',
      specs: { Case: '40 mm, rose gold plated steel', Movement: 'Swiss automatic GMT, 42h', Crystal: 'Sapphire, AR coated', 'Water resistance': '100 m / 10 ATM', Strap: 'Chocolate brown calfskin', Warranty: '5 years international' }
    },
    {
      id: 'pearl-noir', name: 'Pearl Noir', cat: 'Classic',
      style: 'dress', metal: 'steel', strap: { type: 'leather', color: '#101014' },
      dial: '#121216', dial2: '#000000', accent: '#ece7db',
      price: 1450, rating: 4.6, reviews: 88, badge: '',
      desc: 'An exercise in restraint. A lacquered black dial with pearl-white hands and a whisper-thin steel case — the watch you reach for every single morning.',
      specs: { Case: '38 mm, polished steel', Movement: 'Swiss quartz, 3-year battery', Crystal: 'Sapphire', 'Water resistance': '50 m / 5 ATM', Strap: 'Black box calf leather', Warranty: '3 years international' }
    },
    {
      id: 'cobalt-sport', name: 'Cobalt Sport', cat: 'Sport',
      style: 'sport', metal: 'steel', strap: { type: 'rubber', color: '#152436' },
      dial: '#10233d', dial2: '#040b14', accent: '#8fb4e0',
      price: 1750, rating: 4.8, reviews: 112, badge: '',
      desc: 'Engineered for movement. A cobalt sunburst dial, three-register chronograph and a soft-touch rubber strap that stays put through the longest days.',
      specs: { Case: '42 mm, brushed steel', Movement: 'Swiss quartz chronograph', Crystal: 'Sapphire, AR coated', 'Water resistance': '200 m / 20 ATM', Strap: 'Navy rubber with steel buckle', Warranty: '5 years international' }
    },
    {
      id: 'emerald-heritage', name: 'Emerald Heritage', cat: 'Heritage',
      style: 'dress', metal: 'gold', strap: { type: 'leather', color: '#16352a' },
      dial: '#123b2e', dial2: '#04120d', accent: '#c9a961',
      price: 2780, rating: 4.9, reviews: 37, badge: 'Icon',
      desc: 'Inspired by a 1958 archive piece, the Emerald Heritage pairs a deep green lacquer dial with warm gold indices and a hand-burnished green strap.',
      specs: { Case: '39 mm, 18k gold plated steel', Movement: 'Swiss automatic, 44h reserve', Crystal: 'Domed sapphire', 'Water resistance': '50 m / 5 ATM', Strap: 'Hand-burnished green calfskin', Warranty: '5 years international' }
    },
    {
      id: 'slate-minimal', name: 'Slate Minimal', cat: 'Minimal',
      style: 'dress', metal: 'steel', strap: { type: 'bracelet' },
      dial: '#8d9197', dial2: '#4a4e54', accent: '#f6f3ea',
      price: 980, rating: 4.5, reviews: 154, badge: '',
      desc: 'Less, considered carefully. A slate-grey dial with no date, no clutter and a Milanese-style bracelet that adjusts to the millimetre. Our most wearable piece.',
      specs: { Case: '36 mm, brushed steel', Movement: 'Swiss quartz', Crystal: 'Sapphire', 'Water resistance': '50 m / 5 ATM', Strap: 'Steel link bracelet', Warranty: '3 years international' }
    },
    {
      id: 'onyx-chrono', name: 'Onyx Chronograph', cat: 'Chronograph',
      style: 'chrono', metal: 'black', strap: { type: 'leather', color: '#131317' },
      dial: '#111115', dial2: '#000000', accent: '#c9a961',
      price: 2950, old: 3250, rating: 4.8, reviews: 58, badge: 'Sale',
      desc: 'All black, all business. A DLC-coated case, smoked sapphire dial and gold accents that catch the light only when you want them to.',
      specs: { Case: '41 mm, DLC black steel', Movement: 'Swiss automatic chronograph', Crystal: 'Smoked sapphire', 'Water resistance': '100 m / 10 ATM', Strap: 'Black nubuck leather', Warranty: '5 years international' }
    },
    {
      id: 'azure-moonphase', name: 'Azure Moonphase', cat: 'Moonphase',
      style: 'moon', metal: 'steel', strap: { type: 'leather', color: '#18253c' },
      dial: '#16294a', dial2: '#050b16', accent: '#e8d5a3',
      price: 3450, rating: 5.0, reviews: 29, badge: 'Limited',
      desc: 'A midnight-blue aventurine dial with a hand-painted moonphase aperture that tracks the lunar cycle to one day in 122 years. Poetry, in mechanical form.',
      specs: { Case: '40 mm, polished steel', Movement: 'Swiss automatic moonphase', Crystal: 'Domed sapphire', 'Water resistance': '50 m / 5 ATM', Dial: 'Aventurine with gold flecks', Warranty: '8 years international' }
    },
    {
      id: 'cognac-pilot', name: 'Cognac Pilot', cat: 'Pilot',
      style: 'pilot', metal: 'bronze', strap: { type: 'leather', color: '#5b3620' },
      dial: '#2b2219', dial2: '#0b0805', accent: '#e3bf92',
      price: 1980, rating: 4.7, reviews: 66, badge: 'New',
      desc: 'A cockpit instrument for the wrist. Oversized Arabic numerals, cathedral hands and a solid bronze case that will develop a unique patina with every year of wear.',
      specs: { Case: '43 mm, solid bronze', Movement: 'Swiss automatic, 40h', Crystal: 'Sapphire, AR coated', 'Water resistance': '100 m / 10 ATM', Strap: 'Cognac vintage calfskin', Warranty: '5 years international' }
    }
  ];

  const categories = [...new Set(products.map(p => p.cat))];
  const metals = [
    { key: 'gold', label: 'Gold', color: '#c9a961' },
    { key: 'steel', label: 'Steel', color: '#b7bec6' },
    { key: 'rose', label: 'Rose Gold', color: '#d59c77' },
    { key: 'black', label: 'Black DLC', color: '#2a2a30' },
    { key: 'bronze', label: 'Bronze', color: '#a9784a' }
  ];

  /* ---------- product card ---------- */
  function cardHTML(p, i) {
    const wished = w.Store ? w.Store.isWished(p.id) : false;
    const delay = i != null ? (i % 4) + 1 : 1;
    const price = p.old
      ? `<span class="old">${w.Store.money(p.old)}</span><span class="now">${w.Store.money(p.price)}</span>`
      : `<span class="now">${w.Store.money(p.price)}</span>`;
    return `<article class="product-card reveal" data-delay="${delay}" data-id="${p.id}">
      <div class="pc-media">
        ${p.badge ? `<span class="pc-badge${p.badge === 'Sale' ? ' sale' : ''}">${p.badge}</span>` : ''}
        <button class="pc-wish${wished ? ' on' : ''}" data-wish="${p.id}" aria-label="Save to wishlist">${ICON_HEART}</button>
        ${watchSVG(p)}
        <div class="pc-quick"><button data-add="${p.id}">Add to bag — ${w.Store.money(p.price)}</button></div>
      </div>
      <div class="pc-body">
        <div class="pc-cat">${p.cat}</div>
        <a class="pc-name" href="product.html?id=${p.id}">${p.name}</a>
        <div class="pc-price">${price}</div>
        <div class="pc-stars">${stars(p.rating)}</div>
      </div>
    </article>`;
  }

  w.METRA = {
    products, categories, metals,
    watchSVG, stars, cardHTML,
    byId: id => products.find(p => p.id === id),
    money: n => w.Store.money(n)
  };
})(window);
