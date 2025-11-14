import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../utils/api';

const RoadmapViewer = () => {
  const { roadmapId } = useParams();
  const navigate = useNavigate();
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState({});

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

  const downloadRoadmap = () => {
    if (!roadmap) return;

    const content = generateTextContent();
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${roadmap.targetRole.replace(/\s+/g, '_')}_Roadmap.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateTextContent = () => {
    if (!roadmap) return '';

    const data = roadmap.roadmapData;
    let content = `CAREER ROADMAP: ${roadmap.targetRole}\n`;
    content += `Generated on: ${new Date(roadmap.createdAt).toLocaleDateString()}\n`;
    content += `Timeframe: ${roadmap.timeframe}\n`;
    content += `Weekly Learning Hours: ${roadmap.weeklyHours}\n`;
    content += `\n${'='.repeat(60)}\n\n`;
    
    content += `OVERVIEW\n`;
    content += `${data.overview.description}\n`;
    content += `Total Duration: ${data.overview.totalDuration} (${data.overview.totalWeeks} weeks)\n\n`;
    
    content += `KEY MILESTONES:\n`;
    data.overview.keyMilestones.forEach((milestone, i) => {
      content += `${i + 1}. ${milestone}\n`;
    });
    content += `\n${'='.repeat(60)}\n\n`;
    
    data.phases.forEach((phase, idx) => {
      content += `PHASE ${phase.phaseNumber}: ${phase.phaseName}\n`;
      content += `Duration: ${phase.duration}\n\n`;
      
      content += `OBJECTIVES:\n`;
      phase.objectives.forEach(obj => content += `  • ${obj}\n`);
      content += `\n`;
      
      content += `TOPICS TO LEARN:\n`;
      phase.topics.forEach(topic => {
        content += `  📚 ${topic.name} (${topic.estimatedHours}h)\n`;
        content += `     ${topic.description}\n`;
      });
      content += `\n`;
      
      content += `PROJECTS:\n`;
      phase.projects.forEach(project => {
        content += `  🚀 ${project.name}\n`;
        content += `     ${project.description}\n`;
        content += `     Skills: ${project.skillsPracticed.join(', ')}\n`;
      });
      content += `\n`;
      
      content += `RESOURCES:\n`;
      phase.resources.forEach(resource => content += `  • ${resource}\n`);
      content += `\n${'='.repeat(60)}\n\n`;
    });
    
    content += `APPLICATION TIMELINE\n`;
    content += `Start applying from week ${data.applicationTimeline.startWeek}\n`;
    content += `${data.applicationTimeline.recommendation}\n\n`;
    content += `PREPARATION TIPS:\n`;
    data.applicationTimeline.preparationTips.forEach(tip => {
      content += `  • ${tip}\n`;
    });
    content += `\n${'='.repeat(60)}\n\n`;
    
    content += `SUCCESS METRICS\n`;
    data.successMetrics.forEach(metric => {
      content += `  ✓ ${metric}\n`;
    });
    
    return content;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto"></div>
              <p className="mt-4 text-gray-600 font-medium">Loading your roadmap...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-8">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-3xl shadow-soft border border-slate-100 p-12 text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Unable to Load Roadmap</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-medium"
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium mb-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>

          <div className="bg-white rounded-3xl shadow-xl p-8 border border-purple-100">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-4">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                  </svg>
                  Career Roadmap
                </div>
                <h1 className="text-4xl font-display font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                  {roadmap.targetRole}
                </h1>
                <p className="text-gray-600 text-lg">{data.overview.description}</p>
                
                <div className="flex flex-wrap gap-4 mt-6">
                  <div className="flex items-center gap-2 text-sm">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-semibold text-gray-700">{data.overview.totalDuration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <svg className="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <span className="font-semibold text-gray-700">{data.phases.length} Phases</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span className="font-semibold text-gray-700">{roadmap.weeklyHours}h/week</span>
                  </div>
                </div>
              </div>

              <button
                onClick={downloadRoadmap}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Roadmap
              </button>
            </div>

            {/* Key Milestones */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Key Milestones
              </h3>
              <div className="grid md:grid-cols-2 gap-3">
                {data.overview.keyMilestones.map((milestone, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-purple-600 font-bold">{idx + 1}.</span>
                    <span>{milestone}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Vertical Timeline - Phases */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-300 via-pink-300 to-blue-300"></div>

          {data.phases.map((phase, phaseIdx) => {
            const isCompleted = progress[`phase_${phase.phaseNumber}`];
            const isEven = phaseIdx % 2 === 0;

            return (
              <div key={phase.phaseNumber} className="relative mb-12">
                {/* Timeline Node */}
                <div className="absolute left-8 md:left-1/2 -ml-6 md:-ml-8 z-10">
                  <button
                    onClick={() => togglePhaseCompletion(phase.phaseNumber)}
                    className={`w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center font-bold text-xl md:text-2xl transition-all shadow-lg ${
                      isCompleted
                        ? 'bg-gradient-to-br from-green-400 to-green-600 text-white'
                        : 'bg-gradient-to-br from-gray-200 to-gray-300 text-gray-600 hover:from-gray-300 hover:to-gray-400'
                    }`}
                  >
                    {isCompleted ? '✓' : phase.phaseNumber}
                  </button>
                </div>

                {/* Content Card */}
                <div className={`ml-24 md:ml-0 md:w-[calc(50%-3rem)] ${isEven ? 'md:mr-auto' : 'md:ml-auto'}`}>
                  <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-xl p-6 text-white">
                    {/* Phase Header */}
                    <div className="mb-4">
                      <div className="text-sm text-purple-300 font-medium mb-1">
                        Chapter {phase.phaseNumber}
                      </div>
                      <h2 className="text-2xl font-bold mb-2">{phase.phaseName}</h2>
                      <div className="flex items-center gap-4 text-sm text-gray-300">
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Duration: {phase.duration}
                        </div>
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          No. of Topics: {phase.topics.length}
                        </div>
                      </div>
                    </div>

                    {/* Objectives */}
                    <div className="mb-4">
                      <h4 className="font-semibold text-purple-300 mb-2 text-sm">OBJECTIVES:</h4>
                      <ul className="space-y-1">
                        {phase.objectives.map((obj, idx) => (
                          <li key={idx} className="text-sm text-gray-200 flex items-start gap-2">
                            <span className="text-purple-400">•</span>
                            <span>{obj}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Topics */}
                    <div className="space-y-3 mb-4">
                      {phase.topics.map((topic, topicIdx) => (
                        <div key={topicIdx} className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/20">
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div className="flex items-center gap-2 flex-1">
                              <div className="w-8 h-8 rounded-full bg-purple-500/30 flex items-center justify-center text-sm font-bold">
                                {topicIdx + 1}
                              </div>
                              <h5 className="font-semibold text-white">{topic.name}</h5>
                            </div>
                            <div className="text-xs bg-purple-500/20 px-2 py-1 rounded-full whitespace-nowrap">
                              {topic.estimatedHours}h
                            </div>
                          </div>
                          <p className="text-sm text-gray-300 ml-10">{topic.description}</p>
                        </div>
                      ))}
                    </div>

                    {/* Projects */}
                    {phase.projects.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-semibold text-pink-300 mb-2 text-sm flex items-center gap-2">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                          PROJECTS TO BUILD:
                        </h4>
                        <div className="space-y-2">
                          {phase.projects.map((project, projIdx) => (
                            <div key={projIdx} className="bg-pink-500/10 rounded-lg p-3 border border-pink-400/20">
                              <div className="font-medium text-white mb-1">{project.name}</div>
                              <div className="text-sm text-gray-300 mb-2">{project.description}</div>
                              <div className="flex flex-wrap gap-1">
                                {project.skillsPracticed.map((skill, skillIdx) => (
                                  <span key={skillIdx} className="text-xs px-2 py-1 bg-pink-500/20 rounded-full text-pink-200">
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Resources */}
                    <div className="border-t border-white/20 pt-4">
                      <h4 className="font-semibold text-blue-300 mb-2 text-sm">RECOMMENDED RESOURCES:</h4>
                      <div className="flex flex-wrap gap-2">
                        {phase.resources.map((resource, resIdx) => (
                          <span key={resIdx} className="text-xs px-3 py-1 bg-blue-500/20 rounded-full text-blue-200 border border-blue-400/30">
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

          {/* Final Node - Gift Icon */}
          <div className="relative">
            <div className="absolute left-8 md:left-1/2 -ml-6 md:-ml-8 z-10">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-2xl md:text-3xl shadow-lg">
                🎁
              </div>
            </div>
          </div>
        </div>

        {/* Application Timeline */}
        <div className="mt-16 bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl shadow-xl p-8 border border-green-200">
          <div className="flex items-start gap-4">
            <div className="text-5xl">🎯</div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-green-900 mb-3">When to Start Applying</h3>
              <p className="text-green-800 font-semibold mb-2">
                Week {data.applicationTimeline.startWeek}: {data.applicationTimeline.recommendation}
              </p>
              <div className="mt-4">
                <h4 className="font-semibold text-green-800 mb-2">Preparation Tips:</h4>
                <ul className="space-y-2">
                  {data.applicationTimeline.preparationTips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-green-700">
                      <svg className="w-5 h-5 text-green-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Success Metrics */}
        <div className="mt-8 bg-white rounded-3xl shadow-xl p-8 border border-slate-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Success Metrics
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {data.successMetrics.map((metric, idx) => (
              <div key={idx} className="flex items-start gap-3 p-4 bg-purple-50 rounded-xl border border-purple-200">
                <div className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">
                  {idx + 1}
                </div>
                <p className="text-gray-700">{metric}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoadmapViewer;
