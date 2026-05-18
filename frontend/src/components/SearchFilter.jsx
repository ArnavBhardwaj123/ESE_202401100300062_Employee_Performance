const DEPARTMENTS = [
  'Development', 'Design', 'Marketing', 'Sales',
  'HR', 'Finance', 'Operations', 'DevOps', 'QA', 'Support'
];

export default function SearchFilter({ filters, setFilters, onSearch, onReset }) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') onSearch();
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <p className="text-sm font-semibold text-gray-700 mb-3">Search & Filter</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div>
          <label className="block text-xs text-gray-500 font-medium mb-1">Search by Name</label>
          <input
            type="text"
            placeholder="e.g. Aman Verma"
            value={filters.name}
            onChange={(e) => setFilters({ ...filters, name: e.target.value })}
            onKeyDown={handleKeyDown}
            className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 font-medium mb-1">Department</label>
          <select
            value={filters.department}
            onChange={(e) => setFilters({ ...filters, department: e.target.value })}
            className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition bg-white"
          >
            <option value="">All Departments</option>
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-500 font-medium mb-1">Min Score (0–100)</label>
          <input
            type="number"
            placeholder="e.g. 60"
            min="0" max="100"
            value={filters.minScore}
            onChange={(e) => setFilters({ ...filters, minScore: e.target.value })}
            onKeyDown={handleKeyDown}
            className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 font-medium mb-1">Max Score (0–100)</label>
          <input
            type="number"
            placeholder="e.g. 90"
            min="0" max="100"
            value={filters.maxScore}
            onChange={(e) => setFilters({ ...filters, maxScore: e.target.value })}
            onKeyDown={handleKeyDown}
            className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          />
        </div>
      </div>
      <div className="flex gap-2 mt-4">
        <button
          onClick={onSearch}
          className="flex-1 bg-indigo-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
        >
          🔍 Search
        </button>
        <button
          onClick={onReset}
          className="px-5 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
