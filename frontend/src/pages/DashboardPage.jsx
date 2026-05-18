import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getScoreStyle } from '../components/EmployeeCard';
import { getEmployees } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const StatCard = ({ icon, label, value, gradient, loading }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all">
    <div className="flex items-center justify-between mb-4">
      <span className="text-3xl">{icon}</span>
      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} opacity-15 flex items-center justify-center`} />
    </div>
    <p className="text-sm text-gray-500 font-medium">{label}</p>
    {loading
      ? <div className="h-8 bg-gray-100 rounded-lg w-3/4 mt-1 animate-pulse" />
      : <p className="text-2xl font-bold text-gray-900 mt-1 truncate">{value}</p>
    }
  </div>
);

export default function DashboardPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    getEmployees()
      .then((res) => setEmployees(res.data))
      .catch(() => toast.error('Failed to load dashboard data'))
      .finally(() => setLoading(false));
  }, []);

  const avgScore = employees.length
    ? (employees.reduce((s, e) => s + e.performanceScore, 0) / employees.length).toFixed(1)
    : '0.0';

  const departments = [...new Set(employees.map((e) => e.department))];
  const topPerformer = employees[0];

  const stats = [
    { icon: '👥', label: 'Total Employees', value: employees.length, gradient: 'from-blue-500 to-indigo-500' },
    { icon: '📈', label: 'Avg. Performance', value: `${avgScore}%`, gradient: 'from-emerald-500 to-teal-500' },
    { icon: '🏢', label: 'Departments', value: departments.length, gradient: 'from-purple-500 to-pink-500' },
    { icon: '🏆', label: 'Top Performer', value: topPerformer?.name || '—', gradient: 'from-amber-500 to-orange-500' }
  ];

  const quickActions = [
    { to: '/employees/add', icon: '➕', title: 'Add Employee', desc: 'Register a new employee profile', gradient: 'from-indigo-500 to-purple-600', hover: 'hover:from-indigo-600 hover:to-purple-700', shadow: 'shadow-indigo-200' },
    { to: '/employees', icon: '👥', title: 'View All Employees', desc: 'Browse and manage all records', gradient: 'from-emerald-500 to-teal-600', hover: 'hover:from-emerald-600 hover:to-teal-700', shadow: 'shadow-emerald-200' },
    { to: '/ai-recommendations', icon: '🤖', title: 'AI Insights', desc: 'Generate smart recommendations', gradient: 'from-amber-500 to-orange-600', hover: 'hover:from-amber-600 hover:to-orange-700', shadow: 'shadow-amber-200' }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Good morning, {user?.name?.split(' ')[0]}! 👋
            </h1>
            <p className="text-gray-500 mt-1">Here's your employee analytics overview</p>
          </div>
          <div className="hidden sm:flex items-center gap-2 bg-white rounded-xl px-4 py-2 border border-gray-100 shadow-sm">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-sm text-gray-600 font-medium">System Online</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} loading={loading} />
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {quickActions.map((action) => (
            <Link
              key={action.to}
              to={action.to}
              className={`bg-gradient-to-br ${action.gradient} ${action.hover} text-white rounded-2xl p-6 transition-all transform hover:scale-[1.02] hover:shadow-xl ${action.shadow} shadow-lg`}
            >
              <span className="text-4xl mb-3 block">{action.icon}</span>
              <h3 className="text-xl font-bold">{action.title}</h3>
              <p className="text-white/70 text-sm mt-1">{action.desc}</p>
            </Link>
          ))}
        </div>

        {/* Top Performers */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Top Performers</h2>
              <p className="text-gray-400 text-sm">Ranked by performance score</p>
            </div>
            <Link to="/employees" className="text-indigo-600 text-sm font-semibold hover:text-indigo-700 transition-colors">
              View all →
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 animate-pulse">
                  <div className="w-8 h-8 bg-gray-100 rounded-full" />
                  <div className="flex-1 h-10 bg-gray-100 rounded-xl" />
                </div>
              ))}
            </div>
          ) : employees.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-4xl mb-3">😕</p>
              <p className="text-gray-500 font-medium">No employees yet</p>
              <Link to="/employees/add" className="text-indigo-600 text-sm font-semibold mt-1 block hover:text-indigo-700">
                Add your first employee →
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {employees.slice(0, 7).map((emp, i) => {
                const style = getScoreStyle(emp.performanceScore);
                return (
                  <div key={emp._id} className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-xl transition-colors group">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? 'bg-amber-100 text-amber-700' : i === 1 ? 'bg-slate-100 text-slate-700' : i === 2 ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-500'}`}>
                      {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-semibold text-gray-900 text-sm truncate">{emp.name}</p>
                        <span className="text-sm font-bold text-gray-800 ml-2">{emp.performanceScore}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${style.bar}`} style={{ width: `${emp.performanceScore}%` }} />
                        </div>
                        <span className="text-xs text-gray-400">{emp.department}</span>
                      </div>
                    </div>
                    <span className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-semibold ${style.badge}`}>
                      {style.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Department Breakdown */}
        {departments.length > 0 && (
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {departments.map((dept) => {
              const count = employees.filter((e) => e.department === dept).length;
              const avg = (employees.filter((e) => e.department === dept).reduce((s, e) => s + e.performanceScore, 0) / count).toFixed(0);
              return (
                <div key={dept} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm text-center hover:shadow-md transition-all">
                  <p className="font-bold text-gray-900 text-sm truncate">{dept}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{count} emp</p>
                  <p className="text-indigo-600 font-bold text-lg mt-1">{avg}%</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
