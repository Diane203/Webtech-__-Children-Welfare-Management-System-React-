import { Link, useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, BarElement, Title, Tooltip, Legend, Filler
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);

export default function AdminDashboard() {
  const { db } = useData();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const totalChildren = db.children.length;
  const activeChildren = db.children.filter(c => c.status === 'ACTIVE').length;
  const totalStaff = db.staff.length;
  const totalDonations = db.donations.reduce((s, d) => s + d.amount, 0);
  const withDisability = db.children.filter(c => c.disability !== 'None').length;

  const sponsoredChildren = db.children.filter(c => c.sponsor !== 'Unsponsored').length;
  const sponsorshipRate = totalChildren ? Math.round((sponsoredChildren / totalChildren) * 100) : 0;
  const educationRecords = db.education.filter(e => e.grade).length;
  const healthHealthy = db.children.filter(c => c.healthStatus === 'Healthy').length;
  const healthRate = totalChildren ? Math.round((healthHealthy / totalChildren) * 100) : 0;
  const urgentAlerts = (db.alerts || []).filter(a => a.severity === 'urgent').length;
  const totalMilestones = (db.milestones || []).length;

  const topStats = [
    { label: 'TOTAL CHILDREN', value: totalChildren, sub: `↑ ${activeChildren} active`, color: 'text-emerald-400' },
    { label: 'STAFF MEMBERS', value: totalStaff, sub: '↑ dedicated team', color: 'text-blue-400' },
    { label: 'TOTAL DONATIONS', value: `${totalDonations.toLocaleString()} FRw`, sub: '↑ this period', color: 'text-purple-400' },
    { label: 'WITH DISABILITY', value: withDisability, sub: 'specialized care', color: 'text-orange-400' },
  ];

  const impactStats = [
    { label: 'Sponsorship Rate', value: `${sponsorshipRate}%`, sub: `${sponsoredChildren} of ${totalChildren} children`, color: 'text-emerald-400' },
    { label: 'Health Rate', value: `${healthRate}%`, sub: `${healthHealthy} healthy now`, color: 'text-blue-400' },
    { label: 'Average Grade', value: 'B+', sub: `${educationRecords} graded records`, color: 'text-purple-400' },
    { label: 'Cost / Child', value: '45,000', sub: 'FRw per month', color: 'text-amber-400' },
    { label: 'Milestones', value: totalMilestones, sub: 'moments captured', color: 'text-pink-400' },
  ];

  // Donation chart data (by weekday)
  const donationsByDay = [0, 0, 0, 0, 0, 0, 0];
  db.donations.forEach(d => {
    const day = (new Date(d.date).getDay() + 6) % 7;
    donationsByDay[day] += d.amount;
  });

  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Donations (FRw)',
      data: donationsByDay,
      borderColor: '#10B981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      borderWidth: 2,
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#10B981',
      pointBorderColor: '#0B1120',
      pointBorderWidth: 2,
      pointRadius: 5,
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, grid: { color: 'rgba(51, 65, 85, 0.5)' }, ticks: { color: '#64748B' } },
      x: { grid: { display: false }, ticks: { color: '#64748B' } }
    }
  };

  const disabilityBreakdown = [
    { label: 'No Disability', count: db.children.filter(c => c.disability === 'None').length, color: 'bg-emerald-500', text: 'text-emerald-400' },
    { label: 'Hearing', count: db.children.filter(c => c.disability === 'Hearing Impairment').length, color: 'bg-blue-500', text: 'text-blue-400' },
    { label: 'Visual', count: db.children.filter(c => c.disability === 'Visual Impairment').length, color: 'bg-purple-500', text: 'text-purple-400' },
    { label: 'Physical', count: db.children.filter(c => c.disability === 'Physical Disability').length, color: 'bg-amber-500', text: 'text-amber-400' },
  ];

  return (
    <div className="animate-fade-in text-slate-300">
      <h1 className="text-3xl font-bold text-white mb-1">Welcome back, {currentUser.name} 👋</h1>
      <p className="text-slate-400 mb-8">Here's what's happening at Hope Haven today.</p>

      {urgentAlerts > 0 && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-8 flex items-start gap-4">
          <span className="text-2xl">🚨</span>
          <div className="flex-1">
            <p className="text-white font-bold">{urgentAlerts} urgent alert{urgentAlerts > 1 ? 's' : ''} need your attention</p>
            <p className="text-slate-400 text-sm">Click to review children requiring immediate action.</p>
          </div>
          <Link to="/dashboard/alerts" className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
            View
          </Link>
        </div>
      )}

      {/* TOP STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {topStats.map((s, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 p-6 rounded-xl card-hover">
            <p className="text-slate-400 text-sm mb-2">{s.label}</p>
            <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-emerald-500 text-xs mt-2">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* IMPACT DASHBOARD */}
      <div className="bg-gradient-to-br from-emerald-500/10 via-slate-900 to-blue-500/10 border border-emerald-500/20 rounded-xl p-6 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl">💫</span>
          <div>
            <h2 className="text-xl font-bold text-white">Impact Dashboard</h2>
            <p className="text-slate-400 text-sm">Real impact we're making this year</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {impactStats.map((s, i) => (
            <div key={i}>
              <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">{s.label}</p>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-slate-500">{s.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CHART + DISABILITY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-white">Donations Overview</h2>
            <p className="text-xs text-slate-500">Funds received over time</p>
          </div>
          <div className="chart-container">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-lg font-bold text-white mb-1">Children by Disability</h2>
          <p className="text-xs text-slate-500 mb-6">Distribution overview</p>
          <div className="space-y-4">
            {disabilityBreakdown.map((d, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-400">{d.label}</span>
                  <span className={`${d.text} font-bold`}>{d.count}</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2">
                  <div className={`${d.color} h-2 rounded-full transition-all duration-700`}
                    style={{ width: `${totalChildren ? (d.count / totalChildren) * 100 : 0}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ALERTS + MILESTONES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-white">🔔 Smart Alerts</h2>
            <Link to="/dashboard/alerts" className="text-emerald-400 text-sm hover:underline">View all →</Link>
          </div>
          <div className="space-y-3">
            {(db.alerts || []).slice(0, 4).map(a => {
              const child = db.children.find(c => c.id === a.childId);
              const color = a.severity === 'urgent' ? 'border-l-red-500 bg-red-500/5'
                : a.severity === 'soon' ? 'border-l-amber-500 bg-amber-500/5'
                : 'border-l-blue-500 bg-blue-500/5';
              const dot = a.severity === 'urgent' ? 'bg-red-500'
                : a.severity === 'soon' ? 'bg-amber-500'
                : 'bg-blue-500';
              return (
                <div key={a.id} className={`border-l-4 ${color} p-3 rounded-r-lg`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 ${dot} rounded-full mt-2 flex-shrink-0`} />
                    <div className="flex-1">
                      <p className="text-white font-semibold text-sm">{a.title}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{child?.name} • {a.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-lg font-bold text-white mb-4">🌟 Recent Milestones</h2>
          <div className="space-y-3">
            {(db.milestones || []).slice(-4).reverse().map(m => {
              const child = db.children.find(c => c.id === m.childId);
              return (
                <div key={m.id} className="flex gap-3 items-start">
                  <div className="w-9 h-9 bg-emerald-500/20 text-emerald-400 rounded-lg flex items-center justify-center text-lg flex-shrink-0">
                    {m.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium text-sm">{m.title}</p>
                    <p className="text-xs text-slate-400">{child?.name} • {m.date}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* RECENT DONATIONS */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h2 className="text-lg font-bold text-white mb-4">Recent Donations</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-500 text-xs uppercase border-b border-slate-800">
                <th className="pb-3 font-medium">ID</th>
                <th className="pb-3 font-medium">Donor</th>
                <th className="pb-3 font-medium">Type</th>
                <th className="pb-3 font-medium">Amount</th>
                <th className="pb-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {db.donations.slice(0, 4).map(d => {
                const cls = d.type === 'Cash'
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'bg-blue-500/20 text-blue-400';
                return (
                  <tr key={d.id} className="table-row">
                    <td className="py-4 text-slate-400 text-sm">{d.id}</td>
                    <td className="py-4 text-white font-medium text-sm">{d.donor}</td>
                    <td className="py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${cls}`}>{d.type}</span>
                    </td>
                    <td className="py-4 text-emerald-400 font-bold text-sm">{d.amount.toLocaleString()} FRw</td>
                    <td className="py-4 text-slate-400 text-sm">{d.date}</td>
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