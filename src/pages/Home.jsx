import { Link } from 'react-router-dom';
import { Globe, Clipboard, Mail, Handshake, Wheat, Shirt, Code, Building2, Pill, Printer, Truck, Armchair, Sparkles, Package, ArrowRight } from 'lucide-react';
import { store, CATEGORIES } from '../data/store';
import RequestCard from '../components/RequestCard';

const iconMap = {
  Wheat, Shirt, Code, Building2, Pill, Printer, Truck, Armchair, Sparkles, Package
};

function getCategoryIcon(iconName, size = 28) {
  const IconComponent = iconMap[iconName];
  return IconComponent ? <IconComponent size={size} /> : null;
}

export default function Home() {
  const requests = store.getRequests().slice(0, 3);
  const bids = store.getBids();

  const stats = {
    requests: store.getRequests().length,
    bids: bids.length,
    cities: 12,
    categories: CATEGORIES.length,
  };

  return (
    <div style={styles.page}>
      {/* Hero */}
      <section className="hero" style={styles.hero}>
        <div style={styles.heroBg} />
        <div style={styles.heroInner}>
          <div style={styles.heroBadge}>
            <Globe size={16} style={{ display: 'inline-block', marginRight: 6, verticalAlign: 'middle' }} />
            Africa's B2B Procurement Network
          </div>
          <h1 className="hero-title" style={styles.heroTitle}>
            Tell us what<br />
            <span style={styles.heroAccent}>you need.</span><br />
            Vendors compete.
          </h1>
          <p className="hero-sub" style={styles.heroSub}>
            Post your procurement request in 60 seconds. Get competitive bids from verified vendors across Nigeria and Africa. No middlemen. No markup. Just direct deals.
          </p>
          <div className="hero-cta" style={styles.heroCta}>
            <Link to="/post" style={styles.ctaPrimary}>
              Post a Request
              <ArrowRight size={16} style={{ display: 'inline-block', marginLeft: 6, verticalAlign: 'middle' }} />
            </Link>
            <Link to="/board" style={styles.ctaSecondary}>Browse Open Requests</Link>
          </div>
          <div className="hero-stats" style={styles.heroStats}>
            <Stat value={`${stats.requests}+`} label="Open Requests" />
            <StatDivider />
            <Stat value={`${stats.bids}+`} label="Bids Placed" />
            <StatDivider />
            <Stat value={`${stats.cities}+`} label="Cities" />
            <StatDivider />
            <Stat value={`${stats.categories}`} label="Categories" />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section" style={styles.section}>
        <div style={styles.sectionInner}>
          <div style={styles.sectionHeader}>
            <span style={styles.sectionTag}>How It Works</span>
            <h2 style={styles.sectionTitle}>Three steps to your best deal</h2>
          </div>
          <div className="steps" style={styles.steps}>
            {[
              { num: '01', icon: <Clipboard size={32} />, title: 'Post Your Request', desc: 'Describe what you need, your budget, quantity, location, and deadline. Takes under a minute.' },
              { num: '02', icon: <Mail size={32} />, title: 'Receive Bids', desc: 'Verified vendors across Africa see your request and send competitive offers directly to you.' },
              { num: '03', icon: <Handshake size={32} />, title: 'Close the Deal', desc: 'Compare bids, contact your chosen vendor directly, and seal the deal on your terms.' },
            ].map((step, i) => (
              <div key={i} style={styles.step} className="animate-fadeUp" style={{ ...styles.step, animationDelay: `${i * 120}ms`, opacity: 0 }}>
                <div style={styles.stepNum}>{step.num}</div>
                <div style={{ ...styles.stepIcon, color: 'var(--text3)' }}>
                  {typeof step.icon === 'string' ? step.icon : step.icon}
                </div>
                <h3 style={styles.stepTitle}>{step.title}</h3>
                <p style={styles.stepDesc}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section" style={{ ...styles.section, background: 'var(--bg2)' }}>
        <div style={styles.sectionInner}>
          <div style={styles.sectionHeader}>
            <span style={styles.sectionTag}>Categories</span>
            <h2 style={styles.sectionTitle}>Every industry. One platform.</h2>
          </div>
          <div className="cat-grid" style={styles.catGrid}>
            {CATEGORIES.map((cat) => (
              <Link to={`/board?cat=${cat.id}`} key={cat.id} style={styles.catCard}
                onMouseEnter={e => e.currentTarget.style.borderColor = cat.color + '88'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
              >
                {getCategoryIcon(cat.icon, 28)}
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text2)', textAlign: 'center', lineHeight: 1.3 }}>{cat.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recent requests */}
      <section className="section" style={styles.section}>
        <div style={styles.sectionInner}>
          <div style={{ ...styles.sectionHeader, ...styles.sectionHeaderRow }}>
            <div>
              <span style={styles.sectionTag}>Live Board</span>
              <h2 style={styles.sectionTitle}>Latest Requests</h2>
            </div>
            <Link to="/board" style={styles.viewAll}>
              View all
              <ArrowRight size={16} style={{ display: 'inline-block', marginLeft: 6, verticalAlign: 'middle' }} />
            </Link>
          </div>
          <div className="cards-grid" style={styles.cardsGrid}>
            {requests.map((req, i) => (
              <RequestCard key={req.id} request={req} bidsCount={bids.filter(b => b.requestId === req.id).length} animDelay={i * 100} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="ctaBanner" style={styles.ctaBanner}>
        <div style={styles.ctaBannerInner}>
          <h2 style={styles.ctaBannerTitle}>Are you a vendor?</h2>
          <p style={styles.ctaBannerSub}>Browse hundreds of open procurement requests and win new clients today.</p>
          <Link to="/board" style={styles.ctaBannerBtn}>
            Browse Open Requests
            <ArrowRight size={16} style={{ display: 'inline-block', marginLeft: 6, verticalAlign: 'middle' }} />
          </Link>
        </div>
      </section>
    </div>
  );
}

function Stat({ value, label }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, color: 'var(--accent)' }}>{value}</div>
      <div style={{ fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.8px', marginTop: 2 }}>{label}</div>
    </div>
  );
}
function StatDivider() {
  return <div style={{ width: 1, height: 36, background: 'var(--border)', alignSelf: 'center' }} />;
}

const styles = {
  page: { minHeight: '100vh' },
  hero: {
    position: 'relative', overflow: 'hidden',
    padding: '80px 24px 72px',
    borderBottom: '1px solid var(--border)',
  },
  heroBg: {
    position: 'absolute', inset: 0,
    background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(232,108,47,0.12) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  heroInner: {
    maxWidth: 700, margin: '0 auto', textAlign: 'center',
    position: 'relative', zIndex: 1,
  },
  heroBadge: {
    display: 'inline-block',
    fontSize: 12, fontWeight: 600, letterSpacing: '0.5px',
    color: 'var(--accent2)',
    background: 'rgba(245,166,35,0.1)',
    border: '1px solid rgba(245,166,35,0.3)',
    padding: '5px 14px', borderRadius: 20,
    marginBottom: 24,
  },
  heroTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: 'clamp(40px, 6vw, 72px)',
    fontWeight: 800, lineHeight: 1.05,
    color: 'var(--text)',
    marginBottom: 20,
  },
  heroAccent: { color: 'var(--accent)' },
  heroSub: {
    fontSize: 17, color: 'var(--text2)', lineHeight: 1.7,
    maxWidth: 560, margin: '0 auto 32px',
  },
  heroCta: { display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 48 },
  ctaPrimary: {
    padding: '13px 28px',
    background: 'var(--accent)',
    color: '#fff', borderRadius: 10,
    fontFamily: 'var(--font-display)',
    fontWeight: 700, fontSize: 15,
    transition: 'opacity 0.2s',
  },
  ctaSecondary: {
    padding: '13px 28px',
    background: 'var(--surface)',
    color: 'var(--text)', borderRadius: 10,
    fontFamily: 'var(--font-display)',
    fontWeight: 600, fontSize: 15,
    border: '1px solid var(--border)',
    transition: 'border-color 0.2s',
  },
  heroStats: {
    display: 'flex', gap: 32, justifyContent: 'center', flexWrap: 'wrap',
    background: 'var(--bg2)', border: '1px solid var(--border)',
    borderRadius: 14, padding: '20px 32px',
  },
  section: { padding: '72px 24px' },
  sectionInner: { maxWidth: 1200, margin: '0 auto' },
  sectionHeader: { textAlign: 'center', marginBottom: 48 },
  sectionHeaderRow: { display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', textAlign: 'left', flexWrap: 'wrap', gap: 16 },
  sectionTag: {
    display: 'inline-block',
    fontSize: 11, fontWeight: 700, letterSpacing: '1.5px',
    textTransform: 'uppercase', color: 'var(--accent)',
    marginBottom: 8,
  },
  sectionTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: 'clamp(24px, 3vw, 36px)',
    fontWeight: 800, color: 'var(--text)',
  },
  steps: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24,
  },
  step: {
    background: 'var(--bg2)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)', padding: 28,
    display: 'flex', flexDirection: 'column', gap: 12,
  },
  stepNum: {
    fontFamily: 'var(--font-display)', fontSize: 11,
    fontWeight: 800, color: 'var(--text3)', letterSpacing: '2px',
  },
  stepIcon: { fontSize: 32 },
  stepTitle: { fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--text)' },
  stepDesc: { fontSize: 14, color: 'var(--text2)', lineHeight: 1.7 },
  catGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
    gap: 12,
  },
  catCard: {
    background: 'var(--bg3)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)', padding: '20px 12px',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
    cursor: 'pointer', transition: 'border-color 0.2s',
    textDecoration: 'none',
  },
  cardsGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20,
  },
  viewAll: {
    fontSize: 14, color: 'var(--accent)', fontWeight: 600,
    padding: '8px 0', whiteSpace: 'nowrap',
  },
  ctaBanner: {
    background: 'var(--bg2)',
    borderTop: '1px solid var(--border)',
    padding: '64px 24px',
  },
  ctaBannerInner: { maxWidth: 600, margin: '0 auto', textAlign: 'center' },
  ctaBannerTitle: {
    fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 800,
    color: 'var(--text)', marginBottom: 12,
  },
  ctaBannerSub: { fontSize: 16, color: 'var(--text2)', lineHeight: 1.7, marginBottom: 28 },
  ctaBannerBtn: {
    display: 'inline-block',
    padding: '13px 28px', background: 'var(--surface)',
    color: 'var(--text)', borderRadius: 10,
    fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15,
    border: '1px solid var(--border2)',
  },
};
