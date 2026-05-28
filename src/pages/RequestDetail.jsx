import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, DollarSign, Package, MapPin, Calendar, Eye, Mail, MessageCircle, Phone, Clock, Link as LinkIcon, Wheat, Shirt, Code, Building2, Pill, Printer, Truck, Armchair, Sparkles, CheckCircle } from 'lucide-react';
import { store, CATEGORIES } from '../data/store';

const iconMap = {
  Wheat, Shirt, Code, Building2, Pill, Printer, Truck, Armchair, Sparkles
};

function getCategoryIcon(iconName, size = 18) {
  const IconComponent = iconMap[iconName];
  return IconComponent ? <IconComponent size={size} style={{ display: 'inline-block', marginRight: 6, verticalAlign: 'middle' }} /> : null;
}

export default function RequestDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [bids, setBids] = useState([]);
  const [showBidForm, setShowBidForm] = useState(false);
  const [bidData, setBidData] = useState({ vendorName: '', vendorPhone: '', location: '', price: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const req = store.getRequests().find(r => r.id === id);
    if (!req) { navigate('/board'); return; }
    store.incrementView(id);
    setRequest(store.getRequests().find(r => r.id === id));
    setBids(store.getBidsForRequest(id));
  }, [id]);

  if (!request) return null;

  const cat = CATEGORIES.find(c => c.id === request.category) || CATEGORIES[0];
  const deadline = new Date(request.deadline);
  const daysLeft = Math.ceil((deadline - new Date()) / (1000 * 60 * 60 * 24));
  const isExpired = daysLeft < 0;

  const handleBid = () => {
    if (!bidData.vendorName || !bidData.vendorPhone || !bidData.price || !bidData.message) {
      setError('Please fill all required fields.');
      return;
    }
    store.addBid({ ...bidData, requestId: id });
    setBids(store.getBidsForRequest(id));
    setSubmitted(true);
    setShowBidForm(false);
    setBidData({ vendorName: '', vendorPhone: '', location: '', price: '', message: '' });
    setError('');
  };

  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const h = Math.floor(diff / 3600000);
    const d = Math.floor(diff / 86400000);
    if (d > 0) return `${d} day${d > 1 ? 's' : ''} ago`;
    if (h > 0) return `${h} hour${h > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  return (
    <div style={styles.page}>
      <div style={styles.inner}>
        {/* Breadcrumb */}
        <div style={styles.breadcrumb}>
          <Link to="/board" style={styles.breadLink}>
            <ArrowLeft size={16} style={{ display: 'inline-block', marginRight: 6, verticalAlign: 'middle' }} />
            Back to Board
          </Link>
        </div>

        <div style={styles.layout}>
          {/* Left: Main content */}
          <div style={styles.main}>
            {/* Category + Status */}
            <div style={styles.topMeta}>
              <span style={{ ...styles.catBadge, background: cat.color + '22', color: cat.color, border: `1px solid ${cat.color}44` }}>
                {getCategoryIcon(cat.icon)} {cat.label}
              </span>
              {!isExpired && <span style={styles.openBadge}>
                <CheckCircle size={14} style={{ display: 'inline-block', marginRight: 4, verticalAlign: 'middle' }} />
                Open
              </span>}
              {isExpired && <span style={styles.closedBadge}>Closed</span>}
              <span style={styles.timeAgo}>Posted {timeAgo(request.createdAt)}</span>
            </div>

            <h1 style={styles.title}>{request.title}</h1>

            <p style={styles.description}>{request.description}</p>

            {/* Specs */}
            <div style={styles.specBox}>
              <h3 style={styles.specTitle}>Request Specifications</h3>
              <div style={styles.specGrid}>
                <SpecRow icon={<DollarSign size={16} />} label="Budget" value={request.budget} highlight />
                <SpecRow icon={<Package size={16} />} label="Quantity" value={request.quantity} />
                <SpecRow icon={<MapPin size={16} />} label="Location" value={request.location} />
                <SpecRow icon={<Calendar size={16} />} label="Deadline" value={isExpired ? `Expired (${request.deadline})` : daysLeft === 0 ? 'Today!' : `${daysLeft} days left (${request.deadline})`} urgent={daysLeft <= 3 && !isExpired} />
                <SpecRow icon={<Eye size={16} />} label="Views" value={`${request.views} vendors viewed`} />
                <SpecRow icon={<Mail size={16} />} label="Bids Received" value={`${bids.length} bid${bids.length !== 1 ? 's' : ''}`} />
              </div>
            </div>

            {/* Bids section */}
            <div style={styles.bidsSection}>
              <div style={styles.bidsHeader}>
                <h2 style={styles.bidsTitle}>Vendor Bids <span style={styles.bidCount}>{bids.length}</span></h2>
              </div>

              {submitted && (
                <div style={styles.successBanner}>
                  <CheckCircle size={16} style={{ display: 'inline-block', marginRight: 6, verticalAlign: 'middle' }} />
                  Your bid was submitted successfully! The buyer will contact you if interested.
                </div>
              )}

              {bids.length === 0 ? (
                <div style={styles.noBids}>
                  <div style={{ fontSize: 36 }}>
                    <MessageCircle size={36} style={{ color: 'var(--text3)' }} />
                  </div>
                  <p style={{ color: 'var(--text2)', marginTop: 8 }}>No bids yet. Be the first vendor to respond!</p>
                </div>
              ) : (
                <div style={styles.bidsList}>
                  {bids.map((bid, i) => (
                    <div key={bid.id} style={styles.bidCard} className="animate-fadeUp" style={{ ...styles.bidCard, animationDelay: `${i * 80}ms`, opacity: 0 }}>
                      <div style={styles.bidTop}>
                        <div style={styles.bidVendor}>
                          <div style={styles.bidAvatar}>{bid.vendorName[0]}</div>
                          <div>
                            <div style={styles.bidVendorName}>{bid.vendorName}</div>
                            <div style={styles.bidMeta}>
                              {bid.location && (
                                <>
                                  <MapPin size={12} style={{ display: 'inline-block', marginRight: 4, verticalAlign: 'middle' }} />
                                  {bid.location}
                                  {' · '}
                                </>
                              )}
                              {timeAgo(bid.createdAt)}
                            </div>
                          </div>
                        </div>
                        <div style={styles.bidPrice}>{bid.price}</div>
                      </div>
                      <p style={styles.bidMessage}>{bid.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Buyer info + Bid CTA */}
          <aside style={styles.sidebar}>
            {/* Buyer card */}
            <div style={styles.buyerCard}>
              <h3 style={styles.cardTitle}>Posted By</h3>
              <div style={styles.buyerInfo}>
                <div style={styles.buyerAvatar}>{request.buyerName[0]}</div>
                <div>
                  <div style={styles.buyerName}>{request.buyerName}</div>
                  <div style={styles.buyerSub}>Verified Buyer</div>
                </div>
              </div>
              <div style={styles.buyerPhone}>
                <span style={styles.phoneLabel}>Contact</span>
                <span style={styles.phoneNum}>
                  <Phone size={14} style={{ display: 'inline-block', marginRight: 6, verticalAlign: 'middle' }} />
                  {request.buyerPhone}
                </span>
              </div>
            </div>

            {/* Bid CTA */}
            {!isExpired && (
              <div style={styles.bidCtaCard}>
                <h3 style={styles.cardTitle}>Interested in this request?</h3>
                <p style={styles.bidCtaSub}>Submit your best offer and price to win this contract.</p>
                <button style={styles.bidBtn} onClick={() => setShowBidForm(!showBidForm)}>
                  {showBidForm ? 'Cancel' : <>
                    <Mail size={16} style={{ display: 'inline-block', marginRight: 6, verticalAlign: 'middle' }} />
                    Submit a Bid
                  </>}
                </button>

                {showBidForm && (
                  <div style={styles.bidForm}>
                    {error && <div style={styles.errorMsg}>{error}</div>}
                    <Input label="Your Business Name *" value={bidData.vendorName} onChange={v => setBidData(p => ({ ...p, vendorName: v }))} placeholder="e.g. Khayla Fashion Hub" />
                    <Input label="WhatsApp / Phone *" value={bidData.vendorPhone} onChange={v => setBidData(p => ({ ...p, vendorPhone: v }))} placeholder="080xxxxxxxx" />
                    <Input label="Your Location" value={bidData.location} onChange={v => setBidData(p => ({ ...p, location: v }))} placeholder="e.g. Lagos" />
                    <Input label="Your Price / Offer *" value={bidData.price} onChange={v => setBidData(p => ({ ...p, price: v }))} placeholder="e.g. ₦320,000" />
                    <TextArea label="Your Pitch *" value={bidData.message} onChange={v => setBidData(p => ({ ...p, message: v }))} placeholder="Describe what makes your offer the best. Mention experience, delivery timeline, quality guarantees..." />
                    <button style={styles.submitBtn} onClick={handleBid}>
                      Submit Bid
                      <LinkIcon size={14} style={{ display: 'inline-block', marginLeft: 6, verticalAlign: 'middle', transform: 'rotate(-45deg)' }} />
                    </button>
                  </div>
                )}
              </div>
            )}

            {isExpired && (
              <div style={styles.expiredCard}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>
                  <Clock size={28} color="var(--text3)" />
                </div>
                <p style={{ color: 'var(--text2)', fontSize: 14 }}>This request has expired. Browse other open requests.</p>
                <Link to="/board" style={styles.browsBtn}>
                  Browse Board
                  <LinkIcon size={14} style={{ display: 'inline-block', marginLeft: 6, verticalAlign: 'middle', transform: 'rotate(-45deg)' }} />
                </Link>
              </div>
            )}

            {/* Share */}
            <div style={styles.shareCard}>
              <h3 style={styles.cardTitle}>Know a vendor?</h3>
              <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 12, lineHeight: 1.6 }}>Share this request with suppliers who can fulfil it.</p>
              <button style={styles.shareBtn} onClick={() => {
                navigator.clipboard?.writeText(window.location.href);
                alert('Link copied to clipboard!');
              }}>
                <LinkIcon size={14} style={{ display: 'inline-block', marginRight: 6, verticalAlign: 'middle' }} />
                Copy Link
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function SpecRow({ icon, label, value, highlight, urgent }) {
  return (
    <div style={specStyles.row}>
      <span style={{ ...specStyles.icon, color: 'var(--text3)' }}>
        {typeof icon === 'string' ? icon : icon}
      </span>
      <span style={specStyles.label}>{label}</span>
      <span style={{
        ...specStyles.value,
        color: highlight ? 'var(--accent2)' : urgent ? 'var(--red)' : 'var(--text)',
        fontWeight: highlight ? 600 : 500,
      }}>{value}</span>
    </div>
  );
}

function Input({ label, value, onChange, placeholder }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <label style={{ fontSize: 12, color: 'var(--text2)', fontWeight: 500 }}>{label}</label>
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{ padding: '9px 12px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: 13, outline: 'none' }} />
    </div>
  );
}
function TextArea({ label, value, onChange, placeholder }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <label style={{ fontSize: 12, color: 'var(--text2)', fontWeight: 500 }}>{label}</label>
      <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={4}
        style={{ padding: '9px 12px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: 13, outline: 'none', resize: 'vertical', fontFamily: 'var(--font-body)' }} />
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', padding: '32px 24px' },
  inner: { maxWidth: 1200, margin: '0 auto' },
  breadcrumb: { marginBottom: 24 },
  breadLink: { color: 'var(--text2)', fontSize: 14, fontWeight: 500 },
  layout: { display: 'flex', gap: 28, alignItems: 'flex-start', flexWrap: 'wrap' },
  main: { flex: 1, minWidth: 0, minWidth: 300 },
  sidebar: { width: 300, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 16 },
  topMeta: { display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 16 },
  catBadge: { fontSize: 12, fontWeight: 600, padding: '4px 10px', borderRadius: 20 },
  openBadge: { fontSize: 12, color: 'var(--green)', background: 'var(--green-dim)', border: '1px solid rgba(76,175,125,0.3)', padding: '3px 9px', borderRadius: 20 },
  closedBadge: { fontSize: 12, color: 'var(--text3)', background: 'var(--surface)', padding: '3px 9px', borderRadius: 20 },
  timeAgo: { fontSize: 12, color: 'var(--text3)' },
  title: { fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, color: 'var(--text)', marginBottom: 16, lineHeight: 1.2 },
  description: { fontSize: 15, color: 'var(--text2)', lineHeight: 1.8, marginBottom: 24, padding: '20px', background: 'var(--bg2)', borderRadius: 12, border: '1px solid var(--border)' },
  specBox: { background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 14, padding: 20, marginBottom: 28 },
  specTitle: { fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700, color: 'var(--text2)', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.8px', fontSize: 11 },
  specGrid: { display: 'flex', flexDirection: 'column', gap: 0 },
  bidsSection: { marginTop: 8 },
  bidsHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  bidsTitle: { fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--text)' },
  bidCount: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 26, height: 26, background: 'var(--accent)', color: '#fff', borderRadius: '50%', fontSize: 12, fontWeight: 700, marginLeft: 8 },
  noBids: { textAlign: 'center', padding: '48px', background: 'var(--bg2)', borderRadius: 14, border: '1px solid var(--border)' },
  bidsList: { display: 'flex', flexDirection: 'column', gap: 12 },
  bidCard: { background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: 16 },
  bidTop: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, flexWrap: 'wrap', gap: 10 },
  bidVendor: { display: 'flex', alignItems: 'center', gap: 10 },
  bidAvatar: { width: 36, height: 36, borderRadius: '50%', background: 'var(--accent-dim)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14 },
  bidVendorName: { fontWeight: 600, fontSize: 14, color: 'var(--text)' },
  bidMeta: { fontSize: 12, color: 'var(--text3)', marginTop: 2 },
  bidPrice: { fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 800, color: 'var(--accent2)' },
  bidMessage: { fontSize: 13, color: 'var(--text2)', lineHeight: 1.7 },
  successBanner: { background: 'var(--green-dim)', border: '1px solid rgba(76,175,125,0.3)', color: 'var(--green)', padding: '12px 16px', borderRadius: 10, fontSize: 14, marginBottom: 16 },
  buyerCard: { background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 14, padding: 20 },
  cardTitle: { fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 14 },
  buyerInfo: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 },
  buyerAvatar: { width: 44, height: 44, borderRadius: '50%', background: 'var(--accent-dim)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 18, border: '2px solid var(--accent)' },
  buyerName: { fontWeight: 600, fontSize: 15, color: 'var(--text)' },
  buyerSub: { fontSize: 12, color: 'var(--green)', marginTop: 2 },
  buyerPhone: { background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: 4 },
  phoneLabel: { fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.8px' },
  phoneNum: { fontSize: 14, color: 'var(--text)', fontWeight: 500 },
  bidCtaCard: { background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 14, padding: 20 },
  bidCtaSub: { fontSize: 13, color: 'var(--text2)', lineHeight: 1.6, marginBottom: 14 },
  bidBtn: { width: '100%', padding: '12px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 10, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, cursor: 'pointer' },
  bidForm: { marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12 },
  errorMsg: { background: 'var(--red-dim)', border: '1px solid rgba(224,92,92,0.3)', color: 'var(--red)', padding: '10px 14px', borderRadius: 8, fontSize: 13 },
  submitBtn: { padding: '11px', background: 'var(--green)', color: '#fff', border: 'none', borderRadius: 10, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, cursor: 'pointer' },
  expiredCard: { background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 14, padding: 20, textAlign: 'center' },
  browsBtn: { display: 'inline-block', marginTop: 12, padding: '8px 18px', background: 'var(--surface)', color: 'var(--text)', borderRadius: 8, fontSize: 13, border: '1px solid var(--border)' },
  shareCard: { background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 14, padding: 20 },
  shareBtn: { width: '100%', padding: '9px', background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' },
};

const specStyles = {
  row: { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid var(--border)' },
  icon: { fontSize: 16, width: 24, textAlign: 'center' },
  label: { fontSize: 12, color: 'var(--text3)', width: 90, flexShrink: 0 },
  value: { fontSize: 14, color: 'var(--text)', fontWeight: 500, flex: 1 },
};
