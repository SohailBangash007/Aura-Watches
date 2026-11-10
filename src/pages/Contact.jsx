import { Link } from 'react-router-dom';
import Accordion from '../components/ui/Accordion';
import Icon from '../components/ui/Icon';
import PageBanner from '../components/ui/PageBanner';

const FAQ_ITEMS = [
  {
    title: 'How long does delivery take?',
    content:
      'Orders are dispatched from Geneva within 24 hours. Delivery takes 3–6 business days worldwide, fully insured and requiring a signature. Shipping is complimentary on orders above $500.'
  },
  {
    title: 'Is the warranty international?',
    content:
      'Yes. Every AURA watch carries a five-year international warranty (eight years on limited editions), covering manufacturing defects. Servicing is available at our Geneva atelier and through authorised partners.'
  },
  {
    title: 'Can I return a watch?',
    content:
      'You may return any unworn timepiece within 30 days of delivery. A prepaid, insured return label is included in every parcel. Refunds are processed within five business days of arrival.'
  },
  {
    title: 'Are the watches Swiss made?',
    content:
      'Every movement is Swiss, assembled and regulated in our Geneva atelier. Each watch is delivered with a certificate of origin signed by the watchmaker who built it.'
  },
  {
    title: 'Can I request a specific strap?',
    content:
      'Strap swaps are complimentary at the time of order. Note your preference at checkout or contact the atelier. Additional straps can be ordered separately.'
  },
  {
    title: 'Do you offer instalments?',
    content:
      'Available payment methods and instalment options are shown at checkout for your order and region. Our client care team can help with questions about a specific purchase.'
  }
];

export default function Contact() {
  return (
    <>
      <PageBanner
        crumb={[{ label: 'Home', to: '/' }, { label: 'Contact' }]}
        eyebrow="We answer personally"
        title={<>Client <span className="italic">care</span></>}
        text="No call centres, no scripts. Every message is read by a member of the atelier in Geneva — usually within one business day."
        num="06"
      />

      <section className="section">
        <div className="wrap">
          <div className="contact-grid">
            <div className="contact-cards">
              <article className="cc-card">
                <div className="cc-ico"><Icon name="pin" /></div>
                <h4>The Atelier</h4>
                <p>12 Rue du Rhône<br />1204 Geneva, Switzerland</p>
              </article>
              <article className="cc-card">
                <div className="cc-ico"><Icon name="phone" /></div>
                <h4>Telephone</h4>
                <p><a href="tel:+41225550190">+41 22 555 0190</a><br />Mon–Sat, 10:00–19:00 CET</p>
              </article>
              <article className="cc-card">
                <div className="cc-ico"><Icon name="mail" /></div>
                <h4>Email</h4>
                <p>
                  <a href="mailto:clients@metra.watch">clients@metra.watch</a><br />
                  <a href="mailto:service@metra.watch">service@metra.watch</a>
                </p>
              </article>
              <article className="cc-card">
                <div className="cc-ico"><Icon name="clock" /></div>
                <h4>Private appointments</h4>
                <p>Ninety minutes at the bench with a watchmaker. Please book at least 48 hours ahead.</p>
              </article>
            </div>

            <div className="contact-form">
              <h2>Write to us</h2>
              <p className="cf-sub">
                Tell us what you are looking for — a specific reference, a servicing question, or simply advice.
              </p>
              <p className="text-muted text-sm leading-relaxed">
                Email the atelier directly and include your order number if you are contacting us about a purchase.
                We will reply to your message at the address you send it from.
              </p>
              <a className="btn btn-gold btn-block" href="mailto:clients@metra.watch" style={{ marginTop: 24 }}>
                Email client care
              </a>
              <Link className="btn btn-block" to="/shop" style={{ marginTop: 8 }}>
                Browse the collection
              </Link>
            </div>
          </div>

          <div className="map-band">
            <div className="mb-card">
              <h4>AURA Watches Geneva</h4>
              <p>12 Rue du Rhône<br />1204 Geneva, Switzerland<br /><br />+41 22 555 0190</p>
              <a
                className="btn btn-sm btn-ghost"
                href="https://maps.google.com/?q=12+Rue+du+Rhone+Geneva"
                target="_blank"
                rel="noopener noreferrer"
              >
                Get directions
              </a>
            </div>
          </div>

          <div className="faq" id="faq">
            <div className="section-head">
              <div className="titles">
                <span className="eyebrow">Before you write</span>
                <h2>Frequently <span className="italic">asked</span></h2>
              </div>
            </div>
            <div className="faq-grid">
              <Accordion items={FAQ_ITEMS.slice(0, 3)} defaultOpen={null} />
              <Accordion items={FAQ_ITEMS.slice(3)} defaultOpen={null} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
