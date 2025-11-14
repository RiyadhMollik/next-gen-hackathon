import express from 'express';
import { getJobRecommendations, getResourceRecommendations, getDashboardRecommendations } from '../controllers/recommendationController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * @swagger
 * /recommendations/jobs:
 *   get:
 *     summary: Get personalized job recommendations
 *     tags: [Recommendations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: AI-generated job recommendations based on user profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 jobs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Job'
 */
router.get('/jobs', getJobRecommendations);

/**
 * @swagger
 * /recommendations/resources:
 *   get:
 *     summary: Get personalized learning resource recommendations
 *     tags: [Recommendations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: AI-generated learning resource recommendations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 resources:
 *                   type: array
 */
router.get('/resources', getResourceRecommendations);

/**
 * @swagger
 * /recommendations/dashboard:
 *   get:
 *     summary: Get comprehensive dashboard recommendations
 *     tags: [Recommendations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data with AI recommendations (jobs, resources, skills)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 stats:
 *                   type: object
 *                   properties:
 *                     coursesCompleted:
 *                       type: integer
 *                     interviewsCompleted:
 *                       type: integer
 *                     skillsLearned:
 *                       type: integer
 *                     roadmapProgress:
 *                       type: integer
 *                 recommendedJobs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Job'
 *                 recommendedResources:
 *                   type: array
 *                 skills:
 *                   type: array
 */
router.get('/dashboard', getDashboardRecommendations);

export default router;
