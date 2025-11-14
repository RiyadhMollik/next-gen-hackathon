import { useState, useCallback, useRef } from 'react';

class InterviewIntegritySystem {
  constructor() {
    this.canvas = null;
    this.context = null;
    this.analysisInterval = null;
    this.violations = [];
    this.metrics = {
      faceDetections: 0,
      lookAwayCount: 0,
      multiplePersons: 0,
      tabSwitches: 0,
      windowBlurs: 0,
      suspiciousKeystrokes: 0,
      audioLevels: [],
      frameAnalysis: []
    };
    this.isAnalyzing = false;
    this.lastFacePosition = null;
    this.consecutiveLookAways = 0;
    this.startTime = Date.now();
  }

  async initialize(videoElement) {
    try {
      this.videoElement = videoElement;
      this.canvas = document.createElement('canvas');
      this.context = this.canvas.getContext('2d');
      
      // Set up browser monitoring
      this.setupBrowserMonitoring();
      
      return true;
    } catch (error) {
      console.error('Failed to initialize integrity system:', error);
      return false;
    }
  }

  startAnalysis(callback) {
    this.isAnalyzing = true;
    this.callback = callback;
    
    console.log('🔒 Interview Integrity Monitoring Started');
    
    // Analyze video every 2 seconds
    this.analysisInterval = setInterval(() => {
      if (this.isAnalyzing && this.videoElement) {
        this.analyzeVideoFrame();
      }
    }, 2000);

    // Update metrics every 5 seconds
    this.metricsInterval = setInterval(() => {
      if (this.isAnalyzing) {
        this.updateMetrics();
      }
    }, 5000);

    // Send initial data immediately
    setTimeout(() => {
      if (this.callback) {
        this.updateMetrics();
      }
    }, 500);
  }

  stopAnalysis() {
    this.isAnalyzing = false;
    if (this.analysisInterval) {
      clearInterval(this.analysisInterval);
    }
    if (this.metricsInterval) {
      clearInterval(this.metricsInterval);
    }
    this.cleanup();
  }

