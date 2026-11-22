import { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useNavigate } from 'react-router-dom';
import { Plus, X } from 'lucide-react';

const GROUP_STYLES = {
  urgent: { border: 'border-l-red-500', bg: 'bg-red-500/20', text: 'text-red-400' },
  soon: { border: 'border-l-amber-500', bg: 'bg-amber-500/20', text: 'text-amber-400' },
  info: { border: 'border-l-blue-500', bg: 'bg-blue-500/20', text: 'text-blue-400' },
};

export default function AlertsPage() {
  const { db, addAlert } = useData();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    childId: '',
    title: '',
    type: 'Medical Follow-up',
    description: '',
    dueDate: new Date().toISOString().split('T')[0],
    severity: 'urgent',
  });

  const update = (k, v) => setForm({ ...form, [k]: v });

  const handleSubmit = (e) => {
    e.preventDefault();
    addAlert(form);
    setForm({
      childId: '',
      title: '',
      type: 'Medical Follow-up',
      description: '',
      dueDate: new Date().toISOString().split('T')[0],
      severity: 'urgent',
    });
    setShowForm(false);
    alert('✅ Alert added!');
  };

  const alerts = db.alerts || [];
  const urgent = alerts.filter((a) => a.severity === 'urgent');
  const soon = alerts.filter((a) => a.severity === 'soon');
  const info = alerts.filter((a) => a.severity === 'info');

  const renderGroup = (title, icon, list, severity) => {
    if (!list.length) return null;
    const styles = GROUP_STYLES[severity];
    return (
      <div className="mb-8">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <span>{icon}</span> {title}{' '}
          <span className="text-sm text-slate-500 font-normal">({list.length})</span>
        </h3>
        <div className="space-y-3">
          {list.map((a) => {
            const child = db.children.find((c) => c.id === a.childId);
            return (
              <div
                key={a.id}
                className={`bg-slate-900 border border-slate-800 border-l-4 ${styles.border} rounded-xl p-5 flex items-start gap-4 flex-wrap`}
              >
                <div className={`w-10 h-10 ${styles.bg} ${styles.text} rounded-lg flex items-center justify-center text-xl flex-shrink-0`}>
                  {icon}
                </div>
                <div className="flex-1 min-w-[200px]">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <p className="text-white font-bold">{a.title}</p>
                      <p className="text-sm text-slate-400 mt-1">{a.description}</p>
                      <div className="flex gap-4 mt-2 text-xs text-slate-500 flex-wrap">
                        <span>👶 {child ? child.name : 'Unknown'}</span>
                        <span>📅 Due: {a.dueDate}</span>
                        <span>🏷️ {a.type}</span>
                      </div>
                    </div>
                    {child && (
                      <button
                        onClick={() => navigate(`/dashboard/children/${child.id}`)}
                        className="bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap"
                      >
                        View Child →
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="animate-fade-in text-slate-300">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">🔔 Smart Alerts</h1>
          <p className="text-slate-400 text-sm">
            {alerts.length} total alerts • {urgent.length} urgent
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-lg font-medium transition inline-flex items-center gap-2 self-start"
        >
          <Plus size={16} /> Add Alert
        </button>
      </div>

      {showForm && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8 mt-6 animate-slide-up">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Create Alert</h2>
            <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-white">
              <X size={20} />
            </button>
          </div>
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
              <label className="block text-sm font-medium mb-2 text-slate-300">Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Medication refill due"
                value={form.title}
                onChange={(e) => update('title', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-300">Type *</label>
              <select
                required
                value={form.type}
                onChange={(e) => update('type', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"
              >
                <option>Medical Follow-up</option>
                <option>Medication</option>
                <option>Vaccination</option>
                <option>Birthday</option>
                <option>Education</option>
                <option>Sponsorship</option>
                <option>General</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2 text-slate-300">Description *</label>
              <input
                type="text"
                required
                value={form.description}
                onChange={(e) => update('description', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-300">Due Date *</label>
              <input
                type="date"
                required
                value={form.dueDate}
                onChange={(e) => update('dueDate', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-300">Severity *</label>
              <select
                required
                value={form.severity}
                onChange={(e) => update('severity', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"
              >
                <option value="urgent">🔴 Urgent</option>
                <option value="soon">🟡 Soon</option>
                <option value="info">🔵 Info</option>
              </select>
            </div>
            <div className="md:col-span-3">
              <button
                type="submit"
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-lg font-medium"
              >
                Add Alert
              </button>
            </div>
          </form>
        </div>
      )}

      {renderGroup('Urgent — Action Required', '🚨', urgent, 'urgent')}
      {renderGroup('Coming Soon', '⏰', soon, 'soon')}
      {renderGroup('Informational', 'ℹ️', info, 'info')}

      {alerts.length === 0 && (
        <div className="text-center py-16 text-slate-500">
          No alerts. Everything is running smoothly! ✨
        </div>
      )}
    </div>
  );
}