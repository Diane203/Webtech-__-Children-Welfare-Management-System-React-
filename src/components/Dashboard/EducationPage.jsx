import { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Plus, Download } from 'lucide-react';
import { exportToCSV } from '../../utils/exportCSV';

export default function EducationPage() {
  const { db, addEducationRecord } = useData();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    childId: '',
    school: '',
    levelType: '',
    levelNumber: '',
    term: 'Term 1',
    grade: '',
    attendance: '',
    teacher: '',
  });

  const update = (k, v) => setForm({ ...form, [k]: v });

  const handleSubmit = (e) => {
    e.preventDefault();
    const level =
      form.levelType === 'Nursery'
        ? `Nursery ${form.levelNumber}`
        : `${form.levelType} ${form.levelNumber}`;
    addEducationRecord({
      childId: form.childId,
      school: form.school,
      level,
      term: form.term,
      grade: form.grade,
      attendance: form.attendance,
      teacher: form.teacher,
    });
    setForm({
      childId: '',
      school: '',
      levelType: '',
      levelNumber: '',
      term: 'Term 1',
      grade: '',
      attendance: '',
      teacher: '',
    });
    setShowForm(false);
    alert('✅ Education record added!');
  };

  const handleExport = () => {
    exportToCSV(
      'Education_Report.csv',
      ['ID', 'Child', 'School', 'Level', 'Term', 'Grade', 'Attendance', 'Teacher'],
      db.education.map((e) => {
        const c = db.children.find((x) => x.id === e.childId);
        return [e.id, c ? c.name : 'Unknown', e.school, e.level, e.term, e.grade || '—', e.attendance || '—', e.teacher || '—'];
      })
    );
  };

  const maxLevels = form.levelType === 'Nursery' ? 3 : 6;

  return (
    <div className="animate-fade-in text-slate-300">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Education Records</h1>
          <p className="text-slate-400 text-sm">{db.education.length} records</p>
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
          <h2 className="text-xl font-bold text-white mb-4">New Education Record</h2>
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
              <label className="block text-sm font-medium mb-2 text-slate-300">School *</label>
              <input
                type="text"
                required
                placeholder="Hope Primary School"
                value={form.school}
                onChange={(e) => update('school', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-300">Level Type *</label>
              <select
                required
                value={form.levelType}
                onChange={(e) => update('levelType', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"
              >
                <option value="">Select type...</option>
                <option>Nursery</option>
                <option>Primary</option>
                <option>Secondary</option>
              </select>
            </div>
            {form.levelType && (
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-300">Level Number *</label>
                <select
                  required
                  value={form.levelNumber}
                  onChange={(e) => update('levelNumber', e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"
                >
                  <option value="">Select level...</option>
                  {Array.from({ length: maxLevels }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>{form.levelType} {n}</option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-300">Term *</label>
              <select
                required
                value={form.term}
                onChange={(e) => update('term', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"
              >
                <option>Term 1</option>
                <option>Term 2</option>
                <option>Term 3</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-300">Grade (optional)</label>
              <select
                value={form.grade}
                onChange={(e) => update('grade', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"
              >
                <option value="">— No grade yet —</option>
                {['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'E', 'F'].map((g) => (
                  <option key={g}>{g}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-300">Attendance</label>
              <input
                type="text"
                placeholder="e.g. 95%"
                value={form.attendance}
                onChange={(e) => update('attendance', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-300">Teacher</label>
              <input
                type="text"
                placeholder="e.g. Ms. Grace"
                value={form.teacher}
                onChange={(e) => update('teacher', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"
              />
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
              <th className="p-4">Child</th>
              <th className="p-4">School</th>
              <th className="p-4">Level</th>
              <th className="p-4">Term</th>
              <th className="p-4">Grade</th>
              <th className="p-4">Attendance</th>
              <th className="p-4">Teacher</th>
            </tr>
          </thead>
          <tbody>
            {db.education.map((e) => {
              const child = db.children.find((c) => c.id === e.childId);
              const gc = e.grade ? 'text-emerald-400' : 'text-slate-500';
              return (
                <tr key={e.id} className="table-row">
                  <td className="p-4 text-white font-medium text-sm">{child ? child.name : 'Unknown'}</td>
                  <td className="p-4 text-slate-400 text-sm">{e.school}</td>
                  <td className="p-4 text-slate-400 text-sm">{e.level}</td>
                  <td className="p-4 text-slate-400 text-sm">{e.term}</td>
                  <td className="p-4">
                    <span className={`${gc} font-bold text-sm`}>{e.grade || '—'}</span>
                  </td>
                  <td className="p-4 text-slate-300 text-sm">{e.attendance || '—'}</td>
                  <td className="p-4 text-slate-400 text-sm">{e.teacher || '—'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}