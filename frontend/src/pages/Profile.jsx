import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile, updateProfile, addSkill, deleteSkill, uploadCVPDF, analyzeCVText } from '../store/profileSlice';
import SkillBadge from '../components/SkillBadge';
import { generateCV } from '../utils/generateCV';

const Profile = () => {
  const dispatch = useDispatch();
  const { data: profile, loading, analyzing } = useSelector((state) => state.profile);
  const [editing, setEditing] = useState(false);
  const [showSkillForm, setShowSkillForm] = useState(false);
  const [showWorkExpForm, setShowWorkExpForm] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showEducationForm, setShowEducationForm] = useState(false);
  const [uploadingPDF, setUploadingPDF] = useState(false);
  const [formData, setFormData] = useState({});
  const [skillData, setSkillData] = useState({
    skillName: '',
    proficiency: 'Beginner'
  });
  const [workExpData, setWorkExpData] = useState({
    position: '',
    company: '',
    period: '',
    responsibilities: ['']
  });
  const [projectData, setProjectData] = useState({
    name: '',
    period: '',
    description: '',
    achievements: ['']
  });
  const [educationData, setEducationData] = useState({
    degree: '',
    school: '',
    period: ''
  });

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      // Helper function to parse JSON fields (handles double-encoded JSON)
      const parseJSONField = (field) => {
        if (Array.isArray(field)) return field;
        if (typeof field === 'string') {
          try {
            // First parse - might return a string or array
            let parsed = JSON.parse(field);
            // If still a string, try parsing again (double-encoded case)
            if (typeof parsed === 'string') {
              parsed = JSON.parse(parsed);
            }
            return Array.isArray(parsed) ? parsed : [];
          } catch (e) {
            return [];
          }
        }
        return [];
      };

      setFormData({
        fullName: profile.fullName || '',
        email: profile.email || '',
        phone: profile.phone || '',
        address: profile.address || '',
        website: profile.website || '',
        educationLevel: profile.educationLevel || '',
        department: profile.department || '',
        experienceLevel: profile.experienceLevel || 'Fresher',
        preferredCareerTrack: profile.preferredCareerTrack || '',
        summary: profile.summary || profile.cvText || '',
        cvText: profile.cvText || '',
        projectDescriptions: profile.projectDescriptions || '',
        targetRoles: profile.targetRoles || '',
        workExperience: parseJSONField(profile.workExperience),
        projects: parseJSONField(profile.projects),
        education: parseJSONField(profile.education)
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

  const handleDownloadCV = () => {
    if (profile) {
      generateCV(profile);
    }
  };

  // PDF Upload Handler
  const handlePDFUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    setUploadingPDF(true);
    try {
      const result = await dispatch(uploadCVPDF(file));
      if (!result.error) {
        alert('CV uploaded and analyzed successfully! Your profile has been updated.');
      } else {
        alert('Failed to analyze CV: ' + result.payload);
      }
    } catch (error) {
      alert('Error uploading CV: ' + error.message);
    } finally {
      setUploadingPDF(false);
      e.target.value = ''; // Reset file input
    }
  };

  // CV Text Analysis Handler
  const handleAnalyzeCVText = async () => {
    if (!formData.cvText || formData.cvText.trim() === '') {
      alert('Please enter CV text to analyze');
      return;
    }

    if (window.confirm('This will analyze your CV text and update your profile automatically. Continue?')) {
      try {
        const result = await dispatch(analyzeCVText(formData.cvText));
        if (!result.error) {
          alert('CV text analyzed successfully! Your profile has been updated.');
        } else {
          alert('Failed to analyze CV text: ' + result.payload);
        }
      } catch (error) {
        alert('Error analyzing CV text: ' + error.message);
      }
    }
  };

  // Work Experience handlers
  const handleAddWorkExperience = () => {
    // Validate required fields
    if (!workExpData.position.trim() || !workExpData.company.trim() || !workExpData.period.trim()) {
      alert('Please fill in all required fields (Position, Company, and Period)');
      return;
    }
    
    // Filter out empty responsibilities
    const filteredResponsibilities = workExpData.responsibilities.filter(r => r.trim() !== '');
    if (filteredResponsibilities.length === 0) {
      alert('Please add at least one responsibility');
      return;
    }
    
    const newWorkExp = {
      ...workExpData,
      responsibilities: filteredResponsibilities
    };
    
    const updatedWorkExp = [...(formData.workExperience || []), newWorkExp];
    setFormData({ ...formData, workExperience: updatedWorkExp });
    dispatch(updateProfile({ ...formData, workExperience: updatedWorkExp }));
    setWorkExpData({ position: '', company: '', period: '', responsibilities: [''] });
    setShowWorkExpForm(false);
  };

  const handleDeleteWorkExperience = (index) => {
    if (window.confirm('Are you sure you want to delete this work experience?')) {
      const updatedWorkExp = formData.workExperience.filter((_, i) => i !== index);
      setFormData({ ...formData, workExperience: updatedWorkExp });
      dispatch(updateProfile({ ...formData, workExperience: updatedWorkExp }));
    }
  };

  const handleWorkExpChange = (e) => {
    setWorkExpData({ ...workExpData, [e.target.name]: e.target.value });
  };

  const handleResponsibilityChange = (index, value) => {
    const newResponsibilities = [...workExpData.responsibilities];
    newResponsibilities[index] = value;
    setWorkExpData({ ...workExpData, responsibilities: newResponsibilities });
  };

  const addResponsibilityField = () => {
    setWorkExpData({ ...workExpData, responsibilities: [...workExpData.responsibilities, ''] });
  };

  const removeResponsibilityField = (index) => {
    const newResponsibilities = workExpData.responsibilities.filter((_, i) => i !== index);
    setWorkExpData({ ...workExpData, responsibilities: newResponsibilities });
  };

  // Project handlers
  const handleAddProject = () => {
    // Validate required fields
    if (!projectData.name.trim() || !projectData.period.trim()) {
      alert('Please fill in all required fields (Project Name and Period)');
      return;
    }
    
    // Filter out empty achievements
    const filteredAchievements = projectData.achievements.filter(a => a.trim() !== '');
    if (filteredAchievements.length === 0) {
      alert('Please add at least one achievement');
      return;
    }
    
    const newProject = {
      ...projectData,
      achievements: filteredAchievements
    };
    
    const updatedProjects = [...(formData.projects || []), newProject];
    setFormData({ ...formData, projects: updatedProjects });
    dispatch(updateProfile({ ...formData, projects: updatedProjects }));
    setProjectData({ name: '', period: '', description: '', achievements: [''] });
    setShowProjectForm(false);
  };

  const handleDeleteProject = (index) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      const updatedProjects = formData.projects.filter((_, i) => i !== index);
      setFormData({ ...formData, projects: updatedProjects });
      dispatch(updateProfile({ ...formData, projects: updatedProjects }));
    }
  };

  const handleProjectChange = (e) => {
    setProjectData({ ...projectData, [e.target.name]: e.target.value });
  };

  const handleAchievementChange = (index, value) => {
    const newAchievements = [...projectData.achievements];
    newAchievements[index] = value;
    setProjectData({ ...projectData, achievements: newAchievements });
  };

  const addAchievementField = () => {
    setProjectData({ ...projectData, achievements: [...projectData.achievements, ''] });
  };

  const removeAchievementField = (index) => {
    const newAchievements = projectData.achievements.filter((_, i) => i !== index);
    setProjectData({ ...projectData, achievements: newAchievements });
  };

  // Education handlers
  const handleAddEducation = () => {
    // Validate required fields
    if (!educationData.degree.trim() || !educationData.school.trim() || !educationData.period.trim()) {
      alert('Please fill in all required fields (Degree, School, and Period)');
      return;
    }
    
    const updatedEducation = [...(formData.education || []), educationData];
    setFormData({ ...formData, education: updatedEducation });
    dispatch(updateProfile({ ...formData, education: updatedEducation }));
    setEducationData({ degree: '', school: '', period: '' });
    setShowEducationForm(false);
  };

  const handleDeleteEducation = (index) => {
    if (window.confirm('Are you sure you want to delete this education entry?')) {
      const updatedEducation = formData.education.filter((_, i) => i !== index);
      setFormData({ ...formData, education: updatedEducation });
      dispatch(updateProfile({ ...formData, education: updatedEducation }));
    }
  };

  const handleEducationChange = (e) => {
    setEducationData({ ...educationData, [e.target.name]: e.target.value });
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

            {/* Action Buttons */}
            <div className="flex gap-3 flex-wrap">
              {/* Upload PDF CV Button */}
              <label className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center gap-2 shadow-soft hover:shadow-lg cursor-pointer">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span>{uploadingPDF || analyzing ? 'Analyzing CV...' : 'Upload CV PDF'}</span>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handlePDFUpload}
                  disabled={uploadingPDF || analyzing}
                  className="hidden"
                />
              </label>

              {/* Download CV Button */}
              <button
                onClick={handleDownloadCV}
                className="px-6 py-3 bg-gradient-to-r from-mint-500 to-mint-600 hover:from-mint-600 hover:to-mint-700 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center gap-2 shadow-soft hover:shadow-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Download CV</span>
              </button>

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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>Email</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email || ''}
                onChange={handleChange}
                disabled={true}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all disabled:bg-gray-50 disabled:text-gray-600 hover:border-primary-300"
              />
            </div>

            <div className="animate-slide-in-left stagger-1">
              <label className="flex text-sm font-semibold text-gray-700 mb-2 items-center space-x-2">
                <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>Phone</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone || ''}
                onChange={handleChange}
                disabled={!editing}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all disabled:bg-gray-50 disabled:text-gray-600 hover:border-primary-300"
                placeholder="e.g., +1234567890"
              />
            </div>

            <div className="animate-slide-in-right stagger-1">
              <label className="flex text-sm font-semibold text-gray-700 mb-2 items-center space-x-2">
                <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Address</span>
              </label>
              <input
                type="text"
                name="address"
                value={formData.address || ''}
                onChange={handleChange}
                disabled={!editing}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all disabled:bg-gray-50 disabled:text-gray-600 hover:border-primary-300"
                placeholder="e.g., 123 Street, City"
              />
            </div>

            <div className="animate-slide-in-left stagger-2">
              <label className="flex text-sm font-semibold text-gray-700 mb-2 items-center space-x-2">
                <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                <span>Website</span>
              </label>
              <input
                type="url"
                name="website"
                value={formData.website || ''}
                onChange={handleChange}
                disabled={!editing}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all disabled:bg-gray-50 disabled:text-gray-600 hover:border-primary-300"
                placeholder="e.g., www.yourwebsite.com"
              />
            </div>

            <div className="md:col-span-2 animate-slide-in-up stagger-2">
              <label className="flex text-sm font-semibold text-gray-700 mb-2 items-center space-x-2">
                <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Professional Summary</span>
              </label>
              <textarea
                name="summary"
                value={formData.summary || ''}
                onChange={handleChange}
                disabled={!editing}
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all disabled:bg-gray-50 disabled:text-gray-600 hover:border-primary-300 resize-none"
                placeholder="Write a brief professional summary about yourself..."
              />
            </div>

            <div className="animate-slide-in-left stagger-2">
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
                <span className="text-xs text-gray-500">(AI-powered analysis available)</span>
              </label>
              <textarea
                name="cvText"
                value={formData.cvText || ''}
                onChange={handleChange}
                disabled={!editing}
                rows={6}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all disabled:bg-gray-50 disabled:text-gray-600 hover:border-primary-300 resize-none"
                placeholder="Paste your CV or add notes here for AI analysis..."
              />
              {formData.cvText && formData.cvText.trim() !== '' && (
                <button
                  type="button"
                  onClick={handleAnalyzeCVText}
                  disabled={analyzing}
                  className="mt-3 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center gap-2 shadow-soft hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <span>{analyzing ? 'Analyzing with AI...' : 'Analyze CV Text with AI'}</span>
                </button>
              )}
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

      {/* Work Experience Section */}
      <div className="bg-white rounded-2xl shadow-lg p-8 animate-slide-in-up stagger-3 border border-gray-100">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 p-3 rounded-xl">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Work Experience</h2>
              <p className="text-sm text-gray-500">Add your professional work history</p>
            </div>
          </div>
          <button
            onClick={() => setShowWorkExpForm(!showWorkExpForm)}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 ${
              showWorkExpForm
                ? 'bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white shadow-lg'
                : 'bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl'
            }`}
          >
            {showWorkExpForm ? (
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
                <span>Add Experience</span>
              </>
            )}
          </button>
        </div>

        {showWorkExpForm && (
          <div className="mb-6 bg-indigo-50 p-6 rounded-xl animate-slide-in-down border-2 border-indigo-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Work Experience</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Position/Title</label>
                  <input
                    type="text"
                    name="position"
                    value={workExpData.position}
                    onChange={handleWorkExpChange}
                    className="w-full px-4 py-3 border-2 border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    placeholder="e.g., Engineering Executive"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Company</label>
                  <input
                    type="text"
                    name="company"
                    value={workExpData.company}
                    onChange={handleWorkExpChange}
                    className="w-full px-4 py-3 border-2 border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    placeholder="e.g., Borcelle Technologies"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Period</label>
                <input
                  type="text"
                  name="period"
                  value={workExpData.period}
                  onChange={handleWorkExpChange}
                  className="w-full px-4 py-3 border-2 border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  placeholder="e.g., Jan 2023 - Present"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Responsibilities</label>
                {workExpData.responsibilities.map((resp, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={resp}
                      onChange={(e) => handleResponsibilityChange(index, e.target.value)}
                      className="flex-1 px-4 py-3 border-2 border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                      placeholder="e.g., Implemented cost-effective solutions..."
                    />
                    {workExpData.responsibilities.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeResponsibilityField(index)}
                        className="px-3 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addResponsibilityField}
                  className="mt-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-xl hover:bg-indigo-200 transition-all flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Add Responsibility</span>
                </button>
              </div>
              <button
                type="button"
                onClick={handleAddWorkExperience}
                className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-bold px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg btn-ripple flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Add Experience</span>
              </button>
            </div>
          </div>
        )}

        {formData.workExperience && Array.isArray(formData.workExperience) && formData.workExperience.length > 0 ? (
          <div className="space-y-4">
            {formData.workExperience.map((exp, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-xl border-2 border-gray-200 hover:border-indigo-300 transition-all animate-slide-in-up">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{exp.position}</h3>
                    <p className="text-indigo-600 font-semibold">{exp.company}</p>
                    <p className="text-sm text-gray-500">{exp.period}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteWorkExperience(index)}
                    className="text-red-500 hover:text-red-700 transition-colors p-2 hover:bg-red-50 rounded-lg"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {exp.responsibilities && exp.responsibilities.map((resp, idx) => (
                    <li key={idx} className="text-sm">{resp}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 animate-fade-in">
            <div className="bg-gray-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-gray-600 font-medium mb-2">No work experience added yet</p>
            <p className="text-gray-500 text-sm">Add your work experience for your CV!</p>
          </div>
        )}
      </div>

      {/* Projects Section */}
      <div className="bg-white rounded-2xl shadow-lg p-8 animate-slide-in-up stagger-4 border border-gray-100">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-3 rounded-xl">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Projects</h2>
              <p className="text-sm text-gray-500">Showcase your work and achievements</p>
            </div>
          </div>
          <button
            onClick={() => setShowProjectForm(!showProjectForm)}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 ${
              showProjectForm
                ? 'bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white shadow-lg'
                : 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl'
            }`}
          >
            {showProjectForm ? (
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
                <span>Add Project</span>
              </>
            )}
          </button>
        </div>

        {showProjectForm && (
          <div className="mb-6 bg-purple-50 p-6 rounded-xl animate-slide-in-down border-2 border-purple-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Project</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Project Name</label>
                  <input
                    type="text"
                    name="name"
                    value={projectData.name}
                    onChange={handleProjectChange}
                    className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                    placeholder="e.g., Enterprise Resource Planning System"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Period/Year</label>
                  <input
                    type="text"
                    name="period"
                    value={projectData.period}
                    onChange={handleProjectChange}
                    className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                    placeholder="e.g., 2023"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Achievements/Description</label>
                {projectData.achievements.map((achievement, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={achievement}
                      onChange={(e) => handleAchievementChange(index, e.target.value)}
                      className="flex-1 px-4 py-3 border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                      placeholder="e.g., Led the development of a comprehensive ERP system..."
                    />
                    {projectData.achievements.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeAchievementField(index)}
                        className="px-3 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addAchievementField}
                  className="mt-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-xl hover:bg-purple-200 transition-all flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Add Achievement</span>
                </button>
              </div>
              <button
                type="button"
                onClick={handleAddProject}
                className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg btn-ripple flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Add Project</span>
              </button>
            </div>
          </div>
        )}

        {formData.projects && Array.isArray(formData.projects) && formData.projects.length > 0 ? (
          <div className="space-y-4">
            {formData.projects.map((project, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-xl border-2 border-gray-200 hover:border-purple-300 transition-all animate-slide-in-up">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{project.name}</h3>
                    <p className="text-sm text-purple-600 font-semibold">{project.period}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteProject(index)}
                    className="text-red-500 hover:text-red-700 transition-colors p-2 hover:bg-red-50 rounded-lg"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
                {project.achievements && project.achievements.length > 0 ? (
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {project.achievements.map((achievement, idx) => (
                      <li key={idx} className="text-sm">{achievement}</li>
                    ))}
                  </ul>
                ) : project.description ? (
                  <p className="text-gray-700 text-sm">{project.description}</p>
                ) : null}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 animate-fade-in">
            <div className="bg-gray-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-gray-600 font-medium mb-2">No projects added yet</p>
            <p className="text-gray-500 text-sm">Add your projects to showcase your work!</p>
          </div>
        )}
      </div>

      {/* Education Section */}
      <div className="bg-white rounded-2xl shadow-lg p-8 animate-slide-in-up stagger-5 border border-gray-100">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-xl">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Education</h2>
              <p className="text-sm text-gray-500">Add your educational background</p>
            </div>
          </div>
          <button
            onClick={() => setShowEducationForm(!showEducationForm)}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 ${
              showEducationForm
                ? 'bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white shadow-lg'
                : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl'
            }`}
          >
            {showEducationForm ? (
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
                <span>Add Education</span>
              </>
            )}
          </button>
        </div>

        {showEducationForm && (
          <div className="mb-6 bg-blue-50 p-6 rounded-xl animate-slide-in-down border-2 border-blue-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Education</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Degree</label>
                  <input
                    type="text"
                    name="degree"
                    value={educationData.degree}
                    onChange={handleEducationChange}
                    className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="e.g., Master of Engineering Management"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Period</label>
                  <input
                    type="text"
                    name="period"
                    value={educationData.period}
                    onChange={handleEducationChange}
                    className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="e.g., 2015 - 2017"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">School/University</label>
                <input
                  type="text"
                  name="school"
                  value={educationData.school}
                  onChange={handleEducationChange}
                  className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="e.g., University Name"
                />
              </div>
              <button
                type="button"
                onClick={handleAddEducation}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg btn-ripple flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Add Education</span>
              </button>
            </div>
          </div>
        )}

        {formData.education && Array.isArray(formData.education) && formData.education.length > 0 ? (
          <div className="space-y-4">
            {formData.education.map((edu, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-xl border-2 border-gray-200 hover:border-blue-300 transition-all animate-slide-in-up">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold text-gray-900">{edu.degree}</h3>
                      <p className="text-sm text-gray-500 ml-4">{edu.period}</p>
                    </div>
                    <p className="text-blue-600 font-semibold">{edu.school}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteEducation(index)}
                    className="text-red-500 hover:text-red-700 transition-colors p-2 hover:bg-red-50 rounded-lg ml-4"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 animate-fade-in">
            <div className="bg-gray-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
              </svg>
            </div>
            <p className="text-gray-600 font-medium mb-2">No education added yet</p>
            <p className="text-gray-500 text-sm">Add your educational background!</p>
          </div>
        )}
      </div>
    </div>
    </div>
  );
};

export default Profile;
