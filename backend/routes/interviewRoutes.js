import express from 'express';
import {
  generateInterviewQuestions,
  startInterview,
  submitAnswer,
  completeInterview,
  getInterviewById,
  getUserInterviews
} from '../controllers/interviewController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Generate interview questions
router.post('/generate', generateInterviewQuestions);

// Start interview session
router.put('/:interviewId/start', startInterview);

// Submit answer for a question
router.post('/:interviewId/answer', submitAnswer);

// Complete interview and get feedback
router.post('/:interviewId/complete', completeInterview);

// Get all user interviews
router.get('/', getUserInterviews);

// Get specific interview
router.get('/:interviewId', getInterviewById);

export default router;
