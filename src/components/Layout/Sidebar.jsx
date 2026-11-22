import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import {
  LayoutDashboard, Baby, Users, HeartHandshake, Activity,
  BookOpen, Handshake, Bell, TrendingUp, FileText, Settings, LogOut
} from 'lucide-react';

export default function Sidebar({ onClose }) {
  const { currentUser, logout } = useAuth();
  const { db } = useData();

  if (!currentUser) return null;

  const isAdmin = currentUser.role === 'admin';
  const accent = isAdmin ? 'emerald' : 'orange';
  const urgentCount = (db.alerts || []).filter(a => a.severity === 'urgent').length;

  const adminLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/dashboard/children', label: 'Children', icon: Baby },
    { to: '/dashboard/staff', label: 'Staff', icon: Users },
    { to: '/dashboard/donations', label: 'Donations', icon: HeartHandshake },
    { to: '/dashboard/health', label: 'Health', icon: Activity },
    { to: '/dashboard/education', label: 'Education', icon: BookOpen },
    { to: '/dashboard/sponsors', label: 'Sponsors', icon: Handshake },
    { to: '/dashboard/alerts', label: 'Alerts', icon: Bell, badge: urgentCount },
    { to: '/dashboard/reports', label: 'Reports', icon: TrendingUp },
  ];

  const staffLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/dashboard/children', label: 'Children', icon: Baby },
    { to: '/dashboard/health', label: 'Health', icon: Activity },
    { to: '/dashboard/education', label: 'Education', icon: BookOpen },
    { to: '/dashboard/alerts', label: 'Alerts', icon: Bell, badge: urgentCount },
    { to: '/dashboard/profile', label: 'My Profile', icon: Settings },
  ];

  const links = isAdmin ? adminLinks : staffLinks;

  return (
    <aside className="w-64 h-full bg-[#0B1120] border-r border-slate-800 flex flex-col">
      <div className="p-6 text-xl font-bold text-white flex items-center gap-2 border-b border-slate-800">
        <span className={`bg-${accent}-500 text-white p-1 rounded text-sm`}>🏠</span>
        Hope<span className={`text-${accent}-500`}>Haven</span>
      </div>

      <div className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
        {isAdmin ? 'ADMIN PANEL' : 'STAFF PANEL'}
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const Icon = link.icon;
          const activeClass = isAdmin
            ? 'bg-emerald-500/10 text-emerald-400'
            : 'bg-orange-500/10 text-orange-400';
          return (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition ${
                  isActive ? activeClass : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <span className="flex items-center gap-3">
                <Icon size={18} />
                {link.label}
              </span>
              {link.badge > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                  {link.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition">
          <LogOut size={18} /> Logout
        </button>
      </div>
    </aside>
  );
}