import express from 'express';
import { getProfile, updateProfile, addSkill, deleteSkill } from '../controllers/profileController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * @swagger
 * /profile/me:
 *   get:
 *     summary: Get current user profile with skills
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile with skills
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 skills:
 *                   type: array
 *   put:
 *     summary: Update current user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               educationLevel:
 *                 type: string
 *               department:
 *                 type: string
 *               experienceLevel:
 *                 type: string
 *               preferredCareerTrack:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 */
router.get('/me', getProfile);
router.put('/me', updateProfile);

/**
 * @swagger
 * /profile:
 *   get:
 *     summary: Get user profile (alias)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 *   put:
 *     summary: Update user profile (alias)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               educationLevel:
 *                 type: string
 *               department:
 *                 type: string
 *               experienceLevel:
 *                 type: string
 *               preferredCareerTrack:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated
 */
router.get('/', getProfile);
router.put('/', updateProfile);

/**
 * @swagger
 * /profile/skills:
 *   post:
 *     summary: Add a skill to user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - skillName
 *               - proficiencyLevel
 *             properties:
 *               skillName:
 *                 type: string
 *                 example: React
 *               proficiencyLevel:
 *                 type: string
 *                 enum: [Beginner, Intermediate, Advanced, Expert]
 *                 example: Intermediate
 *     responses:
 *       201:
 *         description: Skill added successfully
 */
router.post('/skills', addSkill);

/**
 * @swagger
 * /profile/skills/{id}:
 *   delete:
 *     summary: Delete a skill from user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Skill deleted successfully
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.delete('/skills/:id', deleteSkill);

export default router;
