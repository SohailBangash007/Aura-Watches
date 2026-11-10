import { Link } from 'react-router-dom';
import PageBanner from '../components/ui/PageBanner';
import WatchImage from '../components/WatchImage';
import Icon from '../components/ui/Icon';
import Counter from '../components/ui/Counter';
import Reveal from '../components/ui/Reveal';
import { useCatalog } from '../context/CatalogContext';

const TIMELINE = [
  {
    year: '2009',
    title: 'A bench in Geneva',
    text: "Muhammad Sohail Metra opens a one-room atelier above a bookbinder's shop on the left bank of the Rhône."
  },
  {
    year: '2014',
    title: 'The first calibre',
    text: 'After five years of prototyping, the AURA 01 automatic movement is completed — 42 hours of reserve, finished entirely by hand.'
  },
  {
    year: '2018',
    title: 'The Sovereign',
    text: 'Our signature chronograph launches in a limited run of 100 pieces. It sells out in eleven days, without a single advertisement.'
  },
  {
    year: '2021',
    title: 'Rue du Rhône',
    text: 'The first AURA Watches boutique opens at 12 Rue du Rhône, with a glass workshop where clients can watch their watch being assembled.'
  },
  {
    year: '2024',
    title: 'One thousand collectors',
    text: 'The maison passes 1,000 owners worldwide and introduces lifetime servicing for every piece ever made.'
  },
  {
    year: '2026',
    title: 'The Obsidian Skeleton',
    text: 'Our most complex piece to date — 250 numbered examples, each with a hand-openworked movement and a signed case back.'
  }
];

const VALUES = [
  {
    icon: 'clock',
    title: 'Patience',
    text: 'A movement takes four weeks to assemble and regulate. We have never once tried to make that faster.'
  },
  {
    icon: 'shield',
    title: 'Provenance',
    text: 'Every component is traceable to its maker. Every case back is numbered and registered to its first owner.'
  },
  {
    icon: 'refresh',
    title: 'Permanence',
    text: 'We service every AURA watch we make for as long as it exists. A watch is not a product; it is an heirloom.'
  }
];

