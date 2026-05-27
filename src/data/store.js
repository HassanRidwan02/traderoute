const REQUESTS_KEY = 'traderoute_requests';
const BIDS_KEY = 'traderoute_bids';
const USER_KEY = 'traderoute_user';

export const CATEGORIES = [
  { id: 'food', label: 'Food & Agro', icon: 'Wheat', color: '#4caf7d' },
  { id: 'fashion', label: 'Fashion & Apparel', icon: 'Shirt', color: '#e86c2f' },
  { id: 'tech', label: 'Tech & Electronics', icon: 'Code', color: '#5b8dee' },
  { id: 'construction', label: 'Construction & Materials', icon: 'Building2', color: '#f5a623' },
  { id: 'health', label: 'Health & Pharma', icon: 'Pill', color: '#e05c5c' },
  { id: 'printing', label: 'Printing & Branding', icon: 'Printer', color: '#9b59b6' },
  { id: 'logistics', label: 'Logistics & Delivery', icon: 'Truck', color: '#1abc9c' },
  { id: 'furniture', label: 'Furniture & Décor', icon: 'Chair', color: '#e67e22' },
  { id: 'beauty', label: 'Beauty & Cosmetics', icon: 'Sparkles', color: '#e91e8c' },
  { id: 'stationery', label: 'Stationery & Office', icon: 'Package', color: '#607d8b' },
];

export const CITIES = [
  'Lagos', 'Abuja', 'Kano', 'Ibadan', 'Port Harcourt', 'Enugu',
  'Benin City', 'Kaduna', 'Aba', 'Onitsha', 'Accra', 'Nairobi',
  'Johannesburg', 'Cape Town', 'Dakar', 'Remote / Nationwide'
];

const SEED_REQUESTS = [
  {
    id: 'r001',
    title: '500 Custom Branded Caps for Corporate Event',
    description: 'We need 500 embroidered caps with our company logo in 3 colors. Must be delivered before our event. Quality stitching required, samples welcome before bulk order.',
    category: 'fashion',
    budget: '₦350,000',
    quantity: '500 units',
    location: 'Lagos',
    deadline: '2026-06-10',
    buyerName: 'Adaeze Okonkwo',
    buyerPhone: '080xxxxxxxx',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    status: 'open',
    views: 47,
  },
  {
    id: 'r002',
    title: 'Wholesale Rice Supply — 100 Bags (50kg each)',
    description: 'Looking for a reliable rice supplier for our restaurant chain. We need parboiled or long-grain rice, 50kg bags x 100. Must pass quality check. Monthly repeat orders possible.',
    category: 'food',
    budget: '₦900,000',
    quantity: '100 bags',
    location: 'Abuja',
    deadline: '2026-05-30',
    buyerName: 'Emeka Traders Ltd',
    buyerPhone: '081xxxxxxxx',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    status: 'open',
    views: 83,
  },
  {
    id: 'r003',
    title: '20 Laptops for School Computer Lab',
    description: 'Secondary school seeking 20 refurbished or new laptops minimum Core i5, 8GB RAM, 256GB SSD for student use. Budget is firm. Warranty required. Delivery to Ibadan.',
    category: 'tech',
    budget: '₦2,200,000',
    quantity: '20 units',
    location: 'Ibadan',
    deadline: '2026-06-05',
    buyerName: 'Greenfield Academy',
    buyerPhone: '070xxxxxxxx',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    status: 'open',
    views: 29,
  },
  {
    id: 'r004',
    title: 'Bulk Cement Supply — 200 Bags for Construction Site',
    description: 'Building contractor needs 200 bags of Dangote or Lafarge cement delivered to site in Enugu. Must be genuine product with receipts. Urgently needed, flexible on brand.',
    category: 'construction',
    budget: '₦420,000',
    quantity: '200 bags',
    location: 'Enugu',
    deadline: '2026-05-29',
    buyerName: 'Okeke & Sons Builders',
    buyerPhone: '090xxxxxxxx',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    status: 'open',
    views: 61,
  },
  {
    id: 'r005',
    title: 'Flyers & Business Cards — 5000 Copies Each',
    description: 'New pharmacy launching next month. Need full-color A5 flyers (5000 copies) and business cards (5000). Provide design or we can supply. Fast turnaround within 3 days.',
    category: 'printing',
    budget: '₦85,000',
    quantity: '10,000 pieces',
    location: 'Port Harcourt',
    deadline: '2026-06-02',
    buyerName: 'MedPoint Pharmacy',
    buyerPhone: '080xxxxxxxx',
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    status: 'open',
    views: 38,
  },
];

