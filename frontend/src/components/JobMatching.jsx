import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import CreateCourseDialog from './CreateCourseDialog';
import CreateRoadmapDialog from './CreateRoadmapDialog';

const JobMatching = () => {
  const [matches, setMatches] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [showCourseDialog, setShowCourseDialog] = useState(false);
  const [showRoadmapDialog, setShowRoadmapDialog] = useState(false);
  const [showInterviewDialog, setShowInterviewDialog] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [hasRoadmap, setHasRoadmap] = useState(false);
  const [generatingInterview, setGeneratingInterview] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobMatches();
    checkActiveRoadmap();
  }, []);

  const checkActiveRoadmap = async () => {
    try {
      const response = await api.get('/roadmaps/active');
      setHasRoadmap(response.data.success);
    } catch (error) {
      setHasRoadmap(false);
    }
  };

  const fetchJobMatches = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/job-matching/matches?top_n=10');
      setMatches(response.data);
    } catch (error) {
      console.error('Failed to fetch job matches:', error);
      setError(error.response?.data?.message || 'Failed to load job matches');
    } finally {
      setLoading(false);
    }
  };

  const getMatchColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (percentage >= 60) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (percentage >= 40) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-gray-600 bg-gray-50 border-gray-200';
  };

  const getMatchIcon = (percentage) => {
    if (percentage >= 80) return '🔥';
    if (percentage >= 60) return '✨';
    if (percentage >= 40) return '💡';
    return '📚';
  };

  const handleCreateCourse = (missingSkills, jobTitle) => {
    setSelectedSkills(missingSkills);
    setShowCourseDialog(true);
  };

  const handleCourseCreated = (courseId) => {
    setShowCourseDialog(false);
    navigate(`/courses/edit/${courseId}`);
  };

  const handleRoadmapAction = () => {
    if (hasRoadmap) {
      navigate('/roadmap');
    } else {
      setShowRoadmapDialog(true);
    }
  };

  const handleRoadmapCreated = (roadmapId) => {
    setShowRoadmapDialog(false);
    setHasRoadmap(true);
    navigate('/roadmap');
  };

  const handleStartInterview = async (match) => {
    setGeneratingInterview(true);
    try {
      // Generate interview questions using OpenAI
      const response = await api.post('/interviews/generate', {
        jobTitle: match.title,
        jobDescription: match.description || `${match.title} position at ${match.company}. Required skills: ${match.skills_analysis.missing_skills.concat(match.skills_analysis.matched_skills.map(s => s.skill)).join(', ')}`,
        userSkills: match.skills_analysis.matched_skills.map(s => ({
          skill: s.skill,
          proficiency: s.proficiency
        }))
      });

      if (response.data.success) {
        // Navigate to interview page with the interview ID
        navigate(`/interview/${response.data.interviewId}`);
      }
    } catch (error) {
      console.error('Error generating interview:', error);
      alert('Failed to generate interview questions. Please try again.');
    } finally {
      setGeneratingInterview(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white/60 backdrop-blur-sm rounded-3xl shadow-soft border border-slate-100 p-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Finding your perfect job matches...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white/60 backdrop-blur-sm rounded-3xl shadow-soft border border-slate-100 p-8">
        <div className="text-center py-8">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to Load Job Matches</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchJobMatches}
            className="px-6 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!matches || !matches.success || matches.total_matches === 0) {
    return (
      <div className="bg-white/60 backdrop-blur-sm rounded-3xl shadow-soft border border-slate-100 p-8">
        <div className="text-center py-8">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Job Matches Found</h3>
          <p className="text-gray-600 mb-4">
            We couldn't find any matching jobs. Try adding more skills to your profile!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Summary */}
      <div className="bg-gradient-to-r from-primary-600 to-indigo-600 rounded-3xl shadow-soft p-8 text-white">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
          <div>
            <h2 className="text-3xl font-display font-bold mb-2">
              🎯 Your Job Matches
            </h2>
            <p className="text-primary-100">
              Found {matches.total_matches} jobs matching your profile
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={fetchJobMatches}
              className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-colors text-sm font-medium"
            >
              🔄 Refresh
            </button>
          </div>
        </div>

        {/* Match Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="text-3xl font-bold">{matches.summary.high_matches}</div>
            <div className="text-primary-100 text-sm">High Matches (70%+)</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="text-3xl font-bold">{matches.summary.good_matches}</div>
            <div className="text-primary-100 text-sm">Good Matches (50-70%)</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="text-3xl font-bold">{matches.summary.potential_matches}</div>
            <div className="text-primary-100 text-sm">Potential (&lt;50%)</div>
          </div>
        </div>
      </div>

      {/* Learning Recommendations */}
      {matches.learning_recommendations && matches.learning_recommendations.top_skills_to_learn.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
          <div className="flex items-start gap-3">
            <div className="text-2xl">💡</div>
            <div className="flex-1">
              <h3 className="font-semibold text-amber-900 mb-2">Skills to Learn</h3>
              <p className="text-amber-800 text-sm mb-3">
                {matches.learning_recommendations.summary}
              </p>
              <div className="flex flex-wrap gap-2">
                {matches.learning_recommendations.top_skills_to_learn.slice(0, 8).map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-white border border-amber-300 rounded-lg text-sm font-medium text-amber-900"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Job Matches List */}
      <div className="space-y-4">
        {matches.matches.map((match, index) => (
          <div
            key={match.job_id}
            className="bg-white rounded-2xl shadow-soft border border-slate-100 overflow-hidden hover:shadow-lg transition-all duration-300"
          >
            <div className="p-6">
              {/* Job Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{match.title}</h3>
                    <span className="text-2xl">{getMatchIcon(match.match_percentage)}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      {match.company}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {match.location}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 rounded-lg text-xs font-medium">
                      {match.job_type}
                    </span>
                  </div>
                </div>

                {/* Match Percentage */}
                <div className={`px-4 py-2 rounded-xl border-2 ${getMatchColor(match.match_percentage)} font-bold text-lg`}>
                  {match.match_percentage}%
                </div>
              </div>

              {/* Match Breakdown */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="text-xs text-blue-600 font-medium mb-1">Skills</div>
                  <div className="text-lg font-bold text-blue-700">{match.score_breakdown.skills_match}%</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-3">
                  <div className="text-xs text-purple-600 font-medium mb-1">Experience</div>
                  <div className="text-lg font-bold text-purple-700">{match.score_breakdown.experience_match}%</div>
                </div>
                <div className="bg-green-50 rounded-lg p-3">
                  <div className="text-xs text-green-600 font-medium mb-1">Track</div>
                  <div className="text-lg font-bold text-green-700">{match.score_breakdown.track_match}%</div>
                </div>
              </div>

              {/* Skills Analysis */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">
                    Skills: {match.skills_analysis.match_rate}
                  </span>
                </div>

                {/* Matched Skills */}
                {match.skills_analysis.matched_skills.length > 0 && (
                  <div className="mb-3">
                    <div className="text-xs text-gray-500 mb-2">✅ You have:</div>
                    <div className="flex flex-wrap gap-2">
                      {match.skills_analysis.matched_skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-green-50 border border-green-200 rounded-lg text-sm"
                        >
                          <span className="font-medium text-green-700">{skill.skill}</span>
                          <span className="text-green-600 text-xs ml-1">({skill.proficiency})</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Missing Skills */}
                {match.skills_analysis.missing_skills.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-xs text-gray-500">❌ Missing:</div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleCreateCourse(match.skills_analysis.missing_skills, match.job_title)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-sm hover:shadow-md text-xs font-medium"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          Create Course
                        </button>
                        <button
                          onClick={() => handleStartInterview(match)}
                          disabled={generatingInterview}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all shadow-sm hover:shadow-md text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {generatingInterview ? (
                            <>
                              <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Generating...
                            </>
                          ) : (
                            <>
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                              Mock Interview
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {match.skills_analysis.missing_skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Recommendation */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-2">
                  <div className="text-xl">💡</div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-700">{match.recommendation}</div>
                  </div>
                </div>
              </div>

              {/* Platforms */}
              <div className="border-t border-gray-100 pt-4">
                <div className="text-sm font-semibold text-gray-700 mb-3">Where to Apply:</div>
                <div className="flex flex-wrap gap-2">
                  {match.platforms.map((platform, idx) => (
                    <a
                      key={idx}
                      href={platform.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors text-sm font-medium"
                    >
                      <span>{platform.name}</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Course Creation Dialog */}
      <CreateCourseDialog
        isOpen={showCourseDialog}
        onClose={() => setShowCourseDialog(false)}
        onCourseCreated={handleCourseCreated}
        prefilledSkills={selectedSkills}
      />

      {/* Roadmap Creation Dialog */}
      <CreateRoadmapDialog
        isOpen={showRoadmapDialog}
        onClose={() => setShowRoadmapDialog(false)}
        onRoadmapCreated={handleRoadmapCreated}
      />
    </div>
  );
};

export default JobMatching;
