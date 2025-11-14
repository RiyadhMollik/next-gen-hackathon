import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../utils/api';

const InterviewFeedback = () => {
  const { interviewId } = useParams();
  const navigate = useNavigate();
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchInterview();
  }, [interviewId]);

  const fetchInterview = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/interviews/${interviewId}`);
      
      const interviewData = response.data.interview;
      
      // Parse JSON strings if needed
      if (typeof interviewData.feedback === 'string') {
        interviewData.feedback = JSON.parse(interviewData.feedback);
      }
      if (typeof interviewData.questions === 'string') {
        interviewData.questions = JSON.parse(interviewData.questions);
      }
      if (typeof interviewData.userAnswers === 'string') {
        interviewData.userAnswers = JSON.parse(interviewData.userAnswers);
      }
      
      setInterview(interviewData);
    } catch (error) {
      console.error('Failed to fetch interview:', error);
      setError(error.response?.data?.message || 'Failed to load feedback');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 8) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 6) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (score >= 4) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getOverallScoreColor = (score) => {
    if (score >= 80) return 'from-green-500 to-emerald-500';
    if (score >= 60) return 'from-blue-500 to-indigo-500';
    if (score >= 40) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };

  const getPerformanceEmoji = (score) => {
    if (score >= 80) return '🌟';
    if (score >= 60) return '👍';
    if (score >= 40) return '📚';
    return '💪';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto"></div>
              <p className="mt-4 text-gray-600 font-medium">Analyzing your performance...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Unable to Load Feedback</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!interview || !interview.feedback) {
    return null;
  }

  // Parse overall feedback if it exists in feedback array
  const overallFeedback = interview.feedback.find(f => f.overallFeedback)?.overallFeedback || {
    strengths: [],
    improvements: [],
    recommendations: []
  };

  const questionFeedback = interview.feedback.filter(f => !f.overallFeedback);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium mb-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>

          {/* Overall Score Card */}
          <div className="bg-white rounded-3xl shadow-xl p-8 mb-6">
            <div className="flex items-center justify-between flex-wrap gap-6">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-4">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Interview Complete
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  Interview Feedback
                </h1>
                <p className="text-gray-600 text-lg">
                  {interview.jobTitle}
                </p>
                <div className="flex items-center gap-4 mt-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {interview.questions.length} Questions
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {Math.floor(interview.duration / 60)} minutes
                  </div>
                </div>
              </div>

              {/* Score Circle */}
              <div className="flex flex-col items-center">
                <div className={`relative w-32 h-32 rounded-full bg-gradient-to-br ${getOverallScoreColor(interview.overallScore)} p-1`}>
                  <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-gray-900">{Math.round(interview.overallScore)}</div>
                      <div className="text-sm text-gray-600">/ 100</div>
                    </div>
                  </div>
                </div>
                <div className="mt-3 text-center">
                  <span className="text-2xl">{getPerformanceEmoji(interview.overallScore)}</span>
                  <p className="text-sm font-medium text-gray-700 mt-1">
                    {interview.overallScore >= 80 ? 'Excellent!' : 
                     interview.overallScore >= 60 ? 'Good Job!' : 
                     interview.overallScore >= 40 ? 'Keep Learning' : 'Practice More'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Overall Feedback Summary */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* Strengths */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="font-bold text-green-900">Strengths</h3>
              </div>
              <ul className="space-y-2">
                {overallFeedback.strengths?.map((strength, idx) => (
                  <li key={idx} className="text-sm text-green-800 flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">•</span>
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Improvements */}
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="font-bold text-orange-900">Areas to Improve</h3>
              </div>
              <ul className="space-y-2">
                {overallFeedback.improvements?.map((improvement, idx) => (
                  <li key={idx} className="text-sm text-orange-800 flex items-start gap-2">
                    <span className="text-orange-600 mt-0.5">•</span>
                    <span>{improvement}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommendations */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
                  </svg>
                </div>
                <h3 className="font-bold text-blue-900">Recommendations</h3>
              </div>
              <ul className="space-y-2">
                {overallFeedback.recommendations?.map((recommendation, idx) => (
                  <li key={idx} className="text-sm text-blue-800 flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">•</span>
                    <span>{recommendation}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Question-by-Question Feedback */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Detailed Feedback</h2>
          
          {questionFeedback.map((feedback, idx) => {
            const question = interview.questions[feedback.questionIndex];
            const userAnswer = interview.userAnswers.find(a => a.questionIndex === feedback.questionIndex);

            return (
              <div key={idx} className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-indigo-100 text-indigo-700 rounded-full font-bold text-sm">
                        {feedback.questionIndex + 1}
                      </span>
                      <h3 className="font-semibold text-gray-900">{question.question}</h3>
                    </div>
                    <div className="flex gap-2 ml-11">
                      <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                        {question.category}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        question.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                        question.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {question.difficulty}
                      </span>
                    </div>
                  </div>
                  <div className={`px-4 py-2 rounded-xl border-2 ${getScoreColor(feedback.score)}`}>
                    <div className="text-2xl font-bold text-center">{feedback.score}</div>
                    <div className="text-xs text-center">/ 10</div>
                  </div>
                </div>

                {/* Your Answer */}
                <div className="mb-4 ml-11">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Your Answer:</h4>
                  <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700">
                    {userAnswer?.answer || 'No answer provided'}
                  </div>
                </div>

                {/* Feedback */}
                <div className="mb-4 ml-11">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Feedback:</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">{feedback.feedback}</p>
                </div>

                {/* Strengths & Improvements */}
                <div className="grid md:grid-cols-2 gap-4 ml-11">
                  {feedback.strengths?.length > 0 && (
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <h5 className="text-sm font-semibold text-green-900 mb-2">✓ Strengths:</h5>
                      <ul className="space-y-1">
                        {feedback.strengths.map((strength, sIdx) => (
                          <li key={sIdx} className="text-xs text-green-700">• {strength}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {feedback.improvements?.length > 0 && (
                    <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                      <h5 className="text-sm font-semibold text-orange-900 mb-2">→ Improvements:</h5>
                      <ul className="space-y-1">
                        {feedback.improvements.map((improvement, iIdx) => (
                          <li key={iIdx} className="text-xs text-orange-700">• {improvement}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="mt-8 flex gap-4 justify-center">
          <button
            onClick={() => navigate('/dashboard')}
            className="px-8 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
          >
            Back to Dashboard
          </button>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg font-medium"
          >
            Practice Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterviewFeedback;
