import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MessageCircle, Wheat, Shirt, Code, Building2, Pill, Printer, Truck, Armchair, Sparkles, Package } from 'lucide-react';
import { store, CATEGORIES, CITIES } from '../data/store';
import RequestCard from '../components/RequestCard';

const iconMap = {
  Wheat, Shirt, Code, Building2, Pill, Printer, Truck, Armchair, Sparkles, Package
};

function getCategoryIcon(iconName, size = 16) {
  const IconComponent = iconMap[iconName];
  return IconComponent ? <IconComponent size={size} style={{ display: 'inline-block', marginRight: 4, verticalAlign: 'middle' }} /> : null;
}

export default function Board() {
  const [searchParams] = useSearchParams();
  const [requests, setRequests] = useState([]);
  const [bids, setBids] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState(searchParams.get('cat') || 'all');
  const [selectedCity, setSelectedCity] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    setRequests(store.getRequests());
    setBids(store.getBids());
  }, []);

  const filtered = requests
    .filter(r => {
      if (selectedCat !== 'all' && r.category !== selectedCat) return false;
      if (selectedCity !== 'all' && r.location !== selectedCity) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!r.title.toLowerCase().includes(q) && !r.description.toLowerCase().includes(q)) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'budget_high') return parseBudget(b.budget) - parseBudget(a.budget);
      if (sortBy === 'most_bids') {
        const ba = bids.filter(x => x.requestId === a.id).length;
        const bb = bids.filter(x => x.requestId === b.id).length;
        return bb - ba;
      }
      if (sortBy === 'deadline') return new Date(a.deadline) - new Date(b.deadline);
      return 0;
    });

  function parseBudget(str) {
    if (!str) return 0;
    return parseInt(str.replace(/[^0-9]/g, '')) || 0;
  }

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerInner}>
          <h1 style={styles.title}>Procurement Board</h1>
          <p style={styles.sub}>Browse open requests from buyers across Africa. Find what matches your supply capacity and submit a bid.</p>

          {/* Search */}
          <div style={styles.searchWrap}>
            <span style={styles.searchIcon}>🔍</span>
            <input
              style={styles.searchInput}
              placeholder="Search by product, keyword..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button style={styles.clearBtn} onClick={() => setSearch('')}>✕</button>
            )}
          </div>
        </div>
      </div>

      <div style={styles.body}>
        {/* Sidebar filters */}
        <aside style={styles.sidebar}>
          <FilterSection title="Category">
            <FilterOption label="All Categories" value="all" current={selectedCat} onChange={setSelectedCat} count={requests.length} />
            {CATEGORIES.map(cat => (
              <FilterOption
                key={cat.id}
                label={`${cat.icon} ${cat.label}`}
                value={cat.id}
                current={selectedCat}
                onChange={setSelectedCat}
                count={requests.filter(r => r.category === cat.id).length}
                color={cat.color}
              />
            ))}
          </FilterSection>

          <FilterSection title="City">
            <FilterOption label="All Cities" value="all" current={selectedCity} onChange={setSelectedCity} />
            {CITIES.filter(c => requests.some(r => r.location === c)).map(city => (
              <FilterOption key={city} label={city} value={city} current={selectedCity} onChange={setSelectedCity} count={requests.filter(r => r.location === city).length} />
            ))}
          </FilterSection>
        </aside>

        {/* Main content */}
        <main style={styles.main}>
          {/* Toolbar */}
          <div style={styles.toolbar}>
            <span style={styles.resultCount}>
              <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{filtered.length}</span> requests found
            </span>
            <div style={styles.sortWrap}>
              <span style={styles.sortLabel}>Sort:</span>
              <select style={styles.sortSelect} value={sortBy} onChange={e => setSortBy(e.target.value)}>
                <option value="newest">Newest First</option>
                <option value="deadline">Deadline Soon</option>
                <option value="budget_high">Highest Budget</option>
                <option value="most_bids">Most Bids</option>
              </select>
            </div>
          </div>

          {/* Category chips */}
          <div style={styles.chips}>
            <Chip label="All" value="all" current={selectedCat} onChange={setSelectedCat} />
            {CATEGORIES.map(cat => (
              <Chip key={cat.id} label={<>{getCategoryIcon(cat.icon)} {cat.label}</>} value={cat.id} current={selectedCat} onChange={setSelectedCat} color={cat.color} />
            ))}
          </div>

          {/* Cards */}
          {filtered.length === 0 ? (
            <div style={styles.empty}>
              <div style={{ fontSize: 48 }}>
                <MessageCircle size={48} color="var(--text3)" />
              </div>
              <p style={{ color: 'var(--text2)', marginTop: 12 }}>No requests match your filters.</p>
            </div>
          ) : (
            <div style={styles.grid}>
              {filtered.map((req, i) => (
                <RequestCard
                  key={req.id}
                  request={req}
                  bidsCount={bids.filter(b => b.requestId === req.id).length}
                  animDelay={i * 60}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function FilterSection({ title, children }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.2px', color: 'var(--text3)', marginBottom: 10 }}>{title}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>{children}</div>
    </div>
  );
}

function FilterOption({ label, value, current, onChange, count, color }) {
  const active = current === value;
  return (
    <button
      onClick={() => onChange(value)}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '7px 10px', borderRadius: 8, border: 'none',
        background: active ? 'var(--surface2)' : 'transparent',
        color: active ? 'var(--text)' : 'var(--text2)',
        fontSize: 13, cursor: 'pointer', textAlign: 'left',
        transition: 'all 0.15s',
        fontWeight: active ? 600 : 400,
      }}
    >
      <span>{label}</span>
      {count !== undefined && (
        <span style={{ fontSize: 11, color: active ? 'var(--accent)' : 'var(--text3)', fontWeight: 600 }}>{count}</span>
      )}
    </button>
  );
}

function Chip({ label, value, current, onChange, color }) {
  const active = current === value;
  return (
    <button
      onClick={() => onChange(value)}
      style={{
        padding: '5px 14px', borderRadius: 20, border: '1px solid',
        borderColor: active ? (color || 'var(--accent)') : 'var(--border)',
        background: active ? (color ? color + '22' : 'var(--accent-dim)') : 'transparent',
        color: active ? (color || 'var(--accent)') : 'var(--text2)',
        fontSize: 12, fontWeight: active ? 600 : 400,
        cursor: 'pointer', whiteSpace: 'nowrap',
        transition: 'all 0.15s',
      }}
    >{label}</button>
  );
}

const styles = {
  page: { minHeight: '100vh' },
  header: {
    background: 'var(--bg2)', borderBottom: '1px solid var(--border)',
    padding: '48px 24px 32px',
  },
  headerInner: { maxWidth: 1200, margin: '0 auto' },
  title: { fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 800, color: 'var(--text)', marginBottom: 8 },
  sub: { fontSize: 15, color: 'var(--text2)', marginBottom: 24, maxWidth: 560 },
  searchWrap: {
    position: 'relative', maxWidth: 480,
    display: 'flex', alignItems: 'center',
  },
  searchIcon: { position: 'absolute', left: 14, fontSize: 16 },
  searchInput: {
    width: '100%', padding: '12px 40px 12px 42px',
    background: 'var(--bg3)', border: '1px solid var(--border)',
    borderRadius: 10, color: 'var(--text)', fontSize: 14,
    outline: 'none', transition: 'border-color 0.2s',
  },
  clearBtn: {
    position: 'absolute', right: 12, background: 'none',
    border: 'none', color: 'var(--text3)', fontSize: 14, padding: 4,
  },
  body: {
    maxWidth: 1200, margin: '0 auto', padding: '32px 24px',
    display: 'flex', gap: 32, alignItems: 'flex-start',
  },
  sidebar: {
    width: 220, flexShrink: 0,
    position: 'sticky', top: 80,
  },
  main: { flex: 1, minWidth: 0 },
  toolbar: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: 16, flexWrap: 'wrap', gap: 8,
  },
  resultCount: { fontSize: 14, color: 'var(--text2)' },
  sortWrap: { display: 'flex', alignItems: 'center', gap: 8 },
  sortLabel: { fontSize: 13, color: 'var(--text3)' },
  sortSelect: {
    background: 'var(--surface)', border: '1px solid var(--border)',
    color: 'var(--text)', padding: '6px 12px', borderRadius: 8,
    fontSize: 13, cursor: 'pointer', outline: 'none',
  },
  chips: {
    display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20,
  },
  grid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16,
  },
  empty: {
    textAlign: 'center', padding: '80px 24px',
  },
};
