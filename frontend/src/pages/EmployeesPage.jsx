import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import EmployeeCard from '../components/EmployeeCard';
import SearchFilter from '../components/SearchFilter';
import { getEmployees, searchEmployees, deleteEmployee } from '../services/api';
import toast from 'react-hot-toast';

const EMPTY_FILTERS = { name: '', department: '', minScore: '', maxScore: '' };

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(EMPTY_FILTERS);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const res = await getEmployees();
      setEmployees(res.data);
    } catch {
      toast.error('Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const hasFilters = Object.values(filters).some((v) => v !== '');
      const res = hasFilters ? await searchEmployees(filters) : await getEmployees();
      setEmployees(res.data);
    } catch {
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFilters(EMPTY_FILTERS);
    fetchAll();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;
    try {
      await deleteEmployee(id);
      toast.success('Employee deleted');
      setEmployees((prev) => prev.filter((e) => e._id !== id));
    } catch {
      toast.error('Failed to delete employee');
    }
  };

  useEffect(() => { fetchAll(); }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Employees</h1>
            <p className="text-gray-500 mt-1">
              {loading ? 'Loading...' : `${employees.length} employee${employees.length !== 1 ? 's' : ''} found`}
            </p>
          </div>
          <Link
            to="/employees/add"
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-sm text-sm"
          >
            + Add Employee
          </Link>
        </div>

        {/* Search & Filter */}
        <SearchFilter
          filters={filters}
          setFilters={setFilters}
          onSearch={handleSearch}
          onReset={handleReset}
        />

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm animate-pulse border border-gray-100">
                <div className="flex gap-3 mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
                <div className="h-2 bg-gray-200 rounded mb-4" />
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="h-14 bg-gray-100 rounded-xl" />
                  <div className="h-14 bg-gray-100 rounded-xl" />
                </div>
                <div className="flex gap-2 pt-4 border-t border-gray-100">
                  <div className="flex-1 h-9 bg-gray-100 rounded-xl" />
                  <div className="flex-1 h-9 bg-gray-100 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        ) : employees.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm mt-6">
            <p className="text-6xl mb-4">🔍</p>
            <h3 className="text-xl font-bold text-gray-700">No employees found</h3>
            <p className="text-gray-400 mt-2 text-sm">Try adjusting your search or add a new employee.</p>
            <div className="flex items-center justify-center gap-3 mt-5">
              <button onClick={handleReset} className="px-4 py-2 border border-gray-200 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors">
                Clear Filters
              </button>
              <Link to="/employees/add" className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors">
                Add Employee
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
            {employees.map((emp) => (
              <EmployeeCard key={emp._id} employee={emp} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
