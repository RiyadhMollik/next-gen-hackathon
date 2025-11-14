import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

// Support both Redis Cloud URL and local Redis
const redisClient = process.env.REDIS_URL 
  ? createClient({
      url: process.env.REDIS_URL
    })
  : createClient({
      socket: {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379
      },
      password: process.env.REDIS_PASSWORD || undefined
    });

redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.on('connect', () => console.log('✓ Redis Client Connected'));

export const connectRedis = async () => {
  try {
    await redisClient.connect();
  } catch (error) {
    console.error('Failed to connect to Redis:', error.message);
    console.log('Application will continue without Redis caching');
  }
};

export default redisClient;
