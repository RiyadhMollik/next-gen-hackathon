import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger.js';
import sequelize from './config/database.js';
import { connectRedis } from './config/redis.js';
import { errorHandler } from './middleware/errorHandler.js';
import { metricsMiddleware, getMetrics, getQuery, getQueryRange, getSeries, getLabels } from './middleware/metrics.js';

// Import models to initialize associations
import models from './models/index.js';

// Import routes (new controller-based structure)
import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import learningResourceRoutes from './routes/learningResourceRoutes.js';
import recommendationRoutes from './routes/recommendationRoutes.js';
import cvAnalysisRoutes from './routes/cvAnalysisRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import jobMatchingRoutes from './routes/jobMatchingRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import roadmapRoutes from './routes/roadmapRoutes.js';
import interviewRoutes from './routes/interviewRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import behaviorAnalysisRoutes from './routes/behaviorAnalysisRoutes.js';
import cacheRoutes from './routes/cacheRoutes.js';
import cvGenerationRoutes from './routes/cvGenerationRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'http://localhost:3000' // Grafana
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Metrics middleware (before routes)
app.use(metricsMiddleware);

// Metrics endpoint for Prometheus/Grafana
app.get('/metrics', getMetrics);

// Prometheus API compatibility endpoints
app.get('/api/v1/query', getQuery);
app.get('/api/v1/query_range', getQueryRange);
app.get('/api/v1/series', getSeries);
app.get('/api/v1/labels', getLabels);
app.get('/api/v1/label/:name/values', getLabels);

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'SDG 8 Career Platform API',
  customfavIcon: '/favicon.ico'
}));

// Swagger JSON endpoint
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/resources', learningResourceRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/cv-analysis', cvAnalysisRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/job-matching', jobMatchingRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/roadmaps', roadmapRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/behavior-analysis', behaviorAnalysisRoutes);
app.use('/api/cache', cacheRoutes);
app.use('/api/cv-generation', cvGenerationRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Error handler
app.use(errorHandler);

// Database connection and server start
const startServer = async () => {
  try {
    // Connect to MySQL
    await sequelize.authenticate();
    console.log('✓ MySQL Database connected');

    // Sync models (create tables if they don't exist)
    // Changed from alter: true to avoid index duplication errors
    // Use force: false to preserve existing data
    await sequelize.sync({ force: false });
    console.log('✓ Database models synced');

    // Connect to Redis (optional, app continues if Redis fails)
    await connectRedis();

    // Start server
    app.listen(PORT, () => {
      console.log(`\n🚀 Server running on port ${PORT}`);
      console.log(`📍 API URL: http://localhost:${PORT}`);
      console.log(`📍 Health check: http://localhost:${PORT}/health`);
      console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs\n`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
