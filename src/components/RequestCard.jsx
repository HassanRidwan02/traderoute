import { Link } from 'react-router-dom';
import { AlertCircle, Eye, Wheat, Shirt, Code, Building2, Pill, Printer, Truck, Chair, Sparkles, Package } from 'lucide-react';
import { CATEGORIES } from '../data/store';

const iconMap = {
  Wheat, Shirt, Code, Building2, Pill, Printer, Truck, Chair, Sparkles, Package
};

function getCategoryIcon(iconName, size = 16) {
  const IconComponent = iconMap[iconName];
  return IconComponent ? <IconComponent size={size} style={{ display: 'inline-block', marginRight: 6, verticalAlign: 'middle' }} /> : null;
}

export default function RequestCard({ request, bidsCount = 0, animDelay = 0 }) {
  const cat = CATEGORIES.find(c => c.id === request.category) || CATEGORIES[0];
  const deadline = new Date(request.deadline);
  const now = new Date();
  const daysLeft = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
  const isUrgent = daysLeft <= 3 && daysLeft >= 0;
  const isExpired = daysLeft < 0;

  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const h = Math.floor(diff / 3600000);
    const d = Math.floor(diff / 86400000);
    if (d > 0) return `${d}d ago`;
    if (h > 0) return `${h}h ago`;
    return 'Just now';
  };

  return (
    <Link to={`/request/${request.id}`} style={{ textDecoration: 'none' }}>
      <div
        className="animate-fadeUp"
        style={{
          ...styles.card,
          animationDelay: `${animDelay}ms`,
          opacity: 0,
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = 'var(--border2)';
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.5)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = 'var(--border)';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        {/* Top row */}
        <div style={styles.topRow}>
          <span style={{ ...styles.catBadge, background: cat.color + '22', color: cat.color, border: `1px solid ${cat.color}44` }}>
            {getCategoryIcon(cat.icon)} {cat.label}
          </span>
          <div style={styles.topRight}>
            {isUrgent && !isExpired && (
              <span style={styles.urgentBadge}>
                <AlertCircle size={14} style={{ display: 'inline-block', marginRight: 4, verticalAlign: 'middle' }} />
                Urgent
              </span>
            )}
            {isExpired && (
              <span style={styles.expiredBadge}>Expired</span>
            )}
            <span style={styles.time}>{timeAgo(request.createdAt)}</span>
          </div>
        </div>

        {/* Title */}
        <h3 style={styles.title}>{request.title}</h3>

        {/* Description */}
        <p style={styles.desc}>{request.description}</p>

        {/* Meta grid */}
        <div style={styles.metaGrid}>
          <MetaItem label="Budget" value={request.budget} highlight />
          <MetaItem label="Quantity" value={request.quantity} />
          <MetaItem label="Location" value={request.location} />
          <MetaItem label="Deadline" value={isExpired ? 'Expired' : daysLeft === 0 ? 'Today!' : `${daysLeft} days left`} urgent={isUrgent && !isExpired} />
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <div style={styles.buyerInfo}>
            <div style={styles.avatar}>{request.buyerName[0]}</div>
            <span style={styles.buyerName}>{request.buyerName}</span>
          </div>
          <div style={styles.stats}>
            <span style={styles.stat}>
              <Eye size={14} style={{ display: 'inline-block', marginRight: 4, verticalAlign: 'middle' }} />
              {request.views || 0}
            </span>
            <span style={{ ...styles.stat, ...styles.bidsCount, background: bidsCount > 0 ? 'var(--green-dim)' : 'transparent', color: bidsCount > 0 ? 'var(--green)' : 'var(--text3)' }}>
              {bidsCount} {bidsCount === 1 ? 'bid' : 'bids'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function MetaItem({ label, value, highlight, urgent }) {
  return (
    <div style={metaStyles.item}>
      <span style={metaStyles.label}>{label}</span>
      <span style={{
        ...metaStyles.value,
        color: highlight ? 'var(--accent2)' : urgent ? 'var(--red)' : 'var(--text)',
        fontWeight: highlight ? 600 : 500,
      }}>{value}</span>
    </div>
  );
}

const styles = {
  card: {
    background: 'var(--bg2)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: '20px',
    cursor: 'pointer',
    transition: 'border-color 0.2s, transform 0.2s, box-shadow 0.2s',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  topRow: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
  },
  catBadge: {
    fontSize: 11, fontWeight: 600, padding: '3px 9px',
    borderRadius: 20, letterSpacing: '0.3px',
  },
  topRight: { display: 'flex', alignItems: 'center', gap: 8 },
  urgentBadge: {
    fontSize: 11, color: 'var(--red)',
    background: 'var(--red-dim)',
    border: '1px solid rgba(224,92,92,0.3)',
    padding: '2px 8px', borderRadius: 20,
  },
  expiredBadge: {
    fontSize: 11, color: 'var(--text3)',
    background: 'var(--surface)',
    padding: '2px 8px', borderRadius: 20,
  },
  time: { fontSize: 12, color: 'var(--text3)' },
  title: {
    fontFamily: 'var(--font-display)',
    fontSize: 16, fontWeight: 700,
    color: 'var(--text)', lineHeight: 1.3,
  },
  desc: {
    fontSize: 13, color: 'var(--text2)', lineHeight: 1.6,
    display: '-webkit-box', WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical', overflow: 'hidden',
  },
  metaGrid: {
    display: 'grid', gridTemplateColumns: '1fr 1fr',
    gap: 8,
    background: 'var(--bg3)',
    borderRadius: 8, padding: '12px',
    border: '1px solid var(--border)',
  },
  footer: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: 8, borderTop: '1px solid var(--border)',
  },
  buyerInfo: { display: 'flex', alignItems: 'center', gap: 8 },
  avatar: {
    width: 26, height: 26, borderRadius: '50%',
    background: 'var(--accent-dim)',
    color: 'var(--accent)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 12, fontWeight: 700,
    border: '1px solid var(--accent)',
  },
  buyerName: { fontSize: 12, color: 'var(--text2)' },
  stats: { display: 'flex', alignItems: 'center', gap: 8 },
  stat: { fontSize: 12, color: 'var(--text3)', padding: '2px 6px' },
  bidsCount: { borderRadius: 6, fontSize: 12, fontWeight: 600, padding: '2px 8px' },
};

const metaStyles = {
  item: { display: 'flex', flexDirection: 'column', gap: 2 },
  label: { fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.8px' },
  value: { fontSize: 13, color: 'var(--text)' },
};
