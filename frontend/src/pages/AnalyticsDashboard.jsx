import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const AnalyticsDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [userGrowth, setUserGrowth] = useState(null);
  const [jobTrends, setJobTrends] = useState(null);
  const [interviewPerf, setInterviewPerf] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      
      console.log('Fetching analytics data...');
      
      // Fetch all analytics data with individual error handling
      const responses = await Promise.allSettled([
        api.get('/analytics/sdg-impact'),
        api.get('/analytics/user-growth?period=30'),
        api.get('/analytics/job-trends'),
        api.get('/analytics/interview-performance')
      ]);

      console.log('API Responses:', responses);

      // Handle SDG Impact Analytics
      if (responses[0].status === 'fulfilled') {
        console.log('SDG Analytics Data:', responses[0].value.data);
        setAnalytics(responses[0].value.data.analytics);
      } else {
        console.error('SDG Analytics error:', responses[0].reason);
        // Set default empty data structure
        setAnalytics({
          overview: {
            totalUsers: 0,
            usersAnalyzed: 0,
            analysisRate: 0,
            jobsSuggested: 0,
            coursesCreated: 0,
            interviewsConducted: 0
          },
          skillsDemand: [],
          skillGaps: [],
          topCareerTracks: [],
          experienceLevelDist: []
        });
      }

      // Handle User Growth
      if (responses[1].status === 'fulfilled') {
        console.log('User Growth Data:', responses[1].value.data);
        setUserGrowth(responses[1].value.data.growth);
      } else {
        console.error('User Growth error:', responses[1].reason);
        setUserGrowth([]);
      }

      // Handle Job Trends
      if (responses[2].status === 'fulfilled') {
        console.log('Job Trends Data:', responses[2].value.data);
        setJobTrends(responses[2].value.data.trends);
      } else {
        console.error('Job Trends error:', responses[2].reason);
        setJobTrends({ byType: [], byExperience: [], recentPostings: [] });
      }

      // Handle Interview Performance
      if (responses[3].status === 'fulfilled') {
        console.log('Interview Performance Data:', responses[3].value.data);
        setInterviewPerf(responses[3].value.data.performance);
      } else {
        console.error('Interview Performance error:', responses[3].reason);
        setInterviewPerf({ totalInterviews: 0, averageScore: 0, scoreDistribution: [] });
      }

      // Check for authorization errors
      const hasAuthError = responses.some(r => 
        r.status === 'rejected' && r.reason?.response?.status === 403
      );
      
      if (hasAuthError) {
        alert('Access denied. Admin privileges required.');
        navigate('/dashboard');
      }
      
      console.log('Analytics loaded successfully');
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading Analytics...</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <p className="text-red-600 font-medium">Failed to load analytics data</p>
          </div>
        </div>
      </div>
    );
  }

  // User Growth Chart Data
  const userGrowthData = {
    labels: userGrowth?.map(d => new Date(d.date).toLocaleDateString()) || [],
    datasets: [{
      label: 'New Users',
      data: userGrowth?.map(d => d.count) || [],
      borderColor: 'rgb(79, 70, 229)',
      backgroundColor: 'rgba(79, 70, 229, 0.1)',
      tension: 0.4,
      fill: true
    }]
  };

  // Skills Demand Chart Data
  const skillsDemandData = {
    labels: analytics?.skillsDemand?.slice(0, 10).map(s => s.skill) || [],
    datasets: [{
      label: 'Jobs Requiring Skill',
      data: analytics?.skillsDemand?.slice(0, 10).map(s => s.demand_count) || [],
      backgroundColor: [
        'rgba(79, 70, 229, 0.8)',
        'rgba(99, 102, 241, 0.8)',
        'rgba(129, 140, 248, 0.8)',
        'rgba(147, 197, 253, 0.8)',
        'rgba(96, 165, 250, 0.8)',
        'rgba(59, 130, 246, 0.8)',
        'rgba(37, 99, 235, 0.8)',
        'rgba(29, 78, 216, 0.8)',
        'rgba(30, 64, 175, 0.8)',
        'rgba(30, 58, 138, 0.8)'
      ]
    }]
  };

  // Experience Level Distribution
  const experienceData = {
    labels: analytics?.experienceLevelDist?.map(e => e.experienceLevel) || [],
    datasets: [{
      data: analytics?.experienceLevelDist?.map(e => e.count) || [],
      backgroundColor: [
        'rgba(34, 197, 94, 0.8)',
        'rgba(59, 130, 246, 0.8)',
        'rgba(251, 146, 60, 0.8)',
        'rgba(168, 85, 247, 0.8)'
      ]
    }]
  };

  // Interview Score Distribution
  const scoreDistData = {
    labels: interviewPerf?.scoreDistribution?.map(s => s.scoreRange) || [],
    datasets: [{
      data: interviewPerf?.scoreDistribution?.map(s => s.count) || [],
      backgroundColor: [
        'rgba(34, 197, 94, 0.8)',
        'rgba(59, 130, 246, 0.8)',
        'rgba(251, 191, 36, 0.8)',
        'rgba(239, 68, 68, 0.8)'
      ]
    }]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">SDG 8 Impact Analytics</h1>
          <p className="text-lg text-gray-600">Decent Work and Economic Growth - Platform Impact Dashboard</p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-indigo-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Users</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{(analytics?.overview?.totalUsers || 0).toLocaleString()}</p>
                <p className="text-xs text-indigo-600 mt-1">{analytics?.overview?.analysisRate || 0}% analyzed</p>
              </div>
              <div className="bg-indigo-100 rounded-full p-4">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Jobs Suggested</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{(analytics?.overview?.jobsSuggested || 0).toLocaleString()}</p>
              </div>
              <div className="bg-green-100 rounded-full p-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Courses Created</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{(analytics?.overview?.coursesCreated || 0).toLocaleString()}</p>
              </div>
              <div className="bg-purple-100 rounded-full p-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Interviews Completed</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{(analytics?.overview?.interviewsConducted || 0).toLocaleString()}</p>
              </div>
              <div className="bg-orange-100 rounded-full p-4">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* User Growth */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">User Growth (Last 30 Days)</h3>
            {userGrowth && userGrowth.length > 0 ? (
              <Line data={userGrowthData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
            ) : (
              <div className="text-center py-12 text-gray-500">No user growth data available</div>
            )}
          </div>

          {/* Top Skills in Demand */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Top Skills in Demand</h3>
            {analytics?.skillsDemand && analytics.skillsDemand.length > 0 ? (
              <Bar 
                data={skillsDemandData} 
                options={{ 
                  responsive: true, 
                  indexAxis: 'y',
                  plugins: { legend: { display: false } }
                }} 
              />
            ) : (
              <div className="text-center py-12 text-gray-500">No skills demand data available</div>
            )}
          </div>
        </div>

        {/* Skill Gaps Table */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Common Skill Gaps</h3>
          <div className="overflow-x-auto">
            {analytics?.skillGaps && analytics.skillGaps.length > 0 ? (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Skill</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Jobs Requiring</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Users Having</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Gap</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Gap %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {analytics.skillGaps.map((gap, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{gap.skill}</td>
                      <td className="px-4 py-3 text-sm text-right text-gray-700">{gap.demandCount}</td>
                      <td className="px-4 py-3 text-sm text-right text-gray-700">{gap.userCount}</td>
                      <td className="px-4 py-3 text-sm text-right font-semibold text-orange-600">{gap.gap}</td>
                      <td className="px-4 py-3 text-sm text-right">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                          {gap.gapPercentage}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-12 text-gray-500">No skill gap data available</div>
            )}
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Experience Level Distribution */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Experience Level Distribution</h3>
            {analytics?.experienceLevelDist && analytics.experienceLevelDist.length > 0 ? (
              <div className="flex justify-center">
                <div className="w-80">
                  <Doughnut data={experienceData} />
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">No experience level data available</div>
            )}
          </div>

          {/* Interview Performance */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Interview Performance Distribution</h3>
            {interviewPerf?.scoreDistribution && interviewPerf.scoreDistribution.length > 0 ? (
              <>
                <div className="flex justify-center mb-4">
                  <div className="w-80">
                    <Doughnut data={scoreDistData} />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Average Score</p>
                    <p className="text-2xl font-bold text-indigo-600">{interviewPerf?.averageScore || 0}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Max Score</p>
                    <p className="text-2xl font-bold text-green-600">{interviewPerf?.maxScore || 0}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Total Interviews</p>
                    <p className="text-2xl font-bold text-gray-700">{interviewPerf?.totalInterviews || 0}</p>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-gray-500">No interview performance data available</div>
            )}
          </div>
        </div>

        {/* Top Career Tracks */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Top Career Tracks</h3>
          {analytics?.topCareerTracks && analytics.topCareerTracks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {analytics.topCareerTracks.map((track, idx) => (
                <div key={idx} className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-100">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-900">{track.preferredCareerTrack}</p>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-indigo-600 text-white">
                      {track.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">No career track data available</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
