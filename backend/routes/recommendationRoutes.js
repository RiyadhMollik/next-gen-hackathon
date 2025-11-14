import express from 'express';
import { getJobRecommendations, getResourceRecommendations, getDashboardRecommendations } from '../controllers/recommendationController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// @route   GET /api/recommendations/jobs
// @desc    Get personalized job recommendations
// @access  Private
router.get('/jobs', getJobRecommendations);

// @route   GET /api/recommendations/resources
// @desc    Get personalized learning resource recommendations
// @access  Private
router.get('/resources', getResourceRecommendations);

// @route   GET /api/recommendations/dashboard
// @desc    Get dashboard recommendations (jobs + resources)
// @access  Private
router.get('/dashboard', getDashboardRecommendations);

export default router;
