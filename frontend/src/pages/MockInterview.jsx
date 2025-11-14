import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useInterviewIntegrity } from '../utils/interviewIntegrity';
import { useBehaviorAnalysis } from '../utils/behaviorAnalysis';

const MockInterview = () => {
  const { interviewId } = useParams();
  const navigate = useNavigate();
  
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [answers, setAnswers] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [cameraReady, setCameraReady] = useState(false);
  
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);

  // Interview integrity and fraud detection
  const {
    integrityData,
    isActive,
    startIntegrityMonitoring,
    stopIntegrityMonitoring,
    getIntegrityReport
  } = useInterviewIntegrity();

  // Behavior analysis
  const {
    behaviorData,
    isAnalyzing,
    startBehaviorAnalysis,
    stopBehaviorAnalysis,
    getBehaviorReport
  } = useBehaviorAnalysis();
  const getFraudReport = () => ({});
  const resetFraudDetection = () => {};



  useEffect(() => {
    fetchInterview();
    initializeCamera();
    initializeSpeechRecognition();
    
    return () => {
      stopCamera();
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      synthRef.current.cancel();
      // Fraud detection cleanup temporarily disabled
    };
  }, [interviewId]);

  const fetchInterview = async () => {
    try {
      setLoading(true);
      console.log('Fetching interview with ID:', interviewId);
      
      const response = await api.get(`/interviews/${interviewId}`);
      console.log('Interview response:', response.data);
      
      // Check if response has the expected structure
      if (!response.data || !response.data.interview) {
        throw new Error('Invalid interview data structure');
      }
      
      // Parse questions if they are stored as a string
      const interviewData = response.data.interview;
      
      if (typeof interviewData.questions === 'string') {
        try {
          interviewData.questions = JSON.parse(interviewData.questions);
        } catch (parseError) {
          console.error('Failed to parse questions:', parseError);
          throw new Error('Invalid interview questions format');
        }
      }
      
      if (typeof interviewData.userSkills === 'string') {
        try {
          interviewData.userSkills = JSON.parse(interviewData.userSkills);
        } catch (parseError) {
          console.warn('Failed to parse user skills, using empty array:', parseError);
          interviewData.userSkills = [];
        }
      }
      
      // Ensure questions is an array
      if (!Array.isArray(interviewData.questions)) {
        throw new Error('Interview questions must be an array');
      }
      
      if (interviewData.questions.length === 0) {
        throw new Error('No interview questions found');
      }
      
      console.log('Setting interview data:', interviewData);
      setInterview(interviewData);
      
      // Start the interview
      try {
        await api.put(`/interviews/${interviewId}/start`);
        setStartTime(Date.now());
        console.log('Interview started successfully');
      } catch (startError) {
        console.warn('Failed to start interview session:', startError);
        // Don't fail the whole component if starting fails
        setStartTime(Date.now());
      }
    } catch (error) {
      console.error('Failed to fetch interview:', error);
      alert(`Failed to load interview: ${error.message}`);
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const initializeCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraReady(true);
        
        // Start interview integrity monitoring and behavior analysis
        setTimeout(async () => {
          try {
            await startIntegrityMonitoring(videoRef.current);
            await startBehaviorAnalysis(videoRef.current);
            console.log('Interview monitoring systems activated');
          } catch (error) {
            console.warn('Failed to start interview monitoring:', error);
          }
        }, 1000); // Small delay to ensure video is fully loaded
      }
    } catch (error) {
      console.error('Camera access error:', error);
      alert('Camera access denied. Please enable camera permissions.');
    }
  };

  const stopCamera = () => {
    // Stop integrity monitoring and behavior analysis
    stopIntegrityMonitoring();
    stopBehaviorAnalysis();
    
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
    }
  };

  const initializeSpeechRecognition = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      
      recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }
        
        setUserAnswer(prev => prev + finalTranscript);
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'no-speech') {
          recognition.stop();
          setIsRecording(false);
        }
      };
      
      recognitionRef.current = recognition;
    } else {
      console.warn('Speech recognition not supported');
    }
  };

  const speakQuestion = (text) => {
    synthRef.current.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    
    synthRef.current.speak(utterance);
  };

  const startRecording = () => {
    if (recognitionRef.current) {
      setUserAnswer('');
      recognitionRef.current.start();
      setIsRecording(true);
    } else {
      alert('Speech recognition not available. Please type your answer.');
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  const submitCurrentAnswer = async () => {
    if (!userAnswer.trim()) {
      alert('Please provide an answer before submitting');
      return;
    }

    try {
      await api.post(`/interviews/${interviewId}/answer`, {
        questionIndex: currentQuestionIndex,
        answer: userAnswer
      });

      setAnswers([...answers, { questionIndex: currentQuestionIndex, answer: userAnswer }]);
      setUserAnswer('');

      if (currentQuestionIndex < interview.questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        completeInterview();
      }
    } catch (error) {
      console.error('Failed to submit answer:', error);
      alert('Failed to submit answer. Please try again.');
    }
  };

  const completeInterview = async () => {
    const duration = Math.floor((Date.now() - startTime) / 1000);
    
    try {
      setLoading(true);
      
      // Stop monitoring systems and collect reports
      let integrityReport = null;
      let behaviorReport = null;
      
      if (isActive) {
        stopIntegrityMonitoring();
        integrityReport = getIntegrityReport();
      }
      
      if (isAnalyzing) {
        stopBehaviorAnalysis();
        behaviorReport = getBehaviorReport();
      }
      
      const response = await api.post(`/interviews/${interviewId}/complete`, { 
        duration,
        integrityReport,
        behaviorReport
      });
      
      if (response.data.success) {
        stopCamera();
        navigate(`/interview/${interviewId}/feedback`);
      }
    } catch (error) {
      console.error('Failed to complete interview:', error);
      alert('Failed to complete interview');
    } finally {
      setLoading(false);
    }
  };

  const readQuestion = () => {
    if (interview && interview.questions[currentQuestionIndex]) {
      speakQuestion(interview.questions[currentQuestionIndex].question);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-700 font-medium">Loading interview...</p>
        </div>
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">Loading interview...</p>
        </div>
      </div>
    );
  }

  // Check if questions exist and are valid
  if (!interview.questions || !Array.isArray(interview.questions) || interview.questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Interview Data Error</h2>
          <p className="text-gray-600 mb-4">No interview questions found.</p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = interview.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / interview.questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-xl p-6 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Mock Interview: {interview.jobTitle}
              </h1>
              <p className="text-gray-600 mt-1">
                Question {currentQuestionIndex + 1} of {interview.questions.length}
              </p>
            </div>
            <div className="flex items-center gap-3">
                            <div className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                Mock Interview #{interview.id}
              </div>
              <div className={`px-4 py-2 rounded-full text-sm font-medium ${
                currentQuestion.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                currentQuestion.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {currentQuestion.difficulty}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Fraud detection temporarily disabled for debugging */}

        <div className="grid md:grid-cols-2 gap-6">
          {/* Camera Feed */}
          <div className="bg-white rounded-3xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Video Feed</h2>
              <div className="flex items-center gap-2">
                {cameraReady && (
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
                    <span>Recording</span>
                  </div>
                )}
              </div>
            </div>
            <div className="relative aspect-video bg-gray-900 rounded-2xl overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                muted
                className="w-full h-full object-cover transform scale-x-[-1]"
              />
              
              {/* Debug Panel - Remove in production */}
              {process.env.NODE_ENV === 'development' && (
                <div className="absolute top-4 left-4 bg-red-800/80 rounded-lg p-2">
                  <div className="text-white text-xs space-y-1">
                    <div>Debug Panel</div>
                    <button 
                      onClick={() => window.dispatchEvent(new Event('blur'))}
                      className="bg-red-600 px-2 py-1 rounded text-xs"
                    >
                      Test Window Blur
                    </button>
                    <button 
                      onClick={() => {
                        const event = new KeyboardEvent('keydown', { key: 'F12' });
                        document.dispatchEvent(event);
                      }}
                      className="bg-red-600 px-2 py-1 rounded text-xs"
                    >
                      Test F12 Key
                    </button>
                  </div>
                </div>
              )}
              
              {/* Interview Integrity Monitoring Display */}
              {(isActive || isAnalyzing) && (
                <div className="absolute top-4 right-4 bg-black/80 rounded-lg p-3 min-w-64">
                  <div className="text-white space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <div className={`w-2 h-2 rounded-full ${(isActive && isAnalyzing) ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`}></div>
                      <span>Interview Monitoring Active</span>
                    </div>
                    
                    {integrityData && (
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span>Integrity Score:</span>
                          <span className={`font-bold ${
                            integrityData.integrityScore >= 80 ? 'text-green-400' : 
                            integrityData.integrityScore >= 60 ? 'text-yellow-400' : 'text-red-400'
                          }`}>
                            {integrityData.integrityScore}/100
                          </span>
                        </div>
                        {integrityData.violations?.length > 0 && (
                          <div className="text-red-400">
                            <div>Violations: {integrityData.violations.length}</div>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {behaviorData && (
                      <div className="space-y-1 text-xs border-t border-gray-600 pt-2">
                        <div className="flex justify-between">
                          <span>Attention:</span>
                          <span className="font-bold text-blue-400">{behaviorData.attentionScore}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Engagement:</span>
                          <span className={`font-bold capitalize ${
                            behaviorData.engagementLevel === 'high' ? 'text-green-400' : 
                            behaviorData.engagementLevel === 'medium' ? 'text-yellow-400' : 'text-red-400'
                          }`}>
                            {behaviorData.engagementLevel}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {!cameraReady && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                  <div className="text-center text-white">
                    <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <p>Initializing camera...</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Interview Integrity & Behavior Dashboard */}
          {(isActive || isAnalyzing) && (integrityData || behaviorData) && (
            <div className="bg-white rounded-3xl shadow-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Interview Analysis</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Integrity Monitoring */}
                {integrityData && (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${
                        integrityData.integrityScore >= 80 ? 'bg-green-500' : 
                        integrityData.integrityScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}></div>
                      Interview Integrity
                    </h4>
                    
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Overall Score</span>
                        <span className={`text-lg font-bold ${
                          integrityData.integrityScore >= 80 ? 'text-green-600' : 
                          integrityData.integrityScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {integrityData.integrityScore}/100
                        </span>
                      </div>
                      
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            integrityData.integrityScore >= 80 ? 'bg-green-500' : 
                            integrityData.integrityScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${integrityData.integrityScore}%` }}
                        ></div>
                      </div>
                      
                      {integrityData.violations?.length > 0 && (
                        <div className="mt-3 p-3 bg-red-50 rounded-lg">
                          <div className="text-sm font-medium text-red-800 mb-1">
                            Recent Violations ({integrityData.violations.length})
                          </div>
                          <div className="text-xs text-red-700">
                            {integrityData.violations.slice(-3).map((violation, index) => (
                              <div key={index} className="flex justify-between">
                                <span>{violation.type}</span>
                                <span className="font-medium">{violation.severity}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Behavior Analysis */}
                {behaviorData && (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      Behavioral Analysis
                    </h4>
                    
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-gray-600">Attention</span>
                          <div className="font-bold text-blue-600">{behaviorData.attentionScore}%</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Engagement</span>
                          <div className={`font-bold capitalize ${
                            behaviorData.engagementLevel === 'high' ? 'text-green-600' : 
                            behaviorData.engagementLevel === 'medium' ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {behaviorData.engagementLevel}
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-600">Confidence</span>
                          <div className={`font-bold capitalize ${
                            behaviorData.confidenceLevel === 'high' ? 'text-green-600' : 
                            behaviorData.confidenceLevel === 'medium' ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {behaviorData.confidenceLevel}
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-600">Eye Contact</span>
                          <div className={`font-bold capitalize ${
                            behaviorData.eyeContact === 'excellent' || behaviorData.eyeContact === 'good' ? 'text-green-600' : 
                            behaviorData.eyeContact === 'average' ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {behaviorData.eyeContact}
                          </div>
                        </div>
                      </div>
                      
                      {behaviorData.recommendations?.length > 0 && (
                        <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                          <div className="text-sm font-medium text-blue-800 mb-1">Live Recommendations</div>
                          <div className="text-xs text-blue-700">
                            {behaviorData.recommendations.slice(-2).map((rec, index) => (
                              <div key={index} className="mb-1">• {rec}</div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Question & Answer Panel */}
          <div className="bg-white rounded-3xl shadow-xl p-6">
            <div className="mb-6">
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Question</h2>
                <button
                  onClick={readQuestion}
                  disabled={isSpeaking}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-xl hover:bg-emerald-200 transition-colors disabled:opacity-50"
                >
                  {isSpeaking ? (
                    <>
                      <svg className="w-5 h-5 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" />
                      </svg>
                      Speaking...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" />
                      </svg>
                      Read Question
                    </>
                  )}
                </button>
              </div>
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
                <p className="text-lg text-gray-800 leading-relaxed">
                  {currentQuestion.question}
                </p>
              </div>
            </div>

            {/* Answer Input */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Your Answer
              </label>
              <textarea
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Type your answer or use voice input..."
                rows={8}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
            </div>

            {/* Controls */}
            <div className="flex gap-3">
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                  isRecording 
                    ? 'bg-red-600 text-white hover:bg-red-700' 
                    : 'bg-emerald-600 text-white hover:bg-emerald-700'
                }`}
              >
                {isRecording ? (
                  <>
                    <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                    Stop Recording
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                    </svg>
                    Voice Answer
                  </>
                )}
              </button>
              
              <button
                onClick={submitCurrentAnswer}
                disabled={!userAnswer.trim()}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {currentQuestionIndex === interview.questions.length - 1 ? 'Finish Interview' : 'Next Question'}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockInterview;
