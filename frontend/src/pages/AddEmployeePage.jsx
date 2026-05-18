import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import SkillsInput from '../components/SkillsInput';
import { addEmployee } from '../services/api';
import { getScoreStyle } from '../components/EmployeeCard';
import toast from 'react-hot-toast';

const DEPARTMENTS = [
  'Development', 'Design', 'Marketing', 'Sales',
  'HR', 'Finance', 'Operations', 'DevOps', 'QA', 'Support'
];

const INITIAL = { name: '', email: '', department: '', skills: [], performanceScore: 75, experience: 1 };

export default function AddEmployeePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL);
  const [loading, setLoading] = useState(false);

  const scoreStyle = getScoreStyle(form.performanceScore);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addEmployee(form);
      toast.success('Employee added successfully!');
      navigate('/employees');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add employee');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-indigo-600 text-sm font-semibold hover:text-indigo-700 mb-3 transition-colors"
          >
            ← Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Add Employee</h1>
          <p className="text-gray-500 mt-1 text-sm">Register a new employee in the system</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name *</label>
                <input
                  type="text" required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Aman Verma"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition bg-gray-50 focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address *</label>
                <input
                  type="email" required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="aman@gmail.com"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition bg-gray-50 focus:bg-white"
                />
              </div>
            </div>

            {/* Department */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Department *</label>
              <select
                required
                value={form.department}
                onChange={(e) => setForm({ ...form, department: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition bg-gray-50 focus:bg-white"
              >
                <option value="">Select a department</option>
                {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            {/* Skills */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Skills</label>
              <SkillsInput skills={form.skills} onChange={(skills) => setForm({ ...form, skills })} />
            </div>

            {/* Performance Score Slider */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-gray-700">Performance Score *</label>
                <span className={`px-3 py-1 rounded-full text-sm font-bold ${scoreStyle.badge}`}>
                  {form.performanceScore}% — {scoreStyle.label}
                </span>
              </div>
              <input
                type="range" min="0" max="100"
                value={form.performanceScore}
                onChange={(e) => setForm({ ...form, performanceScore: Number(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                style={{ accentColor: '#4f46e5' }}
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1.5">
                <span>0 · Poor</span>
                <span>50 · Average</span>
                <span>85 · Excellent · 100</span>
              </div>
            </div>

            {/* Experience */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Years of Experience *</label>
              <input
                type="number" required min="0" max="50"
                value={form.experience}
                onChange={(e) => setForm({ ...form, experience: Number(e.target.value) })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition bg-gray-50 focus:bg-white"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 py-3 border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-60 shadow-md shadow-indigo-100 text-sm"
              >
                {loading ? 'Adding...' : 'Add Employee'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
