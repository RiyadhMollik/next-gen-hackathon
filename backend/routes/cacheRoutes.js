import express from 'express';
import { clearCache, getCacheStats } from '../middleware/cache.js';
import { authMiddleware } from '../middleware/auth.js';
import { isAdmin } from '../middleware/adminMiddleware.js';

const router = express.Router();

// Get cache statistics
router.get('/cache/stats', authMiddleware, isAdmin, async (req, res) => {
  try {
    const stats = await getCacheStats();
    res.json({
      success: true,
      stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get cache stats',
      error: error.message
    });
  }
});

// Clear cache
router.delete('/cache/clear', authMiddleware, isAdmin, async (req, res) => {
  try {
    const { pattern = '*' } = req.query;
    const result = await clearCache(pattern);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to clear cache',
      error: error.message
    });
  }
});

export default router;
