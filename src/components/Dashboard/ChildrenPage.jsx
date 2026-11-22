import { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useNavigate } from 'react-router-dom';
import { Search, Download, Plus, Trash2, Eye } from 'lucide-react';
import { exportToCSV } from '../../utils/exportCSV';
import { calcAge } from '../../utils/calcAge';

export default function ChildrenPage() {
  const { db, addChild, deleteChild } = useData();
  const navigate = useNavigate();

  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [form, setForm] = useState({
    name: '', dob: '', gender: '', disability: '', sponsor: ''
  });

  const update = (k, v) => setForm({ ...form, [k]: v });

  let filtered = db.children.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.id.toLowerCase().includes(search.toLowerCase())
  );
  if (filter === 'active') filtered = filtered.filter(c => c.status === 'ACTIVE');
  if (filter === 'disability') filtered = filtered.filter(c => c.disability !== 'None');
  if (filter === 'unsponsored') filtered = filtered.filter(c => c.sponsor === 'Unsponsored');

  const handleSubmit = (e) => {
    e.preventDefault();
    const age = calcAge(form.dob);
    addChild({
      name: form.name,
      age,
      gender: form.gender,
      dob: form.dob,
      disability: form.disability,
      healthStatus: 'Healthy',
      educationLevel: 'Nursery',
      sponsor: form.sponsor || 'Unsponsored',
    });
    setForm({ name: '', dob: '', gender: '', disability: '', sponsor: '' });
    setShowForm(false);
    alert('✅ Child registered successfully!');
  };

  const handleDelete = (id) => {
    if (confirm('Delete this child record?')) deleteChild(id);
  };

  const handleExport = () => {
    exportToCSV('Children_Report.csv',
      ['ID', 'Name', 'Age', 'Gender', 'DOB', 'Disability', 'Education', 'Sponsor', 'Admission', 'Status'],
      db.children.map(c => [c.id, c.name, c.age, c.gender, c.dob, c.disability, c.educationLevel, c.sponsor, c.admissionDate, c.status])
    );
  };

  const filters = [
    { key: 'all', label: 'All' },
    { key: 'active', label: 'Active' },
    { key: 'disability', label: 'With Disability' },
    { key: 'unsponsored', label: 'Unsponsored' },
  ];

  return (
    <div className="animate-fade-in text-slate-300">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Children Management</h1>
          <p className="text-slate-400 text-sm">{db.children.length} children registered</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleExport}
            className="bg-slate-800 hover:bg-slate-700 text-white px-5 py-2.5 rounded-lg font-medium border border-slate-700 transition inline-flex items-center gap-2">
            <Download size={16} /> Export Excel
          </button>
          <button onClick={() => setShowForm(!showForm)}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-lg font-medium transition inline-flex items-center gap-2">
            <Plus size={16} /> Add Child
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8 mt-6 animate-slide-up">
          <h2 className="text-xl font-bold text-white mb-4">Register New Child</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-300">Full Name *</label>
              <input type="text" required value={form.name} onChange={e => update('name', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-300">Date of Birth *</label>
              <input type="date" required value={form.dob} max={new Date().toISOString().split('T')[0]}
                onChange={e => update('dob', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-300">Gender *</label>
              <select required value={form.gender} onChange={e => update('gender', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white">
                <option value="">Select</option>
                <option>Male</option>
                <option>Female</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-300">Disability Status *</label>
              <select required value={form.disability} onChange={e => update('disability', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white">
                <option value="">Select</option>
                <option>None</option>
                <option>Hearing Impairment</option>
                <option>Visual Impairment</option>
                <option>Physical Disability</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-300">Sponsor</label>
              <input type="text" value={form.sponsor} onChange={e => update('sponsor', e.target.value)}
                placeholder="Unsponsored"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white" />
            </div>
            <div className="md:col-span-3 flex gap-4">
              <button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-lg font-medium">Register Child</button>
              <button type="button" onClick={() => setShowForm(false)} className="text-slate-400 hover:text-white px-4">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-4 my-6">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search children..."
            className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2.5 pl-11 pr-4 text-white" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {filters.map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)}
              className={`px-5 py-2.5 text-sm font-medium rounded-lg transition ${
                filter === f.key
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden overflow-x-auto">
        <table className="w-full text-left min-w-[800px]">
          <thead>
            <tr className="text-slate-500 text-xs uppercase border-b border-slate-800">
              <th className="p-4">ID</th>
              <th className="p-4">Child</th>
              <th className="p-4">Age</th>
              <th className="p-4">Gender</th>
              <th className="p-4">Disability</th>
              <th className="p-4">Education</th>
              <th className="p-4">Sponsor</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c.id} className="table-row cursor-pointer" onClick={() => navigate(`/dashboard/children/${c.id}`)}>
                <td className="p-4 text-slate-400 text-sm">{c.id}</td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{c.avatar}</span>
                    <span className="text-white font-medium text-sm">{c.name}</span>
                  </div>
                </td>
                <td className="p-4 text-slate-300 text-sm">{c.age} yrs</td>
                <td className="p-4 text-slate-400 text-sm">{c.gender}</td>
                <td className="p-4">
                  <span className={`text-xs font-bold ${c.disability === 'None' ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {c.disability}
                  </span>
                </td>
                <td className="p-4 text-slate-400 text-sm">{c.educationLevel}</td>
                <td className="p-4 text-slate-400 text-sm">{c.sponsor}</td>
                <td className="p-4" onClick={e => e.stopPropagation()}>
                  <button onClick={() => navigate(`/dashboard/children/${c.id}`)}
                    className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 text-xs rounded border border-emerald-500/20 mr-1 inline-flex items-center gap-1">
                    <Eye size={12} /> View
                  </button>
                  <button onClick={() => handleDelete(c.id)}
                    className="px-3 py-1.5 bg-red-500/10 text-red-400 text-xs rounded border border-red-500/20 inline-flex items-center gap-1">
                    <Trash2 size={12} /> Delete
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="8" className="p-8 text-center text-slate-500">No children match your filters.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}