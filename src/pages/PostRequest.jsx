import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Check, Clipboard, Send, AlertCircle, Wheat, Shirt, Code, Building2, Pill, Printer, Truck, Chair, Sparkles, Package } from 'lucide-react';
import { store, CATEGORIES, CITIES } from '../data/store';

const iconMap = {
  Wheat, Shirt, Code, Building2, Pill, Printer, Truck, Chair, Sparkles, Package
};

function getCategoryIcon(iconName, size = 20) {
  const IconComponent = iconMap[iconName];
  return IconComponent ? <IconComponent size={size} /> : null;
}

const EMPTY = {
  title: '', description: '', category: '',
  budget: '', quantity: '', location: '', deadline: '',
  buyerName: '', buyerPhone: '',
};

export default function PostRequest() {
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1);

  const set = (k) => (v) => setForm(p => ({ ...p, [k]: v }));

  const validate1 = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Required';
    if (!form.description.trim()) e.description = 'Required';
    if (!form.category) e.category = 'Select a category';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validate2 = () => {
    const e = {};
    if (!form.budget.trim()) e.budget = 'Required';
    if (!form.quantity.trim()) e.quantity = 'Required';
    if (!form.location) e.location = 'Select a city';
    if (!form.deadline) e.deadline = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validate3 = () => {
    const e = {};
    if (!form.buyerName.trim()) e.buyerName = 'Required';
    if (!form.buyerPhone.trim()) e.buyerPhone = 'Required';
    if (form.buyerPhone && !/^\d{10,14}$/.test(form.buyerPhone.replace(/\s/g, ''))) e.buyerPhone = 'Enter a valid phone number';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (step === 1 && validate1()) setStep(2);
    if (step === 2 && validate2()) setStep(3);
  };

  const submit = () => {
    if (!validate3()) return;
    const req = store.addRequest(form);
    navigate(`/request/${req.id}?posted=1`);
  };

  const selectedCat = CATEGORIES.find(c => c.id === form.category);
  const minDate = new Date().toISOString().split('T')[0];

  return (
    <div style={styles.page}>
      <div style={styles.inner}>
        {/* Header */}
        <div style={styles.header}>
          <Link to="/board" style={styles.back}>
            <ArrowLeft size={16} style={{ display: 'inline-block', marginRight: 4, verticalAlign: 'middle' }} />
            Board
          </Link>
          <h1 style={styles.title}>Post a Procurement Request</h1>
          <p style={styles.sub}>Tell vendors exactly what you need. The more detail you provide, the better your bids will be.</p>
        </div>

        {/* Progress */}
        <div style={styles.progress}>
          {[1, 2, 3].map(s => (
            <div key={s} style={styles.progressItem}>
              <div style={{ ...styles.progressDot, background: s <= step ? 'var(--accent)' : 'var(--border)', border: `2px solid ${s <= step ? 'var(--accent)' : 'var(--border)'}` }}>
                {s < step ? <Check size={16} style={{ color: '#fff' }} /> : s}
              </div>
              <span style={{ fontSize: 12, color: s <= step ? 'var(--text)' : 'var(--text3)', marginTop: 4 }}>
                {s === 1 ? 'Details' : s === 2 ? 'Requirements' : 'Contact'}
              </span>
              {s < 3 && <div style={{ ...styles.progressLine, background: s < step ? 'var(--accent)' : 'var(--border)' }} />}
            </div>
          ))}
        </div>

        {/* Form card */}
        <div style={styles.formCard}>
          {/* Step 1 */}
          {step === 1 && (
            <div style={styles.formSection}>
              <h2 style={styles.stepTitle}>What are you looking for?</h2>

              <FormField label="Request Title *" error={errors.title}>
                <input
                  style={inputStyle(errors.title)}
                  placeholder="e.g. 500 Custom Branded T-Shirts for Company Event"
                  value={form.title}
                  onChange={e => set('title')(e.target.value)}
                  maxLength={100}
                />
                <span style={styles.charCount}>{form.title.length}/100</span>
              </FormField>

              <FormField label="Detailed Description *" error={errors.description} hint="Include specific requirements, standards, quality expectations.">
                <textarea
                  style={{ ...inputStyle(errors.description), minHeight: 120, resize: 'vertical', fontFamily: 'var(--font-body)' }}
                  placeholder="Describe exactly what you need. Include specifications, quality standards, packaging requirements, any preferences..."
                  value={form.description}
                  onChange={e => set('description')(e.target.value)}
                />
              </FormField>

              <FormField label="Category *" error={errors.category}>
                <div style={styles.catGrid}>
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => set('category')(cat.id)}
                      style={{
                        ...styles.catOption,
                        borderColor: form.category === cat.id ? cat.color : 'var(--border)',
                        background: form.category === cat.id ? cat.color + '18' : 'var(--bg3)',
                        color: form.category === cat.id ? cat.color : 'var(--text2)',
                      }}
                    >
                      {getCategoryIcon(cat.icon, 20)}
                      <span style={{ fontSize: 11, fontWeight: 500, textAlign: 'center', lineHeight: 1.3 }}>{cat.label}</span>
                    </button>
                  ))}
                </div>
              </FormField>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div style={styles.formSection}>
              <h2 style={styles.stepTitle}>Budget, Quantity & Timeline</h2>

              <div style={styles.twoCol}>
                <FormField label="Total Budget *" error={errors.budget} hint="Your maximum spend for this request.">
                  <input
                    style={inputStyle(errors.budget)}
                    placeholder="e.g. ₦350,000"
                    value={form.budget}
                    onChange={e => set('budget')(e.target.value)}
                  />
                </FormField>
                <FormField label="Quantity / Volume *" error={errors.quantity} hint="Units, kg, bags, pieces...">
                  <input
                    style={inputStyle(errors.quantity)}
                    placeholder="e.g. 500 units, 100 bags, 20 pcs"
                    value={form.quantity}
                    onChange={e => set('quantity')(e.target.value)}
                  />
                </FormField>
              </div>

              <div style={styles.twoCol}>
                <FormField label="Delivery Location *" error={errors.location}>
                  <select style={inputStyle(errors.location)} value={form.location} onChange={e => set('location')(e.target.value)}>
                    <option value="">Select city...</option>
                    {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </FormField>
                <FormField label="Deadline *" error={errors.deadline} hint="When do you need delivery by?">
                  <input
                    type="date"
                    style={inputStyle(errors.deadline)}
                    min={minDate}
                    value={form.deadline}
                    onChange={e => set('deadline')(e.target.value)}
                  />
                </FormField>
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div style={styles.formSection}>
              <h2 style={styles.stepTitle}>Your Contact Details</h2>
              <p style={styles.stepSub}>Vendors will use these to reach you. Your phone is shown to vendors only after you engage with their bid.</p>

              <FormField label="Business / Your Name *" error={errors.buyerName}>
                <input
                  style={inputStyle(errors.buyerName)}
                  placeholder="e.g. Adaeze Traders Ltd"
                  value={form.buyerName}
                  onChange={e => set('buyerName')(e.target.value)}
                />
              </FormField>

              <FormField label="WhatsApp / Phone Number *" error={errors.buyerPhone} hint="Vendors will contact you here.">
                <input
                  style={inputStyle(errors.buyerPhone)}
                  placeholder="e.g. 08012345678"
                  value={form.buyerPhone}
                  onChange={e => set('buyerPhone')(e.target.value)}
                />
              </FormField>

              {/* Preview */}
              <div style={styles.preview}>
                <h3 style={styles.previewTitle}>
                  <Clipboard size={16} style={{ display: 'inline-block', marginRight: 6, verticalAlign: 'middle' }} />
                  Request Summary
                </h3>
                <div style={styles.previewGrid}>
                  <PreviewRow label="Title" value={form.title} />
                  <PreviewRow label="Category" value={selectedCat ? selectedCat.label : '—'} icon={selectedCat ? getCategoryIcon(selectedCat.icon, 14) : null} />
                  <PreviewRow label="Budget" value={form.budget} highlight />
                  <PreviewRow label="Quantity" value={form.quantity} />
                  <PreviewRow label="Location" value={form.location} />
                  <PreviewRow label="Deadline" value={form.deadline} />
                </div>
              </div>
            </div>
          )}

          {/* Nav buttons */}
          <div style={styles.formNav}>
            {step > 1 && (
              <button style={styles.backBtn} onClick={() => setStep(step - 1)}>
                <ArrowLeft size={16} style={{ display: 'inline-block', marginRight: 6, verticalAlign: 'middle' }} />
                Back
              </button>
            )}
            {step < 3 && (
              <button style={styles.nextBtn} onClick={next}>
                Continue
                <ArrowLeft size={16} style={{ display: 'inline-block', marginLeft: 6, verticalAlign: 'middle', transform: 'scaleX(-1)' }} />
              </button>
            )}
            {step === 3 && (
              <button style={styles.submitBtn} onClick={submit}>
                <Send size={16} style={{ display: 'inline-block', marginRight: 6, verticalAlign: 'middle' }} />
                Post Request
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function FormField({ label, children, error, hint }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{label}</label>
      {hint && <span style={{ fontSize: 12, color: 'var(--text3)', marginTop: -4 }}>{hint}</span>}
      {children}
      {error && <span style={{ fontSize: 12, color: 'var(--red)' }}>
        <AlertCircle size={12} style={{ display: 'inline-block', marginRight: 4, verticalAlign: 'middle' }} />
        {error}
      </span>}
    </div>
  );
}

function PreviewRow({ label, value, highlight, icon }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)', gap: 16 }}>
      <span style={{ fontSize: 12, color: 'var(--text3)', flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: 13, color: highlight ? 'var(--accent2)' : 'var(--text)', fontWeight: highlight ? 600 : 400, textAlign: 'right' }}>
        {icon && <>{icon} </>}
        {value || '—'}
      </span>
    </div>
  );
}

