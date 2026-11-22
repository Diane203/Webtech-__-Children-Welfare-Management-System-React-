import { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Plus, Download, Trash2 } from 'lucide-react';
import { exportToCSV } from '../../utils/exportCSV';

export default function StaffPage() {
  const { db, addStaff, deleteStaff } = useData();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '',
    role: '',
    email: '',
    phone: '',
    childrenAssigned: 0,
    status: 'ACTIVE',
  });

  const update = (k, v) => setForm({ ...form, [k]: v });

  const handleSubmit = (e) => {
    e.preventDefault();
    addStaff({ ...form, childrenAssigned: parseInt(form.childrenAssigned) || 0 });
    setForm({
      name: '',
      role: '',
      email: '',
      phone: '',
      childrenAssigned: 0,
      status: 'ACTIVE',
    });
    setShowForm(false);
  };

  const handleExport = () => {
    exportToCSV(
      'Staff_Report.csv',
      ['ID', 'Name', 'Role', 'Email', 'Phone', 'Children', 'Status'],
      db.staff.map((s) => [
        s.id,
        s.name,
        s.role,
        s.email,
        s.phone,
        s.childrenAssigned,
        s.status,
      ])
    );
  };

  return (
    <div className="animate-fade-in text-slate-300">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Staff Management</h1>
          <p className="text-slate-400 text-sm">{db.staff.length} staff members</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleExport}
            className="bg-slate-800 hover:bg-slate-700 text-white px-5 py-2.5 rounded-lg font-medium border border-slate-700 transition inline-flex items-center gap-2"
          >
            <Download size={16} /> Export Excel
          </button>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-lg font-medium transition inline-flex items-center gap-2"
          >
            <Plus size={16} /> Add Staff
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8 mt-6 animate-slide-up">
          <h2 className="text-xl font-bold text-white mb-4">Add New Staff Member</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-300">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-300">
                Role *
              </label>
              <select
                required
                value={form.role}
                onChange={(e) => update('role', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"
              >
                <option value="">Select role...</option>
                <option>Social Worker</option>
                <option>Healthcare Provider</option>
                <option>Educator</option>
                <option>Administrator</option>
                <option>Caregiver</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-300">
                Email *
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-300">
                Phone *
              </label>
              <input
                type="tel"
                required
                value={form.phone}
                onChange={(e) => update('phone', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-300">
                Children Assigned
              </label>
              <input
                type="number"
                min="0"
                value={form.childrenAssigned}
                onChange={(e) => update('childrenAssigned', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-300">
                Status *
              </label>
              <select
                required
                value={form.status}
                onChange={(e) => update('status', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"
              >
                <option>ACTIVE</option>
                <option>ON LEAVE</option>
                <option>SUSPENDED</option>
                <option>RESIGNED</option>
              </select>
            </div>
            <div className="md:col-span-3 flex gap-4">
              <button
                type="submit"
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-lg font-medium"
              >
                Add Staff
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="text-slate-400 hover:text-white px-4"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden mt-6 overflow-x-auto">
        <table className="w-full text-left min-w-[800px]">
          <thead>
            <tr className="text-slate-500 text-xs uppercase border-b border-slate-800">
              <th className="p-4">ID</th>
              <th className="p-4">Name</th>
              <th className="p-4">Role</th>
              <th className="p-4">Email</th>
              <th className="p-4">Phone</th>
              <th className="p-4">Children</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {db.staff.map((s) => {
              const cls =
                s.status === 'ACTIVE'
                  ? 'bg-emerald-500/10 text-emerald-400'
                  : 'bg-red-500/10 text-red-400';
              return (
                <tr key={s.id} className="table-row">
                  <td className="p-4 text-slate-400 text-sm">{s.id}</td>
                  <td className="p-4 text-white font-medium text-sm">{s.name}</td>
                  <td className="p-4 text-slate-400 text-sm">{s.role}</td>
                  <td className="p-4 text-slate-400 text-sm">{s.email}</td>
                  <td className="p-4 text-slate-400 text-sm">{s.phone}</td>
                  <td className="p-4 text-white font-bold text-sm">
                    {s.childrenAssigned}
                  </td>
                  <td className="p-4">
                    <span className={`badge ${cls}`}>{s.status}</span>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() =>
                        confirm('Delete this staff member?') && deleteStaff(s.id)
                      }
                      className="px-3 py-1.5 bg-red-500/10 text-red-400 text-xs rounded border border-red-500/20 inline-flex items-center gap-1"
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}