const SEED_BIDS = [
  { id: 'b001', requestId: 'r001', vendorName: 'Khayla Fashion Hub', vendorPhone: '081xxxxxxxx', price: '₦320,000', message: 'We specialize in bulk branded wear. Can provide sample within 48hrs. 7-day delivery guaranteed.', location: 'Lagos', rating: 4.8, createdAt: new Date(Date.now() - 3600000 * 20).toISOString() },
  { id: 'b002', requestId: 'r001', vendorName: 'Top Stitch Promo', vendorPhone: '090xxxxxxxx', price: '₦340,000', message: 'Premium embroidery work. We have served GTB, Dangote events. Samples free.', location: 'Lagos', rating: 4.5, createdAt: new Date(Date.now() - 3600000 * 15).toISOString() },
  { id: 'b003', requestId: 'r002', vendorName: 'Agro Wholesale Direct', vendorPhone: '070xxxxxxxx', price: '₦875,000', message: 'Farm-direct parboiled rice. Can deliver 50 bags now, 50 in 3 days. Monthly contract welcome.', location: 'Abuja', rating: 4.9, createdAt: new Date(Date.now() - 3600000 * 10).toISOString() },
  { id: 'b004', requestId: 'r003', vendors: 'TechZone Computers', vendorName: 'TechZone Computers', vendorPhone: '080xxxxxxxx', price: '₦2,100,000', message: 'Refurbished Dell i5 8GB 256GB SSD with 6-month warranty. School discount applied.', location: 'Lagos', rating: 4.6, createdAt: new Date(Date.now() - 3600000 * 3).toISOString() },
];

function getAll(key, seed) {
  try {
    const data = localStorage.getItem(key);
    if (!data) {
      localStorage.setItem(key, JSON.stringify(seed));
      return seed;
    }
    return JSON.parse(data);
  } catch { return seed; }
}

function save(key, data) {
  try { localStorage.setItem(key, JSON.stringify(data)); } catch {}
}

export const store = {
  getRequests: () => getAll(REQUESTS_KEY, SEED_REQUESTS),
  getBids: () => getAll(BIDS_KEY, SEED_BIDS),
  getUser: () => {
    try { return JSON.parse(localStorage.getItem(USER_KEY)); } catch { return null; }
  },
  saveUser: (user) => save(USER_KEY, user),

  addRequest: (req) => {
    const requests = store.getRequests();
    const newReq = { ...req, id: 'r' + Date.now(), createdAt: new Date().toISOString(), status: 'open', views: 0 };
    requests.unshift(newReq);
    save(REQUESTS_KEY, requests);
    return newReq;
  },

  addBid: (bid) => {
    const bids = store.getBids();
    const newBid = { ...bid, id: 'b' + Date.now(), createdAt: new Date().toISOString() };
    bids.unshift(newBid);
    save(BIDS_KEY, bids);
    return newBid;
  },

  incrementView: (id) => {
    const requests = store.getRequests();
    const idx = requests.findIndex(r => r.id === id);
    if (idx !== -1) {
      requests[idx].views = (requests[idx].views || 0) + 1;
      save(REQUESTS_KEY, requests);
    }
  },

  getBidsForRequest: (requestId) => store.getBids().filter(b => b.requestId === requestId),

  getMyRequests: (phone) => store.getRequests().filter(r => r.buyerPhone === phone),
  getMyBids: (phone) => store.getBids().filter(b => b.vendorPhone === phone),
};
