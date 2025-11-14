import express from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  generateCourseLayout,
  generateCourseContent,
  getUserCourses,
  getCourseById,
  deleteCourse
} from '../controllers/courseController.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Course generation routes
router.post('/generate-layout', generateCourseLayout);
router.post('/generate-content/:courseId', generateCourseContent);

// Course CRUD routes
router.get('/', getUserCourses);
router.get('/:courseId', getCourseById);
router.delete('/:courseId', deleteCourse);

export default router;