export default function About() {
  const { byId, products } = useCatalog();
  const storyWatch = byId('emerald-heritage') || products[0];
  const atelierWatch = byId('obsidian-skeleton') || products[0];

  return (
    <>
      <PageBanner
        crumb={[{ label: 'Home', to: '/' }, { label: 'Our Maison' }]}
        eyebrow="Independent since 2009"
        title={
          <>
            The <span className="italic">maison</span>
          </>
        }
        text="Seventeen years of quiet obsession with one idea: that a watch should be made slowly, finished properly, and kept for a lifetime."
        num="05"
      />

      <section className="section">
        <div className="wrap">
          <div className="about-story">
            <div className="as-copy">
              <span className="eyebrow reveal in">Our story</span>
              <Reveal delay={1}>
                <h2>
                  A bench, a lathe,
                  <br />
                  and a <span className="italic">belief.</span>
                </h2>
              </Reveal>
              <Reveal as="p" delay={2}>
                AURA Watches began in 2009 in a single room above a bookbinder&apos;s shop in Geneva. Muhammad
                Sohail Metra — a watchmaker trained in Le Locle — had one bench, one lathe and a
                conviction that had fallen out of fashion: a watch should be finished by the person who
                signs it.
              </Reveal>
              <Reveal as="p" delay={3}>
                Seventeen years later, that conviction has not changed. We still assemble no more than
                eight movements a day. Bridges are bevelled by hand under a loupe. Every dial is
                inspected three times before it is cased. And every watch that leaves the atelier
                carries the name of the person who built it.
              </Reveal>
              <Reveal className="signature" delay={4}>
                <div className="sig-name">Muhammad Sohail Metra</div>
                <div className="sig-role">Founder &amp; Master Watchmaker</div>
              </Reveal>
            </div>

            <Reveal className="split-visual" delay={2}>
              <div className="frame">{storyWatch ? <WatchImage product={storyWatch} /> : null}</div>
              <span className="tag">Geneva · 46.2044° N</span>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section-tight">
        <div className="wrap">
          <Reveal className="stats">
            <div className="stat">
              <Counter value={17} />
              <span>Years of watchmaking</span>
            </div>
            <div className="stat">
              <Counter value={8} suffix="/day" />
              <span>Movements assembled</span>
            </div>
            <div className="stat">
              <Counter value={42} />
              <span>Countries served</span>
            </div>
            <div className="stat">
              <Counter value={1200} suffix="+" />
              <span>Collectors worldwide</span>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section section-alt">
        <div className="wrap">
          <Reveal>
            <div className="section-head">
              <div className="titles">
                <span className="eyebrow">The chronology</span>
                <h2>
                  Seventeen <span className="italic">years</span>
                </h2>
                <p>No shortcuts, no acquisitions — just a small atelier that grew one watch at a time.</p>
              </div>
            </div>
          </Reveal>

          <div className="timeline">
            {TIMELINE.map((item, index) => (
              <Reveal className="tl-item" key={item.year} delay={(index % 3) + 1}>
                <div className="tl-year">{item.year}</div>
                <span className="tl-dot" />
                <div>
                  <h4>{item.title}</h4>
                  <p>{item.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <Reveal>
            <div className="section-head center">
              <span className="eyebrow center">What we stand for</span>
              <h2>
                Three <span className="italic">principles</span>
              </h2>
            </div>
          </Reveal>

          <div className="values">
            {VALUES.map((value, index) => (
              <Reveal className="value" key={value.title} delay={index + 1}>
                <div className="v-ico">
                  <Icon name={value.icon} size={20} />
                </div>
                <h4>{value.title}</h4>
                <p>{value.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-tight">
        <div className="wrap">
          <div className="split">
            <Reveal className="atelier">
              <div>{atelierWatch ? <WatchImage product={atelierWatch} /> : null}</div>
              <div className="at-cap">
                <h4>The glass atelier</h4>
                <span>Rue du Rhône · Geneva</span>
              </div>
            </Reveal>

            <div>
              <span className="eyebrow reveal in">Visit us</span>
              <Reveal delay={1}>
                <h2 style={{ fontSize: 'clamp(30px,4vw,48px)', marginTop: 16 }}>
                  Watch it being <span className="italic">made.</span>
                </h2>
              </Reveal>
              <Reveal as="p" className="lead" delay={2} style={{ marginTop: 18 }}>
                Our Geneva boutique has no back room. Clients sit at the bench with the watchmaker,
                choose their strap, and watch the final assembly through a loupe. Private appointments
                last ninety minutes and include a movement finishing demonstration.
              </Reveal>

              <div className="craft-list">
                <Reveal className="craft-item" delay={1}>
                  <span className="ci-num">01</span>
                  <div>
                    <h4>Private appointments</h4>
                    <p>Monday to Saturday, 10:00–19:00 CET. Book at least 48 hours in advance.</p>
                  </div>
                </Reveal>
                <Reveal className="craft-item" delay={2}>
                  <span className="ci-num">02</span>
                  <div>
                    <h4>Complimentary servicing</h4>
                    <p>Every owner receives an annual ultrasonic clean and timing check, for life.</p>
                  </div>
                </Reveal>
              </div>

              <Reveal style={{ marginTop: 32 }} delay={3}>
                <Link className="btn btn-gold" to="/contact">
                  Book an appointment
                </Link>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <Reveal className="newsletter" style={{ textAlign: 'center' }}>
            <div style={{ position: 'relative', zIndex: 2, maxWidth: 760, marginInline: 'auto' }}>
              <span className="eyebrow center">The founder</span>
              <h2
                style={{
                  fontSize: 'clamp(26px,3.4vw,42px)',
                  marginTop: 16,
                  fontStyle: 'italic',
                  lineHeight: 1.3
                }}
              >
                “A watch is the only object you will own that measures something you can never buy back.
                It deserves to be made properly.”
              </h2>
              <p
                style={{
                  marginTop: 20,
                  fontSize: 10,
                  letterSpacing: '.26em',
                  textTransform: 'uppercase',
                  color: 'var(--gold)'
                }}
              >
                Muhammad Sohail Metra · Founder
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