const inputStyle = (error) => ({
  padding: '10px 14px',
  background: 'var(--bg3)',
  border: `1px solid ${error ? 'var(--red)' : 'var(--border)'}`,
  borderRadius: 9,
  color: 'var(--text)',
  fontSize: 14,
  outline: 'none',
  width: '100%',
  transition: 'border-color 0.2s',
});

const styles = {
  page: { minHeight: '100vh', padding: '40px 24px' },
  inner: { maxWidth: 700, margin: '0 auto' },
  header: { marginBottom: 32 },
  back: { fontSize: 13, color: 'var(--text3)', display: 'inline-block', marginBottom: 12 },
  title: { fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 800, color: 'var(--text)', marginBottom: 8 },
  sub: { fontSize: 15, color: 'var(--text2)', lineHeight: 1.6 },
  progress: { display: 'flex', alignItems: 'flex-start', marginBottom: 32, position: 'relative' },
  progressItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, position: 'relative' },
  progressDot: { width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff', zIndex: 1 },
  progressLine: { position: 'absolute', top: 16, left: '50%', width: '100%', height: 2, zIndex: 0 },
  formCard: { background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '32px', display: 'flex', flexDirection: 'column', gap: 0 },
  formSection: { display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 28 },
  stepTitle: { fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: 'var(--text)' },
  stepSub: { fontSize: 14, color: 'var(--text2)', lineHeight: 1.6, marginTop: -12 },
  catGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 8 },
  catOption: { padding: '12px 8px', borderRadius: 10, border: '1px solid', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, cursor: 'pointer', transition: 'all 0.15s' },
  twoCol: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
  charCount: { fontSize: 11, color: 'var(--text3)', alignSelf: 'flex-end', marginTop: -4 },
  preview: { background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: '16px' },
  previewTitle: { fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 12 },
  previewGrid: { display: 'flex', flexDirection: 'column' },
  formNav: { display: 'flex', gap: 12, justifyContent: 'flex-end', paddingTop: 8, borderTop: '1px solid var(--border)' },
  backBtn: { padding: '10px 20px', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: 9, fontSize: 14, fontWeight: 500, cursor: 'pointer' },
  nextBtn: { padding: '10px 24px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 9, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, cursor: 'pointer' },
  submitBtn: { padding: '11px 28px', background: 'var(--green)', color: '#fff', border: 'none', borderRadius: 9, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, cursor: 'pointer' },
};
