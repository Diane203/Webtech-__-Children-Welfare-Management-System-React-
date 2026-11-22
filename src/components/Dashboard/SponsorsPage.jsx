import { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useNavigate } from 'react-router-dom';
import { Plus, Download, Trash2, Link2, X } from 'lucide-react';
import { exportToCSV } from '../../utils/exportCSV';

export default function SponsorsPage() {
  const { db, addSponsor, deleteSponsor, matchSponsor } = useData();
  const navigate = useNavigate();

  const [showForm, setShowForm] = useState(false);
  const [showMatcher, setShowMatcher] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    childrenSponsored: 1,
    totalDonated: 0,
    since: new Date().getFullYear().toString(),
  });

  const update = (k, v) => setForm({ ...form, [k]: v });
  const total = db.sponsors.reduce((s, sp) => s + sp.totalDonated, 0);
  const unsponsored = db.children.filter((c) => c.sponsor === 'Unsponsored');

  const handleSubmit = (e) => {
    e.preventDefault();
    addSponsor({
      ...form,
      childrenSponsored: parseInt(form.childrenSponsored) || 0,
      totalDonated: parseInt(form.totalDonated) || 0,
      status: 'ACTIVE',
      preferences: { ageMin: 5, ageMax: 12, gender: 'Any', disabilityFocus: false },
    });
    setForm({
      name: '',
      email: '',
      phone: '',
      childrenSponsored: 1,
      totalDonated: 0,
      since: new Date().getFullYear().toString(),
    });
    setShowForm(false);
    alert('✅ Sponsor added!');
  };

  const handleExport = () => {
    exportToCSV(
      'Sponsors_Report.csv',
      ['ID', 'Name', 'Email', 'Phone', 'Children', 'Total Donated', 'Since', 'Status'],
      db.sponsors.map((s) => [s.id, s.name, s.email, s.phone, s.childrenSponsored, s.totalDonated, s.since, s.status])
    );
  };

  const handleMatch = (sponsorId, childId) => {
    const sponsor = db.sponsors.find((s) => s.id === sponsorId);
    const child = db.children.find((c) => c.id === childId);
    if (!sponsor || !child) return;
    if (confirm(`Match ${sponsor.name} with ${child.name}?`)) {
      matchSponsor(sponsorId, childId);
      alert(`✅ ${child.name} is now sponsored by ${sponsor.name}!`);
    }
  };

  return (
    <div className="animate-fade-in text-slate-300">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Sponsors</h1>
          <p className="text-slate-400 text-sm">
            {db.sponsors.length} sponsors • {total.toLocaleString()} FRw donated
          </p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={handleExport}
            className="bg-slate-800 hover:bg-slate-700 text-white px-5 py-2.5 rounded-lg font-medium border border-slate-700 transition inline-flex items-center gap-2"
          >
            <Download size={16} /> Export Excel
          </button>
          <button
            onClick={() => setShowMatcher(!showMatcher)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium transition inline-flex items-center gap-2"
          >
            <Link2 size={16} /> Matcher
          </button>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-lg font-medium transition inline-flex items-center gap-2"
          >
            <Plus size={16} /> Add Sponsor
          </button>
        </div>
      </div>

      {unsponsored.length > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-6 flex flex-wrap items-center gap-4 mt-6">
          <span className="text-3xl">💛</span>
          <div className="flex-1 min-w-[200px]">
            <p className="text-white font-bold">
              {unsponsored.length} child{unsponsored.length > 1 ? 'ren' : ''} still need a sponsor
            </p>
            <p className="text-slate-400 text-sm">Use the Match button to find the perfect sponsor for each child.</p>
          </div>
          <button
            onClick={() => setShowMatcher(true)}
            className="bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 rounded-lg font-medium text-sm"
          >
            🔗 Open Matcher
          </button>
        </div>
      )}

      {showForm && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8 animate-slide-up">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Add New Sponsor</h2>
            <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-white">
              <X size={20} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-300">Name *</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-300">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-300">Phone *</label>
              <input
                type="tel"
                required
                value={form.phone}
                onChange={(e) => update('phone', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-300">Children Sponsored</label>
              <input
                type="number"
                min="0"
                value={form.childrenSponsored}
                onChange={(e) => update('childrenSponsored', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-300">Total Donated (FRw)</label>
              <input
                type="number"
                min="0"
                value={form.totalDonated}
                onChange={(e) => update('totalDonated', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-300">Sponsor Since</label>
              <input
                type="text"
                value={form.since}
                onChange={(e) => update('since', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"
              />
            </div>
            <div className="md:col-span-3">
              <button
                type="submit"
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-lg font-medium"
              >
                Add Sponsor
              </button>
            </div>
          </form>
        </div>
      )}

      {showMatcher && (
        <div className="bg-slate-900 border border-blue-500/30 rounded-xl p-6 mb-8 animate-slide-up">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white">🔗 Sponsorship Matching</h2>
              <p className="text-slate-400 text-sm">Find the perfect match between sponsors and children in need.</p>
            </div>
            <button onClick={() => setShowMatcher(false)} className="text-slate-400 hover:text-white">
              <X size={20} />
            </button>
          </div>

          {unsponsored.length === 0 ? (
            <p className="text-center text-slate-500 py-8">All children are sponsored! 🎉</p>
          ) : (
            <div className="space-y-6">
              {db.sponsors.map((sp) => {
                const matches = unsponsored.filter((c) => {
                  const p = sp.preferences || {};
                  if (p.ageMin && c.age < p.ageMin) return false;
                  if (p.ageMax && c.age > p.ageMax) return false;
                  if (p.gender && p.gender !== 'Any' && c.gender !== p.gender) return false;
                  if (p.disabilityFocus && c.disability === 'None') return false;
                  return true;
                });
                return (
                  <div key={sp.id} className="bg-slate-800 border border-slate-700 rounded-lg p-5">
                    <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                      <div>
                        <p className="text-white font-bold">{sp.name}</p>
                        <p className="text-xs text-slate-500">
                          Prefers: Ages {sp.preferences?.ageMin || '?'}-{sp.preferences?.ageMax || '?'}, {sp.preferences?.gender || 'Any'}, {sp.preferences?.disabilityFocus ? 'Disability focus' : 'Any disability'}
                        </p>
                      </div>
                      <span className="text-emerald-400 font-bold text-sm">
                        {matches.length} match{matches.length !== 1 ? 'es' : ''}
                      </span>
                    </div>
                    {matches.length === 0 ? (
                      <p className="text-slate-500 text-sm">No matching children currently.</p>
                    ) : (
                      <div className="space-y-2">
                        {matches.map((c) => (
                          <div key={c.id} className="flex items-center justify-between bg-slate-900 border border-slate-700 rounded-lg p-3 flex-wrap gap-2">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{c.avatar}</span>
                              <div>
                                <p className="text-white text-sm font-medium">{c.name}</p>
                                <p className="text-xs text-slate-400">{c.age} yrs • {c.gender} • {c.disability}</p>
                              </div>
                            </div>
                            <button
                              onClick={() => handleMatch(sp.id, c.id)}
                              className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-1.5 rounded-lg text-xs font-medium"
                            >
                              ✓ Match
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {db.sponsors.map((s) => {
          const sponsored = db.children.filter((c) => c.sponsor === s.name);
          return (
            <div key={s.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 card-hover">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-white font-bold text-lg">{s.name}</h3>
                  <p className="text-xs text-slate-500">Sponsor since {s.since}</p>
                </div>
                <span className="badge bg-emerald-500/10 text-emerald-400">{s.status}</span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center mb-4">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Children</p>
                  <p className="text-xl font-bold text-emerald-400">{s.childrenSponsored}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Donated</p>
                  <p className="text-xl font-bold text-blue-400">{(s.totalDonated / 1000).toFixed(0)}K</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Phone</p>
                  <p className="text-xs text-slate-400 mt-1">{s.phone}</p>
                </div>
              </div>
              {sponsored.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs text-slate-500 mb-2">Sponsoring:</p>
                  <div className="flex flex-wrap gap-2">
                    {sponsored.map((c) => (
                      <span
                        key={c.id}
                        onClick={() => navigate(`/dashboard/children/${c.id}`)}
                        className="bg-emerald-500/10 text-emerald-400 text-xs px-3 py-1 rounded-full border border-emerald-500/20 cursor-pointer"
                      >
                        {c.avatar} {c.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex gap-2">
                <button
                  onClick={() => setShowMatcher(true)}
                  className="flex-1 px-3 py-1.5 bg-emerald-500/10 text-emerald-400 text-xs rounded border border-emerald-500/20 inline-flex items-center justify-center gap-1"
                >
                  <Link2 size={12} /> Match
                </button>
                <button
                  onClick={() => confirm('Delete this sponsor?') && deleteSponsor(s.id)}
                  className="px-3 py-1.5 bg-red-500/10 text-red-400 text-xs rounded border border-red-500/20 inline-flex items-center gap-1"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}