import redisClient from '../config/redis.js';
import { cacheHits, cacheMisses, cacheResponseTime } from './metrics.js';

export const cacheMiddleware = (duration = 300, keyPrefix = 'cache') => {
  return async (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    if (!redisClient.isOpen) {
      return next();
    }

    const key = `${keyPrefix}:${req.originalUrl}`;
    const startTime = Date.now();

    try {
      const cachedData = await redisClient.get(key);
      
      if (cachedData) {
        // Cache HIT
        const responseTime = (Date.now() - startTime) / 1000;
        cacheHits.inc({ cache_key: keyPrefix });
        cacheResponseTime.observe(
          { endpoint: req.path, cache_status: 'hit' },
          responseTime
        );
        console.log(`✓ Cache HIT: ${key} (${responseTime.toFixed(3)}s)`);
        return res.json(JSON.parse(cachedData));
      }

      // Cache MISS - Store original send function
      const originalSend = res.json.bind(res);
      
      // Override send function
      res.json = (data) => {
        const responseTime = (Date.now() - startTime) / 1000;
        cacheMisses.inc({ cache_key: keyPrefix });
        cacheResponseTime.observe(
          { endpoint: req.path, cache_status: 'miss' },
          responseTime
        );

        // Cache the response
        redisClient.set(key, JSON.stringify(data), { EX: duration }).catch(err => {
          console.error('Redis cache error:', err);
        });
        
        console.log(`✗ Cache MISS: ${key} (${responseTime.toFixed(3)}s) - Cached for ${duration}s`);
        // Send the response
        return originalSend(data);
      };

      next();
    } catch (error) {
      console.error('Cache middleware error:', error);
      next();
    }
  };
};

export const clearCache = async (pattern = '*') => {
  if (!redisClient.isOpen) {
    return { success: false, message: 'Redis not connected' };
  }

  try {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(keys);
      return { success: true, message: `Cleared ${keys.length} cache entries`, count: keys.length };
    }
    return { success: true, message: 'No cache entries found', count: 0 };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

/**
 * Get cache statistics
 */
export const getCacheStats = async () => {
  try {
    if (!redisClient.isOpen) {
      return { connected: false, keys: 0 };
    }

    const keys = await redisClient.keys('*');
    const keysByPrefix = {};
    
    // Group by prefix
    keys.forEach(key => {
      const prefix = key.split(':')[0];
      keysByPrefix[prefix] = (keysByPrefix[prefix] || 0) + 1;
    });

    return {
      connected: true,
      totalKeys: keys.length,
      keysByPrefix
    };
  } catch (error) {
    return { connected: false, error: error.message };
  }
};

export default cacheMiddleware;
