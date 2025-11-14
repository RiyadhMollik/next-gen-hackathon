import express from 'express';
import { chatWithBot, chatbotHealth } from '../controllers/chatController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/chat/health
// @desc    Check chatbot service health
// @access  Public
router.get('/health', chatbotHealth);

// @route   POST /api/chat
// @desc    Send message to chatbot (proxied to Python server)
// @access  Private
router.post('/', authenticate, chatWithBot);

export default router;
