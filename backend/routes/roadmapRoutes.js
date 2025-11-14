import express from 'express';
import {
  generateRoadmap,
  getActiveRoadmap,
  getRoadmapById,
  updateProgress,
  getUserRoadmaps,
  deleteRoadmap
} from '../controllers/roadmapController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

/**
 * @swagger
 * /roadmaps/generate:
 *   post:
 *     summary: Generate personalized career roadmap
 *     tags: [Roadmaps]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - targetRole
 *               - timeframe
 *             properties:
 *               targetRole:
 *                 type: string
 *                 example: Full Stack Developer
 *               currentSkills:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: [JavaScript, HTML, CSS]
 *               timeframe:
 *                 type: string
 *                 example: 3 months
 *               weeklyHours:
 *                 type: integer
 *                 example: 10
 *     responses:
 *       201:
 *         description: Roadmap generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 roadmap:
 *                   $ref: '#/components/schemas/Roadmap'
 */
router.post('/generate', generateRoadmap);

/**
 * @swagger
 * /roadmaps/active:
 *   get:
 *     summary: Get user's active roadmap
 *     tags: [Roadmaps]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Active roadmap details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 roadmap:
 *                   $ref: '#/components/schemas/Roadmap'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get('/active', getActiveRoadmap);

/**
 * @swagger
 * /roadmaps:
 *   get:
 *     summary: Get all user roadmaps
 *     tags: [Roadmaps]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user roadmaps
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 roadmaps:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Roadmap'
 */
router.get('/', getUserRoadmaps);

/**
 * @swagger
 * /roadmaps/{roadmapId}:
 *   get:
 *     summary: Get specific roadmap by ID
 *     tags: [Roadmaps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roadmapId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Roadmap details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 roadmap:
 *                   $ref: '#/components/schemas/Roadmap'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *   delete:
 *     summary: Delete roadmap
 *     tags: [Roadmaps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roadmapId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Roadmap deleted successfully
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get('/:roadmapId', getRoadmapById);
router.delete('/:roadmapId', deleteRoadmap);

/**
 * @swagger
 * /roadmaps/{roadmapId}/progress:
 *   put:
 *     summary: Update roadmap progress
 *     tags: [Roadmaps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roadmapId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               progress:
 *                 type: object
 *                 example: { "phase_1": true, "phase_2": false }
 *     responses:
 *       200:
 *         description: Progress updated successfully
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.put('/:roadmapId/progress', updateProgress);

export default router;
