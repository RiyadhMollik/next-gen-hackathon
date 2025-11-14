import { useState, useRef, useCallback } from 'react';
import api from '../utils/api';

class BehaviorAnalysisSystem {
  constructor() {
    this.analysisInterval = null;
    this.frameCaptures = [];
    this.behaviorPatterns = {
      attentionScore: 100,
      engagementLevel: 'high',
      suspiciousActivities: [],
      emotionalState: 'neutral',
      confidenceLevel: 'medium'
    };
    this.isAnalyzing = false;
  }

  startAnalysis(videoElement, analysisCallback) {
    this.isAnalyzing = true;
    this.analysisCallback = analysisCallback;
    
    console.log('🎯 Behavioral Analysis Started');
    
    // Send initial default data immediately
    setTimeout(() => {
      if (this.analysisCallback) {
        this.processBehaviorAnalysis({
          attentionScore: 85,
          engagementLevel: 'high',
          emotionalState: 'focused',
          confidenceLevel: 'medium',
          eyeContact: 'good',
          bodyLanguage: 'neutral',
          suspiciousActivities: [],
          technicalQuality: {
            lighting: 'good',
            cameraAngle: 'good',
            backgroundQuality: 'professional'
          },
          overallAssessment: 'good',
          recommendations: ['Interview starting - maintain natural behavior'],
          violations: []
        });
      }
    }, 1000);
    
    // Capture frames every 5 seconds for OpenAI Vision analysis
    this.analysisInterval = setInterval(() => {
      if (this.isAnalyzing && videoElement) {
        this.captureAndAnalyzeFrame(videoElement);
      }
    }, 5000);
  }

  stopAnalysis() {
    this.isAnalyzing = false;
    if (this.analysisInterval) {
      clearInterval(this.analysisInterval);
      this.analysisInterval = null;
    }
  }

  captureAndAnalyzeFrame(videoElement) {
    try {
      // Create canvas to capture video frame
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;
      
      // Draw current frame
      ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
      
      // Convert to base64
      const frameData = canvas.toDataURL('image/jpeg', 0.8);
      
      // Analyze with OpenAI Vision
      this.analyzeFrameWithOpenAI(frameData);
      
    } catch (error) {
      console.error('Error capturing video frame:', error);
    }
  }

  async analyzeFrameWithOpenAI(frameData) {
    try {
      const response = await api.post('/behavior-analysis/analyze-frame', {
        image: frameData,
        timestamp: new Date().toISOString()
      });

      if (response.data.analysis) {
        this.processBehaviorAnalysis(response.data.analysis);
      }
    } catch (error) {
      console.error('Error analyzing frame with OpenAI:', error);
    }
  }

  processBehaviorAnalysis(analysis) {
    // Update behavior patterns based on AI analysis
    this.behaviorPatterns = {
      ...this.behaviorPatterns,
      ...analysis,
      timestamp: new Date().toISOString()
    };

    // Notify callback with updated analysis
    if (this.analysisCallback) {
      this.analysisCallback(this.behaviorPatterns);
    }
  }

  getBehaviorReport() {
    return {
      ...this.behaviorPatterns,
      framesCaptured: this.frameCaptures.length,
      analysisDate: new Date().toISOString()
    };
  }

  reset() {
    this.frameCaptures = [];
    this.behaviorPatterns = {
      attentionScore: 100,
      engagementLevel: 'high',
      suspiciousActivities: [],
      emotionalState: 'neutral',
      confidenceLevel: 'medium'
    };
  }
}

// React Hook for Behavior Analysis
export const useBehaviorAnalysis = () => {
  const [behaviorSystem] = useState(() => new BehaviorAnalysisSystem());
  const [behaviorData, setBehaviorData] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const startBehaviorAnalysis = useCallback((videoElement) => {
    setIsAnalyzing(true);
    behaviorSystem.startAnalysis(videoElement, (analysis) => {
      setBehaviorData(analysis);
    });
  }, [behaviorSystem]);

  const stopBehaviorAnalysis = useCallback(() => {
    setIsAnalyzing(false);
    behaviorSystem.stopAnalysis();
  }, [behaviorSystem]);

  const getBehaviorReport = useCallback(() => {
    return behaviorSystem.getBehaviorReport();
  }, [behaviorSystem]);

  const resetBehaviorAnalysis = useCallback(() => {
    behaviorSystem.reset();
    setBehaviorData(null);
  }, [behaviorSystem]);

  return {
    behaviorData,
    isAnalyzing,
    startBehaviorAnalysis,
    stopBehaviorAnalysis,
    getBehaviorReport,
    resetBehaviorAnalysis
  };
};

export default BehaviorAnalysisSystem;
