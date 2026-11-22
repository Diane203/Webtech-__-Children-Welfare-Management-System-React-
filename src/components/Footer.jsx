import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 py-10 mt-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="text-xl font-bold text-white flex items-center gap-2 mb-3">
              <span className="bg-emerald-500 text-white p-1 rounded text-xs">🏠</span>
              Hope<span className="text-emerald-500">Haven</span>
            </div>
            <p className="text-sm text-slate-500">Dedicated to providing comprehensive welfare management for orphaned and vulnerable children.</p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-3 text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/" className="hover:text-emerald-400 transition">Home</Link></li>
              <li><Link to="/about" className="hover:text-emerald-400 transition">About</Link></li>
              <li><Link to="/impact" className="hover:text-emerald-400 transition">Impact</Link></li>
              <li><Link to="/sponsor" className="hover:text-emerald-400 transition">Sponsor</Link></li>
              <li><Link to="/contact" className="hover:text-emerald-400 transition">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-3 text-sm uppercase tracking-wider">Contact Info</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>✉️ info@hopehaven.org</li>
              <li>📞 +250 780 565 497</li>
              <li>📍 Kigali, Rwanda</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-3 text-sm uppercase tracking-wider">Designer</h4>
            <p className="text-sm text-slate-400">IGIRANEZA DIANE</p>
          </div>
        </div>
        <div className="border-t border-slate-800 pt-6 text-center text-xs text-slate-500">
          <p>© 2026 Hope Haven — Children Welfare Management System. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
