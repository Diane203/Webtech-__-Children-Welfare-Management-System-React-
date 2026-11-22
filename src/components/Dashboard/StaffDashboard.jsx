import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function StaffDashboard() {
  const { db } = useData();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const myChildren = db.children.slice(0, 4);
  const urgentAlerts = (db.alerts || []).filter(a => a.severity === 'urgent').length;
  const myNotes = (db.caseNotes || []).filter(n => n.author === currentUser.name).length;

  return (
    <div className="animate-fade-in text-slate-300">
      <p className="text-orange-500 text-xs font-bold tracking-widest mb-1">HOPE HAVEN STAFF PORTAL</p>
      <h1 className="text-3xl font-bold text-white mb-1">Welcome back, {currentUser.name} 👋</h1>
      <p className="text-slate-400 mb-8">Here's your daily overview.</p>

      {urgentAlerts > 0 && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-8 flex items-start gap-4">
          <span className="text-2xl">🚨</span>
          <div className="flex-1">
            <p className="text-white font-bold">{urgentAlerts} urgent alert{urgentAlerts > 1 ? 's' : ''}</p>
            <p className="text-slate-400 text-sm">Please review alerts for children under your care.</p>
          </div>
          <button onClick={() => navigate('/dashboard/alerts')}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
            View
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl card-hover">
          <p className="text-slate-400 text-sm mb-2">CHILDREN ASSIGNED</p>
          <p className="text-3xl font-bold text-emerald-400">{myChildren.length}</p>
          <p className="text-emerald-500 text-xs mt-2">under your care</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl card-hover">
          <p className="text-slate-400 text-sm mb-2">HEALTH CHECKUPS</p>
          <p className="text-3xl font-bold text-blue-400">{db.healthRecords.length}</p>
          <p className="text-slate-500 text-xs mt-2">records to review</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl card-hover">
          <p className="text-slate-400 text-sm mb-2">MY CASE NOTES</p>
          <p className="text-3xl font-bold text-purple-400">{myNotes}</p>
          <p className="text-slate-500 text-xs mt-2">notes written</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8">
        <h2 className="text-lg font-bold text-white mb-4">My Assigned Children</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {myChildren.map(c => (
            <div key={c.id} onClick={() => navigate(`/dashboard/children/${c.id}`)}
              className="bg-slate-800 border border-slate-700 rounded-lg p-4 flex items-center gap-4 cursor-pointer hover:border-orange-500/50 transition">
              <div className="text-3xl">{c.avatar}</div>
              <div className="flex-1">
                <p className="text-white font-bold">{c.name}</p>
                <p className="text-xs text-slate-400">{c.age} years • {c.educationLevel}</p>
                <p className={`text-xs ${c.disability === 'None' ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {c.disability}
                </p>
              </div>
              <span className="badge bg-emerald-500/10 text-emerald-400">ACTIVE</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h2 className="text-lg font-bold text-white mb-4">Recent Health Records</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-500 text-xs uppercase border-b border-slate-800">
                <th className="pb-3 font-medium">Child</th>
                <th className="pb-3 font-medium">Type</th>
                <th className="pb-3 font-medium">Diagnosis</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {db.healthRecords.map(h => {
                const child = db.children.find(c => c.id === h.childId);
                const cls = h.status === 'Completed'
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'bg-amber-500/20 text-amber-400';
                return (
                  <tr key={h.id} className="table-row">
                    <td className="py-4 text-white font-medium text-sm">{child?.name || 'Unknown'}</td>
                    <td className="py-4 text-slate-400 text-sm">{h.type}</td>
                    <td className="py-4 text-slate-400 text-sm">{h.diagnosis}</td>
                    <td className="py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${cls}`}>{h.status}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}