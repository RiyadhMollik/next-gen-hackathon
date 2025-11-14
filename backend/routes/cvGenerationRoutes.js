import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { generateAICV, saveAIEnhancements } from '../controllers/cvGenerationController.js';

const router = express.Router();

/**
 * @swagger
 * /cv-generation/generate-ai-cv:
 *   post:
 *     summary: Generate AI-enhanced CV
 *     description: Use AI to enhance and optimize user CV with professional formatting and ATS optimization
 *     tags: [CV Generation]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userData
 *             properties:
 *               userData:
 *                 type: object
 *                 properties:
 *                   personalInfo:
 *                     type: object
 *                     properties:
 *                       fullName:
 *                         type: string
 *                       email:
 *                         type: string
 *                       phone:
 *                         type: string
 *                       location:
 *                         type: string
 *                   workExperience:
 *                     type: array
 *                     items:
 *                       type: object
 *                   education:
 *                     type: array
 *                     items:
 *                       type: object
 *                   projects:
 *                     type: array
 *                     items:
 *                       type: object
 *                   skills:
 *                     type: array
 *                     items:
 *                       type: string
 *     responses:
 *       200:
 *         description: AI-enhanced CV generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 enhancedCV:
 *                   type: object
 *                 suggestions:
 *                   type: array
 */
router.post('/generate-ai-cv', authenticate, generateAICV);

/**
 * @swagger
 * /cv-generation/save-enhancements:
 *   post:
 *     summary: Save AI CV enhancements to user profile
 *     tags: [CV Generation]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               enhancements:
 *                 type: object
 *     responses:
 *       200:
 *         description: Enhancements saved successfully
 */
router.post('/save-enhancements', authenticate, saveAIEnhancements);

export default router;
