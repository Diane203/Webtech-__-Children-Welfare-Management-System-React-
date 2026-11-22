import { Link } from 'react-router-dom';
import { Baby, Heart, BookOpen, Users, HeartHandshake, BarChart3, ArrowRight, Sparkles } from 'lucide-react';
import { useData } from '../context/DataContext';

export default function Home() {
  const { db } = useData();

  const modules = [
    { icon: Baby, title: 'Child Management', desc: 'Complete profiles, health records, and development tracking for every child in our care.', color: 'emerald' },
    { icon: Heart, title: 'Health & Care', desc: 'Medical checkups, treatments, and specialized disability support with full audit trails.', color: 'red' },
    { icon: BookOpen, title: 'Education Tracking', desc: 'School enrollment, grades, attendance, and academic progress for every child.', color: 'blue' },
    { icon: HeartHandshake, title: 'Donations & Sponsors', desc: 'Track donations, manage sponsors, and monitor fundraising campaigns.', color: 'purple' },
    { icon: Users, title: 'Staff Coordination', desc: 'Manage social workers, healthcare providers, and educators with role-based access.', color: 'amber' },
    { icon: BarChart3, title: 'Reports & Analytics', desc: 'Generate comprehensive reports on welfare activities with visual charts.', color: 'pink' },
  ];

  const totalDonated = db.donations.reduce((s, d) => s + d.amount, 0);

  const stats = [
    { value: `${db.children.length}+`, label: 'Children Cared For', color: 'text-emerald-400' },
    { value: db.staff.length, label: 'Dedicated Staff', color: 'text-blue-400' },
    { value: db.sponsors.length, label: 'Active Sponsors', color: 'text-purple-400' },
    { value: `${(totalDonated / 1000000).toFixed(1)}M+`, label: 'FRw Donated', color: 'text-orange-400' },
  ];

  return (
    <div className="text-slate-300">
      {/* HERO */}
      <section className="relative max-w-5xl mx-auto text-center py-20 md:py-28 px-4 animate-fade-in">
        <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-4 py-1.5 rounded-full text-sm font-medium mb-6 border border-emerald-500/20">
          <Sparkles size={14} />
          Children Welfare Management System — Rwanda
        </div>
        <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
          Every Child Deserves<br />
          <span className="gradient-text-emerald">A Hope & A Haven.</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          A comprehensive welfare management system designed to care for orphaned and vulnerable children, with specialized support for those with disabilities.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link to="/sponsor" className="group bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold transition shadow-lg shadow-emerald-500/20 inline-flex items-center gap-2">
            Sponsor a Child
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link to="/about" className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-3 rounded-lg font-semibold transition border border-slate-700">
            Learn More
          </Link>
        </div>
      </section>

      {/* STATS */}
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

      {/* CORE MODULES */}
      <section className="max-w-6xl mx-auto py-16 px-4">
        <div className="text-center mb-12">
          <p className="text-emerald-500 text-xs font-bold tracking-widest mb-2">WHAT WE OFFER</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Core Modules</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">Everything needed to manage a modern children welfare center in one place.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((m, i) => {
            const Icon = m.icon;
            return (
              <div key={i} className="bg-slate-800/50 border border-slate-700 p-8 rounded-xl card-hover">
                <div className={`w-12 h-12 bg-${m.color}-500/20 text-${m.color}-400 rounded-xl flex items-center justify-center mb-4`}>
                  <Icon size={24} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{m.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{m.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto py-16 px-4">
        <div className="bg-gradient-to-br from-emerald-500/10 via-slate-900 to-blue-500/10 border border-emerald-500/20 rounded-2xl p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to make a difference?</h2>
          <p className="text-slate-400 mb-8 max-w-lg mx-auto">Sponsor a child or log in as Administrator / Staff to manage the welfare center.</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link to="/sponsor" className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-lg font-bold transition shadow-lg shadow-emerald-500/20">
              💝 Sponsor Now
            </Link>
            <Link to="/login" className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-3 rounded-lg font-bold border border-slate-700 transition">
              Access System
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
