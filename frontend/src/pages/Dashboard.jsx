import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import JobCard from '../components/JobCard';
import ResourceCard from '../components/ResourceCard';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/recommendations/dashboard');
      setDashboardData(response.data);
    } catch (error) {
      console.error('Failed to fetch dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-50">
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-7xl">
        {/* Header */}
        <div className="mb-10 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-display font-bold bg-gradient-to-r from-primary-600 via-indigo-600 to-mint-600 bg-clip-text text-transparent mb-3">
            Welcome back, {dashboardData?.user?.fullName}! 👋
          </h1>
          <p className="text-slate-600 text-lg font-medium">Here's your personalized career dashboard</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* Skills Card */}
          <div className="group relative overflow-hidden bg-gradient-to-br from-primary-500 to-indigo-600 text-white rounded-3xl p-6 shadow-soft-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 animate-scale-in">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-primary-100 text-sm font-medium mb-2">Your Skills</p>
                  <p className="text-5xl font-display font-bold">{dashboardData?.stats?.totalSkills || 0}</p>
                </div>
                <div className="bg-white bg-opacity-20 backdrop-blur-sm p-3 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <p className="text-primary-50 text-sm">Skills mastered</p>
            </div>
          </div>

          {/* Jobs Card */}
          <div className="group relative overflow-hidden bg-gradient-to-br from-mint-500 to-mint-600 text-white rounded-3xl p-6 shadow-soft-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 animate-scale-in" style={{animationDelay: '0.1s'}}>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-10 rounded-full -ml-16 -mb-16"></div>
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-mint-100 text-sm font-medium mb-2">Recommended Jobs</p>
                  <p className="text-5xl font-display font-bold">{dashboardData?.stats?.recommendedJobs || 0}</p>
                </div>
                <div className="bg-white bg-opacity-20 backdrop-blur-sm p-3 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <p className="text-mint-50 text-sm">Matches found</p>
            </div>
          </div>

          {/* Resources Card */}
          <div className="group relative overflow-hidden bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-3xl p-6 shadow-soft-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 animate-scale-in" style={{animationDelay: '0.2s'}}>
            <div className="absolute top-0 left-0 w-32 h-32 bg-white opacity-10 rounded-full -ml-8 -mt-8"></div>
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-indigo-100 text-sm font-medium mb-2">Learning Resources</p>
                  <p className="text-5xl font-display font-bold">{dashboardData?.stats?.availableResources || 0}</p>
                </div>
                <div className="bg-white bg-opacity-20 backdrop-blur-sm p-3 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              </div>
              <p className="text-indigo-50 text-sm">Courses available</p>
            </div>
          </div>
        </div>

        {/* Profile Summary */}
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl shadow-soft border border-slate-100 p-8 mb-10 animate-slide-up">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-display font-bold text-slate-900">Your Profile</h2>
            <button
              onClick={() => navigate('/profile')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-700 rounded-xl hover:bg-primary-100 transition-all duration-200 font-medium text-sm"
            >
              <span>Update Profile</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary-100 rounded-lg">
                <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <p className="text-slate-500 text-xs font-medium mb-1">Education</p>
                <p className="text-slate-900 font-semibold">{dashboardData?.user?.educationLevel || 'Not specified'}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <p className="text-slate-500 text-xs font-medium mb-1">Department</p>
                <p className="text-slate-900 font-semibold">{dashboardData?.user?.department || 'Not specified'}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-mint-100 rounded-lg">
                <svg className="w-5 h-5 text-mint-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <p className="text-slate-500 text-xs font-medium mb-1">Experience Level</p>
                <p className="text-slate-900 font-semibold">{dashboardData?.user?.experienceLevel}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <div>
                <p className="text-slate-500 text-xs font-medium mb-1">Career Track</p>
                <p className="text-slate-900 font-semibold">{dashboardData?.user?.preferredCareerTrack || 'Not specified'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recommended Jobs */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-display font-bold text-slate-900 mb-1">Recommended Jobs for You</h2>
              <p className="text-slate-600">Personalized based on your skills and preferences</p>
            </div>
            <button
              onClick={() => navigate('/jobs')}
              className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 bg-white text-primary-600 border-2 border-primary-200 rounded-xl hover:bg-primary-50 hover:border-primary-300 transition-all duration-200 font-semibold shadow-soft"
            >
              <span>View All Jobs</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
          
          {dashboardData?.recommendedJobs?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dashboardData.recommendedJobs.map((job, index) => (
                <div key={job.id} className="animate-scale-in" style={{animationDelay: `${index * 0.1}s`}}>
                  <JobCard job={job} onClick={() => navigate(`/jobs`)} />
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gradient-to-br from-primary-50 to-indigo-50 rounded-3xl border-2 border-dashed border-primary-200 p-12 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className="text-xl font-display font-bold text-slate-900 mb-2">Add Skills to Get Started</h3>
                <p className="text-slate-600 mb-6">
                  Add skills to your profile to get personalized job recommendations!
                </p>
                <button
                  onClick={() => navigate('/profile')}
                  className="btn-primary"
                >
                  Add Your Skills
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Recommended Resources */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-display font-bold text-slate-900 mb-1">Recommended Learning Resources</h2>
              <p className="text-slate-600">Curated courses to enhance your skills</p>
            </div>
            <button
              onClick={() => navigate('/resources')}
              className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 bg-white text-indigo-600 border-2 border-indigo-200 rounded-xl hover:bg-indigo-50 hover:border-indigo-300 transition-all duration-200 font-semibold shadow-soft"
            >
              <span>View All Resources</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
          
          {dashboardData?.recommendedResources?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dashboardData.recommendedResources.map((resource, index) => (
                <div key={resource.id} className="animate-scale-in" style={{animationDelay: `${index * 0.1}s`}}>
                  <ResourceCard resource={resource} />
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl border-2 border-dashed border-indigo-200 p-12 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl font-display font-bold text-slate-900 mb-2">No Resources Yet</h3>
                <p className="text-slate-600">Check back later for learning recommendations</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
