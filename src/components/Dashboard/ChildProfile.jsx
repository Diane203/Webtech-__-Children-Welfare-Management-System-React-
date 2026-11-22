import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';

export default function ChildProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { db, addMilestone, addCaseNote } = useData();
  const { currentUser } = useAuth();

  const [tab, setTab] = useState('overview');
  const [showMilestoneForm, setShowMilestoneForm] = useState(false);
  const [msForm, setMsForm] = useState({ title: '', description: '' });
  const [noteForm, setNoteForm] = useState({ content: '', type: 'General', visibility: 'Public' });

  const child = db.children.find(c => c.id === id);
  if (!child) return (
    <div className="text-center py-20 text-slate-500">
      Child not found. <button onClick={() => navigate('/dashboard/children')} className="text-emerald-400 underline">Back to Children</button>
    </div>
  );

  const milestones = (db.milestones || []).filter(m => m.childId === id).sort((a, b) => new Date(b.date) - new Date(a.date));
  const healthRecords = db.healthRecords.filter(h => h.childId === id);
  const educationRecords = db.education.filter(e => e.childId === id);
  const caseNotes = (db.caseNotes || []).filter(n => n.childId === id).sort((a, b) => new Date(b.date) - new Date(a.date));
  const isAdmin = currentUser.role === 'admin';
  const visibleNotes = isAdmin ? caseNotes : caseNotes.filter(n => n.visibility === 'Public');

  const handleAddMilestone = (e) => {
    e.preventDefault();
    addMilestone({
      childId: id,
      date: new Date().toISOString().split('T')[0],
      type: 'Achievement',
      title: msForm.title,
      description: msForm.description,
      icon: '🌟'
    });
    setMsForm({ title: '', description: '' });
    setShowMilestoneForm(false);
  };

  const handleAddNote = (e) => {
    e.preventDefault();
    const now = new Date();
    addCaseNote({
      childId: id,
      author: currentUser.name,
      date: now.toISOString().split('T')[0],
      time: now.toTimeString().slice(0, 5),
      type: noteForm.type,
      visibility: noteForm.visibility,
      content: noteForm.content
    });
    setNoteForm({ content: '', type: 'General', visibility: 'Public' });
  };

  const tabs = [
    { key: 'overview', label: '📋 Overview' },
    { key: 'timeline', label: '🌟 Timeline' },
    { key: 'health', label: '🏥 Health' },
    { key: 'education', label: '📚 Education' },
    { key: 'notes', label: '📝 Case Notes' },
  ];

  return (
    <div className="animate-fade-in text-slate-300">
      <button onClick={() => navigate('/dashboard/children')}
        className="text-slate-400 hover:text-white text-sm mb-4 flex items-center gap-2">← Back to Children</button>

      {/* HEADER */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-2xl p-8 mb-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-24 h-24 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center text-5xl flex-shrink-0">
            {child.avatar}
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-white mb-2">{child.name}</h1>
            <div className="flex flex-wrap justify-center md:justify-start gap-3 text-sm text-slate-400">
              <span>🆔 {child.id}</span>
              <span>🎂 {child.age} years old</span>
              <span>👤 {child.gender}</span>
              {child.sponsor !== 'Unsponsored' ? (
                <span className="text-emerald-400">💝 Sponsored</span>
              ) : (
                <span className="text-amber-400">⏳ Awaiting sponsor</span>
              )}
            </div>
          </div>
          <span className="badge bg-emerald-500/10 text-emerald-400">{child.status}</span>
        </div>
      </div>

      {/* TABS */}
      <div className="flex gap-2 border-b border-slate-800 mb-6 overflow-x-auto">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-5 py-3 text-sm font-medium border-b-2 transition whitespace-nowrap ${
              tab === t.key
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT */}
      {tab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in">
          {[
            { label: 'Date of Birth', value: child.dob },
            { label: 'Admission Date', value: child.admissionDate },
            { label: 'Age', value: `${child.age} years` },
            { label: 'Gender', value: child.gender },
            { label: 'Disability', value: child.disability, highlight: child.disability !== 'None' },
            { label: 'Health Status', value: child.healthStatus },
            { label: 'Education Level', value: child.educationLevel },
            { label: 'Sponsor', value: child.sponsor },
            { label: 'Status', value: child.status },
          ].map((item, i) => (
            <div key={i} className="bg-slate-800 border border-slate-700 rounded-lg p-4">
              <p className="text-xs text-slate-500 mb-1">{item.label}</p>
              <p className={`font-bold ${item.highlight ? 'text-amber-400' : 'text-white'}`}>{item.value}</p>
            </div>
          ))}
        </div>
      )}

      {tab === 'timeline' && (
        <div className="animate-fade-in">
          <div className="flex justify-end mb-4">
            <button onClick={() => setShowMilestoneForm(!showMilestoneForm)}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
              + Add Milestone
            </button>
          </div>

          {showMilestoneForm && (
            <form onSubmit={handleAddMilestone} className="bg-slate-800 border border-slate-700 rounded-lg p-4 mb-6 grid grid-cols-1 md:grid-cols-4 gap-3">
              <input type="text" required placeholder="Title (e.g. Learned to swim)"
                value={msForm.title} onChange={e => setMsForm({ ...msForm, title: e.target.value })}
                className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-white text-sm md:col-span-2" />
              <input type="text" required placeholder="Description"
                value={msForm.description} onChange={e => setMsForm({ ...msForm, description: e.target.value })}
                className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-white text-sm" />
              <button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg px-4 py-3 text-sm font-medium">
                + Add
              </button>
            </form>
          )}

          {milestones.length === 0 ? (
            <p className="text-slate-500 text-center py-8">No milestones yet.</p>
          ) : (
            <div className="relative pl-8">
              <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-emerald-500/30" />
              <div className="space-y-6">
                {milestones.map(m => (
                  <div key={m.id} className="relative">
                    <div className="absolute -left-[26px] w-8 h-8 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center text-base border-2 border-slate-900">
                      {m.icon}
                    </div>
                    <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                      <p className="text-white font-bold">{m.title}</p>
                      <p className="text-xs text-emerald-400 mt-1">{m.date} • {m.type}</p>
                      <p className="text-sm text-slate-400 mt-2">{m.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 'health' && (
        <div className="space-y-3 animate-fade-in">
          {healthRecords.length === 0 ? (
            <p className="text-slate-500 text-center py-8">No health records.</p>
          ) : healthRecords.map(h => (
            <div key={h.id} className="bg-slate-800 border border-slate-700 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <p className="text-white font-bold">{h.type}</p>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  h.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                }`}>{h.status}</span>
              </div>
              <p className="text-sm text-slate-400">Diagnosis: <span className="text-slate-300">{h.diagnosis}</span></p>
              <p className="text-sm text-slate-400">Treatment: <span className="text-slate-300">{h.treatment}</span></p>
              <p className="text-xs text-slate-500 mt-2">{h.date} • {h.doctor}</p>
            </div>
          ))}
        </div>
      )}

      {tab === 'education' && (
        <div className="space-y-3 animate-fade-in">
          {educationRecords.length === 0 ? (
            <p className="text-slate-500 text-center py-8">No education records.</p>
          ) : educationRecords.map(e => (
            <div key={e.id} className="bg-slate-800 border border-slate-700 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <p className="text-white font-bold">{e.school}</p>
                <span className="text-emerald-400 font-bold">{e.grade || '—'}</span>
              </div>
              <p className="text-sm text-slate-400">{e.level} • {e.term}</p>
              <p className="text-xs text-slate-500 mt-2">Attendance: {e.attendance || '—'} • Teacher: {e.teacher || '—'}</p>
            </div>
          ))}
        </div>
      )}

      {tab === 'notes' && (
        <div className="animate-fade-in">
          <form onSubmit={handleAddNote} className="bg-slate-800 border border-slate-700 rounded-lg p-4 mb-4">
            <h4 className="text-white font-bold mb-3">Write a Case Note</h4>
            <textarea required rows="3" placeholder="What happened today?"
              value={noteForm.content} onChange={e => setNoteForm({ ...noteForm, content: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white text-sm mb-3" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <select value={noteForm.type} onChange={e => setNoteForm({ ...noteForm, type: e.target.value })}
                className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-white text-sm">
                <option>General</option><option>Behavior</option><option>Health</option>
                <option>Education</option><option>Family</option>
              </select>
              <select value={noteForm.visibility} onChange={e => setNoteForm({ ...noteForm, visibility: e.target.value })}
                className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-white text-sm">
                <option value="Public">Public (all staff)</option>
                <option value="Private">Private (admin only)</option>
              </select>
              <button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg px-4 py-2 text-sm font-medium">Save Note</button>
            </div>
          </form>

          <div className="space-y-3">
            {visibleNotes.length === 0 ? (
              <p className="text-slate-500 text-center py-8">No case notes yet.</p>
            ) : visibleNotes.map(n => (
              <div key={n.id} className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-white font-bold text-sm">{n.author}</p>
                    <p className="text-xs text-slate-500">{n.date} at {n.time}</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-700 text-slate-300">{n.type}</span>
                    {n.visibility === 'Private' && (
                      <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-400">🔒 Private</span>
                    )}
                  </div>
                </div>
                <p className="text-sm text-slate-300">{n.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