  setupBrowserMonitoring() {
    // Monitor tab visibility
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.recordViolation('tab_switch', 'User switched tabs or minimized window', 'medium');
        this.metrics.tabSwitches++;
      }
    });

    // Monitor window focus
    window.addEventListener('blur', () => {
      this.recordViolation('window_blur', 'Window lost focus', 'medium');
      this.metrics.windowBlurs++;
    });

    // Monitor suspicious keystrokes
    document.addEventListener('keydown', (event) => {
      const suspiciousKeys = ['F12', 'F5', 'PrintScreen'];
      const suspiciousCombos = [
        event.ctrlKey && event.shiftKey && event.key === 'I', // DevTools
        event.ctrlKey && event.shiftKey && event.key === 'C', // DevTools
        event.ctrlKey && event.key === 'u', // View source
        event.altKey && event.key === 'Tab' // Alt+Tab
      ];

      if (suspiciousKeys.includes(event.key) || suspiciousCombos.some(combo => combo)) {
        this.recordViolation('suspicious_keystroke', `Suspicious key combination: ${event.key}`, 'low');
        this.metrics.suspiciousKeystrokes++;
      }
    });
  }

  analyzeVideoFrame() {
    try {
      if (!this.videoElement || this.videoElement.readyState < 2) {
        return;
      }

      // Set canvas size to match video
      this.canvas.width = this.videoElement.videoWidth;
      this.canvas.height = this.videoElement.videoHeight;
      
      // Draw current frame to canvas
      this.context.drawImage(this.videoElement, 0, 0, this.canvas.width, this.canvas.height);
      
      // Get image data for analysis
      const imageData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
      
      // Perform basic computer vision analysis
      this.detectFace(imageData);
      this.detectMotion(imageData);
      this.analyzeAudioLevel();
      
    } catch (error) {
      console.warn('Video frame analysis error:', error);
    }
  }

  detectFace(imageData) {
    // Simple face detection using color and brightness patterns
    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;
    
    let skinColorRegions = 0;
    let faceRegionDetected = false;
    
    // Sample pixels in center region for face detection
    const centerX = width / 2;
    const centerY = height / 2;
    const sampleRadius = Math.min(width, height) * 0.15;
    
    for (let y = centerY - sampleRadius; y < centerY + sampleRadius; y += 10) {
      for (let x = centerX - sampleRadius; x < centerX + sampleRadius; x += 10) {
        if (x >= 0 && x < width && y >= 0 && y < height) {
          const index = (y * width + x) * 4;
          const r = data[index];
          const g = data[index + 1];
          const b = data[index + 2];
          
          // Simple skin color detection
          if (this.isSkinColor(r, g, b)) {
            skinColorRegions++;
          }
        }
      }
    }
    
    // If we found enough skin-colored regions, assume face is present
    faceRegionDetected = skinColorRegions > 20;
    
    if (faceRegionDetected) {
      this.metrics.faceDetections++;
      this.consecutiveLookAways = 0;
    } else {
      this.consecutiveLookAways++;
      if (this.consecutiveLookAways > 3) {
        this.recordViolation('no_face_detected', 'No face detected in frame', 'high');
        this.metrics.lookAwayCount++;
      }
    }
    
    // Store analysis result
    this.metrics.frameAnalysis.push({
      timestamp: Date.now(),
      faceDetected: faceRegionDetected,
      skinColorRegions
    });
    
    // Keep only recent analysis data
    if (this.metrics.frameAnalysis.length > 50) {
      this.metrics.frameAnalysis = this.metrics.frameAnalysis.slice(-30);
    }
  }

  isSkinColor(r, g, b) {
    // Simple skin color detection algorithm
    return (
      r > 95 && g > 40 && b > 20 &&
      r > g && r > b &&
      r - g > 15 &&
      Math.abs(r - g) > 15
    );
  }

  detectMotion(imageData) {
    // Compare with previous frame to detect excessive motion
    if (this.previousImageData) {
      let totalDifference = 0;
      const data = imageData.data;
      const prevData = this.previousImageData.data;
      
      // Sample every 100th pixel for performance
      for (let i = 0; i < data.length; i += 400) {
        const diff = Math.abs(data[i] - prevData[i]) + 
                    Math.abs(data[i + 1] - prevData[i + 1]) + 
                    Math.abs(data[i + 2] - prevData[i + 2]);
        totalDifference += diff;
      }
      
      const avgDifference = totalDifference / (data.length / 400);
      
      // If there's excessive motion, it might indicate multiple people or cheating
      if (avgDifference > 50) {
        this.recordViolation('excessive_motion', 'Excessive movement detected', 'medium');
      }
    }
    
    // Store current frame for next comparison
    this.previousImageData = this.context.createImageData(imageData.width, imageData.height);
    this.previousImageData.data.set(imageData.data);
  }

  analyzeAudioLevel() {
    // This would require Web Audio API implementation
    // For now, we'll simulate audio level analysis
    const simulatedLevel = Math.random() * 100;
    this.metrics.audioLevels.push(simulatedLevel);
    
    if (this.metrics.audioLevels.length > 20) {
      this.metrics.audioLevels = this.metrics.audioLevels.slice(-10);
    }
  }

  recordViolation(type, description, severity) {
    const violation = {
      id: Date.now() + Math.random(),
      type,
      description,
      severity,
      timestamp: new Date().toISOString(),
      timeFromStart: Date.now() - this.startTime
    };
    
    this.violations.push(violation);
    
    // Keep only recent violations
    if (this.violations.length > 100) {
      this.violations = this.violations.slice(-50);
    }
    
    console.warn('Integrity Violation:', violation);
  }

  updateMetrics() {
    const currentData = {
      integrityScore: this.calculateIntegrityScore(),
      violations: this.violations,
      violationsCount: this.violations.length,
      recentViolations: this.violations.slice(-5),
      metrics: { ...this.metrics },
      uptime: Date.now() - this.startTime,
      status: this.violations.length === 0 ? 'clean' : 
              this.violations.filter(v => v.severity === 'high').length > 0 ? 'suspicious' : 'warning'
    };
    
    if (this.callback) {
      this.callback(currentData);
    }
  }

  calculateIntegrityScore() {
    let score = 100;
    
    // Deduct points for violations
    this.violations.forEach(violation => {
      switch (violation.severity) {
        case 'low': score -= 2; break;
        case 'medium': score -= 5; break;
        case 'high': score -= 10; break;
        case 'critical': score -= 20; break;
      }
    });
    
    // Bonus points for continuous face detection
    const recentFrames = this.metrics.frameAnalysis.slice(-10);
    const faceDetectionRate = recentFrames.length > 0 ? 
      recentFrames.filter(f => f.faceDetected).length / recentFrames.length : 0;
    
    if (faceDetectionRate > 0.8) {
      score += 5;
    }
    
    return Math.max(0, Math.min(100, score));
  }

  generateReport() {
    return {
      interviewId: null,
      startTime: this.startTime,
      endTime: Date.now(),
      duration: Date.now() - this.startTime,
      integrityScore: this.calculateIntegrityScore(),
      totalViolations: this.violations.length,
      violationsByType: this.groupViolationsByType(),
      violationsBySeverity: this.groupViolationsBySeverity(),
      metrics: { ...this.metrics },
      status: this.violations.length === 0 ? 'clean' : 
              this.violations.filter(v => v.severity === 'high').length > 0 ? 'suspicious' : 'warning',
      recommendations: this.generateRecommendations()
    };
  }

  groupViolationsByType() {
    const groups = {};
    this.violations.forEach(violation => {
      groups[violation.type] = (groups[violation.type] || 0) + 1;
    });
    return groups;
  }

  groupViolationsBySeverity() {
    const groups = { low: 0, medium: 0, high: 0, critical: 0 };
    this.violations.forEach(violation => {
      groups[violation.severity]++;
    });
    return groups;
  }

  generateRecommendations() {
    const recommendations = [];
    
    if (this.metrics.lookAwayCount > 5) {
      recommendations.push('Maintain better eye contact with the camera');
    }
    
    if (this.metrics.tabSwitches > 2) {
      recommendations.push('Avoid switching tabs during the interview');
    }
    
    if (this.metrics.suspiciousKeystrokes > 3) {
      recommendations.push('Avoid using developer tools or shortcuts during interview');
    }
    
    if (recommendations.length === 0) {
      recommendations.push('Great job maintaining interview integrity!');
    }
    
    return recommendations;
  }

  cleanup() {
    if (this.canvas) {
      this.canvas = null;
    }
    this.context = null;
    this.previousImageData = null;
  }

  reset() {
    this.violations = [];
    this.metrics = {
      faceDetections: 0,
      lookAwayCount: 0,
      multiplePersons: 0,
      tabSwitches: 0,
      windowBlurs: 0,
      suspiciousKeystrokes: 0,
      audioLevels: [],
      frameAnalysis: []
    };
    this.startTime = Date.now();
  }
}

