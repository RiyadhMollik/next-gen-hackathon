import express from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  getJobMatches,
  postJobMatches,
  chatAboutJobs,
  jobMatchingHealth
} from '../controllers/jobMatchingController.js';

const router = express.Router();

// Public routes
router.get('/health', jobMatchingHealth);

// Protected routes
router.get('/matches', authenticate, getJobMatches);
router.post('/matches', authenticate, postJobMatches);
router.post('/chat', authenticate, chatAboutJobs);

export default router;
