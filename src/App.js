import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Board from './pages/Board';
import RequestDetail from './pages/RequestDetail';
import PostRequest from './pages/PostRequest';
import Dashboard from './pages/Dashboard';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--border)',
      background: 'var(--bg2)',
      padding: '40px 24px',
      marginTop: 80,
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, color: 'var(--text)', marginBottom: 4 }}>
            <span style={{ background: 'var(--accent)', color: '#fff', padding: '2px 6px', borderRadius: 4, fontSize: 12, marginRight: 8 }}>TR</span>
            TradeRoute
          </div>
          <div style={{ fontSize: 13, color: 'var(--text3)' }}>Africa's B2B Procurement Network</div>
        </div>
        <div style={{ fontSize: 13, color: 'var(--text3)' }}>
          Built for African markets. Buyer-first. No middlemen.
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/board" element={<Board />} />
        <Route path="/request/:id" element={<RequestDetail />} />
        <Route path="/post" element={<PostRequest />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/join" element={<Dashboard />} />
        <Route path="*" element={<Home />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
