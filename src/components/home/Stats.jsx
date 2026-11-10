import Counter from '../ui/Counter';
import Reveal from '../ui/Reveal';

const STATS = [
  { value: 42, suffix: '', label: 'Countries served' },
  { value: 1200, suffix: '+', label: 'Collectors worldwide' },
  { value: 5, suffix: ' yr', label: 'International warranty' },
  { value: 100, suffix: '%', label: 'Swiss assembled' }
];

export default function Stats() {
  return (
    <section className="section-tight">
      <div className="wrap">
        <Reveal className="stats">
          {STATS.map((stat) => (
            <div className="stat" key={stat.label}>
              <Counter value={stat.value} suffix={stat.suffix} />
              <span>{stat.label}</span>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
