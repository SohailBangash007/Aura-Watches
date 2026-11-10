import Hero from '../components/home/Hero';
import Marquee from '../components/ui/Marquee';
import Featured from '../components/home/Featured';
import Collections from '../components/home/Collections';
import Craft from '../components/home/Craft';
import Stats from '../components/home/Stats';
import Testimonials from '../components/home/Testimonials';
import Newsletter from '../components/home/Newsletter';

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <Featured />
      <Collections />
      <Craft />
      <Stats />
      <Testimonials />
      <Newsletter />
    </>
  );
}
