import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

export default function Login() {
  const [role, setRole] = useState('admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { login } = useAuth();
  const { db } = useData();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = login(email, password, role, db.users);
    if (result.success) navigate('/dashboard');
    else setError(result.error);
  };

  const accent = role === 'admin' ? 'emerald' : 'orange';

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
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
                🏠
              </div>
              <h1 className="text-2xl font-bold text-white mb-1">Welcome Back</h1>
              <p className="text-sm text-slate-500">Sign in to access Hope Haven</p>
            </div>

            <div className="flex gap-2 mb-6">
              <button type="button" onClick={() => setRole('admin')}
                className={`flex-1 py-3 rounded-lg border font-medium text-sm transition ${
                  role === 'admin'
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                    : 'border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-500'
                }`}>
                👤 Administrator
              </button>
              <button type="button" onClick={() => setRole('staff')}
                className={`flex-1 py-3 rounded-lg border font-medium text-sm transition ${
                  role === 'staff'
                    ? 'border-orange-500 bg-orange-500/10 text-orange-400'
                    : 'border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-500'
                }`}>
                🧑‍⚕️ Staff
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                  ❌ {error}
                </div>
              )}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-slate-300">Email Address</label>
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="admin@hopehaven.rw"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white" />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2 text-slate-300">Password</label>
                <input type="password" required minLength="6" value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white" />
              </div>
              <button type="submit"
                className={`w-full bg-${accent}-500 hover:bg-${accent}-600 text-white font-bold py-3 rounded-lg transition`}>
                Login as {role === 'admin' ? 'Administrator' : 'Staff'}
              </button>
            </form>

            <p className="text-center text-sm text-slate-500 mt-6">
              Don't have an account? <Link to="/register" className="text-emerald-400 hover:underline font-medium">Register here</Link>
            </p>

            <div className="mt-6 p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
              <p className="text-xs font-bold text-slate-400 mb-2">🔑 DEMO CREDENTIALS</p>
              <div className="space-y-1 text-xs">
                <p className="text-slate-400">Admin: <span className="text-emerald-400 font-mono">admin@hopehaven.rw</span> / <span className="text-emerald-400 font-mono">admin123</span></p>
                <p className="text-slate-400">Staff: <span className="text-orange-400 font-mono">diane@hopehaven.rw</span> / <span className="text-orange-400 font-mono">staff123</span></p>
              </div>
            </div>

            <p className="text-center text-sm text-slate-500 mt-6">
              <Link to="/" className="text-slate-400 hover:text-emerald-400 transition">← Back to homepage</Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}