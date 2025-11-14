import { FaceDetection } from '@mediapipe/face_detection';
import { Holistic } from '@mediapipe/holistic';
import { useState, useCallback } from 'react';

class FraudDetectionSystem {
  constructor() {
    this.faceDetection = null;
    this.holistic = null;
    this.violations = [];
    this.behaviorMetrics = {
      faceDetections: 0,
      eyeContact: 0,
      headMovements: 0,
      suspiciousActivity: 0,
      tabSwitches: 0,
      windowBlurs: 0,
      multiplePersons: 0,
      lookAwayCount: 0,
      phoneDetections: 0
    };
    this.isAnalyzing = false;
    this.lastFaceDetection = null;
    this.eyeContactThreshold = 0.3;
    this.suspiciousActivityThreshold = 5;
    this.onViolationCallback = null;
    
    this.initializeModels();
    this.setupPageVisibilityDetection();
    this.setupWindowFocusDetection();
  }

  async initializeModels() {
    try {
      // Initialize MediaPipe Face Detection
      this.faceDetection = new FaceDetection({
        locateFile: (file) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`;
        }
      });

      this.faceDetection.setOptions({
        model: 'short',
        minDetectionConfidence: 0.5,
      });

      this.faceDetection.onResults((results) => {
        this.processFaceDetectionResults(results);
      });

      // Initialize MediaPipe Holistic
      this.holistic = new Holistic({
        locateFile: (file) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`;
        }
      });

      this.holistic.setOptions({
        modelComplexity: 1,
        smoothLandmarks: true,
        enableSegmentation: false,
        smoothSegmentation: true,
        refineFaceLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      });

      this.holistic.onResults((results) => {
        this.processHolisticResults(results);
      });

      console.log('✅ Fraud Detection System initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize fraud detection models:', error);
    }
  }

  startAnalysis(videoElement, onViolation) {
    this.isAnalyzing = true;
    this.onViolationCallback = onViolation;
    this.processVideoFrame(videoElement);
  }

  stopAnalysis() {
    this.isAnalyzing = false;
  }

  processVideoFrame(videoElement) {
    if (!this.isAnalyzing || !videoElement) return;

    if (videoElement.videoWidth > 0 && videoElement.videoHeight > 0) {
      // Send frame to both models
      if (this.faceDetection) {
        this.faceDetection.send({ image: videoElement });
      }
      if (this.holistic) {
        this.holistic.send({ image: videoElement });
      }
    }

    // Continue processing frames
    if (this.isAnalyzing) {
      requestAnimationFrame(() => this.processVideoFrame(videoElement));
    }
  }

  processFaceDetectionResults(results) {
    const currentTime = Date.now();
    const faces = results.detections;

    if (faces && faces.length > 0) {
      this.behaviorMetrics.faceDetections++;

      // Check for multiple persons
      if (faces.length > 1) {
        this.behaviorMetrics.multiplePersons++;
        this.addViolation('multiple_persons', 'Multiple persons detected in frame', 'high');
      }

      // Analyze primary face
      const primaryFace = faces[0];
      this.analyzeFaceBehavior(primaryFace, currentTime);
    } else {
      // No face detected
      if (this.lastFaceDetection && (currentTime - this.lastFaceDetection > 3000)) {
        this.addViolation('face_not_visible', 'Face not visible for extended period', 'medium');
      }
    }

    this.lastFaceDetection = currentTime;
  }

  processHolisticResults(results) {
    if (results.faceLandmarks) {
      this.analyzeEyeContact(results.faceLandmarks);
      this.analyzeHeadMovement(results.faceLandmarks);
    }

    if (results.poseLandmarks) {
      this.analyzePoseBehavior(results.poseLandmarks);
    }

    if (results.rightHandLandmarks || results.leftHandLandmarks) {
      this.analyzeHandMovements(results.rightHandLandmarks, results.leftHandLandmarks);
    }
  }

  analyzeFaceBehavior(face, currentTime) {
    // Analyze face size (distance from camera)
    const faceBounds = face.boundingBox;
    const faceArea = faceBounds.width * faceBounds.height;

    if (faceArea < 0.05) { // Face too small (too far)
      this.addViolation('distance_violation', 'Too far from camera', 'low');
    } else if (faceArea > 0.5) { // Face too large (too close)
      this.addViolation('distance_violation', 'Too close to camera', 'low');
    }
  }

  analyzeEyeContact(faceLandmarks) {
    if (!faceLandmarks || faceLandmarks.length < 468) return;

    // Eye landmarks indices (MediaPipe Face Mesh)
    const leftEyeIndices = [33, 7, 163, 144, 145, 153, 154, 155, 133, 173, 157, 158, 159, 160, 161, 246];
    const rightEyeIndices = [362, 382, 381, 380, 374, 373, 390, 249, 263, 466, 388, 387, 386, 385, 384, 398];

    try {
      // Calculate eye aspect ratio for blink detection
      const leftEAR = this.calculateEyeAspectRatio(faceLandmarks, leftEyeIndices);
      const rightEAR = this.calculateEyeAspectRatio(faceLandmarks, rightEyeIndices);
      const avgEAR = (leftEAR + rightEAR) / 2;

      // Detect looking away (simplified gaze estimation)
      const noseX = faceLandmarks[1].x;
      const leftEyeX = faceLandmarks[33].x;
      const rightEyeX = faceLandmarks[362].x;
      
      const gazeDirection = (leftEyeX + rightEyeX) / 2 - noseX;
      
      if (Math.abs(gazeDirection) > this.eyeContactThreshold) {
        this.behaviorMetrics.lookAwayCount++;
        if (this.behaviorMetrics.lookAwayCount > 10) {
          this.addViolation('poor_eye_contact', 'Consistently looking away from camera', 'medium');
        }
      } else {
        this.behaviorMetrics.eyeContact++;
      }

      // Detect closed eyes for extended period
      if (avgEAR < 0.2) {
        this.behaviorMetrics.suspiciousActivity++;
      }
    } catch (error) {
      console.warn('Error analyzing eye contact:', error);
    }
  }

  calculateEyeAspectRatio(landmarks, eyeIndices) {
    if (eyeIndices.length < 6) return 0;

    const p1 = landmarks[eyeIndices[1]];
    const p2 = landmarks[eyeIndices[5]];
    const p3 = landmarks[eyeIndices[2]];
    const p4 = landmarks[eyeIndices[4]];
    const p5 = landmarks[eyeIndices[0]];
    const p6 = landmarks[eyeIndices[3]];

    const A = Math.sqrt(Math.pow(p2.x - p6.x, 2) + Math.pow(p2.y - p6.y, 2));
    const B = Math.sqrt(Math.pow(p3.x - p5.x, 2) + Math.pow(p3.y - p5.y, 2));
    const C = Math.sqrt(Math.pow(p1.x - p4.x, 2) + Math.pow(p1.y - p4.y, 2));

    return (A + B) / (2.0 * C);
  }

  analyzeHeadMovement(faceLandmarks) {
    if (!this.previousHeadPosition) {
      this.previousHeadPosition = { x: faceLandmarks[1].x, y: faceLandmarks[1].y };
      return;
    }

    const currentPos = { x: faceLandmarks[1].x, y: faceLandmarks[1].y };
    const movement = Math.sqrt(
      Math.pow(currentPos.x - this.previousHeadPosition.x, 2) +
      Math.pow(currentPos.y - this.previousHeadPosition.y, 2)
    );

    if (movement > 0.1) {
      this.behaviorMetrics.headMovements++;
      if (this.behaviorMetrics.headMovements > 50) {
        this.addViolation('excessive_movement', 'Excessive head movement detected', 'low');
      }
    }

    this.previousHeadPosition = currentPos;
  }

  analyzePoseBehavior(poseLandmarks) {
    // Check if person is facing the camera
    const leftShoulder = poseLandmarks[11];
    const rightShoulder = poseLandmarks[12];
    
    if (leftShoulder && rightShoulder) {
      const shoulderAngle = Math.abs(leftShoulder.y - rightShoulder.y);
      
      if (shoulderAngle > 0.1) {
        this.addViolation('body_orientation', 'Not facing the camera properly', 'low');
      }
    }
  }

  analyzeHandMovements(rightHand, leftHand) {
    // Detect phone-like objects near face
    if (rightHand || leftHand) {
      const hands = [rightHand, leftHand].filter(Boolean);
      
      hands.forEach(hand => {
        if (hand[8] && hand[4]) { // Index finger tip and thumb tip
          const distance = Math.sqrt(
            Math.pow(hand[8].x - hand[4].x, 2) + 
            Math.pow(hand[8].y - hand[4].y, 2)
          );
          
          // Detect potential phone usage (hand near ear)
          if (hand[8].y < 0.3 && distance < 0.1) {
            this.behaviorMetrics.phoneDetections++;
            this.addViolation('phone_usage', 'Possible phone usage detected', 'high');
          }
        }
      });
    }
  }

  setupPageVisibilityDetection() {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.behaviorMetrics.tabSwitches++;
        this.addViolation('tab_switch', 'User switched away from interview tab', 'high');
      }
    });

    // Detect right-click (context menu)
    document.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      this.addViolation('context_menu', 'Right-click detected during interview', 'medium');
    });

    // Detect keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      const suspiciousKeys = [
        'F12', 'F11', // Developer tools, fullscreen
        'Alt+Tab', 'Cmd+Tab', // Task switching
        'Ctrl+Shift+I', 'Cmd+Option+I', // Developer tools
        'Ctrl+U', 'Cmd+U', // View source
        'Ctrl+Shift+C', 'Cmd+Option+C', // Inspect element
      ];

      const keyCombo = `${e.ctrlKey ? 'Ctrl+' : ''}${e.altKey ? 'Alt+' : ''}${e.shiftKey ? 'Shift+' : ''}${e.metaKey ? 'Cmd+' : ''}${e.key}`;
      
      if (suspiciousKeys.some(key => keyCombo.includes(key)) || e.key === 'F12') {
        e.preventDefault();
        this.addViolation('suspicious_keypress', `Suspicious key combination: ${keyCombo}`, 'high');
      }
    });
  }

  setupWindowFocusDetection() {
    window.addEventListener('blur', () => {
      this.behaviorMetrics.windowBlurs++;
      this.addViolation('window_blur', 'Window lost focus during interview', 'medium');
    });

    // Detect window resize (potential screen sharing)
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.addViolation('window_resize', 'Window resized during interview', 'low');
      }, 300);
    });
  }

  addViolation(type, description, severity) {
    const violation = {
      type,
      description,
      severity,
      timestamp: new Date().toISOString(),
      behaviorMetrics: { ...this.behaviorMetrics }
    };

    this.violations.push(violation);
    console.warn(`🚨 Fraud Detection Violation [${severity.toUpperCase()}]:`, description);

    // Notify the callback
    if (this.onViolationCallback) {
      this.onViolationCallback(violation);
    }

    // Auto-escalate for high severity violations
    if (severity === 'high' && this.getHighSeverityCount() >= 3) {
      this.escalateInterview();
    }
  }

  getHighSeverityCount() {
    return this.violations.filter(v => v.severity === 'high').length;
  }

  getMediumSeverityCount() {
    return this.violations.filter(v => v.severity === 'medium').length;
  }

  getLowSeverityCount() {
    return this.violations.filter(v => v.severity === 'low').length;
  }

  escalateInterview() {
    const escalation = {
      type: 'interview_escalation',
      description: 'Interview flagged for manual review due to multiple violations',
      severity: 'critical',
      timestamp: new Date().toISOString(),
      totalViolations: this.violations.length,
      highSeverityCount: this.getHighSeverityCount(),
      behaviorMetrics: { ...this.behaviorMetrics }
    };

    this.violations.push(escalation);
    
    if (this.onViolationCallback) {
      this.onViolationCallback(escalation);
    }
  }

  getIntegrityScore() {
    const totalViolations = this.violations.length;
    const highSeverityPenalty = this.getHighSeverityCount() * 20;
    const mediumSeverityPenalty = this.getMediumSeverityCount() * 10;
    const lowSeverityPenalty = this.getLowSeverityCount() * 5;

    const totalPenalty = highSeverityPenalty + mediumSeverityPenalty + lowSeverityPenalty;
    const score = Math.max(0, 100 - totalPenalty);

    return {
      score,
      totalViolations,
      breakdown: {
        high: this.getHighSeverityCount(),
        medium: this.getMediumSeverityCount(),
        low: this.getLowSeverityCount()
      },
      behaviorMetrics: this.behaviorMetrics
    };
  }

  generateReport() {
    const integrityScore = this.getIntegrityScore();
    
    return {
      ...integrityScore,
      violations: this.violations,
      analysisDate: new Date().toISOString(),
      recommendations: this.generateRecommendations(integrityScore.score)
    };
  }

  generateRecommendations(score) {
    const recommendations = [];

    if (score < 50) {
      recommendations.push('Interview requires manual review due to multiple integrity violations');
    } else if (score < 70) {
      recommendations.push('Interview shows concerning behavior patterns - recommend secondary verification');
    } else if (score < 85) {
      recommendations.push('Minor integrity concerns detected - acceptable with monitoring');
    } else {
      recommendations.push('Interview shows good integrity - minimal concerns detected');
    }

    if (this.behaviorMetrics.multiplePersons > 0) {
      recommendations.push('Multiple persons detected - verify interview authenticity');
    }

    if (this.behaviorMetrics.tabSwitches > 3) {
      recommendations.push('Excessive tab switching detected - possible external assistance');
    }

    if (this.behaviorMetrics.phoneDetections > 0) {
      recommendations.push('Potential phone usage detected - verify compliance with interview rules');
    }

    return recommendations;
  }

  reset() {
    this.violations = [];
    this.behaviorMetrics = {
      faceDetections: 0,
      eyeContact: 0,
      headMovements: 0,
      suspiciousActivity: 0,
      tabSwitches: 0,
      windowBlurs: 0,
      multiplePersons: 0,
      lookAwayCount: 0,
      phoneDetections: 0
    };
    this.previousHeadPosition = null;
  }
}

// React Hook for Fraud Detection
export const useFraudDetection = () => {
  const [fraudSystem] = useState(() => new FraudDetectionSystem());
  const [fraudData, setFraudData] = useState(null);
  const [isDetectionActive, setIsDetectionActive] = useState(false);

  const startFraudDetection = useCallback((videoElement) => {
    setIsDetectionActive(true);
    fraudSystem.startDetection(videoElement, (data) => {
      setFraudData(data);
    });
  }, [fraudSystem]);

  const stopFraudDetection = useCallback(() => {
    setIsDetectionActive(false);
    fraudSystem.stopDetection();
  }, [fraudSystem]);

  const getFraudReport = useCallback(() => {
    return fraudSystem.generateReport();
  }, [fraudSystem]);

  const resetFraudDetection = useCallback(() => {
    fraudSystem.reset();
    setFraudData(null);
  }, [fraudSystem]);

  return {
    fraudData,
    isDetectionActive,
    startFraudDetection,
    stopFraudDetection,
    getFraudReport,
    resetFraudDetection
  };
};

export default FraudDetectionSystem;
