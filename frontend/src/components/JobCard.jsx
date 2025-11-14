const JobCard = ({ job, onClick }) => {
  const getBadgeColor = (type) => {
    const colors = {
      'Internship': 'bg-gradient-to-r from-emerald-100 to-mint-100 text-emerald-800 border border-emerald-300',
      'Full-time': 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-300',
      'Part-time': 'bg-gradient-to-r from-mint-100 to-green-100 text-mint-800 border border-mint-300',
      'Freelance': 'bg-gradient-to-r from-green-100 to-emerald-200 text-green-800 border border-green-300'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  // Parse requiredSkills if it's a JSON string
  const requiredSkills = typeof job.requiredSkills === 'string' 
    ? JSON.parse(job.requiredSkills) 
    : Array.isArray(job.requiredSkills) 
      ? job.requiredSkills 
      : [];

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-green-100 cursor-pointer transform hover:-translate-y-2 hover:scale-105 animate-fade-in" onClick={onClick}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-green-600 transition-colors">{job.title}</h3>
          <p className="text-gray-600 flex items-center space-x-2">
            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span className="font-medium">{job.company}</span>
          </p>
        </div>
        <span className={`px-4 py-2 rounded-full text-xs font-semibold ${getBadgeColor(job.jobType)} transform hover:scale-105 transition-transform`}>
          {job.jobType}
        </span>
      </div>
      
      <div className="flex items-center text-sm text-gray-600 mb-4 space-x-2">
        <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span>{job.location}</span>
      </div>

      <div className="mb-4">
        <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center space-x-2">
          <svg className="w-4 h-4 text-mint-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>Required Skills:</span>
        </p>
        <div className="flex flex-wrap gap-2">
          {requiredSkills.slice(0, 4).map((skill, index) => (
            <span key={index} className="bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 px-3 py-1.5 rounded-lg text-xs font-medium border border-green-200 hover:border-green-300 hover:shadow-lg transition-all transform hover:scale-105">
              {skill}
            </span>
          ))}
          {requiredSkills.length > 4 && (
            <span className="text-green-600 font-semibold text-xs px-3 py-1.5 bg-green-50 rounded-lg border border-green-200">
              +{requiredSkills.length - 4} more
            </span>
          )}
        </div>
      </div>

      {job.matchedSkills && job.matchedSkills.length > 0 && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-300 rounded-xl p-3 mt-3 animate-slide-in-up shadow-lg">
          <p className="text-sm text-green-800 font-medium flex items-start space-x-2">
            <svg className="w-5 h-5 text-green-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Matches {job.matchedSkills.length} of your skills: {job.matchedSkills.join(', ')}</span>
          </p>
        </div>
      )}

      {job.salary && (
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-600 font-medium flex items-center space-x-2">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-green-700 font-semibold">{job.salary}</span>
          </p>
          <button className="text-green-600 hover:text-green-700 font-medium text-sm flex items-center space-x-1 transition-all transform hover:translate-x-1 hover:scale-105">
            <span>View Details</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default JobCard;
