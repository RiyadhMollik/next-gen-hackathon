import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';

const JobDetails = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    fetchJobDetails();
  }, [jobId]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/jobs/${jobId}`);
      setJob(response.data.job);
    } catch (error) {
      console.error('Failed to fetch job details:', error);
      setError('Failed to load job details');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!job) return;
    
    try {
      setApplying(true);
      const response = await api.post(`/jobs/${jobId}/apply`);
      
      if (response.data.success) {
        alert('Application submitted successfully!');
      }
    } catch (error) {
      console.error('Failed to apply for job:', error);
      if (error.response?.status === 400) {
        alert(error.response.data.message || 'You have already applied for this job');
      } else {
        alert('Failed to submit application. Please try again.');
      }
    } finally {
      setApplying(false);
    }
  };

  const getBadgeColor = (type) => {
    const colors = {
      'Internship': 'bg-gradient-to-r from-emerald-100 to-mint-100 text-emerald-800 border border-emerald-300',
      'Full-time': 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-300',
      'Part-time': 'bg-gradient-to-r from-mint-100 to-green-100 text-mint-800 border border-mint-300',
      'Freelance': 'bg-gradient-to-r from-green-100 to-emerald-200 text-green-800 border border-green-300'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
            <svg className="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h3 className="text-lg font-medium text-red-800 mb-2">Job Not Found</h3>
            <p className="text-red-600 mb-4">{error || 'The job you\'re looking for doesn\'t exist or has been removed.'}</p>
            <button
              onClick={() => navigate('/jobs')}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Back to Jobs
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Parse requiredSkills if it's a JSON string
  const requiredSkills = typeof job.requiredSkills === 'string' 
    ? JSON.parse(job.requiredSkills) 
    : Array.isArray(job.requiredSkills) 
      ? job.requiredSkills 
      : [];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Back Button */}
      <button
        onClick={() => navigate('/jobs')}
        className="flex items-center gap-2 text-green-600 hover:text-green-700 mb-6 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span>Back to Jobs</span>
      </button>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-8 border-b border-green-100">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
              <div className="flex items-center gap-4 text-gray-600 mb-4">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span className="font-medium text-lg">{job.company}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{job.location}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getBadgeColor(job.jobType)}`}>
                  {job.jobType}
                </span>
                {job.experienceLevel && (
                  <span className="px-4 py-2 rounded-full text-sm font-semibold bg-blue-100 text-blue-800 border border-blue-300">
                    {job.experienceLevel}
                  </span>
                )}
              </div>
            </div>
            
            {job.salary && (
              <div className="bg-white rounded-xl p-4 border border-green-200 shadow-sm">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 text-green-600 mb-1">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm font-medium">Salary</span>
                  </div>
                  <div className="text-xl font-bold text-green-700">{job.salary}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="p-8">
          {/* Job Description */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Job Description
            </h2>
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {job.description || 'No detailed description available for this position.'}
              </p>
            </div>
          </div>

          {/* Required Skills */}
          {requiredSkills.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Required Skills
              </h2>
              <div className="flex flex-wrap gap-3">
                {requiredSkills.map((skill, index) => (
                  <span 
                    key={index} 
                    className="bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 px-4 py-2 rounded-xl text-sm font-medium border border-green-200 hover:border-green-300 hover:shadow-lg transition-all transform hover:scale-105"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Matched Skills */}
          {job.matchedSkills && job.matchedSkills.length > 0 && (
            <div className="mb-8">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-300 rounded-xl p-6">
                <h3 className="text-lg font-bold text-green-800 mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Skills Match ({job.matchedSkills.length} matches)
                </h3>
                <div className="flex flex-wrap gap-2">
                  {job.matchedSkills.map((skill, index) => (
                    <span 
                      key={index} 
                      className="bg-green-100 text-green-800 px-3 py-1 rounded-lg text-sm font-medium border border-green-200"
                    >
                      ✓ {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Additional Information */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {job.careerTrack && (
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3" />
                  </svg>
                  Career Track
                </h3>
                <p className="text-blue-700">{job.careerTrack}</p>
              </div>
            )}
            
            {job.createdAt && (
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Posted
                </h3>
                <p className="text-gray-700">
                  {new Date(job.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            )}
          </div>

          {/* Apply Button */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
            <button
              onClick={handleApply}
              disabled={applying}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              {applying ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Applying...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Apply for This Job
                </>
              )}
            </button>
            <button
              onClick={() => navigator.share ? navigator.share({
                title: `${job.title} at ${job.company}`,
                text: `Check out this job opportunity: ${job.title} at ${job.company}`,
                url: window.location.href
              }) : navigator.clipboard.writeText(window.location.href).then(() => alert('Link copied to clipboard!'))}
              className="bg-gray-100 text-gray-700 px-6 py-4 rounded-xl font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
              Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
