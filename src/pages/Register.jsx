import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

export default function Register() {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', role: 'staff',
    password: '', confirmPassword: ''
  });
  const [error, setError] = useState('');

  const { register } = useAuth();
  const { db, addUser } = useData();
  const navigate = useNavigate();

  const update = (k, v) => setForm({ ...form, [k]: v });

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = register(form, db.users);
    if (!result.success) return setError(result.error);

    const initials = form.name.split(' ').filter(Boolean).map(n => n[0]).join('').substring(0, 2).toUpperCase();
    const newUser = {
      id: db.users.length ? Math.max(...db.users.map(u => u.id)) + 1 : 1,
      name: form.name,
      email: form.email.trim(),
      password: form.password,
      role: form.role,
      initials,
      phone: form.phone || '',
      memberSince: new Date().toLocaleString('default', { month: 'short', year: 'numeric' })
    };
    addUser(newUser);

    alert(`✅ Account created!\n\nWelcome, ${form.name}!`);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#0B1120] flex flex-col">
      <div className="mesh-bg" />

      <nav className="flex justify-between items-center p-6 border-b border-slate-800 sticky top-0 z-20 bg-[#0B1120]/95 backdrop-blur">
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-white">
          <span className="bg-emerald-500 text-white p-1.5 rounded-lg text-sm">🏠</span>
          Hope<span className="text-emerald-500">Haven</span>
        </Link>
        <div className="hidden md:flex gap-8">
          <Link to="/" className="text-slate-300 hover:text-white transition">Home</Link>
          <Link to="/about" className="text-slate-300 hover:text-white transition">About</Link>
          <Link to="/impact" className="text-slate-300 hover:text-white transition">Impact</Link>
          <Link to="/sponsor" className="text-slate-300 hover:text-white transition">Sponsor</Link>
          <Link to="/contact" className="text-slate-300 hover:text-white transition">Contact</Link>
        </div>
      </nav>

      <main className="flex-1 flex items-center justify-center px-4 py-12 relative z-10">
        <div className="w-full max-w-md animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">📝</div>
              <h1 className="text-2xl font-bold text-white mb-1">Create Account</h1>
              <p className="text-sm text-slate-500">Join Hope Haven today</p>
            </div>

            <form onSubmit={handleSubmit}>
              {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                  ❌ {error}
                </div>
              )}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-slate-300">Full Name *</label>
                <input type="text" required value={form.name} onChange={e => update('name', e.target.value)}
                  placeholder="Your Full Name"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white" />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-slate-300">Email Address *</label>
                <input type="email" required value={form.email} onChange={e => update('email', e.target.value)}
                  placeholder="you@hopehaven.rw"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white" />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-slate-300">Phone Number</label>
                <input type="tel" value={form.phone} onChange={e => update('phone', e.target.value)}
                  placeholder="+250 7XX XXX XXX"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white" />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-slate-300">Role *</label>
                <select required value={form.role} onChange={e => update('role', e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white">
                  <option value="staff">Staff Member</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-slate-300">Password *</label>
                <input type="password" required minLength="6" value={form.password} onChange={e => update('password', e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white" />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2 text-slate-300">Confirm Password *</label>
                <input type="password" required minLength="6" value={form.confirmPassword} onChange={e => update('confirmPassword', e.target.value)}
                  placeholder="Re-enter password"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white" />
              </div>
              <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-lg transition">
                Create Account
              </button>
            </form>

            <p className="text-center text-sm text-slate-500 mt-6">
              Already have an account? <Link to="/login" className="text-emerald-400 hover:underline font-medium">Login here</Link>
            </p>
            <p className="text-center text-sm text-slate-500 mt-2">
              <Link to="/" className="text-slate-400 hover:text-emerald-400 transition">← Back to homepage</Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}