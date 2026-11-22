import { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Plus, Download, Trash2 } from 'lucide-react';
import { exportToCSV } from '../../utils/exportCSV';

export default function DonationsPage() {
  const { db, addDonation, deleteDonation } = useData();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    donor: '',
    type: 'Cash',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    purpose: 'General Support',
    method: 'Bank Transfer',
  });

  const update = (k, v) => setForm({ ...form, [k]: v });
  const total = db.donations.reduce((s, d) => s + d.amount, 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    addDonation({ ...form, amount: parseInt(form.amount) });
    setForm({
      donor: '',
      type: 'Cash',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      purpose: 'General Support',
      method: 'Bank Transfer',
    });
    setShowForm(false);
    alert('✅ Donation recorded!');
  };

  const handleExport = () => {
    exportToCSV(
      'Donations_Report.csv',
      ['ID', 'Date', 'Donor', 'Type', 'Amount', 'Purpose', 'Method'],
      db.donations.map((d) => [
        d.id,
        d.date,
        d.donor,
        d.type,
        d.amount,
        d.purpose,
        d.method,
      ])
    );
  };

  return (
    <div className="animate-fade-in text-slate-300">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Donations</h1>
          <p className="text-slate-400 text-sm">
            {db.donations.length} donations • {total.toLocaleString()} FRw total
          </p>
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
            <Plus size={16} /> Add Donation
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8 mt-6 animate-slide-up">
          <h2 className="text-xl font-bold text-white mb-4">Record New Donation</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-300">
                Donor Name *
              </label>
              <input
                type="text"
                required
                value={form.donor}
                onChange={(e) => update('donor', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-300">
                Type *
              </label>
              <select
                value={form.type}
                onChange={(e) => update('type', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"
              >
                <option>Cash</option>
                <option>Supplies</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-300">
                Amount (FRw) *
              </label>
              <input
                type="number"
                required
                min="0"
                value={form.amount}
                onChange={(e) => update('amount', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-300">
                Date *
              </label>
              <input
                type="date"
                required
                value={form.date}
                onChange={(e) => update('date', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-300">
                Purpose *
              </label>
              <input
                type="text"
                required
                value={form.purpose}
                onChange={(e) => update('purpose', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-300">
                Method *
              </label>
              <select
                value={form.method}
                onChange={(e) => update('method', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"
              >
                <option>Bank Transfer</option>
                <option>Mobile Money</option>
                <option>Cheque</option>
                <option>Cash</option>
                <option>In-Kind</option>
              </select>
            </div>
            <div className="md:col-span-3 flex gap-4">
              <button
                type="submit"
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-lg font-medium"
              >
                Add Donation
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
              <th className="p-4">Date</th>
              <th className="p-4">Donor</th>
              <th className="p-4">Type</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Purpose</th>
              <th className="p-4">Method</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {db.donations.map((d) => {
              const cls =
                d.type === 'Cash'
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'bg-blue-500/20 text-blue-400';
              return (
                <tr key={d.id} className="table-row">
                  <td className="p-4 text-slate-400 text-sm">{d.id}</td>
                  <td className="p-4 text-slate-400 text-sm">{d.date}</td>
                  <td className="p-4 text-white font-medium text-sm">{d.donor}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${cls}`}>
                      {d.type}
                    </span>
                  </td>
                  <td className="p-4 text-emerald-400 font-bold text-sm">
                    {d.amount.toLocaleString()} FRw
                  </td>
                  <td className="p-4 text-slate-400 text-sm">{d.purpose}</td>
                  <td className="p-4 text-slate-400 text-sm">{d.method}</td>
                  <td className="p-4">
                    <button
                      onClick={() =>
                        confirm('Delete this donation?') && deleteDonation(d.id)
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