import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useEffect, useState } from 'react';

export default function Impact() {
  const { db } = useData();
  const GOAL = 5000000;

  const totalDonated = db.donations.reduce((s, d) => s + d.amount, 0);
  const percent = Math.min(100, (totalDonated / GOAL) * 100);
  const [animatedPercent, setAnimatedPercent] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setAnimatedPercent(percent), 100);
    return () => clearTimeout(t);
  }, [percent]);

  const stats = [
    { value: db.children.length, label: 'Children in Care', color: 'text-emerald-400' },
    { value: db.staff.length, label: 'Dedicated Staff', color: 'text-blue-400' },
    { value: db.sponsors.length, label: 'Active Sponsors', color: 'text-purple-400' },
    { value: `${(totalDonated / 1000000).toFixed(1)}M`, label: 'FRw Donated', color: 'text-orange-400' },
  ];

  const stories = [
    { icon: '🌟', title: 'From Silence to Words', desc: 'After receiving a hearing aid, 6-year-old Eric said his first words. His world opened up — and so did ours.' },
    { icon: '🥇', title: 'Champion Despite Challenges', desc: 'Patrick, who uses a wheelchair, won gold at the regional sports competition. Nothing holds him back.' },
    { icon: '🏆', title: 'Best Student Award', desc: "Aline topped her class this term. Her sponsor's support turned into a bright academic future." },
  ];

  const uniqueDonors = new Set(db.donations.map(d => d.donor)).size;

  return (
    <div className="text-slate-300">
      {/* HERO */}
      <section className="max-w-5xl mx-auto py-20 px-4 text-center animate-fade-in">
        <p className="text-emerald-500 text-xs font-bold tracking-widest mb-2">OUR IMPACT</p>
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
          Real Change. <span className="gradient-text-emerald">Real Children.</span>
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto">
          Here's a live look at the impact we're making together — thanks to our staff, sponsors, and donors.
        </p>
      </section>

      {/* LIVE STATS */}
      <section className="max-w-6xl mx-auto py-12 px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-center card-hover">
              <p className={`text-4xl font-bold mb-1 ${s.color}`}>{s.value}</p>
              <p className="text-xs text-slate-500 uppercase tracking-wider">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* GOAL PROGRESS */}
      <section className="max-w-6xl mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">Donation Goal Progress</h2>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 max-w-3xl mx-auto">
          <div className="flex justify-between mb-3">
            <span className="text-white font-bold">New Beds for Children</span>
            <span className="text-emerald-400 font-bold">{animatedPercent.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-4 mb-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-500 to-blue-500 h-4 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${animatedPercent}%` }}
            />
          </div>
          <p className="text-slate-400 text-sm">
            Goal: 5,000,000 FRw — Raised so far: <span className="text-emerald-400 font-bold">{totalDonated.toLocaleString()} FRw</span>
          </p>
          <p className="text-xs text-slate-500 mt-3">
            {db.donations.length} contribution{db.donations.length !== 1 ? 's' : ''} from {uniqueDonors} generous donor{uniqueDonors !== 1 ? 's' : ''}
          </p>
        </div>
      </section>

      {/* STORIES */}
      <section className="max-w-6xl mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">Success Stories</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {stories.map((s, i) => (
            <div key={i} className="bg-slate-900 border border-slate-800 p-6 rounded-xl card-hover">
              <div className="text-4xl mb-3">{s.icon}</div>
              <h3 className="text-white font-bold mb-2">{s.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto py-16 px-4 text-center">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-2xl p-12">
          <h2 className="text-3xl font-bold text-white mb-4">Be Part of the Story</h2>
          <p className="text-slate-400 mb-8">Your support changes lives. Sponsor a child or make a donation today.</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link to="/sponsor" className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-lg font-bold transition">💝 Sponsor a Child</Link>
            <Link to="/contact" className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-3 rounded-lg font-bold border border-slate-700 transition">Contact Us</Link>
          </div>
        </div>
      </section>
    </div>
  );
}