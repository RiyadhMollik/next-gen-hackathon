import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import AdminLayout from '../components/AdminLayout';

const AdminResources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showResourceModal, setShowResourceModal] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const navigate = useNavigate();

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
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/admin/resources?search=${searchTerm}`);
      setResources(response.data.resources);
    } catch (error) {
      console.error('Failed to fetch resources:', error);
      if (error.response?.status === 403) {
        alert('Access denied. Admin privileges required.');
        navigate('/admin');
      }
    } finally {
      setLoading(false);
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

  return (
    <AdminLayout>
      <div>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-mint-600 bg-clip-text text-transparent mb-2">
            Resources Management
          </h1>
          <p className="text-lg text-slate-600">Add and manage learning resources</p>
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
                  placeholder="Search resources..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && fetchResources()}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
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
        </div>
      </div>

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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mint-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                  <textarea
                    required
                    value={resourceForm.description}
                    onChange={(e) => setResourceForm({ ...resourceForm, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mint-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type *</label>
                    <select
                      value={resourceForm.type}
                      onChange={(e) => setResourceForm({ ...resourceForm, type: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mint-500 focus:border-transparent"
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mint-500 focus:border-transparent"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mint-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Career Track</label>
                  <input
                    type="text"
                    value={resourceForm.careerTrack}
                    onChange={(e) => setResourceForm({ ...resourceForm, careerTrack: e.target.value })}
                    placeholder="e.g., Software Development, Data Science"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mint-500 focus:border-transparent"
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
    </AdminLayout>
  );
};

export default AdminResources;
