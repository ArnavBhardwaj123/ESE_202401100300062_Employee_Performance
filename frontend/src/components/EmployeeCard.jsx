import { Link } from 'react-router-dom';

export const getScoreStyle = (score) => {
  if (score >= 85) return { bar: 'bg-emerald-500', badge: 'bg-emerald-100 text-emerald-700', label: 'Excellent', dot: 'bg-emerald-500' };
  if (score >= 70) return { bar: 'bg-blue-500', badge: 'bg-blue-100 text-blue-700', label: 'Good', dot: 'bg-blue-500' };
  if (score >= 50) return { bar: 'bg-amber-500', badge: 'bg-amber-100 text-amber-700', label: 'Average', dot: 'bg-amber-500' };
  return { bar: 'bg-red-500', badge: 'bg-red-100 text-red-700', label: 'Poor', dot: 'bg-red-500' };
};

const avatarColors = [
  'from-indigo-400 to-purple-500',
  'from-rose-400 to-pink-500',
  'from-emerald-400 to-teal-500',
  'from-amber-400 to-orange-500',
  'from-blue-400 to-cyan-500',
  'from-violet-400 to-indigo-500'
];

export default function EmployeeCard({ employee, onDelete }) {
  const score = getScoreStyle(employee.performanceScore);
  const colorIdx = employee.name.charCodeAt(0) % avatarColors.length;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all hover:-translate-y-0.5 group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 bg-gradient-to-br ${avatarColors[colorIdx]} rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm`}>
            {employee.name[0].toUpperCase()}
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-gray-900 truncate">{employee.name}</h3>
            <p className="text-gray-400 text-xs truncate">{employee.email}</p>
          </div>
        </div>
        <span className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold ${score.badge}`}>
          {score.label}
        </span>
      </div>

      {/* Score Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-1.5">
          <span className="text-gray-500 font-medium">Performance</span>
          <span className="font-bold text-gray-900">{employee.performanceScore}%</span>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${score.bar}`}
            style={{ width: `${employee.performanceScore}%` }}
          />
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="bg-slate-50 rounded-xl p-3">
          <p className="text-gray-400 text-xs font-medium mb-0.5">Department</p>
          <p className="font-semibold text-gray-800 text-sm truncate">{employee.department}</p>
        </div>
        <div className="bg-slate-50 rounded-xl p-3">
          <p className="text-gray-400 text-xs font-medium mb-0.5">Experience</p>
          <p className="font-semibold text-gray-800 text-sm">{employee.experience} yr{employee.experience !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {/* Skills */}
      {employee.skills?.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-1.5">
          {employee.skills.slice(0, 4).map((skill) => (
            <span key={skill} className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs rounded-lg font-medium">
              {skill}
            </span>
          ))}
          {employee.skills.length > 4 && (
            <span className="px-2.5 py-1 bg-gray-100 text-gray-500 text-xs rounded-lg font-medium">
              +{employee.skills.length - 4} more
            </span>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-4 border-t border-gray-100">
        <Link
          to={`/employees/edit/${employee._id}`}
          className="flex-1 text-center py-2 bg-indigo-50 text-indigo-700 rounded-xl text-sm font-semibold hover:bg-indigo-100 transition-colors"
        >
          Edit
        </Link>
        <button
          onClick={() => onDelete(employee._id)}
          className="flex-1 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-semibold hover:bg-red-100 transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
