import { useState } from 'react';
import api from '../utils/api';

const RoadmapGeneratorModal = ({ isOpen, onClose, onRoadmapGenerated, isRegenerate = false, userData }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    targetRole: userData?.preferredCareerTrack || '',
    timeframe: '3 months',
    timeUnit: 'months',
    customTime: '',
    weeklyHours: '10'
  });

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Determine timeframe
      let timeframe;
      if (formData.timeframe === 'custom' && formData.customTime) {
        timeframe = `${formData.customTime} ${formData.timeUnit}`;
      } else {
        timeframe = formData.timeframe;
      }

      const payload = {
        targetRole: formData.targetRole,
        currentSkills: userData?.skills || [],
        timeframe: timeframe,
        weeklyHours: parseInt(formData.weeklyHours)
      };

      console.log('Generating roadmap with:', payload);

      const response = await api.post('/roadmaps/generate', payload);

      if (response.data.success) {
        onRoadmapGenerated(response.data.roadmap);
        onClose();
      }
    } catch (error) {
      console.error('Failed to generate roadmap:', error);
      alert(error.response?.data?.message || 'Failed to generate roadmap. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-green-500 via-emerald-600 to-mint-600 text-white p-6 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  {isRegenerate ? 'Regenerate Your Roadmap' : 'Create Your Learning Roadmap'}
                </h2>
                <p className="text-green-100 text-sm mt-1">
                  {isRegenerate ? 'Update your career path with new goals' : 'Build a personalized path to your dream career'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-xl transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Career Goal */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Career Goal / Target Role
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              name="targetRole"
              value={formData.targetRole}
              onChange={handleInputChange}
              placeholder="e.g., Full Stack Developer, Data Scientist, UI/UX Designer"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 outline-none font-medium"
              required
            />
            <p className="mt-2 text-xs text-gray-500">
              What position or role are you aiming for?
            </p>
          </div>

          {/* Timeframe */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Learning Timeframe
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, timeframe: '1 month' }))}
                className={`px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  formData.timeframe === '1 month'
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                1 Month
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, timeframe: '2 months' }))}
                className={`px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  formData.timeframe === '2 months'
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                2 Months
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, timeframe: '3 months' }))}
                className={`px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  formData.timeframe === '3 months'
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                3 Months
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, timeframe: '6 months' }))}
                className={`px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  formData.timeframe === '6 months'
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                6 Months
              </button>
            </div>

            {/* Custom Timeframe */}
            <div className="flex items-center gap-2 mt-3">
              <input
                type="checkbox"
                id="customTime"
                checked={formData.timeframe === 'custom'}
                onChange={(e) => setFormData(prev => ({ ...prev, timeframe: e.target.checked ? 'custom' : '3 months' }))}
                className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
              />
              <label htmlFor="customTime" className="text-sm font-medium text-gray-700">
                Custom timeframe
              </label>
            </div>

            {formData.timeframe === 'custom' && (
              <div className="mt-3 flex gap-3">
                <input
                  type="number"
                  name="customTime"
                  value={formData.customTime}
                  onChange={handleInputChange}
                  placeholder="Enter number"
                  min="1"
                  max="24"
                  className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 outline-none"
                  required={formData.timeframe === 'custom'}
                />
                <select
                  name="timeUnit"
                  value={formData.timeUnit}
                  onChange={handleInputChange}
                  className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 outline-none font-medium"
                >
                  <option value="days">Days</option>
                  <option value="weeks">Weeks</option>
                  <option value="months">Months</option>
                </select>
              </div>
            )}
          </div>

          {/* Weekly Hours */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Weekly Learning Hours
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                name="weeklyHours"
                value={formData.weeklyHours}
                onChange={handleInputChange}
                min="5"
                max="40"
                step="5"
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
              />
              <div className="flex items-center gap-2 min-w-[100px]">
                <input
                  type="number"
                  name="weeklyHours"
                  value={formData.weeklyHours}
                  onChange={handleInputChange}
                  min="5"
                  max="40"
                  className="w-16 px-3 py-2 border-2 border-gray-200 rounded-xl text-center font-bold focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 outline-none"
                />
                <span className="text-sm font-medium text-gray-700">hrs/week</span>
              </div>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              How many hours per week can you dedicate to learning?
            </p>
          </div>

          {/* Profile Data Info */}
          {userData && (
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-200">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-500 rounded-lg">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 mb-1">Using Your Profile Data</h4>
                  <p className="text-sm text-gray-700">
                    Your roadmap will be personalized based on your current skills, education level 
                    ({userData.educationLevel}), and experience ({userData.experienceLevel}).
                  </p>
                  {userData.skills && userData.skills.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs font-medium text-gray-600 mb-1">Current Skills:</p>
                      <div className="flex flex-wrap gap-1">
                        {userData.skills.slice(0, 5).map((skill, idx) => (
                          <span key={idx} className="px-2 py-1 bg-white/50 rounded-lg text-xs font-medium text-gray-700">
                            {skill}
                          </span>
                        ))}
                        {userData.skills.length > 5 && (
                          <span className="px-2 py-1 bg-white/50 rounded-lg text-xs font-medium text-gray-700">
                            +{userData.skills.length - 5} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors duration-200"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 via-emerald-600 to-mint-600 text-white rounded-xl font-bold hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>{isRegenerate ? 'Regenerate Roadmap' : 'Generate Roadmap'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoadmapGeneratorModal;
