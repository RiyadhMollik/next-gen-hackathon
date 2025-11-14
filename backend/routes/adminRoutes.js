import express from 'express';
import {
  getAllJobs,
  createJob,
  updateJob,
  deleteJob,
  getAllResources,
  createResource,
  updateResource,
  deleteResource,
  getAllUsers,
  getDashboardStats
} from '../controllers/adminController.js';
import { authMiddleware } from '../middleware/auth.js';
import { isAdmin } from '../middleware/adminMiddleware.js';

const router = express.Router();

// All routes require authentication and admin privileges
router.use(authMiddleware);
router.use(isAdmin);

// Dashboard stats
router.get('/stats', getDashboardStats);

// Job management
router.get('/jobs', getAllJobs);
router.post('/jobs', createJob);
router.put('/jobs/:jobId', updateJob);
router.delete('/jobs/:jobId', deleteJob);

// Resource management
router.get('/resources', getAllResources);
router.post('/resources', createResource);
router.put('/resources/:resourceId', updateResource);
router.delete('/resources/:resourceId', deleteResource);

// User management
router.get('/users', getAllUsers);

export default router;
