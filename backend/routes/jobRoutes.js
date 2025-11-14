import express from 'express';
import { getAllJobs, getJobById, createJob, updateJob, deleteJob } from '../controllers/jobController.js';
import { authenticate } from '../middleware/auth.js';
import { cacheMiddleware } from '../middleware/cache.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// @route   GET /api/jobs
// @desc    Get all jobs with filtering and pagination
// @access  Private
router.get('/', cacheMiddleware(600), getAllJobs);

// @route   GET /api/jobs/:id
// @desc    Get single job by ID
// @access  Private
router.get('/:id', getJobById);

// @route   POST /api/jobs
// @desc    Create a new job (admin)
// @access  Private
router.post('/', createJob);

// @route   PUT /api/jobs/:id
// @desc    Update a job
// @access  Private
router.put('/:id', updateJob);

// @route   DELETE /api/jobs/:id
// @desc    Delete a job
// @access  Private
router.delete('/:id', deleteJob);

export default router;
