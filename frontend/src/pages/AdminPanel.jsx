import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import AdminLayout from '../components/AdminLayout';

const AdminPanel = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/stats');
      setStats(response.data.stats);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      if (error.response?.status === 403) {
        alert('Access denied. Admin privileges required.');
        navigate('/dashboard');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading...</p>
        </div>
      ) : stats ? (
        <div>
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-mint-600 bg-clip-text text-transparent mb-2">
              Dashboard Overview
            </h1>
            <p className="text-lg text-slate-600">Platform statistics and recent activity</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg">
              <p className="text-sm opacity-90">Total Users</p>
              <p className="text-4xl font-bold mt-2">{stats.totalUsers.toLocaleString()}</p>
              <p className="text-sm mt-2 opacity-75">+{stats.recentActivity.newUsers} this week</p>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
              <p className="text-sm opacity-90">Total Jobs</p>
              <p className="text-4xl font-bold mt-2">{stats.totalJobs.toLocaleString()}</p>
              <p className="text-sm mt-2 opacity-75">+{stats.recentActivity.newJobs} this week</p>
            </div>
            <div className="bg-gradient-to-br from-mint-500 to-mint-600 rounded-xl p-6 text-white shadow-lg">
              <p className="text-sm opacity-90">Learning Resources</p>
              <p className="text-4xl font-bold mt-2">{stats.totalResources.toLocaleString()}</p>
            </div>
            <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-xl p-6 text-white shadow-lg">
              <p className="text-sm opacity-90">Courses Created</p>
              <p className="text-4xl font-bold mt-2">{stats.totalCourses.toLocaleString()}</p>
            </div>
            <div className="bg-gradient-to-br from-emerald-600 to-mint-700 rounded-xl p-6 text-white shadow-lg">
              <p className="text-sm opacity-90">Interviews</p>
              <p className="text-4xl font-bold mt-2">{stats.totalInterviews.toLocaleString()}</p>
              <p className="text-sm mt-2 opacity-75">{stats.completedInterviews} completed</p>
            </div>
            <div className="bg-gradient-to-br from-mint-600 to-green-700 rounded-xl p-6 text-white shadow-lg">
              <p className="text-sm opacity-90">Platform Activity</p>
              <p className="text-2xl font-bold mt-2">Active</p>
              <p className="text-sm mt-2 opacity-75">All systems operational</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => navigate('/admin/jobs')}
                className="p-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:shadow-lg transition-all text-left"
              >
                <div className="text-2xl mb-2">💼</div>
                <div className="font-semibold">Manage Jobs</div>
                <div className="text-sm opacity-90">Add, edit, or delete job postings</div>
              </button>
              <button
                onClick={() => navigate('/admin/resources')}
                className="p-4 bg-gradient-to-r from-mint-600 to-green-600 text-white rounded-xl hover:shadow-lg transition-all text-left"
              >
                <div className="text-2xl mb-2">📚</div>
                <div className="font-semibold">Manage Resources</div>
                <div className="text-sm opacity-90">Add learning materials and guides</div>
              </button>
              <button
                onClick={() => navigate('/admin/users')}
                className="p-4 bg-gradient-to-r from-emerald-600 to-mint-600 text-white rounded-xl hover:shadow-lg transition-all text-left"
              >
                <div className="text-2xl mb-2">👥</div>
                <div className="font-semibold">View Users</div>
                <div className="text-sm opacity-90">Monitor user activity and profiles</div>
              </button>
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="p-4 bg-gradient-to-r from-green-700 to-emerald-700 text-white rounded-xl hover:shadow-lg transition-all text-left"
              >
                <div className="text-2xl mb-2">🎯</div>
                <div className="font-semibold">SDG Impact Dashboard</div>
                <div className="text-sm opacity-90">View SDG 8 metrics and reports</div>
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </AdminLayout>
  );
};

export default AdminPanel;
