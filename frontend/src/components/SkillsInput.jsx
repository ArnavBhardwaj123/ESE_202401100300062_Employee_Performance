import { useState } from 'react';

export default function SkillsInput({ skills, onChange }) {
  const [input, setInput] = useState('');

  const addSkill = () => {
    const skill = input.trim();
    if (skill && !skills.includes(skill)) {
      onChange([...skills, skill]);
    }
    setInput('');
  };

  const removeSkill = (skill) => onChange(skills.filter((s) => s !== skill));

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addSkill();
    }
    if (e.key === 'Backspace' && !input && skills.length > 0) {
      onChange(skills.slice(0, -1));
    }
  };

  return (
    <div>
      <div className="flex gap-2 mb-2.5">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type skill and press Enter (e.g. React)"
          className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
        />
        <button
          type="button"
          onClick={addSkill}
          className="px-4 py-2.5 bg-indigo-100 text-indigo-700 rounded-xl text-sm font-semibold hover:bg-indigo-200 transition-colors"
        >
          Add
        </button>
      </div>
      {skills.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span
              key={skill}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium border border-indigo-100"
            >
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(skill)}
                className="text-indigo-400 hover:text-indigo-700 leading-none font-bold text-base"
                aria-label={`Remove ${skill}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
      {skills.length === 0 && (
        <p className="text-gray-400 text-xs">No skills added yet. Type and press Enter to add.</p>
      )}
    </div>
  );
}
