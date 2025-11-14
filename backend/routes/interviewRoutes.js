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

/**
 * @swagger
 * /interviews/generate:
 *   post:
 *     summary: Generate AI mock interview questions
 *     tags: [Interviews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - jobRole
 *               - experienceLevel
 *             properties:
 *               jobRole:
 *                 type: string
 *                 example: Frontend Developer
 *               experienceLevel:
 *                 type: string
 *                 example: Mid-Level
 *               focusAreas:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: [React, JavaScript, Problem Solving]
 *     responses:
 *       201:
 *         description: Interview session created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 interview:
 *                   $ref: '#/components/schemas/Interview'
 */
router.post('/generate', generateInterviewQuestions);

/**
 * @swagger
 * /interviews/{interviewId}/start:
 *   put:
 *     summary: Start interview session
 *     tags: [Interviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: interviewId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Interview session started
 */
router.put('/:interviewId/start', startInterview);

/**
 * @swagger
 * /interviews/{interviewId}/answer:
 *   post:
 *     summary: Submit answer to interview question
 *     tags: [Interviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: interviewId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - questionId
 *               - answer
 *             properties:
 *               questionId:
 *                 type: integer
 *                 example: 1
 *               answer:
 *                 type: string
 *                 example: My answer to the interview question...
 *     responses:
 *       200:
 *         description: Answer submitted and evaluated
 */
router.post('/:interviewId/answer', submitAnswer);

/**
 * @swagger
 * /interviews/{interviewId}/complete:
 *   post:
 *     summary: Complete interview and get AI feedback
 *     tags: [Interviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: interviewId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Interview completed with feedback
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 feedback:
 *                   type: object
 */
router.post('/:interviewId/complete', completeInterview);

/**
 * @swagger
 * /interviews:
 *   get:
 *     summary: Get all user interviews
 *     tags: [Interviews]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user interviews
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 interviews:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Interview'
 */
router.get('/', getUserInterviews);

/**
 * @swagger
 * /interviews/{interviewId}:
 *   get:
 *     summary: Get specific interview by ID
 *     tags: [Interviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: interviewId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Interview details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 interview:
 *                   $ref: '#/components/schemas/Interview'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get('/:interviewId', getInterviewById);

export default router;
