import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Clipboard, PenTool, User, Key } from 'lucide-react';
import { store } from '../data/store';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = store.getUser();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={styles.nav}>
      <div style={styles.inner}>
        {/* Logo */}
        <Link to="/" style={styles.logo}>
          <span style={styles.logoMark}>TR</span>
          <span style={styles.logoText}>TradeRoute</span>
        </Link>

        {/* Ticker */}
        <div style={styles.tickerWrap}>
          <div style={styles.ticker}>
            {['Food & Agro', 'Fashion', 'Tech', 'Construction', 'Health', 'Logistics', 'Printing', 'Food & Agro', 'Fashion', 'Tech', 'Construction', 'Health', 'Logistics', 'Printing'].map((t, i) => (
              <span key={i} style={styles.tickerItem}>{t}</span>
            ))}
          </div>
        </div>

        {/* Links */}
        <div style={styles.links}>
          <Link to="/board" style={{ ...styles.link, ...(isActive('/board') ? styles.linkActive : {}) }}>Board</Link>
          <Link to="/post" style={styles.postBtn}>+ Post Request</Link>
          {user
            ? <Link to="/dashboard" style={{ ...styles.link, ...(isActive('/dashboard') ? styles.linkActive : {}) }}>My Dashboard</Link>
            : <Link to="/join" style={{ ...styles.link, ...(isActive('/join') ? styles.linkActive : {}) }}>Sign In</Link>
          }
        </div>

        {/* Mobile menu */}
        <button 
          style={styles.hamburger} 
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <span style={{ width: 24, height: 2, background: 'var(--text)', borderRadius: 1, transition: 'all 0.3s', transformOrigin: 'center', transform: menuOpen ? 'rotate(45deg) translateY(10px)' : 'rotate(0)' }} />
          <span style={{ width: 24, height: 2, background: 'var(--text)', borderRadius: 1, transition: 'all 0.3s', opacity: menuOpen ? 0 : 1 }} />
          <span style={{ width: 24, height: 2, background: 'var(--text)', borderRadius: 1, transition: 'all 0.3s', transformOrigin: 'center', transform: menuOpen ? 'rotate(-45deg) translateY(-10px)' : 'rotate(0)' }} />
        </button>
      </div>

      {menuOpen && (
        <div style={styles.mobileMenu}>
          <Link to="/board" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>
            <Clipboard size={18} style={{ display: 'inline-block', marginRight: 8, verticalAlign: 'middle' }} />
            Browse Board
          </Link>
          <Link to="/post" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>
            <PenTool size={18} style={{ display: 'inline-block', marginRight: 8, verticalAlign: 'middle' }} />
            Post a Request
          </Link>
          {user
            ? <Link to="/dashboard" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>
                <User size={18} style={{ display: 'inline-block', marginRight: 8, verticalAlign: 'middle' }} />
                Dashboard
              </Link>
            : <Link to="/join" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>
                <Key size={18} style={{ display: 'inline-block', marginRight: 8, verticalAlign: 'middle' }} />
                Sign In
              </Link>
          }
        </div>
      )}
    </nav>
  );
}

const styles = {
  nav: {
    position: 'sticky', top: 0, zIndex: 100,
    background: 'rgba(14,12,10,0.92)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid var(--border)',
  },
  inner: {
    maxWidth: 1200, margin: '0 auto',
    padding: '0 24px',
    height: 64,
    display: 'flex', alignItems: 'center', gap: 24,
    '@media (max-width: 768px)': {
      padding: '0 16px',
      gap: 12,
    }
  },
  logo: {
    display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0,
    textDecoration: 'none',
  },
  logoMark: {
    background: 'var(--accent)',
    color: '#fff',
    fontFamily: 'var(--font-display)',
    fontWeight: 800,
    fontSize: 13,
    padding: '4px 7px',
    borderRadius: 6,
    letterSpacing: 1,
  },
  logoText: {
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: 18,
    color: 'var(--text)',
  },
  tickerWrap: {
    flex: 1,
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    '@media (max-width: 768px)': {
      display: 'none',
    }
  },
  ticker: {
    display: 'flex',
    gap: 32,
    animation: 'ticker 28s linear infinite',
    whiteSpace: 'nowrap',
  },
  tickerItem: {
    fontSize: 12,
    color: 'var(--text3)',
    letterSpacing: '0.5px',
  },
  links: {
    display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0,
    '@media (max-width: 768px)': {
      display: 'none',
    }
  },
  link: {
    padding: '6px 14px',
    fontSize: 14,
    color: 'var(--text2)',
    borderRadius: 8,
    transition: 'all 0.2s',
    fontWeight: 400,
  },
  linkActive: {
    color: 'var(--text)',
    background: 'var(--surface)',
  },
  postBtn: {
    padding: '7px 16px',
    background: 'var(--accent)',
    color: '#fff',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    fontFamily: 'var(--font-display)',
    transition: 'opacity 0.2s',
  },
  hamburger: {
    display: 'none',
    flexDirection: 'column',
    gap: 4,
    background: 'none',
    border: 'none',
    padding: 8,
    '@media (max-width: 768px)': {
      display: 'flex',
    },
    '& span': {
      width: 24,
      height: 2,
      background: 'var(--text)',
      borderRadius: 1,
      transition: 'all 0.3s',
    }
  },
  mobileMenu: {
    background: 'var(--bg2)',
    borderTop: '1px solid var(--border)',
    padding: '12px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  mobileLink: {
    padding: '12px 0',
    fontSize: 14,
    color: 'var(--text)',
    borderBottom: '1px solid var(--border)',
  },
};
