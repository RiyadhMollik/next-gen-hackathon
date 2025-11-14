import express from 'express';
import { getAllResources, getResourceById, createResource, updateResource, deleteResource } from '../controllers/learningResourceController.js';
import { authenticate } from '../middleware/auth.js';
import { cacheMiddleware } from '../middleware/cache.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// @route   GET /api/learning-resources
// @desc    Get all learning resources with filtering and pagination
// @access  Private
router.get('/', cacheMiddleware(600), getAllResources);

// @route   GET /api/learning-resources/:id
// @desc    Get single learning resource by ID
// @access  Private
router.get('/:id', getResourceById);

// @route   POST /api/learning-resources
// @desc    Create a new learning resource
// @access  Private
router.post('/', createResource);

// @route   PUT /api/learning-resources/:id
// @desc    Update a learning resource
// @access  Private
router.put('/:id', updateResource);

// @route   DELETE /api/learning-resources/:id
// @desc    Delete a learning resource
// @access  Private
router.delete('/:id', deleteResource);

export default router;
