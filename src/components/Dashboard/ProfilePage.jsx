import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

export default function ProfilePage() {
  const { currentUser, setCurrentUser } = useAuth();
  const { updateUser } = useData();

  const [form, setForm] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '+250780565497',
  });

  const update = (k, v) => setForm({ ...form, [k]: v });

  const initials = (form.name || 'U')
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const handleSave = () => {
    const updated = { ...currentUser, ...form, initials };
    setCurrentUser(updated);
    updateUser(updated);
    alert('✅ Profile saved!');
  };

  return (
    <div className="animate-fade-in text-slate-300">
      <h1 className="text-3xl font-bold text-white mb-1">My Profile</h1>
      <p className="text-slate-400 mb-8">Manage your account information.</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center">
          <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
            {initials}
          </div>
          <h2 className="text-xl font-bold text-white">{form.name}</h2>
          <p className="text-slate-400 text-sm mb-4">
            {currentUser?.role === 'admin' ? 'Administrator' : 'Staff Member'}
          </p>
          <span className="badge bg-emerald-500/10 text-emerald-400">ACTIVE</span>
        </div>

        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-8">
          <h2 className="text-lg font-bold text-white mb-6">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-xs font-bold mb-2 text-slate-400">Full Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-2 text-slate-400">Email Address</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-2 text-slate-400">Phone Number</label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => update('phone', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"
              />
            </div>
          </div>
          <button
            onClick={handleSave}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-lg font-medium transition"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}