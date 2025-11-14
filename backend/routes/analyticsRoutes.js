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

/**
 * @swagger
 * /analytics/sdg-impact:
 *   get:
 *     summary: Get SDG 8 impact analytics
 *     description: Platform analytics showing contribution to SDG 8 (Decent Work and Economic Growth)
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: SDG impact metrics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 analytics:
 *                   type: object
 *                   properties:
 *                     overview:
 *                       type: object
 *                       properties:
 *                         totalUsers:
 *                           type: integer
 *                         jobsCreated:
 *                           type: integer
 *                         skillsDeveloped:
 *                           type: integer
 *                         coursesCompleted:
 *                           type: integer
 *                     skillsDemand:
 *                       type: array
 *                     skillGaps:
 *                       type: array
 *       403:
 *         description: Unauthorized - admin access required
 */
router.get('/sdg-impact', getSDGImpactAnalytics);

/**
 * @swagger
 * /analytics/user-growth:
 *   get:
 *     summary: Get user growth statistics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User growth metrics over time
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 stats:
 *                   type: object
 */
router.get('/user-growth', getUserGrowthStats);

/**
 * @swagger
 * /analytics/job-trends:
 *   get:
 *     summary: Get job market trends
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Job market trends and analytics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 trends:
 *                   type: object
 */
router.get('/job-trends', getJobTrends);

/**
 * @swagger
 * /analytics/interview-performance:
 *   get:
 *     summary: Get interview performance analytics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Interview performance metrics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 performance:
 *                   type: object
 */
router.get('/interview-performance', getInterviewPerformance);

export default router;
