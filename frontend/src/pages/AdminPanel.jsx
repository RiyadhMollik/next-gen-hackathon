import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('stats');
  const [stats, setStats] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [resources, setResources] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showJobModal, setShowJobModal] = useState(false);
  const [showResourceModal, setShowResourceModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [editingResource, setEditingResource] = useState(null);
  const navigate = useNavigate();

  // Job Form State
  const [jobForm, setJobForm] = useState({
    title: '',
    company: '',
    location: '',
    requiredSkills: [],
    experienceLevel: 'Fresher',
    jobType: 'Full-time',
    careerTrack: '',
    description: '',
    salary: ''
  });

  // Resource Form State
  const [resourceForm, setResourceForm] = useState({
    title: '',
    description: '',
    type: 'Article',
    url: '',
    difficulty: 'Beginner',
    careerTrack: ''
  });

  useEffect(() => {
    if (activeTab === 'stats') fetchStats();
    if (activeTab === 'jobs') fetchJobs();
    if (activeTab === 'resources') fetchResources();
    if (activeTab === 'users') fetchUsers();
  }, [activeTab]);

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

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/admin/jobs?search=${searchTerm}`);
      setJobs(response.data.jobs);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchResources = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/admin/resources?search=${searchTerm}`);
      setResources(response.data.resources);
    } catch (error) {
      console.error('Failed to fetch resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/admin/users?search=${searchTerm}`);
      setUsers(response.data.users);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!confirm('Are you sure you want to delete this job?')) return;
    
    try {
      await api.delete(`/admin/jobs/${jobId}`);
      alert('Job deleted successfully');
      fetchJobs();
    } catch (error) {
      console.error('Failed to delete job:', error);
      alert('Failed to delete job');
    }
  };

  const handleDeleteResource = async (resourceId) => {
    if (!confirm('Are you sure you want to delete this resource?')) return;
    
    try {
      await api.delete(`/admin/resources/${resourceId}`);
      alert('Resource deleted successfully');
      fetchResources();
    } catch (error) {
      console.error('Failed to delete resource:', error);
      alert('Failed to delete resource');
    }
  };

  const openJobModal = (job = null) => {
    if (job) {
      setEditingJob(job);
      setJobForm({
        title: job.title,
        company: job.company,
        location: job.location,
        requiredSkills: job.requiredSkills || [],
        experienceLevel: job.experienceLevel,
        jobType: job.jobType,
        careerTrack: job.careerTrack,
        description: job.description || '',
        salary: job.salary || ''
      });
    } else {
      setEditingJob(null);
      setJobForm({
        title: '',
        company: '',
        location: '',
        requiredSkills: [],
        experienceLevel: 'Fresher',
        jobType: 'Full-time',
        careerTrack: '',
        description: '',
        salary: ''
      });
    }
    setShowJobModal(true);
  };

  const openResourceModal = (resource = null) => {
    if (resource) {
      setEditingResource(resource);
      setResourceForm({
        title: resource.title,
        description: resource.description,
        type: resource.type,
        url: resource.url,
        difficulty: resource.difficulty || 'Beginner',
        careerTrack: resource.careerTrack || ''
      });
    } else {
      setEditingResource(null);
      setResourceForm({
        title: '',
        description: '',
        type: 'Article',
        url: '',
        difficulty: 'Beginner',
        careerTrack: ''
      });
    }
    setShowResourceModal(true);
  };

  const handleSaveJob = async (e) => {
    e.preventDefault();
    try {
      if (editingJob) {
        await api.put(`/admin/jobs/${editingJob.id}`, jobForm);
        alert('Job updated successfully');
      } else {
        await api.post('/admin/jobs', jobForm);
        alert('Job created successfully');
      }
      setShowJobModal(false);
      fetchJobs();
    } catch (error) {
      console.error('Failed to save job:', error);
      alert(error.response?.data?.message || 'Failed to save job');
    }
  };

  const handleSaveResource = async (e) => {
    e.preventDefault();
    try {
      if (editingResource) {
        await api.put(`/admin/resources/${editingResource.id}`, resourceForm);
        alert('Resource updated successfully');
      } else {
        await api.post('/admin/resources', resourceForm);
        alert('Resource created successfully');
      }
      setShowResourceModal(false);
      fetchResources();
    } catch (error) {
      console.error('Failed to save resource:', error);
      alert(error.response?.data?.message || 'Failed to save resource');
    }
  };

  const handleSkillInput = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      e.preventDefault();
      const newSkill = e.target.value.trim();
      if (!jobForm.requiredSkills.includes(newSkill)) {
        setJobForm({ ...jobForm, requiredSkills: [...jobForm.requiredSkills, newSkill] });
      }
      e.target.value = '';
    }
  };

  const removeSkill = (skillToRemove) => {
    setJobForm({
      ...jobForm,
      requiredSkills: jobForm.requiredSkills.filter(skill => skill !== skillToRemove)
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-mint-50 to-emerald-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-mint-600 bg-clip-text text-transparent mb-2">Admin Panel</h1>
          <p className="text-lg text-slate-600">Manage platform content and monitor activity</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {[
                { id: 'stats', name: 'Dashboard', icon: '📊' },
                { id: 'jobs', name: 'Jobs', icon: '💼' },
                { id: 'resources', name: 'Resources', icon: '📚' },
                { id: 'users', name: 'Users', icon: '👥' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 inline-flex items-center gap-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-emerald-500 text-emerald-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <span>{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
                <p className="mt-4 text-slate-600">Loading...</p>
              </div>
            ) : (
              <>
                {/* Stats Tab */}
                {activeTab === 'stats' && stats && (
                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                      <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-6 text-white">
                        <p className="text-sm opacity-90">Total Users</p>
                        <p className="text-4xl font-bold mt-2">{stats.totalUsers.toLocaleString()}</p>
                        <p className="text-sm mt-2 opacity-75">+{stats.recentActivity.newUsers} this week</p>
                      </div>
                      <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
                        <p className="text-sm opacity-90">Total Jobs</p>
                        <p className="text-4xl font-bold mt-2">{stats.totalJobs.toLocaleString()}</p>
                        <p className="text-sm mt-2 opacity-75">+{stats.recentActivity.newJobs} this week</p>
                      </div>
                      <div className="bg-gradient-to-br from-mint-500 to-mint-600 rounded-xl p-6 text-white">
                        <p className="text-sm opacity-90">Learning Resources</p>
                        <p className="text-4xl font-bold mt-2">{stats.totalResources.toLocaleString()}</p>
                      </div>
                      <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-xl p-6 text-white">
                        <p className="text-sm opacity-90">Courses Created</p>
                        <p className="text-4xl font-bold mt-2">{stats.totalCourses.toLocaleString()}</p>
                      </div>
                      <div className="bg-gradient-to-br from-emerald-600 to-mint-700 rounded-xl p-6 text-white">
                        <p className="text-sm opacity-90">Interviews</p>
                        <p className="text-4xl font-bold mt-2">{stats.totalInterviews.toLocaleString()}</p>
                        <p className="text-sm mt-2 opacity-75">{stats.completedInterviews} completed</p>
                      </div>
                      <div className="bg-gradient-to-br from-mint-600 to-green-700 rounded-xl p-6 text-white">
                        <p className="text-sm opacity-90">Platform Activity</p>
                        <p className="text-2xl font-bold mt-2">Active</p>
                        <p className="text-sm mt-2 opacity-75">All systems operational</p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <button
                        onClick={() => navigate('/analytics')}
                        className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl py-4 px-6 font-semibold hover:shadow-lg transition-all"
                      >
                        📈 View Full Analytics Dashboard
                      </button>
                    </div>
                  </div>
                )}

                {/* Jobs Tab */}
                {activeTab === 'jobs' && (
                  <div>
                    <div className="mb-6 flex gap-4">
                      <input
                        type="text"
                        placeholder="Search jobs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && fetchJobs()}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                      <button
                        onClick={() => openJobModal()}
                        className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium flex items-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Job
                      </button>
                    </div>
                    <div className="space-y-4">
                      {jobs.map(job => (
                        <div key={job.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                              <p className="text-gray-600 mt-1">{job.company} • {job.location}</p>
                              <div className="flex gap-2 mt-3">
                                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-medium">{job.jobType}</span>
                                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-medium">{job.experienceLevel}</span>
                              </div>
                            </div>
                            <div className="flex gap-2 ml-4">
                              <button
                                onClick={() => openJobModal(job)}
                                className="px-4 py-2 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200 transition-colors font-medium"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteJob(job.id)}
                                className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors font-medium"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                      {jobs.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                          No jobs found
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Resources Tab */}
                {activeTab === 'resources' && (
                  <div>
                    <div className="mb-6 flex gap-4">
                      <input
                        type="text"
                        placeholder="Search resources..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && fetchResources()}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                      <button
                        onClick={() => openResourceModal()}
                        className="px-6 py-3 bg-mint-600 text-white rounded-xl hover:bg-mint-700 transition-colors font-medium flex items-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Resource
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {resources.map(resource => (
                        <div key={resource.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="text-lg font-bold text-gray-900">{resource.title}</h3>
                              <p className="text-sm text-gray-600 mt-2 line-clamp-2">{resource.description}</p>
                              <div className="flex gap-2 mt-3">
                                <span className="px-2 py-1 bg-mint-100 text-mint-700 rounded text-xs font-medium">{resource.type}</span>
                                {resource.difficulty && (
                                  <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-medium">{resource.difficulty}</span>
                                )}
                              </div>
                            </div>
                            <div className="flex flex-col gap-2 ml-4">
                              <button
                                onClick={() => openResourceModal(resource)}
                                className="px-3 py-1 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200 transition-colors text-sm font-medium"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteResource(resource.id)}
                                className="px-3 py-1 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                      {resources.length === 0 && (
                        <div className="col-span-2 text-center py-12 text-gray-500">
                          No resources found
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Users Tab */}
                {activeTab === 'users' && (
                  <div>
                    <div className="mb-6">
                      <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && fetchUsers()}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Experience</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Career Track</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Joined</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                          {users.map(user => (
                            <tr key={user.id} className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm font-medium text-gray-900">{user.fullName}</td>
                              <td className="px-4 py-3 text-sm text-gray-700">{user.email}</td>
                              <td className="px-4 py-3 text-sm">
                                <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                                  {user.experienceLevel || 'N/A'}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-700">{user.preferredCareerTrack || 'Not set'}</td>
                              <td className="px-4 py-3 text-sm text-gray-700">
                                {new Date(user.createdAt).toLocaleDateString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {users.length === 0 && (
                        <div className="text-center py-12 text-gray-500 bg-white">
                          No users found
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Job Modal */}
      {showJobModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {editingJob ? 'Edit Job' : 'Add New Job'}
              </h2>
              <form onSubmit={handleSaveJob} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Job Title *</label>
                  <input
                    type="text"
                    required
                    value={jobForm.title}
                    onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company *</label>
                    <input
                      type="text"
                      required
                      value={jobForm.company}
                      onChange={(e) => setJobForm({ ...jobForm, company: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                    <input
                      type="text"
                      required
                      value={jobForm.location}
                      onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Job Type *</label>
                    <select
                      value={jobForm.jobType}
                      onChange={(e) => setJobForm({ ...jobForm, jobType: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="Internship">Internship</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Full-time">Full-time</option>
                      <option value="Freelance">Freelance</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level *</label>
                    <select
                      value={jobForm.experienceLevel}
                      onChange={(e) => setJobForm({ ...jobForm, experienceLevel: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="Fresher">Fresher</option>
                      <option value="Junior">Junior</option>
                      <option value="Mid">Mid</option>
                      <option value="Senior">Senior</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Career Track *</label>
                  <input
                    type="text"
                    required
                    value={jobForm.careerTrack}
                    onChange={(e) => setJobForm({ ...jobForm, careerTrack: e.target.value })}
                    placeholder="e.g., Software Development, Data Science"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Required Skills</label>
                  <input
                    type="text"
                    onKeyPress={handleSkillInput}
                    placeholder="Type a skill and press Enter"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {jobForm.requiredSkills.map((skill, idx) => (
                      <span key={idx} className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm flex items-center gap-2">
                        {skill}
                        <button type="button" onClick={() => removeSkill(skill)} className="text-emerald-900 hover:text-emerald-700">×</button>
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Salary (Optional)</label>
                  <input
                    type="text"
                    value={jobForm.salary}
                    onChange={(e) => setJobForm({ ...jobForm, salary: e.target.value })}
                    placeholder="e.g., $50,000 - $70,000"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={jobForm.description}
                    onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    {editingJob ? 'Update Job' : 'Create Job'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowJobModal(false)}
                    className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Resource Modal */}
      {showResourceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {editingResource ? 'Edit Resource' : 'Add New Resource'}
              </h2>
              <form onSubmit={handleSaveResource} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                  <input
                    type="text"
                    required
                    value={resourceForm.title}
                    onChange={(e) => setResourceForm({ ...resourceForm, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                  <textarea
                    required
                    value={resourceForm.description}
                    onChange={(e) => setResourceForm({ ...resourceForm, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type *</label>
                    <select
                      value={resourceForm.type}
                      onChange={(e) => setResourceForm({ ...resourceForm, type: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="Article">Article</option>
                      <option value="Video">Video</option>
                      <option value="Course">Course</option>
                      <option value="Tutorial">Tutorial</option>
                      <option value="Documentation">Documentation</option>
                      <option value="Book">Book</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                    <select
                      value={resourceForm.difficulty}
                      onChange={(e) => setResourceForm({ ...resourceForm, difficulty: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">URL *</label>
                  <input
                    type="url"
                    required
                    value={resourceForm.url}
                    onChange={(e) => setResourceForm({ ...resourceForm, url: e.target.value })}
                    placeholder="https://example.com/resource"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Career Track</label>
                  <input
                    type="text"
                    value={resourceForm.careerTrack}
                    onChange={(e) => setResourceForm({ ...resourceForm, careerTrack: e.target.value })}
                    placeholder="e.g., Software Development, Data Science"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                  >
                    {editingResource ? 'Update Resource' : 'Create Resource'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowResourceModal(false)}
                    className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
