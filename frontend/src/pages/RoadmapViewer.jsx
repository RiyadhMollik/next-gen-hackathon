import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import html2canvas from 'html2canvas';
import api from '../utils/api';

const RoadmapViewer = () => {
  const { roadmapId } = useParams();
  const navigate = useNavigate();
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState({});
  const [downloading, setDownloading] = useState(false);
  const roadmapRef = useRef(null);

  useEffect(() => {
    fetchRoadmap();
  }, [roadmapId]);

  const fetchRoadmap = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const endpoint = roadmapId ? `/roadmaps/${roadmapId}` : '/roadmaps/active';
      const response = await api.get(endpoint);
      
      // Parse roadmapData if it's a string
      const roadmapData = response.data.roadmap;
      if (typeof roadmapData.roadmapData === 'string') {
        roadmapData.roadmapData = JSON.parse(roadmapData.roadmapData);
      }
      if (typeof roadmapData.currentSkills === 'string') {
        roadmapData.currentSkills = JSON.parse(roadmapData.currentSkills);
      }
      if (typeof roadmapData.progress === 'string') {
        roadmapData.progress = JSON.parse(roadmapData.progress);
      }
      
      setRoadmap(roadmapData);
      setProgress(roadmapData.progress || {});
    } catch (error) {
      console.error('Failed to fetch roadmap:', error);
      setError(error.response?.data?.message || 'Failed to load roadmap');
    } finally {
      setLoading(false);
    }
  };

  const togglePhaseCompletion = async (phaseNumber) => {
    const newProgress = {
      ...progress,
      [`phase_${phaseNumber}`]: !progress[`phase_${phaseNumber}`]
    };
    
    setProgress(newProgress);
    
    try {
      await api.put(`/roadmaps/${roadmap.id}/progress`, { progress: newProgress });
    } catch (error) {
      console.error('Failed to update progress:', error);
    }
  };

  const downloadAsImage = async (format = 'png') => {
    if (!roadmapRef.current) return;

    setDownloading(true);
    try {
      const canvas = await html2canvas(roadmapRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#f0fdf4',
        windowWidth: 1200,
        windowHeight: roadmapRef.current.scrollHeight
      });

      const image = canvas.toDataURL(`image/${format}`, 0.95);
      const link = document.createElement('a');
      link.href = image;
      link.download = `${roadmap.targetRole.replace(/\s+/g, '_')}_Roadmap.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Failed to download roadmap:', error);
      alert('Failed to download roadmap. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-mint-50 to-emerald-50 p-8 relative overflow-hidden">
        {/* Animated Background Orbs */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-75"></div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto"></div>
              <p className="mt-4 text-gray-700 font-bold">Loading your roadmap...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-mint-50 to-emerald-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-green-100 p-12 text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Unable to Load Roadmap</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg font-bold"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!roadmap) {
    return null;
  }

  const data = roadmap.roadmapData;
  const completedPhases = Object.values(progress).filter(Boolean).length;
  const progressPercentage = (completedPhases / data.phases.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-mint-50 to-emerald-50 p-4 md:p-8 relative overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute top-40 right-20 w-96 h-96 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-75"></div>
      <div className="absolute -bottom-32 left-1/2 w-96 h-96 bg-mint-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-150"></div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Fixed Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-bold transition-colors duration-200 mb-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>

          {/* Download Buttons */}
          <div className="flex flex-wrap gap-3 items-center justify-end mb-4">
            <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-xl p-2 shadow-lg border border-green-100">
              <button
                onClick={() => downloadAsImage('png')}
                disabled={downloading}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all font-bold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {downloading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Downloading...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    <span>Download PNG</span>
                  </>
                )}
              </button>
              <button
                onClick={() => downloadAsImage('jpeg')}
                disabled={downloading}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-mint-600 text-white rounded-lg hover:from-emerald-600 hover:to-mint-700 transition-all font-bold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {downloading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Downloading...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    <span>Download JPG</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Roadmap Content - This will be captured */}
        <div ref={roadmapRef} className="space-y-6">
          {/* Header Card */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-green-100">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-lg">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-bold mb-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                        <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                      </svg>
                      Career Roadmap
                    </div>
                    <h1 className="text-4xl font-display font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-mint-600 bg-clip-text text-transparent">
                      {roadmap.targetRole}
                    </h1>
                  </div>
                </div>
                <p className="text-gray-600 text-lg font-medium mb-6">{data.overview.description}</p>
                
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-bold text-gray-700">{data.overview.totalDuration}</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-emerald-50 to-mint-50 rounded-xl border border-emerald-200">
                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <span className="font-bold text-gray-700">{data.phases.length} Phases</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-mint-50 to-green-50 rounded-xl border border-mint-200">
                    <svg className="w-5 h-5 text-mint-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span className="font-bold text-gray-700">{roadmap.weeklyHours}h/week</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-gray-700">Overall Progress</span>
                <span className="text-sm font-bold text-green-600">{completedPhases} / {data.phases.length} Phases Completed</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 via-emerald-600 to-mint-600 transition-all duration-500 rounded-full"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>

            {/* Key Milestones */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 text-lg">
                <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Key Milestones
              </h3>
              <div className="grid md:grid-cols-2 gap-3">
                {data.overview.keyMilestones.map((milestone, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white flex items-center justify-center text-sm font-bold">
                      {idx + 1}
                    </span>
                    <span className="text-gray-700 font-medium">{milestone}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Learning Phases */}
          <div className="space-y-6">
            {data.phases.map((phase, phaseIdx) => {
              const isCompleted = progress[`phase_${phase.phaseNumber}`];

              return (
                <div key={phase.phaseNumber} className="relative">
                  <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-green-100 overflow-hidden hover:shadow-2xl transition-all duration-300">
                    {/* Phase Header */}
                    <div className={`p-6 ${isCompleted ? 'bg-gradient-to-r from-green-500 via-emerald-600 to-mint-600' : 'bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900'} text-white`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <button
                              onClick={() => togglePhaseCompletion(phase.phaseNumber)}
                              className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-xl transition-all shadow-lg ${
                                isCompleted
                                  ? 'bg-white text-green-600 hover:scale-110'
                                  : 'bg-white/20 hover:bg-white/30 backdrop-blur-sm'
                              }`}
                            >
                              {isCompleted ? '✓' : phase.phaseNumber}
                            </button>
                            <div>
                              <div className="text-sm text-green-200 font-bold mb-1">
                                Phase {phase.phaseNumber}
                              </div>
                              <h2 className="text-2xl font-bold">{phase.phaseName}</h2>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-4 text-sm">
                            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span className="font-medium">{phase.duration}</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              <span className="font-medium">{phase.topics.length} Topics</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                              <span className="font-medium">{phase.projects.length} Projects</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Phase Content */}
                    <div className="p-6 space-y-6">
                      {/* Objectives */}
                      <div>
                        <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                          <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Learning Objectives
                        </h4>
                        <div className="grid md:grid-cols-2 gap-2">
                          {phase.objectives.map((obj, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-sm text-gray-700 p-2 bg-green-50 rounded-lg">
                              <span className="text-green-600 font-bold">•</span>
                              <span className="font-medium">{obj}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Topics */}
                      <div>
                        <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                          <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                          Topics to Master
                        </h4>
                        <div className="space-y-3">
                          {phase.topics.map((topic, topicIdx) => (
                            <div key={topicIdx} className="bg-gradient-to-br from-emerald-50 to-mint-50 rounded-2xl p-4 border border-emerald-200 hover:shadow-lg transition-all duration-200">
                              <div className="flex items-start justify-between gap-3 mb-2">
                                <div className="flex items-center gap-3 flex-1">
                                  <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-emerald-500 to-mint-600 flex items-center justify-center text-white font-bold shadow-lg">
                                    {topicIdx + 1}
                                  </div>
                                  <h5 className="font-bold text-gray-900">{topic.name}</h5>
                                </div>
                                <div className="text-xs bg-emerald-500 text-white px-3 py-1 rounded-full font-bold whitespace-nowrap shadow-md">
                                  {topic.estimatedHours}h
                                </div>
                              </div>
                              <p className="text-sm text-gray-700 ml-13 font-medium">{topic.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Projects */}
                      {phase.projects.length > 0 && (
                        <div>
                          <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                            <svg className="w-5 h-5 text-mint-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            Projects to Build
                          </h4>
                          <div className="space-y-3">
                            {phase.projects.map((project, projIdx) => (
                              <div key={projIdx} className="bg-gradient-to-br from-mint-50 to-green-50 rounded-2xl p-4 border border-mint-200 hover:shadow-lg transition-all duration-200">
                                <div className="flex items-start gap-3 mb-2">
                                  <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-mint-500 to-green-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                                    {projIdx + 1}
                                  </div>
                                  <div className="flex-1">
                                    <div className="font-bold text-gray-900 mb-1">{project.name}</div>
                                    <div className="text-sm text-gray-700 mb-3 font-medium">{project.description}</div>
                                    <div className="flex flex-wrap gap-2">
                                      {project.skillsPracticed.map((skill, skillIdx) => (
                                        <span key={skillIdx} className="text-xs px-3 py-1 bg-mint-500 text-white rounded-full font-bold shadow-md">
                                          {skill}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Resources */}
                      <div className="border-t border-gray-200 pt-4">
                        <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                          Recommended Resources
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {phase.resources.map((resource, resIdx) => (
                            <span key={resIdx} className="text-sm px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 rounded-xl font-bold border border-green-200">
                              {resource}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Application Timeline */}
          <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-mint-50 rounded-3xl shadow-xl p-8 border-2 border-green-200">
            <div className="flex items-start gap-4">
              <div className="text-5xl">🎯</div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-green-900 mb-3 flex items-center gap-2">
                  <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  When to Start Applying
                </h3>
                <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-4 mb-4 border border-green-200">
                  <p className="text-green-800 font-bold text-lg">
                    Week {data.applicationTimeline.startWeek}: {data.applicationTimeline.recommendation}
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-green-800 mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    Preparation Tips
                  </h4>
                  <div className="grid md:grid-cols-2 gap-3">
                    {data.applicationTimeline.preparationTips.map((tip, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 bg-white/50 backdrop-blur-sm rounded-xl border border-green-200">
                        <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-green-700 font-medium">{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Success Metrics */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-green-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-lg">
                <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              Success Metrics
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {data.successMetrics.map((metric, idx) => (
                <div key={idx} className="flex items-start gap-3 p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200 hover:shadow-lg transition-all duration-200">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white flex items-center justify-center flex-shrink-0 font-bold shadow-lg">
                    {idx + 1}
                  </div>
                  <p className="text-gray-700 font-medium">{metric}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoadmapViewer;
