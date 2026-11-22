import { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  Title, Tooltip, Legend
} from 'chart.js';
import { useData } from '../../context/DataContext';
import { exportToCSV } from '../../utils/exportCSV';
import { Download, FileText, HeartHandshake, Baby, Activity, BookOpen, Handshake } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const REPORT_CARDS = [
  { icon: FileText, title: 'Monthly Welfare Report', desc: 'Complete overview of children, health, education, and donations.', colorClass: 'bg-emerald-500/20 text-emerald-400' },
  { icon: HeartHandshake, title: 'Donor Transparency Report', desc: 'Show donors exactly how their money is being used.', colorClass: 'bg-purple-500/20 text-purple-400' },
  { icon: Baby, title: 'Child Progress Report', desc: 'Individual child progress with milestones, health, and education.', colorClass: 'bg-blue-500/20 text-blue-400' },
  { icon: Activity, title: 'Health Summary', desc: 'All checkups, treatments, and health alerts.', colorClass: 'bg-red-500/20 text-red-400' },
  { icon: BookOpen, title: 'Education Summary', desc: 'Grades, attendance, and academic progress.', colorClass: 'bg-amber-500/20 text-amber-400' },
  { icon: Handshake, title: 'Sponsor Impact Report', desc: 'Show each sponsor the impact of their generosity.', colorClass: 'bg-pink-500/20 text-pink-400' },
];

export default function ReportsPage() {
  const { db } = useData();
  const [period, setPeriod] = useState('weekly');
  const [stats, setStats] = useState({});
  const [chartData, setChartData] = useState({ labels: [], values: [] });

  useEffect(() => {
    const DAY = 864e5;
    const windows = { daily: 1, weekly: 7, monthly: 30, yearly: 365 };
    const inWindow = (dateStr) => {
      const diff = (Date.now() - new Date(dateStr)) / DAY;
      return diff >= 0 && diff <= windows[period];
    };

    const donationsByDay = [0, 0, 0, 0, 0, 0, 0];
    const donationsByWeek = [0, 0, 0, 0];
    const donationsByMonth = new Array(12).fill(0);
    const y = new Date().getFullYear();
    const years = [y - 3, y - 2, y - 1, y];
    const donationsByYear = [0, 0, 0, 0];

    db.donations.forEach((d) => {
      const date = new Date(d.date);
      donationsByDay[(date.getDay() + 6) % 7] += d.amount;
      donationsByWeek[Math.min(3, Math.floor((date.getDate() - 1) / 7))] += d.amount;
      donationsByMonth[date.getMonth()] += d.amount;
      const yi = years.indexOf(date.getFullYear());
      if (yi >= 0) donationsByYear[yi] += d.amount;
    });

    const received = db.donations
      .filter((d) => inWindow(d.date))
      .reduce((s, d) => s + d.amount, 0);

    const chartByPeriod = {
      daily: { labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], values: donationsByDay },
      weekly: { labels: ['W1', 'W2', 'W3', 'W4'], values: donationsByWeek },
      monthly: { labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], values: donationsByMonth },
      yearly: { labels: years.map(String), values: donationsByYear },
    };

    setChartData(chartByPeriod[period]);
    setStats({
      newAdmissions: db.children.filter((c) => inWindow(c.admissionDate)).length,
      healthCheckups: db.healthRecords.filter((h) => inWindow(h.date)).length,
      donationsReceived: received.toLocaleString() + ' FRw',
      activeChildren: db.children.filter((c) => c.status === 'ACTIVE').length,
    });
  }, [period, db]);

  const barData = {
    labels: chartData.labels,
    datasets: [
      {
        label: 'Donations (FRw)',
        data: chartData.values,
        backgroundColor: '#10B981',
        borderRadius: 6,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, grid: { color: 'rgba(51, 65, 85, 0.5)' }, ticks: { color: '#64748B' } },
      x: { grid: { display: false }, ticks: { color: '#64748B' } },
    },
  };

  const periods = [
    { key: 'daily', label: 'Daily' },
    { key: 'weekly', label: 'Weekly' },
    { key: 'monthly', label: 'Monthly' },
    { key: 'yearly', label: 'Yearly' },
  ];

  const handleExport = () => {
    exportToCSV(
      'Reports_Summary.csv',
      ['Metric', 'Value'],
      [
        ['Period', period],
        ['New Admissions', stats.newAdmissions],
        ['Health Checkups', stats.healthCheckups],
        ['Donations Received', stats.donationsReceived],
        ['Active Children', stats.activeChildren],
      ]
    );
  };

  return (
    <div className="animate-fade-in text-slate-300">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Reports &amp; Analytics</h1>
          <p className="text-slate-400 text-sm">Comprehensive welfare overview</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {periods.map((p) => (
            <button
              key={p.key}
              onClick={() => setPeriod(p.key)}
              className={`px-4 py-2 text-sm rounded transition ${
                period === p.key
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {p.label}
            </button>
          ))}
          <button
            onClick={handleExport}
            className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded text-sm inline-flex items-center gap-2 border border-slate-700"
          >
            <Download size={14} /> Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
          <p className="text-slate-400 text-sm mb-2">NEW ADMISSIONS</p>
          <p className="text-3xl font-bold text-emerald-400">{stats.newAdmissions ?? 0}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
          <p className="text-slate-400 text-sm mb-2">HEALTH CHECKUPS</p>
          <p className="text-3xl font-bold text-blue-400">{stats.healthCheckups ?? 0}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
          <p className="text-slate-400 text-sm mb-2">DONATIONS RECEIVED</p>
          <p className="text-xl font-bold text-purple-400 mt-1">{stats.donationsReceived ?? '0 FRw'}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
          <p className="text-slate-400 text-sm mb-2">ACTIVE CHILDREN</p>
          <p className="text-3xl font-bold text-orange-400">{stats.activeChildren ?? 0}</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8">
        <h2 className="text-lg font-bold text-white mb-6">Activity Chart</h2>
        <div className="chart-container">
          <Bar data={barData} options={barOptions} />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-white mb-4">📄 Report Center</h2>
      <p className="text-slate-400 mb-6">Generate professional reports for donors, staff, and stakeholders.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {REPORT_CARDS.map((r, i) => {
          const Icon = r.icon;
          return (
            <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-6 card-hover">
              <div className={`w-12 h-12 ${r.colorClass} rounded-xl flex items-center justify-center mb-3`}>
                <Icon size={22} />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">{r.title}</h3>
              <p className="text-slate-400 text-sm mb-4">{r.desc}</p>
              <button
                onClick={() => window.print()}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded-lg font-medium text-sm"
              >
                Generate →
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}