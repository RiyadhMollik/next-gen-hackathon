import express from 'express';
import multer from 'multer';
import { analyzePDF, analyzeText } from '../controllers/cvAnalysisController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Configure multer for file upload (memory storage for PDF parsing)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  }
});

// All routes require authentication
router.use(authenticate);

// @route   POST /api/cv-analysis/upload-pdf
// @desc    Upload and analyze PDF CV
// @access  Private
router.post('/upload-pdf', upload.single('pdf'), analyzePDF);

// @route   POST /api/cv-analysis/analyze-text
// @desc    Analyze CV text
// @access  Private
router.post('/analyze-text', analyzeText);

export default router;
