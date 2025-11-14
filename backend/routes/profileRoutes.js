import express from 'express';
import { getProfile, updateProfile, addSkill, deleteSkill } from '../controllers/profileController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// @route   GET /api/profile/me
// @desc    Get current user profile with skills
// @access  Private
router.get('/me', getProfile);

// @route   PUT /api/profile/me
// @desc    Update current user profile
// @access  Private
router.put('/me', updateProfile);

// @route   GET /api/profile
// @desc    Get user profile with skills (alias)
// @access  Private
router.get('/', getProfile);

// @route   PUT /api/profile
// @desc    Update user profile (alias)
// @access  Private
router.put('/', updateProfile);

// @route   POST /api/profile/skills
// @desc    Add a skill to user profile
// @access  Private
router.post('/skills', addSkill);

// @route   DELETE /api/profile/skills/:id
// @desc    Delete a skill from user profile
// @access  Private
router.delete('/skills/:id', deleteSkill);

export default router;
