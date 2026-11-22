import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  const links = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/impact', label: 'Impact' },
    { to: '/sponsor', label: 'Sponsor' },
    { to: '/contact', label: 'Contact' },
  ];

  const isActive = (path) => pathname === path;

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800 bg-[#0B1120]/95 backdrop-blur">
      <div className="max-w-7xl mx-auto flex justify-between items-center p-4 md:p-6">
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-white">
          <span className="bg-emerald-500 text-white p-1.5 rounded-lg text-sm">🏠</span>
          Hope<span className="text-emerald-500">Haven</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <Link key={l.to} to={l.to}
              className={`transition ${isActive(l.to) ? 'text-emerald-400 font-bold' : 'text-slate-300 hover:text-white'}`}>
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link to="/login" className="hidden md:inline-block bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2 rounded-lg font-medium transition">
            Login
          </Link>
          <button onClick={() => setOpen(!open)} className="md:hidden text-white">
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-slate-800 bg-[#0B1120] px-6 py-4 space-y-3 animate-fade-in">
          {links.map(l => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)}
              className={`block py-2 ${isActive(l.to) ? 'text-emerald-400 font-bold' : 'text-slate-300'}`}>
              {l.label}
            </Link>
          ))}
          <Link to="/login" onClick={() => setOpen(false)} className="block bg-emerald-500 text-white text-center px-5 py-2 rounded-lg font-medium">
            Login
          </Link>
        </div>
      )}
    </nav>
  );
}