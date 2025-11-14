import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import api from '../utils/api';

const CreateRoadmapDialog = ({ isOpen, onClose, onRoadmapCreated, prefilledRole = '', prefilledSkills = [] }) => {
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const [formData, setFormData] = useState({
    targetRole: '',
    currentSkills: [],
    timeframe: '3 months',
    weeklyHours: 10
  });

  // Pre-fill form when data is provided
  useEffect(() => {
    if (isOpen) {
      setFormData(prev => ({
        ...prev,
        targetRole: prefilledRole || prev.targetRole,
        currentSkills: prefilledSkills.length > 0 ? prefilledSkills : (user?.skills || [])
      }));
    }
  }, [prefilledRole, prefilledSkills, isOpen, user]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSkillsChange = (e) => {
    const skillsArray = e.target.value.split(',').map(skill => skill.trim()).filter(skill => skill);
    setFormData(prev => ({
      ...prev,
      currentSkills: skillsArray
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.targetRole || !formData.timeframe) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      
      const response = await api.post('/roadmaps/generate', formData);
      
      if (response.data.success) {
        const roadmapId = response.data.roadmapId;
        console.log('Roadmap created with ID:', roadmapId);
        
        alert('✅ Career roadmap created successfully!');
        onRoadmapCreated && onRoadmapCreated(roadmapId);
        onClose();
        
        // Reset form
        setFormData({
          targetRole: '',
          currentSkills: [],
          timeframe: '3 months',
          weeklyHours: 10
        });
      }
    } catch (error) {
      console.error('Roadmap creation error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create roadmap';
      
      if (error.response?.status === 401) {
        alert('Your session has expired. Please login again.');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      } else {
        alert(`❌ Error: ${errorMessage}`);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-display font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Create Career Roadmap
              </h2>
              <p className="text-slate-600 mt-2">
                AI-powered personalized learning path to your dream job
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition-colors"
              disabled={loading}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Target Role */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Target Role <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.targetRole}
                onChange={(e) => handleInputChange('targetRole', e.target.value)}
                placeholder="e.g., Frontend Developer, Data Analyst, Full-Stack Engineer"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
                disabled={loading}
              />
            </div>

            {/* Current Skills */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Current Skills
              </label>
              <input
                type="text"
                value={formData.currentSkills.join(', ')}
                onChange={handleSkillsChange}
                placeholder="e.g., HTML, CSS, JavaScript, React (comma-separated)"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                disabled={loading}
              />
              <p className="text-xs text-slate-500 mt-1">
                Enter your existing skills separated by commas
              </p>
            </div>

            {/* Timeframe and Weekly Hours */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Timeframe <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.timeframe}
                  onChange={(e) => handleInputChange('timeframe', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                  disabled={loading}
                >
                  <option value="1 month">1 Month</option>
                  <option value="2 months">2 Months</option>
                  <option value="3 months">3 Months</option>
                  <option value="6 months">6 Months</option>
                  <option value="9 months">9 Months</option>
                  <option value="12 months">12 Months</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Weekly Hours
                </label>
                <input
                  type="number"
                  value={formData.weeklyHours}
                  onChange={(e) => handleInputChange('weeklyHours', parseInt(e.target.value))}
                  min="1"
                  max="60"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  disabled={loading}
                />
                <p className="text-xs text-slate-500 mt-1">
                  Hours/week for learning
                </p>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="text-2xl">🎯</div>
                <div className="flex-1">
                  <h4 className="font-semibold text-purple-900 mb-1">What you'll get:</h4>
                  <ul className="text-sm text-purple-700 space-y-1">
                    <li>✓ Step-by-step learning phases</li>
                    <li>✓ Specific topics and technologies to master</li>
                    <li>✓ Hands-on project ideas</li>
                    <li>✓ Timeline for job applications</li>
                    <li>✓ Progress tracking & downloadable PDF</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors font-medium"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Generating Roadmap...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <span>Create Roadmap</span>
                  </div>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateRoadmapDialog;
