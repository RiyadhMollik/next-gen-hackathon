import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile, updateProfile, addSkill, deleteSkill } from '../store/profileSlice';
import SkillBadge from '../components/SkillBadge';

const Profile = () => {
  const dispatch = useDispatch();
  const { data: profile, loading } = useSelector((state) => state.profile);
  const [editing, setEditing] = useState(false);
  const [showSkillForm, setShowSkillForm] = useState(false);
  const [formData, setFormData] = useState({});
  const [skillData, setSkillData] = useState({
    skillName: '',
    proficiency: 'Beginner'
  });

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.fullName || '',
        educationLevel: profile.educationLevel || '',
        department: profile.department || '',
        experienceLevel: profile.experienceLevel || 'Fresher',
        preferredCareerTrack: profile.preferredCareerTrack || '',
        cvText: profile.cvText || '',
        projectDescriptions: profile.projectDescriptions || '',
        targetRoles: profile.targetRoles || ''
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(updateProfile(formData));
    setEditing(false);
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    const result = await dispatch(addSkill(skillData));
    if (!result.error) {
      setSkillData({ skillName: '', proficiency: 'Beginner' });
      setShowSkillForm(false);
    }
  };

  const handleDeleteSkill = async (skillId) => {
    if (window.confirm('Are you sure you want to delete this skill?')) {
      await dispatch(deleteSkill(skillId));
    }
  };

  if (loading && !profile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary-50 to-purple-50">
        <div className="text-center animate-fade-in">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-600 mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
          <p className="mt-6 text-gray-700 font-medium text-lg">Loading your profile...</p>
          <p className="mt-2 text-gray-500 text-sm">Please wait a moment</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-primary-50 py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 animate-slide-in-up border border-gray-100">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-6">
              {/* Avatar */}
              <div className="relative group">
                <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                  {profile?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              
              {/* User Info */}
              <div>
                <h1 className="text-3xl font-bold gradient-text mb-2">
                  {profile?.fullName || 'Your Name'}
                </h1>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-gradient-to-r from-primary-100 to-purple-100 text-primary-800 rounded-full text-sm font-medium border border-primary-200">
                    {profile?.experienceLevel || 'Fresher'}
                  </span>
                  {profile?.preferredCareerTrack && (
                    <span className="px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 rounded-full text-sm font-medium border border-green-200">
                      {profile.preferredCareerTrack}
                    </span>
                  )}
                  <span className="px-3 py-1 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 rounded-full text-sm font-medium border border-blue-200">
                    {profile?.skills?.length || 0} Skills
                  </span>
                </div>
              </div>
            </div>

            {/* Edit Button */}
            <button
              onClick={() => setEditing(!editing)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 ${
                editing 
                  ? 'bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white shadow-lg' 
                  : 'bg-gradient-to-r from-primary-600 to-purple-700 hover:from-primary-700 hover:to-purple-800 text-white shadow-lg hover:shadow-xl'
              }`}
            >
              {editing ? (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>Cancel</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span>Edit Profile</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Profile Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 animate-slide-in-up stagger-1 border border-gray-100">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-gradient-to-r from-primary-600 to-purple-700 p-3 rounded-xl">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
          </div>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="animate-slide-in-left stagger-1">
              <label className="flex text-sm font-semibold text-gray-700 mb-2 items-center space-x-2">
                <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Full Name</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName || ''}
                onChange={handleChange}
                disabled={!editing}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all disabled:bg-gray-50 disabled:text-gray-600 hover:border-primary-300"
              />
            </div>

            <div className="animate-slide-in-right stagger-1">
              <label className="flex text-sm font-semibold text-gray-700 mb-2 items-center space-x-2">
                <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                </svg>
                <span>Education Level</span>
              </label>
              <input
                type="text"
                name="educationLevel"
                value={formData.educationLevel || ''}
                onChange={handleChange}
                disabled={!editing}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all disabled:bg-gray-50 disabled:text-gray-600 hover:border-primary-300"
                placeholder="e.g., Bachelor's Degree"
              />
            </div>

            <div className="animate-slide-in-left stagger-2">
              <label className="flex text-sm font-semibold text-gray-700 mb-2 items-center space-x-2">
                <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span>Department/Field</span>
              </label>
              <input
                type="text"
                name="department"
                value={formData.department || ''}
                onChange={handleChange}
                disabled={!editing}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all disabled:bg-gray-50 disabled:text-gray-600 hover:border-primary-300"
                placeholder="e.g., Computer Science"
              />
            </div>

            <div className="animate-slide-in-right stagger-2">
              <label className="flex text-sm font-semibold text-gray-700 mb-2 items-center space-x-2">
                <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
                <span>Experience Level</span>
              </label>
              <select
                name="experienceLevel"
                value={formData.experienceLevel || 'Fresher'}
                onChange={handleChange}
                disabled={!editing}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all disabled:bg-gray-50 disabled:text-gray-600 hover:border-primary-300"
              >
                <option value="Fresher">🌱 Fresher</option>
                <option value="Junior">🚀 Junior (1-2 years)</option>
                <option value="Mid">💼 Mid-Level (3-5 years)</option>
                <option value="Senior">⭐ Senior (5+ years)</option>
              </select>
            </div>

            <div className="md:col-span-2 animate-slide-in-up stagger-3">
              <label className="flex text-sm font-semibold text-gray-700 mb-2 items-center space-x-2">
                <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                <span>Preferred Career Track</span>
              </label>
              <input
                type="text"
                name="preferredCareerTrack"
                value={formData.preferredCareerTrack || ''}
                onChange={handleChange}
                disabled={!editing}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all disabled:bg-gray-50 disabled:text-gray-600 hover:border-primary-300"
                placeholder="e.g., Web Development, Data Science"
              />
            </div>

            <div className="md:col-span-2 animate-slide-in-up stagger-4">
              <label className="flex text-sm font-semibold text-gray-700 mb-2 items-center space-x-2">
                <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>Target Roles</span>
              </label>
              <input
                type="text"
                name="targetRoles"
                value={formData.targetRoles || ''}
                onChange={handleChange}
                disabled={!editing}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all disabled:bg-gray-50 disabled:text-gray-600 hover:border-primary-300"
                placeholder="e.g., Frontend Developer, UI Designer"
              />
            </div>

            <div className="md:col-span-2 animate-slide-in-up stagger-5">
              <label className="flex text-sm font-semibold text-gray-700 mb-2 items-center space-x-2">
                <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Project Descriptions / Experience</span>
              </label>
              <textarea
                name="projectDescriptions"
                value={formData.projectDescriptions || ''}
                onChange={handleChange}
                disabled={!editing}
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all disabled:bg-gray-50 disabled:text-gray-600 hover:border-primary-300 resize-none"
                placeholder="Describe your projects and experience..."
              />
            </div>

            <div className="md:col-span-2 animate-slide-in-up stagger-6">
              <label className="flex text-sm font-semibold text-gray-700 mb-2 items-center space-x-2">
                <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>CV Text / Notes</span>
                <span className="text-xs text-gray-500">(For future AI analysis)</span>
              </label>
              <textarea
                name="cvText"
                value={formData.cvText || ''}
                onChange={handleChange}
                disabled={!editing}
                rows={6}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all disabled:bg-gray-50 disabled:text-gray-600 hover:border-primary-300 resize-none"
                placeholder="Paste your CV or add notes here for future AI analysis..."
              />
            </div>
          </div>

          {editing && (
            <div className="mt-8 flex items-center space-x-4 animate-slide-in-up">
              <button 
                type="submit" 
                className="bg-gradient-to-r from-primary-600 to-purple-700 hover:from-primary-700 hover:to-purple-800 text-white font-bold px-8 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl btn-ripple flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Save Changes</span>
              </button>
              <p className="text-sm text-gray-500 flex items-center space-x-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Changes will be saved to your profile</span>
              </p>
            </div>
          )}
        </form>
      </div>

      {/* Skills Section */}
      <div className="bg-white rounded-2xl shadow-lg p-8 animate-slide-in-up stagger-2 border border-gray-100">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-3 rounded-xl">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">My Skills</h2>
              <p className="text-sm text-gray-500">Manage your professional skills</p>
            </div>
          </div>
          <button
            onClick={() => setShowSkillForm(!showSkillForm)}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 ${
              showSkillForm
                ? 'bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white shadow-lg'
                : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl'
            }`}
          >
            {showSkillForm ? (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>Cancel</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Add Skill</span>
              </>
            )}
          </button>
        </div>

        {showSkillForm && (
          <div className="mb-6 p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200 animate-slide-in-up">
            <form onSubmit={handleAddSkill}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="flex text-sm font-semibold text-gray-700 mb-2 items-center space-x-2">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    <span>Skill Name</span>
                  </label>
                  <input
                    type="text"
                    value={skillData.skillName}
                    onChange={(e) => setSkillData({ ...skillData, skillName: e.target.value })}
                    required
                    className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                    placeholder="e.g., JavaScript, Communication"
                  />
                </div>
                <div>
                  <label className="flex text-sm font-semibold text-gray-700 mb-2 items-center space-x-2">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>Proficiency</span>
                  </label>
                  <select
                    value={skillData.proficiency}
                    onChange={(e) => setSkillData({ ...skillData, proficiency: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  >
                    <option value="Beginner">🌱 Beginner</option>
                    <option value="Intermediate">📈 Intermediate</option>
                    <option value="Advanced">⚡ Advanced</option>
                    <option value="Expert">🏆 Expert</option>
                  </select>
                </div>
              </div>
              <button 
                type="submit" 
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold px-6 py-3 rounded-xl mt-4 transition-all duration-300 transform hover:scale-105 hover:shadow-lg btn-ripple flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Add Skill</span>
              </button>
            </form>
          </div>
        )}

        {profile?.skills && profile.skills.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {profile.skills.map((skill, index) => (
              <div 
                key={skill.id} 
                className="animate-scale-in" 
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <SkillBadge
                  skill={skill}
                  onDelete={handleDeleteSkill}
                  showDelete={true}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 animate-fade-in">
            <div className="bg-gray-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <p className="text-gray-600 font-medium mb-2">No skills added yet</p>
            <p className="text-gray-500 text-sm">Add your first skill to get personalized job recommendations!</p>
          </div>
        )}
      </div>
    </div>
    </div>
  );
};

export default Profile;
