import { useState } from 'react';
import api from '../utils/api';

const AIEnhancedCVGenerator = ({ profile, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [cvData, setCvData] = useState(null);
  const [selectedTab, setSelectedTab] = useState('summary');
  const [saving, setSaving] = useState(false);

  const generateAICV = async () => {
    setLoading(true);
    try {
      const response = await api.post('/cv-generation/generate-ai-cv');
      setCvData(response.data.cvData);
    } catch (error) {
      console.error('Error generating AI CV:', error);
      alert('Failed to generate AI-enhanced CV: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const saveEnhancements = async () => {
    if (!cvData) return;

    setSaving(true);
    try {
      const payload = {
        professionalSummary: cvData.professionalSummary.aiSuggestion,
        workExperience: cvData.workExperience.map(exp => ({
          position: exp.position,
          company: exp.company,
          period: exp.period,
          responsibilities: exp.enhancedBulletPoints
        })),
        projects: cvData.projects.map(proj => ({
          name: proj.name,
          period: proj.period,
          description: proj.description,
          achievements: proj.enhancedBulletPoints
        }))
      };

      await api.post('/cv-generation/save-enhancements', payload);
      alert('✅ AI enhancements saved to your profile!');
      window.location.reload(); // Refresh to show updated data
    } catch (error) {
      console.error('Error saving enhancements:', error);
      alert('Failed to save enhancements: ' + (error.response?.data?.message || error.message));
    } finally {
      setSaving(false);
    }
  };

  const downloadPDF = () => {
    // Use existing generateCV function
    import('../utils/generateCV').then(({ generateCV }) => {
      // Create enhanced profile data for PDF
      const enhancedProfile = {
        ...profile,
        summary: cvData?.professionalSummary?.aiSuggestion || profile.summary,
        workExperience: cvData?.workExperience?.map(exp => ({
          position: exp.position,
          company: exp.company,
          period: exp.period,
          responsibilities: exp.enhancedBulletPoints
        })) || profile.workExperience,
        projects: cvData?.projects?.map(proj => ({
          name: proj.name,
          period: proj.period,
          description: proj.description,
          achievements: proj.enhancedBulletPoints
        })) || profile.projects
      };
      generateCV(enhancedProfile);
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-gradient-to-br from-white via-mint-50 to-emerald-50 rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto relative">
        {/* Animated Background Elements */}
        <div className="absolute top-0 left-0 w-48 h-48 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
        
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-green-500 via-emerald-600 to-mint-600 text-white p-6 rounded-t-3xl z-10 shadow-lg">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                AI-Enhanced CV Generator
              </h2>
              <p className="text-green-50 mt-2 text-lg">Auto-generate professional CV with AI-powered suggestions</p>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white hover:bg-white/20 rounded-full p-2 transition-all hover:rotate-90 duration-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 relative z-10">
          {!cvData ? (
            <div className="text-center py-12">
              <div className="mb-6">
                <div className="w-24 h-24 mx-auto bg-gradient-to-r from-green-100 to-emerald-100 rounded-3xl flex items-center justify-center shadow-lg">
                  <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-3">Generate Your Professional CV</h3>
              <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
                Our AI will analyze your profile and create a polished CV with:
              </p>
              <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto mb-8">
                <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-green-100">
                  <div className="text-green-600 font-bold text-lg mb-2">📝 Professional Summary</div>
                  <p className="text-sm text-slate-600">AI-crafted summary highlighting your unique value</p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-emerald-100">
                  <div className="text-emerald-600 font-bold text-lg mb-2">💡 Strong Bullet Points</div>
                  <p className="text-sm text-slate-600">Achievement-focused descriptions using action verbs</p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-mint-100">
                  <div className="text-mint-600 font-bold text-lg mb-2">🎯 Profile Recommendations</div>
                  <p className="text-sm text-slate-600">Tips for LinkedIn and online portfolio improvement</p>
                </div>
              </div>
              <button
                onClick={generateAICV}
                disabled={loading}
                className="bg-gradient-to-r from-green-500 via-emerald-600 to-mint-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:from-green-600 hover:via-emerald-700 hover:to-mint-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl flex items-center gap-3 mx-auto"
              >
                {loading ? (
                  <>
                    <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Generating AI-Enhanced CV...
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Generate AI-Enhanced CV
                  </>
                )}
              </button>
            </div>
          ) : (
            <div>
              {/* Action Buttons */}
              <div className="flex gap-3 mb-6 flex-wrap">
                <button
                  onClick={downloadPDF}
                  className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105 shadow-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download PDF
                </button>
                <button
                  onClick={saveEnhancements}
                  disabled={saving}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-700 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                      </svg>
                      Save to Profile
                    </>
                  )}
                </button>
                <button
                  onClick={generateAICV}
                  disabled={loading}
                  className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Regenerate
                </button>
              </div>

              {/* Tabs */}
              <div className="flex gap-2 border-b-2 border-green-100 mb-6 overflow-x-auto bg-white/50 rounded-t-2xl">
                {['summary', 'experience', 'projects', 'recommendations'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setSelectedTab(tab)}
                    className={`px-6 py-3 font-bold capitalize transition-all whitespace-nowrap rounded-t-2xl ${
                      selectedTab === tab
                        ? 'border-b-4 border-green-600 text-green-700 bg-white shadow-md'
                        : 'text-slate-600 hover:text-green-600 hover:bg-white/50'
                    }`}
                  >
                    {tab === 'recommendations' ? 'LinkedIn & Portfolio' : tab}
                  </button>
                ))}
              </div>

              {/* Content */}
              <div className="space-y-6">
                {selectedTab === 'summary' && (
                  <div>
                    <div className="bg-gradient-to-r from-green-50 via-emerald-50 to-mint-50 p-6 rounded-2xl border-2 border-green-200 shadow-lg">
                      <h3 className="text-xl font-bold text-green-900 mb-3 flex items-center gap-2">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        AI-Generated Professional Summary
                      </h3>
                      <p className="text-slate-700 leading-relaxed text-lg">{cvData.professionalSummary.aiSuggestion}</p>
                      <p className="text-sm text-green-700 font-medium mt-3 italic">💡 {cvData.professionalSummary.recommendation}</p>
                    </div>
                    {cvData.professionalSummary.original && (
                      <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl mt-4 border border-slate-200 shadow">
                        <h4 className="font-bold text-slate-700 mb-2">Original Summary (for comparison):</h4>
                        <p className="text-slate-600">{cvData.professionalSummary.original}</p>
                      </div>
                    )}
                  </div>
                )}

                {selectedTab === 'experience' && (
                  <div className="space-y-6">
                    {cvData.workExperience.map((exp, idx) => (
                      <div key={idx} className="bg-white/80 backdrop-blur-sm border-2 border-green-200 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all">
                        <h3 className="text-xl font-bold text-slate-800">{exp.position}</h3>
                        <p className="text-green-600 font-bold">{exp.company} • {exp.period}</p>
                        <div className="mt-4">
                          <h4 className="font-bold text-emerald-600 mb-2 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            AI-Enhanced Bullet Points
                          </h4>
                          <ul className="space-y-2">
                            {exp.enhancedBulletPoints.map((bullet, bidx) => (
                              <li key={bidx} className="flex items-start gap-2">
                                <span className="text-green-500 mt-1 font-bold">▸</span>
                                <span className="text-slate-700">{bullet}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        {exp.recommendations.length > 0 && (
                          <div className="mt-4 bg-green-50 p-4 rounded-xl border border-green-100">
                            <h4 className="font-bold text-green-700 mb-2">💡 Tips:</h4>
                            <ul className="text-sm text-green-600 space-y-1">
                              {exp.recommendations.map((rec, ridx) => (
                                <li key={ridx}>• {rec}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {selectedTab === 'projects' && (
                  <div className="space-y-6">
                    {cvData.projects.map((proj, idx) => (
                      <div key={idx} className="bg-white/80 backdrop-blur-sm border-2 border-emerald-200 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all">
                        <h3 className="text-xl font-bold text-slate-800">{proj.name}</h3>
                        <p className="text-emerald-600 font-bold">{proj.period}</p>
                        {proj.description && (
                          <p className="text-slate-600 mt-2">{proj.description}</p>
                        )}
                        <div className="mt-4">
                          <h4 className="font-bold text-mint-600 mb-2 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            AI-Enhanced Achievements
                          </h4>
                          <ul className="space-y-2">
                            {proj.enhancedBulletPoints.map((bullet, bidx) => (
                              <li key={bidx} className="flex items-start gap-2">
                                <span className="text-emerald-500 mt-1 font-bold">▸</span>
                                <span className="text-slate-700">{bullet}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        {proj.recommendations.length > 0 && (
                          <div className="mt-4 bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                            <h4 className="font-bold text-emerald-700 mb-2">💡 Tips:</h4>
                            <ul className="text-sm text-emerald-600 space-y-1">
                              {proj.recommendations.map((rec, ridx) => (
                                <li key={ridx}>• {rec}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {selectedTab === 'recommendations' && cvData.aiRecommendations && (
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-green-50 via-emerald-50 to-mint-50 p-6 rounded-2xl border-2 border-green-200 shadow-lg">
                      <h3 className="text-xl font-bold text-green-900 mb-4 flex items-center gap-2">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                        LinkedIn Profile Recommendations
                      </h3>
                      <ul className="space-y-3">
                        {cvData.aiRecommendations.linkedinProfile.map((rec, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full w-7 h-7 flex items-center justify-center flex-shrink-0 text-sm font-bold shadow-md">{idx + 1}</span>
                            <span className="text-slate-700">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-gradient-to-r from-emerald-50 via-mint-50 to-green-50 p-6 rounded-2xl border-2 border-emerald-200 shadow-lg">
                      <h3 className="text-xl font-bold text-emerald-900 mb-4 flex items-center gap-2">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M7 2a1 1 0 00-.707 1.707L7 4.414v3.758a1 1 0 01-.293.707l-4 4C.817 14.769 2.156 18 4.828 18h10.343c2.673 0 4.012-3.231 2.122-5.121l-4-4A1 1 0 0113 8.172V4.414l.707-.707A1 1 0 0013 2H7zm2 6.172V4h2v4.172a3 3 0 00.879 2.12l1.027 1.028a4 4 0 00-2.171.102l-.47.156a4 4 0 01-2.53 0l-.563-.187a1.993 1.993 0 00-.114-.035l1.063-1.063A3 3 0 009 8.172z" clipRule="evenodd" />
                        </svg>
                        Online Portfolio Improvements
                      </h3>
                      <ul className="space-y-3">
                        {cvData.aiRecommendations.portfolioImprovements.map((rec, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <span className="bg-gradient-to-r from-emerald-500 to-mint-600 text-white rounded-full w-7 h-7 flex items-center justify-center flex-shrink-0 text-sm font-bold shadow-md">{idx + 1}</span>
                            <span className="text-slate-700">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-gradient-to-r from-mint-50 via-green-50 to-emerald-50 p-6 rounded-2xl border-2 border-mint-200 shadow-lg">
                      <h3 className="text-xl font-bold text-mint-900 mb-4 flex items-center gap-2">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        Overall CV Tips
                      </h3>
                      <ul className="space-y-3">
                        {cvData.aiRecommendations.overallTips.map((tip, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <span className="text-green-500 text-xl font-bold">✓</span>
                            <span className="text-slate-700">{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIEnhancedCVGenerator;
