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

// Generate new roadmap
router.post('/generate', generateRoadmap);

// Get active roadmap
router.get('/active', getActiveRoadmap);

// Get all user roadmaps
router.get('/', getUserRoadmaps);

// Get specific roadmap
router.get('/:roadmapId', getRoadmapById);

// Update roadmap progress
router.put('/:roadmapId/progress', updateProgress);

// Delete roadmap
router.delete('/:roadmapId', deleteRoadmap);

export default router;
