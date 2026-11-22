import { useState } from 'react';
import { useData } from '../context/DataContext';

export default function Sponsor() {
  const { db, createSponsorship } = useData();
  const [selectedChild, setSelectedChild] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', amount: 50000, payment: 'Mobile Money' });
  const [processing, setProcessing] = useState(false);
  const [receipt, setReceipt] = useState(null);

  const unsponsored = db.children.filter(c => !c.sponsor || c.sponsor === 'Unsponsored');
  const update = (k, v) => setForm({ ...form, [k]: v });

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.phone) return alert('❌ Please fill in all your information.');
    if (!selectedChild) return alert('❌ Please select a child to sponsor.');

    setProcessing(true);
    setTimeout(() => {
      try {
        createSponsorship({
          donorName: form.name,
          donorEmail: form.email,
          donorPhone: form.phone,
          amount: form.amount,
          method: form.payment,
          childId: selectedChild.id,
        });
        setReceipt({
          id: "RC-" + Date.now().toString().slice(-8),
          childName: selectedChild.name,
          amount: form.amount,
          method: form.payment
        });
        setProcessing(false);
      } catch (err) {
        console.error(err);
        alert('❌ Something went wrong. Please try again.');
        setProcessing(false);
      }
    }, 1200);
  };

  const closeModal = () => {
    setReceipt(null);
    setSelectedChild(null);
    setForm({ name: '', email: '', phone: '', amount: 50000, payment: 'Mobile Money' });
    window.location.href = '/impact';
  };

  return (
    <div className="min-h-screen bg-[#0B1120]">
      <div className="mesh-bg" />

      <main className="max-w-5xl mx-auto px-4 py-12 relative z-10">
        <div className="text-center mb-10 animate-fade-in">
          <p className="text-emerald-500 text-xs font-bold tracking-widest mb-2">SPONSOR A CHILD</p>
          <h1 className="text-4xl font-bold text-white mb-4">Change a Life Today</h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
          Your monthly sponsorship provides education, healthcare, and a loving home for a child in need. Choose a child, select a payment method, and start making a difference. This demo records sponsorships in your browser and does not process payments.
          </p>
        </div>

        {/* STEP 1 — CHILD */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold text-sm">1</span>
            <h2 className="text-xl font-bold text-white">Choose a Child to Sponsor</h2>
          </div>
          {unsponsored.length === 0 ? (
            <p className="text-slate-500 text-center py-8">All our children are sponsored! 🎉 Please contact us to support our general fund.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {unsponsored.map(c => {
                const isSelected = selectedChild?.id === c.id;
                return (
                  <div key={c.id} onClick={() => setSelectedChild(c)}
                    className={`bg-slate-800 border-2 rounded-xl p-4 cursor-pointer transition ${
                      isSelected ? 'border-emerald-500 ring-2 ring-emerald-500/30' : 'border-slate-700 hover:border-emerald-500/50'
                    }`}>
                    <div className="text-center">
                      <div className="text-5xl mb-2">{c.avatar}</div>
                      <p className="text-white font-bold">{c.name}</p>
                      <p className="text-xs text-slate-400 mt-1">{c.age} years • {c.gender}</p>
                      <p className={`text-xs mt-1 ${c.disability === 'None' ? 'text-emerald-400' : 'text-amber-400'}`}>{c.disability}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* STEP 2 — INFO */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold text-sm">2</span>
            <h2 className="text-xl font-bold text-white">Your Information</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-300">Full Name *</label>
              <input type="text" value={form.name} onChange={e => update('name', e.target.value)}
                placeholder="Your full name"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-300">Email Address *</label>
              <input type="email" value={form.email} onChange={e => update('email', e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-300">Phone Number *</label>
              <input type="tel" value={form.phone} onChange={e => update('phone', e.target.value)}
                placeholder="+250 7XX XXX XXX"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-300">Sponsorship Amount (FRw / month) *</label>
              <select value={form.amount} onChange={e => update('amount', parseInt(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white">
                <option value={25000}>25,000 FRw — Basic Needs</option>
                <option value={50000}>50,000 FRw — Full Support (Recommended)</option>
                <option value={75000}>75,000 FRw — Premium Care</option>
                <option value={100000}>100,000 FRw — Champion Sponsor</option>
              </select>
            </div>
          </div>
        </div>

        {/* STEP 3 — PAYMENT */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold text-sm">3</span>
            <h2 className="text-xl font-bold text-white">Payment Method</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {['Mobile Money', 'Card', 'Bank Transfer'].map(m => {
              const icons = { 'Mobile Money': '📱', 'Card': '💳', 'Bank Transfer': '🏦' };
              const subs = { 'Mobile Money': 'MTN / Airtel', 'Card': 'Visa / Mastercard', 'Bank Transfer': 'Direct deposit' };
              const isSelected = form.payment === m;
              return (
                <button key={m} type="button" onClick={() => update('payment', m)}
                  className={`bg-slate-800 border-2 rounded-xl p-5 text-center transition ${
                    isSelected ? 'border-emerald-500 bg-emerald-500/10' : 'border-slate-700 hover:border-slate-600'
                  }`}>
                  <div className="text-3xl mb-2">{icons[m]}</div>
                  <p className="text-white font-bold text-sm">{m}</p>
                  <p className="text-slate-400 text-xs mt-1">{subs[m]}</p>
                </button>
              );
            })}
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
            <p className="text-white font-semibold mb-2">Demo checkout</p>
            <p className="text-sm text-slate-400">
              No payment details are collected and no transaction is processed. Selecting a method only records your preference.
            </p>
          </div>
        </div>

        {/* SUMMARY */}
        <div className="bg-gradient-to-br from-emerald-500/10 to-blue-500/10 border border-emerald-500/30 rounded-2xl p-6 mb-6">
          <h3 className="text-white font-bold mb-3">📋 Summary</h3>
          <div className="flex justify-between text-sm mb-2"><span className="text-slate-400">Child:</span><span className="text-white font-medium">{selectedChild?.name || '—'}</span></div>
          <div className="flex justify-between text-sm mb-2"><span className="text-slate-400">Donor:</span><span className="text-white font-medium">{form.name || '—'}</span></div>
          <div className="flex justify-between text-sm mb-4"><span className="text-slate-400">Amount:</span><span className="text-emerald-400 font-bold">{form.amount.toLocaleString()} FRw</span></div>
          <div className="border-t border-slate-700 pt-3 flex justify-between">
            <span className="text-white font-bold">Total:</span>
            <span className="text-emerald-400 font-bold text-xl">{form.amount.toLocaleString()} FRw</span>
          </div>
        </div>

        <button onClick={handleSubmit} disabled={processing}
          className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white py-4 rounded-xl font-bold text-lg transition shadow-lg shadow-emerald-500/20">
          {processing ? '⏳ Recording sponsorship...' : '💝 Record Sponsorship (Demo)'}
        </button>
      </main>

      {/* SUCCESS MODAL */}
      {receipt && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="bg-slate-900 border border-emerald-500/50 rounded-2xl p-8 w-full max-w-md shadow-2xl text-center" onClick={e => e.stopPropagation()}>
            <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center text-5xl mx-auto mb-4">✅</div>
            <h2 className="text-2xl font-bold text-white mb-2">Sponsorship Recorded</h2>
            <p className="text-slate-400 mb-6">Thank you for your kindness. This demo saved your sponsorship locally; no payment was processed.</p>
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 mb-6 text-left">
              <div className="flex justify-between text-sm mb-2"><span className="text-slate-400">Receipt #:</span><span className="text-emerald-400 font-mono font-bold">{receipt.id}</span></div>
              <div className="flex justify-between text-sm mb-2"><span className="text-slate-400">Child:</span><span className="text-white">{receipt.childName}</span></div>
              <div className="flex justify-between text-sm mb-2"><span className="text-slate-400">Amount:</span><span className="text-emerald-400 font-bold">{receipt.amount.toLocaleString()} FRw</span></div>
              <div className="flex justify-between text-sm"><span className="text-slate-400">Method:</span><span className="text-white">{receipt.method}</span></div>
            </div>
            <button onClick={closeModal} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-lg font-bold transition">Done</button>
          </div>
        </div>
      )}
    </div>
  );
}