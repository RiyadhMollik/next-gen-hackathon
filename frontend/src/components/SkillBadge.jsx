const SkillBadge = ({ skill, onDelete, showDelete = false }) => {
  const getProficiencyColor = (proficiency) => {
    const colors = {
      'Beginner': 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border-blue-300',
      'Intermediate': 'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border-yellow-300',
      'Advanced': 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border-purple-300',
      'Expert': 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-300'
    };
    return colors[proficiency] || 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-gray-300';
  };

  const getProficiencyIcon = (proficiency) => {
    const icons = {
      'Beginner': '🌱',
      'Intermediate': '📈',
      'Advanced': '⚡',
      'Expert': '🏆'
    };
    return icons[proficiency] || '📌';
  };

  return (
    <div className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${getProficiencyColor(skill.proficiency)} group`}>
      <span className="flex items-center space-x-1">
        <span className="text-base">{getProficiencyIcon(skill.proficiency)}</span>
        <span>{skill.skillName}</span>
      </span>
      {skill.proficiency && (
        <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-white bg-opacity-50">
          {skill.proficiency}
        </span>
      )}
      {showDelete && onDelete && (
        <button
          onClick={() => onDelete(skill.id)}
          className="ml-3 text-red-600 hover:text-red-800 transition-all transform hover:scale-125 hover:rotate-90 duration-200 font-bold text-lg"
          title="Delete skill"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default SkillBadge;
