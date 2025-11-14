import express from 'express';
const router = express.Router();
import { authMiddleware } from '../middleware/auth.js';
import {
  analyzeBehaviorFrame,
  getInterviewBehaviorReport
} from '../controllers/behaviorAnalysisController.js';

// Analyze video frame for behavior patterns
router.post('/analyze-frame', authMiddleware, analyzeBehaviorFrame);

// Get behavior analysis report for an interview
router.get('/report/:interviewId', authMiddleware, getInterviewBehaviorReport);

export default router;
