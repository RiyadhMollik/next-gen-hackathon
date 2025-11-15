import express from 'express';
import { getAllJobs, getJobById, createJob, updateJob, deleteJob, applyJob } from '../controllers/jobController.js';
import { authenticate } from '../middleware/auth.js';
import { cacheMiddleware } from '../middleware/cache.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * @swagger
 * /jobs:
 *   get:
 *     summary: Get all jobs with filtering and pagination
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [Full-time, Part-time, Contract, Internship]
 *         description: Filter by job type
 *       - in: query
 *         name: experienceLevel
 *         schema:
 *           type: string
 *         description: Filter by experience level
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Filter by location
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in job title and description
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *     responses:
 *       200:
 *         description: List of jobs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 25
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                 jobs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Job'
 */
router.get('/', cacheMiddleware(600), getAllJobs);

/**
 * @swagger
 * /jobs/{id}:
 *   get:
 *     summary: Get single job by ID
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Job ID
 *     responses:
 *       200:
 *         description: Job details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 job:
 *                   $ref: '#/components/schemas/Job'
 *       404:
 *         description: Job not found
 */
router.get('/:id', getJobById);

/**
 * @swagger
 * /jobs/{id}/apply:
 *   post:
 *     summary: Apply for a job
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Job ID
 *     responses:
 *       200:
 *         description: Application submitted successfully
 *       400:
 *         description: Already applied or invalid request
 *       404:
 *         description: Job not found
 */
router.post('/:id/apply', applyJob);

/**
 * @swagger
 * /jobs:
 *   post:
 *     summary: Create a new job posting
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - company
 *               - location
 *               - type
 *               - experienceLevel
 *             properties:
 *               title:
 *                 type: string
 *                 example: Full Stack Developer
 *               company:
 *                 type: string
 *                 example: Tech Corp
 *               location:
 *                 type: string
 *                 example: New York, NY
 *               type:
 *                 type: string
 *                 enum: [Full-time, Part-time, Contract, Internship]
 *               experienceLevel:
 *                 type: string
 *                 example: Mid-Level
 *               salary:
 *                 type: string
 *                 example: $80,000 - $120,000
 *               description:
 *                 type: string
 *               requirements:
 *                 type: array
 *                 items:
 *                   type: string
 *               requiredSkills:
 *                 type: array
 *                 items:
 *                   type: string
 *               responsibilities:
 *                 type: array
 *                 items:
 *                   type: string
 *               benefits:
 *                 type: array
 *                 items:
 *                   type: string
 *               applicationUrl:
 *                 type: string
 *     responses:
 *       201:
 *         description: Job created successfully
 *       400:
 *         description: Validation error
 */
router.post('/', createJob);

/**
 * @swagger
 * /jobs/{id}:
 *   put:
 *     summary: Update a job posting
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Job'
 *     responses:
 *       200:
 *         description: Job updated successfully
 *       404:
 *         description: Job not found
 */
router.put('/:id', updateJob);

/**
 * @swagger
 * /jobs/{id}:
 *   delete:
 *     summary: Delete a job posting
 *     tags: [Jobs]
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
 *         description: Job deleted successfully
 *       404:
 *         description: Job not found
 */
router.delete('/:id', deleteJob);

export default router;
