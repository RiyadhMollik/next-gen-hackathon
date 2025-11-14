import express from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  generateCourseLayout,
  generateCourseContent,
  getUserCourses,
  getCourseById,
  deleteCourse,
  updateCompletedChapters
} from '../controllers/courseController.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * @swagger
 * /courses/generate-layout:
 *   post:
 *     summary: Generate AI-powered course layout
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - targetSkill
 *               - difficulty
 *             properties:
 *               targetSkill:
 *                 type: string
 *                 example: JavaScript
 *               difficulty:
 *                 type: string
 *                 enum: [Beginner, Intermediate, Advanced]
 *                 example: Beginner
 *               estimatedDuration:
 *                 type: string
 *                 example: 4 weeks
 *     responses:
 *       201:
 *         description: Course layout generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 course:
 *                   $ref: '#/components/schemas/Course'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.post('/generate-layout', generateCourseLayout);

/**
 * @swagger
 * /courses/generate-content/{courseId}:
 *   post:
 *     summary: Generate detailed content for a course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Course ID
 *     responses:
 *       200:
 *         description: Course content generated successfully
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.post('/generate-content/:courseId', generateCourseContent);

/**
 * @swagger
 * /courses:
 *   get:
 *     summary: Get all user courses
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user courses
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 courses:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Course'
 */
router.get('/', getUserCourses);

/**
 * @swagger
 * /courses/{courseId}:
 *   get:
 *     summary: Get course by ID
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Course details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 course:
 *                   $ref: '#/components/schemas/Course'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *   delete:
 *     summary: Delete a course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Course deleted successfully
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get('/:courseId', getCourseById);
router.delete('/:courseId', deleteCourse);

/**
 * @swagger
 * /courses/{courseId}/progress:
 *   put:
 *     summary: Update course progress
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
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
 *               completedChapters:
 *                 type: array
 *                 items:
 *                   type: number
 *                 example: [1, 2, 3]
 *     responses:
 *       200:
 *         description: Progress updated successfully
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.put('/:courseId/progress', updateCompletedChapters);

export default router;
