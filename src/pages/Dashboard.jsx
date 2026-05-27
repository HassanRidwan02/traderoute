import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Smile, Clipboard, Mail, MapPin } from 'lucide-react';
import { store } from '../data/store';
import RequestCard from '../components/RequestCard';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(store.getUser());
  const [tab, setTab] = useState('requests');
  const [myRequests, setMyRequests] = useState([]);
  const [myBids, setMyBids] = useState([]);
  const [bids, setBids] = useState([]);
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    if (user) {
      setMyRequests(store.getMyRequests(user.phone));
      setMyBids(store.getMyBids(user.phone));
      setBids(store.getBids());
    }
  }, [user]);

  const handleLogin = () => {
    if (!phone.trim()) { setLoginError('Enter your phone number.'); return; }
    if (!name.trim()) { setLoginError('Enter your name.'); return; }
    const u = { phone: phone.trim(), name: name.trim() };
    store.saveUser(u);
    setUser(u);
    setLoginError('');
  };

  const handleLogout = () => {
    store.saveUser(null);
    setUser(null);
    setMyRequests([]);
    setMyBids([]);
  };

  if (!user) {
    return (
      <div style={styles.page}>
        <div style={styles.loginBox}>
          <div style={styles.loginIcon}>
            <User size={48} color="var(--accent)" />
          </div>
          <h1 style={styles.loginTitle}>Your Dashboard</h1>
          <p style={styles.loginSub}>Enter your name and phone number to access your requests and bids. This is linked to your phone number.</p>
          {loginError && <div style={styles.loginError}>{loginError}</div>}
          <div style={styles.loginForm}>
            <input style={styles.loginInput} placeholder="Your Name" value={name} onChange={e => setName(e.target.value)} />
            <input style={styles.loginInput} placeholder="Phone Number (e.g. 08012345678)" value={phone} onChange={e => setPhone(e.target.value)} />
            <button style={styles.loginBtn} onClick={handleLogin}>Access Dashboard →</button>
          </div>
          <p style={styles.loginNote}>No password needed. Your phone number is your identity on TradeRoute.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.inner}>
        {/* Header */}
        <div style={styles.dashHeader}>
          <div>
            <h1 style={styles.title}>
              Welcome back, {user.name.split(' ')[0]}
              <Smile size={28} style={{ display: 'inline-block', marginLeft: 8, verticalAlign: 'middle' }} />
            </h1>
            <p style={styles.sub}>Manage your requests and bids</p>
          </div>
          <div style={styles.headerActions}>
            <Link to="/post" style={styles.postBtn}>+ New Request</Link>
            <button style={styles.logoutBtn} onClick={handleLogout}>Sign Out</button>
          </div>
        </div>

        {/* Stats */}
        <div style={styles.statsRow}>
          <StatBox value={myRequests.length} label="Your Requests" color="var(--accent)" />
          <StatBox value={myBids.length} label="Bids You Placed" color="var(--blue)" />
          <StatBox value={myRequests.reduce((a, r) => a + (bids.filter(b => b.requestId === r.id).length), 0)} label="Bids Received" color="var(--green)" />
          <StatBox value={myRequests.filter(r => new Date(r.deadline) >= new Date()).length} label="Active Requests" color="var(--accent2)" />
        </div>

        {/* Tabs */}
        <div style={styles.tabs}>
          <Tab label={`My Requests (${myRequests.length})`} active={tab === 'requests'} onClick={() => setTab('requests')} />
          <Tab label={`My Bids (${myBids.length})`} active={tab === 'bids'} onClick={() => setTab('bids')} />
        </div>

        {/* My Requests */}
        {tab === 'requests' && (
          <div>
            {myRequests.length === 0 ? (
              <EmptyState
                icon={<Clipboard size={48} />}
                title="No requests yet"
                desc="Post your first procurement request and start receiving bids from vendors."
                cta="Post a Request"
                link="/post"
              />
            ) : (
              <div style={styles.grid}>
                {myRequests.map((req, i) => (
                  <div key={req.id}>
                    <RequestCard request={req} bidsCount={bids.filter(b => b.requestId === req.id).length} animDelay={i * 80} />
                    <div style={styles.bidsSummary}>
                      <span style={{ fontSize: 12, color: 'var(--text3)' }}>
                        {bids.filter(b => b.requestId === req.id).length} bids received
                      </span>
                      <Link to={`/request/${req.id}`} style={styles.viewBidsLink}>View Bids →</Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* My Bids */}
        {tab === 'bids' && (
          <div>
            {myBids.length === 0 ? (
              <EmptyState
                icon={<Mail size={48} />}
                title="No bids placed yet"
                desc="Browse open requests and submit bids to win procurement contracts."
                cta="Browse Board"
                link="/board"
              />
            ) : (
              <div style={styles.bidCards}>
                {myBids.map((bid, i) => {
                  const req = store.getRequests().find(r => r.id === bid.requestId);
                  return (
                    <div key={bid.id} style={styles.myBidCard} className="animate-fadeUp" style={{ ...styles.myBidCard, animationDelay: `${i * 80}ms`, opacity: 0 }}>
                      <div style={styles.myBidTop}>
                        <div>
                          <div style={{ fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 4 }}>You bid on</div>
                          <Link to={`/request/${bid.requestId}`} style={styles.myBidTitle}>{req?.title || 'Request'}</Link>
                        </div>
                        <div style={styles.myBidPrice}>{bid.price}</div>
                      </div>
                      <p style={styles.myBidMsg}>{bid.message}</p>
                      <div style={styles.myBidFooter}>
                        <span style={{ fontSize: 12, color: 'var(--text3)' }}>
                          <MapPin size={14} style={{ display: 'inline-block', marginRight: 4, verticalAlign: 'middle' }} />
                          {bid.location || 'N/A'}
                        </span>
                        <Link to={`/request/${bid.requestId}`} style={styles.viewLink}>View Request →</Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function StatBox({ value, label, color }) {
  return (
    <div style={styles.statBox}>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 800, color }}>{value}</div>
      <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 4 }}>{label}</div>
    </div>
  );
}

function Tab({ label, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding: '10px 20px', border: 'none', cursor: 'pointer',
      background: 'none', fontSize: 14, fontWeight: active ? 600 : 400,
      color: active ? 'var(--text)' : 'var(--text3)',
      borderBottom: `2px solid ${active ? 'var(--accent)' : 'transparent'}`,
      transition: 'all 0.2s',
    }}>{label}</button>
  );
}

function EmptyState({ icon, title, desc, cta, link }) {
  return (
    <div style={{ textAlign: 'center', padding: '64px 24px', background: 'var(--bg2)', borderRadius: 16, border: '1px solid var(--border)' }}>
      <div style={{ marginBottom: 12, color: 'var(--text3)' }}>
        {typeof icon === 'string' ? <div style={{ fontSize: 48 }}>{icon}</div> : icon}
      </div>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--text)', marginBottom: 8 }}>{title}</h3>
      <p style={{ color: 'var(--text2)', fontSize: 14, marginBottom: 20, maxWidth: 360, margin: '0 auto 20px' }}>{desc}</p>
      <Link to={link} style={{ display: 'inline-block', padding: '10px 24px', background: 'var(--accent)', color: '#fff', borderRadius: 9, fontWeight: 600, fontSize: 14 }}>{cta}</Link>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', padding: '40px 24px' },
  inner: { maxWidth: 1100, margin: '0 auto' },
  loginBox: { maxWidth: 480, margin: '80px auto 0', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 20, padding: '40px 32px', textAlign: 'center' },
  loginIcon: { fontSize: 48, marginBottom: 16 },
  loginTitle: { fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800, color: 'var(--text)', marginBottom: 10 },
  loginSub: { fontSize: 14, color: 'var(--text2)', lineHeight: 1.7, marginBottom: 24 },
  loginError: { background: 'var(--red-dim)', color: 'var(--red)', padding: '10px', borderRadius: 8, fontSize: 13, marginBottom: 16 },
  loginForm: { display: 'flex', flexDirection: 'column', gap: 12 },
  loginInput: { padding: '12px 16px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text)', fontSize: 14, outline: 'none' },
  loginBtn: { padding: '12px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 10, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, cursor: 'pointer' },
  loginNote: { fontSize: 12, color: 'var(--text3)', marginTop: 16, lineHeight: 1.6 },
  dashHeader: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 16 },
  title: { fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, color: 'var(--text)' },
  sub: { fontSize: 14, color: 'var(--text2)', marginTop: 4 },
  headerActions: { display: 'flex', gap: 10, alignItems: 'center' },
  postBtn: { padding: '9px 18px', background: 'var(--accent)', color: '#fff', borderRadius: 9, fontSize: 14, fontWeight: 600 },
  logoutBtn: { padding: '9px 18px', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text2)', borderRadius: 9, fontSize: 14, cursor: 'pointer' },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 28 },
  statBox: { background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: '20px 16px', textAlign: 'center' },
  tabs: { display: 'flex', borderBottom: '1px solid var(--border)', marginBottom: 24, gap: 0 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 },
  bidsSummary: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 4px 0' },
  viewBidsLink: { fontSize: 13, color: 'var(--accent)', fontWeight: 600 },
  bidCards: { display: 'flex', flexDirection: 'column', gap: 12 },
  myBidCard: { background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 },
  myBidTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12, flexWrap: 'wrap', gap: 10 },
  myBidTitle: { fontSize: 15, fontWeight: 600, color: 'var(--text)', textDecoration: 'none' },
  myBidPrice: { fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800, color: 'var(--accent2)' },
  myBidMsg: { fontSize: 13, color: 'var(--text2)', lineHeight: 1.7, marginBottom: 12 },
  myBidFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTop: '1px solid var(--border)' },
  viewLink: { fontSize: 13, color: 'var(--accent)', fontWeight: 600 },
};
