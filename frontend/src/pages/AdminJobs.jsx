import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import AdminLayout from '../components/AdminLayout';

const AdminJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showJobModal, setShowJobModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
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

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/admin/jobs?search=${searchTerm}`);
      setJobs(response.data.jobs);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
      if (error.response?.status === 403) {
        alert('Access denied. Admin privileges required.');
        navigate('/admin');
      }
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
    <AdminLayout>
      <div>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-mint-600 bg-clip-text text-transparent mb-2">
            Jobs Management
          </h1>
          <p className="text-lg text-slate-600">Add, edit, and manage job postings</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
              <p className="mt-4 text-slate-600">Loading...</p>
            </div>
          ) : (
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                    <input
                      type="text"
                      required
                      value={jobForm.location}
                      onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Job Type *</label>
                    <select
                      value={jobForm.jobType}
                      onChange={(e) => setJobForm({ ...jobForm, jobType: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Required Skills</label>
                  <input
                    type="text"
                    onKeyPress={handleSkillInput}
                    placeholder="Type a skill and press Enter"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={jobForm.description}
                    onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
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
    </AdminLayout>
  );
};

export default AdminJobs;
