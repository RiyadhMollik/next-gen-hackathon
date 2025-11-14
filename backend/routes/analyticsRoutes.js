import express from 'express';
import {
  getSDGImpactAnalytics,
  getUserGrowthStats,
  getJobTrends,
  getInterviewPerformance
} from '../controllers/analyticsController.js';
import { authMiddleware } from '../middleware/auth.js';
import { isAdmin } from '../middleware/adminMiddleware.js';

const router = express.Router();

// All routes require authentication and admin privileges
router.use(authMiddleware);
router.use(isAdmin);

// Analytics routes
router.get('/sdg-impact', getSDGImpactAnalytics);
router.get('/user-growth', getUserGrowthStats);
router.get('/job-trends', getJobTrends);
router.get('/interview-performance', getInterviewPerformance);

export default router;
