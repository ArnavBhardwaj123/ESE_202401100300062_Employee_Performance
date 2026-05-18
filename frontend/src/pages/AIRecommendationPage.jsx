import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { getEmployees, getAIRecommendation } from '../services/api';
import { getScoreStyle } from '../components/EmployeeCard';
import toast from 'react-hot-toast';

const promotionBadge = (rec) => {
  const r = rec?.toLowerCase();
  if (r === 'yes') return { cls: 'bg-emerald-100 text-emerald-700 border-emerald-200', label: '✅ Promote', icon: '🚀' };
  if (r === 'maybe') return { cls: 'bg-amber-100 text-amber-700 border-amber-200', label: '🤔 Consider', icon: '📋' };
  return { cls: 'bg-red-100 text-red-700 border-red-200', label: '❌ Not Yet', icon: '📚' };
};

export default function AIRecommendationPage() {
  const [employees, setEmployees] = useState([]);
  const [selected, setSelected] = useState([]);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    getEmployees()
      .then((res) => setEmployees(res.data))
      .catch(() => toast.error('Failed to load employees'))
      .finally(() => setFetching(false));
  }, []);

  const toggle = (id) =>
    setSelected((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);

  const handleGenerate = async () => {
    if (selected.length === 0) {
      toast.error('Please select at least one employee');
      return;
    }
    setLoading(true);
    setResults(null);
    try {
      const data = employees.filter((e) => selected.includes(e._id));
      const res = await getAIRecommendation(data);
      setResults(res.data);
      toast.success('AI analysis complete!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'AI generation failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">AI Recommendations</h1>
          <p className="text-gray-500 mt-1">Select employees and generate AI-powered performance insights</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Selector Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-gray-900">Select Employees</h2>
                <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2.5 py-1 rounded-full">
                  {selected.length} selected
                </span>
              </div>

              {/* Employee List */}
              <div className="space-y-1.5 max-h-72 overflow-y-auto scrollbar-hide mb-3">
                {fetching ? (
                  [...Array(4)].map((_, i) => (
                    <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />
                  ))
                ) : employees.length === 0 ? (
                  <p className="text-gray-400 text-sm text-center py-4">No employees available</p>
                ) : (
                  employees.map((emp) => {
                    const style = getScoreStyle(emp.performanceScore);
                    const isSelected = selected.includes(emp._id);
                    return (
                      <label
                        key={emp._id}
                        className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-indigo-50 border border-indigo-200'
                            : 'hover:bg-slate-50 border border-transparent'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggle(emp._id)}
                          className="w-4 h-4 rounded text-indigo-600 accent-indigo-600"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 text-sm truncate">{emp.name}</p>
                          <p className="text-gray-400 text-xs">{emp.department}</p>
                        </div>
                        <span className={`shrink-0 text-xs font-bold px-2 py-0.5 rounded-full ${style.badge}`}>
                          {emp.performanceScore}%
                        </span>
                      </label>
                    );
                  })
                )}
              </div>

              {/* Select controls */}
              <div className="flex gap-2 mb-3">
                <button
                  onClick={() => setSelected(employees.map((e) => e._id))}
                  className="flex-1 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                >
                  Select All
                </button>
                <button
                  onClick={() => setSelected([])}
                  className="flex-1 py-2 text-xs font-semibold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Clear
                </button>
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading || selected.length === 0}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm shadow-md shadow-indigo-100"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Analyzing with AI...
                  </span>
                ) : '🤖 Generate AI Insights'}
              </button>

              {loading && (
                <p className="text-xs text-gray-400 text-center mt-2">This may take 10–20 seconds</p>
              )}
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2 space-y-4">
            {/* Idle State */}
            {!results && !loading && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <span className="text-4xl">🤖</span>
                </div>
                <h3 className="text-xl font-bold text-gray-700">Ready to Analyze</h3>
                <p className="text-gray-400 mt-2 text-sm max-w-xs mx-auto">
                  Select one or more employees from the panel and click Generate AI Insights
                </p>
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center">
                <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-5" />
                <h3 className="text-xl font-bold text-gray-700">Analyzing Performance Data</h3>
                <p className="text-gray-400 mt-2 text-sm">AI is reviewing {selected.length} employee profile{selected.length !== 1 ? 's' : ''}...</p>
                <div className="flex justify-center gap-1 mt-4">
                  {['Reviewing data', 'Generating insights', 'Preparing recommendations'].map((step, i) => (
                    <span key={step} className="text-xs bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full font-medium animate-pulse" style={{ animationDelay: `${i * 0.3}s` }}>
                      {step}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Results */}
            {results && !loading && (
              <>
                {/* Summary Banner */}
                {results.summary && (
                  <div className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white rounded-2xl p-6 shadow-lg shadow-indigo-200">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">📋</span>
                      <h3 className="font-bold text-lg">AI Team Summary</h3>
                    </div>
                    <p className="text-indigo-100 text-sm leading-relaxed">{results.summary}</p>
                  </div>
                )}

                {/* Individual Cards */}
                {results.recommendations?.map((rec, i) => {
                  const badge = promotionBadge(rec.promotionRecommendation);
                  const suggestions = rec.trainingsuggestions || rec.trainingSuggestions || [];
                  return (
                    <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                      {/* Card Header */}
                      <div className="px-6 py-5 border-b border-gray-100">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm">
                              {rec.rank || i + 1}
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-900 text-lg">{rec.employeeName}</h3>
                              <p className="text-gray-400 text-xs">AI Rank #{rec.rank || i + 1}</p>
                            </div>
                          </div>
                          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-bold ${badge.cls}`}>
                            {badge.label}
                          </div>
                        </div>
                      </div>

                      <div className="p-6 space-y-4">
                        {/* Promotion & Assessment */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                            <p className="text-blue-700 text-xs font-bold uppercase tracking-wider mb-2">
                              🎯 Promotion Rationale
                            </p>
                            <p className="text-gray-700 text-sm leading-relaxed">{rec.promotionReason}</p>
                          </div>
                          <div className="bg-violet-50 rounded-xl p-4 border border-violet-100">
                            <p className="text-violet-700 text-xs font-bold uppercase tracking-wider mb-2">
                              ⭐ Overall Assessment
                            </p>
                            <p className="text-gray-700 text-sm leading-relaxed">{rec.overallAssessment}</p>
                          </div>
                        </div>

                        {/* Training Suggestions */}
                        {suggestions.length > 0 && (
                          <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                            <p className="text-emerald-700 text-xs font-bold uppercase tracking-wider mb-3">
                              💡 Training Suggestions
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {suggestions.map((s, j) => (
                                <span key={j} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-emerald-200 text-gray-700 text-xs rounded-lg font-medium shadow-sm">
                                  <span className="text-emerald-500">✓</span>
                                  {s}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Performance Feedback */}
                        <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                          <p className="text-amber-700 text-xs font-bold uppercase tracking-wider mb-2">
                            📝 Performance Feedback
                          </p>
                          <p className="text-gray-700 text-sm leading-relaxed">{rec.performanceFeedback}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}

                <button
                  onClick={() => { setResults(null); setSelected([]); }}
                  className="w-full py-3 border border-gray-200 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors"
                >
                  Clear Results & Start Over
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
