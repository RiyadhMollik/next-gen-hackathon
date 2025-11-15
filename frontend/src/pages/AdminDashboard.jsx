import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import AdminLayout from '../components/AdminLayout';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  const [stats, setStats] = useState(null);
  const [disadvantagedGroups, setDisadvantagedGroups] = useState(null);
  const [regionalData, setRegionalData] = useState(null);
  const [sdgReport, setSdgReport] = useState(null);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      
      // Fetch all admin data
      const [statsRes, disadvantagedRes, regionalRes, sdgRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/opportunities/disadvantaged-groups'),
        api.get('/admin/opportunities/regional'),
        api.get('/admin/sdg-impact-report')
      ]);

      setStats(statsRes.data.stats);
      setDisadvantagedGroups(disadvantagedRes.data);
      setRegionalData(regionalRes.data);
      setSdgReport(sdgRes.data.report);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      if (error.response?.status === 403) {
        alert('Access denied. Admin privileges required.');
        navigate('/dashboard');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-20 left-1/2 w-72 h-72 bg-mint-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">SDG Impact Dashboard</h1>
          <p className="text-gray-600">Monitor SDG 8 impact and manage opportunities for disadvantaged groups</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md p-2 mb-6 flex gap-2 overflow-x-auto">
          {[
            { id: 'overview', label: '📊 Overview', icon: '📊' },
            { id: 'disadvantaged', label: '🌟 Disadvantaged Groups', icon: '🌟' },
            { id: 'regional', label: '🌍 Regional Opportunities', icon: '🌍' },
            { id: 'sdg-impact', label: '🎯 SDG Impact', icon: '🎯' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-emerald-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard title="Total Users" value={stats.totalUsers} icon="👥" color="blue" />
            <StatCard title="Active Jobs" value={stats.totalJobs} icon="💼" color="green" />
            <StatCard title="Learning Resources" value={stats.totalResources} icon="📚" color="purple" />
            <StatCard title="Completed Interviews" value={stats.completedInterviews} icon="🎤" color="orange" />
          </div>
        )}

        {/* Disadvantaged Groups Tab */}
        {activeTab === 'disadvantaged' && disadvantagedGroups && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-emerald-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-semibold">Disadvantaged Users</p>
                    <p className="text-3xl font-bold text-gray-800 mt-2">
                      {disadvantagedGroups.stats.totalDisadvantagedUsers}
                    </p>
                  </div>
                  <div className="bg-emerald-100 rounded-full p-4">
                    <span className="text-3xl">🌟</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-semibold">Targeted Jobs</p>
                    <p className="text-3xl font-bold text-gray-800 mt-2">
                      {disadvantagedGroups.stats.totalTargetedJobs}
                    </p>
                  </div>
                  <div className="bg-green-100 rounded-full p-4">
                    <span className="text-3xl">💼</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-semibold">Internships</p>
                    <p className="text-3xl font-bold text-gray-800 mt-2">
                      {disadvantagedGroups.stats.byCategory.internships}
                    </p>
                  </div>
                  <div className="bg-blue-100 rounded-full p-4">
                    <span className="text-3xl">🎓</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Opportunities Breakdown */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Opportunities by Category</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(disadvantagedGroups.stats.byCategory).map(([category, count]) => (
                  <div key={category} className="bg-emerald-50 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-emerald-600">{count}</p>
                    <p className="text-sm text-gray-600 capitalize">{category.replace(/([A-Z])/g, ' $1')}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Opportunities */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">🌟 Highlighted Opportunities for Disadvantaged Groups</h3>
              <div className="space-y-3">
                {disadvantagedGroups.opportunities.freshGraduates.slice(0, 5).map((job) => (
                  <div key={job.id} className="border-l-4 border-emerald-500 bg-emerald-50 p-4 rounded-r-lg hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-800">{job.title}</h4>
                        <p className="text-sm text-gray-600">{job.company} • {job.location}</p>
                        <div className="flex gap-2 mt-2">
                          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full font-semibold">
                            {job.experienceLevel}
                          </span>
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-semibold">
                            {job.jobType}
                          </span>
                          <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-semibold">
                            Recommended
                          </span>
                        </div>
                      </div>
                      <span className="text-2xl">🌟</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            {disadvantagedGroups.recommendations && (
              <div className="bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
                <h3 className="text-xl font-bold mb-4">💡 Administrative Recommendations</h3>
                <div className="space-y-3">
                  {disadvantagedGroups.recommendations.createMoreInternships && (
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                      <p className="font-semibold">📈 Increase Internship Opportunities</p>
                      <p className="text-sm text-emerald-50 mt-1">Create more internship positions to match demand from fresh graduates and disadvantaged groups.</p>
                    </div>
                  )}
                  {disadvantagedGroups.recommendations.createMoreRemoteJobs && (
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                      <p className="font-semibold">🌍 Expand Remote Work Options</p>
                      <p className="text-sm text-emerald-50 mt-1">Remote jobs increase accessibility for disadvantaged groups in rural or underserved areas.</p>
                    </div>
                  )}
                  {disadvantagedGroups.recommendations.focusOnFreshers && (
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                      <p className="font-semibold">🎓 Focus on Fresh Graduate Programs</p>
                      <p className="text-sm text-emerald-50 mt-1">Large proportion of users are fresh graduates - prioritize entry-level positions.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Regional Opportunities Tab */}
        {activeTab === 'regional' && regionalData && (
          <div className="space-y-6">
            {/* Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
                <p className="text-gray-600 text-sm font-semibold">Total Regions</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{regionalData.summary.totalRegions}</p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
                <p className="text-gray-600 text-sm font-semibold">Remote Jobs</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{regionalData.summary.remoteJobs}</p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
                <p className="text-gray-600 text-sm font-semibold">Bangladesh Jobs</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{regionalData.summary.bangladeshJobs}</p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
                <p className="text-gray-600 text-sm font-semibold">International</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{regionalData.summary.internationalJobs}</p>
              </div>
            </div>

            {/* Regional Breakdown */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">🌍 Opportunities by Region</h3>
              <div className="space-y-4">
                {regionalData.regionalData.map((region, index) => (
                  <div key={index} className="border-l-4 border-emerald-500 bg-gradient-to-r from-emerald-50 to-green-50 p-4 rounded-r-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-bold text-gray-800 text-lg">{region.region}</h4>
                      <span className="px-4 py-2 bg-emerald-600 text-white rounded-full font-bold">
                        {region.totalJobs} jobs
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                      {Object.entries(region.jobTypes).map(([type, count]) => (
                        <div key={type} className="bg-white rounded-lg p-3 text-center shadow-sm">
                          <p className="text-lg font-bold text-emerald-600">{count}</p>
                          <p className="text-xs text-gray-600">{type}</p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-3">
                      <p className="text-sm text-gray-600 mb-2">Top Opportunities:</p>
                      <div className="flex flex-wrap gap-2">
                        {region.topJobs.slice(0, 3).map((job) => (
                          <span key={job.id} className="px-3 py-1 bg-white rounded-lg text-xs text-gray-700 shadow-sm">
                            {job.title} @ {job.company}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SDG Impact Tab */}
        {activeTab === 'sdg-impact' && sdgReport && (
          <div className="space-y-6">
            {/* SDG Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg p-8 text-white">
              <h2 className="text-3xl font-bold mb-2">🎯 SDG 8: Decent Work and Economic Growth</h2>
              <p className="text-blue-100">Platform Impact Report - Promoting inclusive and sustainable economic growth</p>
            </div>

            {/* Overall Impact */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <ImpactCard
                title="Total Users Served"
                value={sdgReport.overallImpact.totalUsers}
                icon="👥"
                color="blue"
              />
              <ImpactCard
                title="Active Opportunities"
                value={sdgReport.overallImpact.activeJobs}
                icon="💼"
                color="green"
              />
              <ImpactCard
                title="Skills Courses"
                value={sdgReport.skillsDevelopment.totalCourses}
                icon="📚"
                color="purple"
              />
              <ImpactCard
                title="Interview Prep"
                value={sdgReport.interviewPreparation.totalInterviews}
                icon="🎤"
                color="orange"
              />
            </div>

            {/* Disadvantaged Groups Impact */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">🌟 Disadvantaged Groups Impact</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-emerald-50 rounded-lg">
                  <p className="text-4xl font-bold text-emerald-600">
                    {sdgReport.disadvantagedGroupsImpact.totalDisadvantagedUsers}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">Users from Disadvantaged Groups</p>
                  <p className="text-xs text-emerald-600 mt-1 font-semibold">
                    {sdgReport.disadvantagedGroupsImpact.percentageOfTotal}% of total users
                  </p>
                </div>
                <div className="text-center p-6 bg-green-50 rounded-lg">
                  <p className="text-4xl font-bold text-green-600">
                    {sdgReport.disadvantagedGroupsImpact.targetedOpportunities}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">Targeted Opportunities</p>
                  <p className="text-xs text-green-600 mt-1 font-semibold">Entry-level & Internships</p>
                </div>
                <div className="text-center p-6 bg-blue-50 rounded-lg">
                  <p className="text-4xl font-bold text-blue-600">
                    {sdgReport.disadvantagedGroupsImpact.opportunityCoverage}%
                  </p>
                  <p className="text-sm text-gray-600 mt-2">Opportunity Coverage</p>
                  <p className="text-xs text-blue-600 mt-1 font-semibold">Jobs per disadvantaged user</p>
                </div>
              </div>
            </div>

            {/* Regional Impact */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">🌍 Regional Accessibility</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-purple-50 rounded-lg">
                  <p className="text-4xl font-bold text-purple-600">
                    {sdgReport.regionalImpact.remoteJobs}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">Remote Opportunities</p>
                  <p className="text-xs text-purple-600 mt-1 font-semibold">
                    {sdgReport.regionalImpact.remotePercentage}% of total
                  </p>
                </div>
                <div className="text-center p-6 bg-orange-50 rounded-lg">
                  <p className="text-4xl font-bold text-orange-600">
                    {sdgReport.regionalImpact.bangladeshJobs}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">Local (Bangladesh)</p>
                  <p className="text-xs text-orange-600 mt-1 font-semibold">
                    {sdgReport.regionalImpact.localPercentage}% of total
                  </p>
                </div>
                <div className="text-center p-6 bg-pink-50 rounded-lg">
                  <p className="text-4xl font-bold text-pink-600">
                    {sdgReport.regionalImpact.internationalJobs}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">International</p>
                  <p className="text-xs text-pink-600 mt-1 font-semibold">Global reach</p>
                </div>
              </div>
            </div>

            {/* SDG Alignment */}
            <div className="bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
              <h3 className="text-xl font-bold mb-4">✅ SDG 8 Targets Alignment</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                  <p className="font-semibold mb-2">8.5 Full Employment & Decent Work</p>
                  <p className="text-sm text-emerald-50">
                    {sdgReport.sdgAlignment.decentWorkOpportunities} decent work opportunities created
                  </p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                  <p className="font-semibold mb-2">8.6 Youth Employment</p>
                  <p className="text-sm text-emerald-50">
                    {sdgReport.sdgAlignment.youthEmpowerment} youth empowered with skills & opportunities
                  </p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                  <p className="font-semibold mb-2">8.3 Entrepreneurship & Innovation</p>
                  <p className="text-sm text-emerald-50">
                    {sdgReport.sdgAlignment.skillsTraining} skills training programs provided
                  </p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                  <p className="font-semibold mb-2">8.8 Labor Rights & Safe Working Environments</p>
                  <p className="text-sm text-emerald-50">
                    {sdgReport.sdgAlignment.inclusiveEmployment} inclusive employment opportunities
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

// Helper Components
const StatCard = ({ title, value, icon, color }) => {
  const colorMap = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600'
  };

  return (
    <div className={`bg-gradient-to-r ${colorMap[color]} rounded-xl shadow-lg p-6 text-white`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/80 text-sm font-semibold">{title}</p>
          <p className="text-4xl font-bold mt-2">{value}</p>
        </div>
        <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
          <span className="text-3xl">{icon}</span>
        </div>
      </div>
    </div>
  );
};

const ImpactCard = ({ title, value, icon, color }) => {
  const colorMap = {
    blue: 'border-blue-500 bg-blue-50 text-blue-600',
    green: 'border-green-500 bg-green-50 text-green-600',
    purple: 'border-purple-500 bg-purple-50 text-purple-600',
    orange: 'border-orange-500 bg-orange-50 text-orange-600'
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 border-l-4 ${colorMap[color]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-semibold">{title}</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
        </div>
        <div className={`${colorMap[color]} rounded-full p-4`}>
          <span className="text-3xl">{icon}</span>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
