const ResourceCard = ({ resource }) => {
  const getCostBadge = (cost) => {
    return cost === 'Free' 
      ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-300' 
      : 'bg-gradient-to-r from-orange-100 to-amber-100 text-orange-800 border border-orange-300';
  };

  const getLevelBadge = (level) => {
    const colors = {
      'Beginner': 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border border-blue-300',
      'Intermediate': 'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border border-yellow-300',
      'Advanced': 'bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border border-red-300'
    };
    return colors[level] || 'bg-gray-100 text-gray-800';
  };

  const getPlatformIcon = (platform) => {
    if (platform.toLowerCase().includes('coursera')) {
      return (
        <svg className="w-5 h-5 text-primary-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm6.5 12c0 3.59-2.91 6.5-6.5 6.5S5.5 15.59 5.5 12 8.41 5.5 12 5.5s6.5 2.91 6.5 6.5z"/>
        </svg>
      );
    }
    return (
      <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    );
  };

  // Parse relatedSkills if it's a JSON string
  const relatedSkills = typeof resource.relatedSkills === 'string' 
    ? JSON.parse(resource.relatedSkills) 
    : Array.isArray(resource.relatedSkills) 
      ? resource.relatedSkills 
      : [];

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 p-6 border border-gray-100 card-hover transform hover:-translate-y-2 animate-fade-in">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-primary-600 transition-colors line-clamp-2">{resource.title}</h3>
          <div className="flex items-center space-x-2 text-gray-600">
            {getPlatformIcon(resource.platform)}
            <span className="font-medium">{resource.platform}</span>
          </div>
        </div>
        <span className={`px-4 py-2 rounded-full text-xs font-semibold ml-3 ${getCostBadge(resource.cost)} transform hover:scale-105 transition-transform whitespace-nowrap`}>
          {resource.cost}
        </span>
      </div>

      {resource.description && (
        <p className="text-sm text-gray-600 mb-4 line-clamp-3 leading-relaxed">{resource.description}</p>
      )}

      <div className="mb-4">
        <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center space-x-2">
          <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>Skills Covered:</span>
        </p>
        <div className="flex flex-wrap gap-2">
          {relatedSkills.map((skill, index) => (
            <span key={index} className="bg-gradient-to-r from-primary-50 to-primary-100 text-primary-800 px-3 py-1.5 rounded-lg text-xs font-medium border border-primary-200 hover:border-primary-400 hover:shadow-sm transition-all transform hover:scale-105">
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
        <div className="flex gap-2 items-center">
          {resource.level && (
            <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${getLevelBadge(resource.level)} transform hover:scale-105 transition-transform`}>
              {resource.level}
            </span>
          )}
          {resource.duration && (
            <span className="text-xs text-gray-600 flex items-center space-x-1 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{resource.duration}</span>
            </span>
          )}
        </div>
        <a
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg btn-ripple flex items-center space-x-2"
        >
          <span>Start Learning</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>

      {resource.reasons && resource.reasons.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-300 rounded-xl p-3 mt-3 animate-slide-in-up">
          <p className="text-sm text-blue-800 font-medium flex items-start space-x-2">
            <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span>{resource.reasons[0]}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default ResourceCard;
