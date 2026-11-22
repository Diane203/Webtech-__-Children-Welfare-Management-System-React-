import { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Plus, Download } from 'lucide-react';
import { exportToCSV } from '../../utils/exportCSV';

export default function HealthPage() {
  const { db, addHealthRecord } = useData();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    childId: '',
    date: new Date().toISOString().split('T')[0],
    type: '',
    diagnosis: '',
    treatment: '',
    doctor: '',
    status: 'Completed',
  });

  const update = (k, v) => setForm({ ...form, [k]: v });

  const handleSubmit = (e) => {
    e.preventDefault();
    addHealthRecord(form);
    setForm({
      childId: '',
      date: new Date().toISOString().split('T')[0],
      type: '',
      diagnosis: '',
      treatment: '',
      doctor: '',
      status: 'Completed',
    });
    setShowForm(false);
    alert('✅ Health record added!');
  };

  const handleExport = () => {
    exportToCSV(
      'Health_Report.csv',
      ['ID', 'Child', 'Date', 'Type', 'Diagnosis', 'Treatment', 'Doctor', 'Status'],
      db.healthRecords.map((h) => {
        const c = db.children.find((x) => x.id === h.childId);
        return [h.id, c ? c.name : 'Unknown', h.date, h.type, h.diagnosis, h.treatment, h.doctor, h.status];
      })
    );
  };

  return (
    <div className="animate-fade-in text-slate-300">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Health Records</h1>
          <p className="text-slate-400 text-sm">{db.healthRecords.length} medical records</p>
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
            <Plus size={16} /> Add Record
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8 mt-6 animate-slide-up">
          <h2 className="text-xl font-bold text-white mb-4">New Health Record</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-300">Child *</label>
              <select
                required
                value={form.childId}
                onChange={(e) => update('childId', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"
              >
                <option value="">Select child...</option>
                {db.children.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-300">Date *</label>
              <input
                type="date"
                required
                value={form.date}
                onChange={(e) => update('date', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-300">Type *</label>
              <input
                type="text"
                required
                placeholder="e.g. Routine Checkup"
                value={form.type}
                onChange={(e) => update('type', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-300">Diagnosis *</label>
              <input
                type="text"
                required
                value={form.diagnosis}
                onChange={(e) => update('diagnosis', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-300">Treatment</label>
              <input
                type="text"
                placeholder="None"
                value={form.treatment}
                onChange={(e) => update('treatment', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-300">Doctor *</label>
              <input
                type="text"
                required
                value={form.doctor}
                onChange={(e) => update('doctor', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-300">Status *</label>
              <select
                required
                value={form.status}
                onChange={(e) => update('status', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"
              >
                <option>Completed</option>
                <option>Ongoing</option>
                <option>Pending</option>
              </select>
            </div>
            <div className="md:col-span-3 flex gap-4">
              <button
                type="submit"
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-lg font-medium"
              >
                Add Record
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
              <th className="p-4">Child</th>
              <th className="p-4">Date</th>
              <th className="p-4">Type</th>
              <th className="p-4">Diagnosis</th>
              <th className="p-4">Treatment</th>
              <th className="p-4">Doctor</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {db.healthRecords.map((h) => {
              const child = db.children.find((c) => c.id === h.childId);
              const cls =
                h.status === 'Completed'
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'bg-amber-500/20 text-amber-400';
              return (
                <tr key={h.id} className="table-row">
                  <td className="p-4 text-slate-400 text-sm">{h.id}</td>
                  <td className="p-4 text-white font-medium text-sm">{child ? child.name : 'Unknown'}</td>
                  <td className="p-4 text-slate-400 text-sm">{h.date}</td>
                  <td className="p-4 text-slate-400 text-sm">{h.type}</td>
                  <td className="p-4 text-slate-300 text-sm">{h.diagnosis}</td>
                  <td className="p-4 text-slate-400 text-sm">{h.treatment}</td>
                  <td className="p-4 text-slate-400 text-sm">{h.doctor}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${cls}`}>{h.status}</span>
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