// React Hook for Interview Integrity
export const useInterviewIntegrity = () => {
  const [integritySystem] = useState(() => new InterviewIntegritySystem());
  const [integrityData, setIntegrityData] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const initPromise = useRef(null);

  const startIntegrityMonitoring = useCallback(async (videoElement) => {
    try {
      if (!initPromise.current) {
        initPromise.current = integritySystem.initialize(videoElement);
      }
      
      const initialized = await initPromise.current;
      if (initialized) {
        setIsActive(true);
        integritySystem.startAnalysis((data) => {
          setIntegrityData(data);
        });
      }
    } catch (error) {
      console.error('Failed to start integrity monitoring:', error);
    }
  }, [integritySystem]);

  const stopIntegrityMonitoring = useCallback(() => {
    setIsActive(false);
    integritySystem.stopAnalysis();
  }, [integritySystem]);

  const getIntegrityReport = useCallback(() => {
    return integritySystem.generateReport();
  }, [integritySystem]);

  const resetIntegritySystem = useCallback(() => {
    integritySystem.reset();
    setIntegrityData(null);
  }, [integritySystem]);

  return {
    integrityData,
    isActive,
    startIntegrityMonitoring,
    stopIntegrityMonitoring,
    getIntegrityReport,
    resetIntegritySystem
  };
};

export default InterviewIntegritySystem;
