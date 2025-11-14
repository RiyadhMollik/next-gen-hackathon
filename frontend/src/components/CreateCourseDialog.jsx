import { useState, useEffect } from 'react';
import api from '../utils/api';

const CreateCourseDialog = ({ isOpen, onClose, onCourseCreated, prefilledSkills = [] }) => {
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    noOfChapters: 5,
    totalTime: '10 hours',
    includeVideo: false,
    level: 'Beginner',
    category: ''
  });

  // Pre-fill form when skills are provided
  useEffect(() => {
    if (prefilledSkills.length > 0 && isOpen) {
      const skillsText = prefilledSkills.join(', ');
      setFormData(prev => ({
        ...prev,
        name: `Master ${prefilledSkills.length > 1 ? prefilledSkills.slice(0, 2).join(' & ') : prefilledSkills[0]}`,
        description: `Comprehensive course to learn ${skillsText} from scratch to advanced level. Perfect for career advancement and skill development.`,
        category: prefilledSkills[0] || ''
      }));
    }
  }, [prefilledSkills, isOpen]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description || !formData.category) {
      alert('Please fill in all required fields');
      return;
    }

    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to create a course');
      window.location.href = '/login';
      return;
    }

    try {
      setLoading(true);
      
      // Step 1: Generate course layout
      setLoadingStep('Generating course structure...');
      const response = await api.post('/courses/generate-layout', formData);
      
      if (response.data.success) {
        const courseId = response.data.courseId;
        console.log('Course layout created with ID:', courseId);
        
        alert('✅ Course structure created successfully! You can now generate the content.');
        onCourseCreated && onCourseCreated(courseId);
        onClose();
        setFormData({
          name: '',
          description: '',
          noOfChapters: 5,
          totalTime: '10 hours',
          includeVideo: false,
          level: 'Beginner',
          category: ''
        });
        setLoadingStep('');
      }
    } catch (error) {
      console.error('Course creation error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create course';
      
      if (error.response?.status === 401) {
        alert('Your session has expired. Please login again.');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      } else {
        alert(`Error: ${errorMessage}\n\nPlease try again or contact support if the issue persists.`);
      }
    } finally {
      setLoading(false);
      setLoadingStep('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-display font-bold bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent">
                Create AI-Generated Course
              </h2>
              <p className="text-slate-600 mt-2">
                Let AI create a comprehensive learning course for you
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
            {/* Course Name */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Course Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="e.g., Full-Stack Web Development"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe what this course will cover..."
                rows={4}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                required
              />
            </div>

            {/* Number of Chapters */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Total Modules
                </label>
                <input
                  type="number"
                  value={formData.noOfChapters}
                  onChange={(e) => handleInputChange('noOfChapters', parseInt(e.target.value))}
                  min="1"
                  max="20"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Total Time
                </label>
                <input
                  type="text"
                  value={formData.totalTime}
                  onChange={(e) => handleInputChange('totalTime', e.target.value)}
                  placeholder="e.g., 10 hours"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Include Video */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="includeVideo"
                checked={formData.includeVideo}
                onChange={(e) => handleInputChange('includeVideo', e.target.checked)}
                className="w-5 h-5 text-primary-600 border-slate-300 rounded focus:ring-primary-500"
              />
              <label htmlFor="includeVideo" className="text-sm font-semibold text-slate-700">
                Include YouTube Video Recommendations
              </label>
            </div>

            {/* Level */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Difficulty Level <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.level}
                onChange={(e) => handleInputChange('level', e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                placeholder="e.g., Web Development, AI, Data Science"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex-1 px-6 py-3 border-2 border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-primary-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    {loadingStep || 'Generating...'}
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Generate Course
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateCourseDialog;
