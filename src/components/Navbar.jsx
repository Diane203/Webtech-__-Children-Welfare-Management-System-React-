import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const location = useLocation()
  const isActive = (path) => location.pathname === path

  return (
    <nav className="flex justify-between items-center p-6 border-b border-slate-800 sticky top-0 bg-[#0B1120]/95 backdrop-blur z-50">
      <Link to="/" className="text-2xl font-bold text-white flex items-center gap-2">
        <span className="bg-emerald-500 text-white p-1.5 rounded-lg text-sm">🏠</span>
        Hope<span className="text-emerald-500">Haven</span>
      </Link>
      <div className="hidden md:flex items-center gap-8">
        <Link to="/" className={isActive('/') ? 'text-emerald-400 font-bold' : 'text-slate-300 hover:text-white transition'}>Home</Link>
        <Link to="/about" className={isActive('/about') ? 'text-emerald-400 font-bold' : 'text-slate-300 hover:text-white transition'}>About</Link>
        <Link to="/impact" className={isActive('/impact') ? 'text-emerald-400 font-bold' : 'text-slate-300 hover:text-white transition'}>Impact</Link>
        <Link to="/sponsor" className={isActive('/sponsor') ? 'text-emerald-400 font-bold' : 'text-slate-300 hover:text-white transition'}>Sponsor</Link>
        <Link to="/contact" className={isActive('/contact') ? 'text-emerald-400 font-bold' : 'text-slate-300 hover:text-white transition'}>Contact</Link>
      </div>
      <Link to="/login" className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2 rounded-lg font-medium transition">Login</Link>
    </nav>
  )
}
