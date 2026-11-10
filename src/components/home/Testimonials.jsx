import Stars from '../ui/Stars';
import SectionHeading from '../ui/SectionHeading';
import Reveal from '../ui/Reveal';

const QUOTES = [
  {
    text: 'The finishing on my Sovereign is easily a match for pieces costing three times as much. It has not left my wrist since it arrived.',
    initial: 'A',
    name: 'Adrian Weber',
    role: 'Zurich · Sovereign Chronograph'
  },
  {
    text: "I bought the Midnight Diver for my husband's 40th. The packaging alone felt like an occasion — the watch itself is extraordinary.",
    initial: 'L',
    name: 'Layla Haddad',
    role: 'Dubai · Midnight Diver 300'
  },
  {
    text: 'Ordered on a Tuesday, delivered in Karachi on Friday. The team answered every question personally. This is what service should be.',
    initial: 'S',
    name: 'Sana Malik',
    role: 'Karachi · Emerald Heritage'
  }
];

export default function Testimonials() {
  return (
    <section className="section">
      <div className="wrap">
        <Reveal>
          <SectionHeading
            center
            eyebrow="Collectors"
            title={
              <>
                Worn with <span className="italic">pride</span>
              </>
            }
          />
        </Reveal>

        <div className="quotes">
          {QUOTES.map((quote, i) => (
            <Reveal className="quote" key={quote.name} delay={i + 1}>
              <div className="qmark">“</div>
              <p>{quote.text}</p>
              <div className="q-stars">
                <Stars rating={5} />
              </div>
              <footer>
                <div className="avatar">{quote.initial}</div>
                <div>
                  <div className="q-name">{quote.name}</div>
                  <div className="q-role">{quote.role}</div>
                </div>
              </footer>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
