import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Bell, Menu, X } from 'lucide-react';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { currentUser } = useAuth();
  const { db } = useData();
  const navigate = useNavigate();

  const urgentCount = (db.alerts || []).filter(a => a.severity === 'urgent').length;
  const accent = currentUser?.role === 'admin' ? 'emerald' : 'orange';

  return (
    <div className="min-h-screen bg-[#0B1120] flex">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed left-0 top-0 h-screen z-30">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <>
          <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
          <div className="fixed left-0 top-0 h-screen z-50 lg:hidden">
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </>
      )}

      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top Nav */}
        <header className="flex justify-between items-center px-6 py-4 border-b border-slate-800 bg-[#0B1120] sticky top-0 z-20">
          <div className="flex items-center gap-4 text-slate-400">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden hover:text-white transition">
              <Menu size={22} />
            </button>
            <span className="hidden md:block">{currentUser?.role === 'admin' ? 'Administrator' : 'Staff Member'}</span>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={() => navigate('/dashboard/alerts')} className="text-slate-400 hover:text-white transition relative">
              <Bell size={20} />
              {urgentCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 rounded-full border-2 border-[#0B1120] text-white text-[10px] font-bold flex items-center justify-center">
                  {urgentCount}
                </span>
              )}
            </button>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 bg-${accent}-500 rounded-full flex items-center justify-center text-white font-bold text-sm`}>
                {currentUser?.initials}
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-bold text-white leading-tight">{currentUser?.name}</p>
                <p className="text-xs text-slate-500">{currentUser?.email}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="p-6 md:p-8 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}