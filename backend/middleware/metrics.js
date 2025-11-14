import client from 'prom-client';

// Create a Registry to register metrics
const register = new client.Registry();

// Add default metrics (CPU, memory, etc.)
client.collectDefaultMetrics({ register });

// Custom metrics for the application
export const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 2, 5]
});

export const httpRequestTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});

export const activeUsers = new client.Gauge({
  name: 'active_users_total',
  help: 'Total number of active users'
});

export const jobsPosted = new client.Counter({
  name: 'jobs_posted_total',
  help: 'Total number of jobs posted'
});

export const cvAnalyses = new client.Counter({
  name: 'cv_analyses_total',
  help: 'Total number of CV analyses performed'
});

export const interviewsConducted = new client.Counter({
  name: 'interviews_conducted_total',
  help: 'Total number of mock interviews conducted'
});

export const coursesCreated = new client.Counter({
  name: 'courses_created_total',
  help: 'Total number of AI-generated courses created'
});

// Cache metrics
export const cacheHits = new client.Counter({
  name: 'cache_hits_total',
  help: 'Total number of cache hits',
  labelNames: ['cache_key']
});

export const cacheMisses = new client.Counter({
  name: 'cache_misses_total',
  help: 'Total number of cache misses',
  labelNames: ['cache_key']
});

export const cacheResponseTime = new client.Histogram({
  name: 'cache_response_time_seconds',
  help: 'Response time with cache',
  labelNames: ['endpoint', 'cache_status'],
  buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1]
});

export const dbResponseTime = new client.Histogram({
  name: 'db_response_time_seconds',
  help: 'Database query response time',
  labelNames: ['query_type'],
  buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5]
});

// Register custom metrics
register.registerMetric(httpRequestDuration);
register.registerMetric(httpRequestTotal);
register.registerMetric(activeUsers);
register.registerMetric(jobsPosted);
register.registerMetric(cvAnalyses);
register.registerMetric(interviewsConducted);
register.registerMetric(coursesCreated);
register.registerMetric(cacheHits);
register.registerMetric(cacheMisses);
register.registerMetric(cacheResponseTime);
register.registerMetric(dbResponseTime);

// Middleware to track HTTP requests
export const metricsMiddleware = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    const route = req.route?.path || req.path;
    
    httpRequestDuration.observe(
      { method: req.method, route, status_code: res.statusCode },
      duration
    );
    
    httpRequestTotal.inc({
      method: req.method,
      route,
      status_code: res.statusCode
    });
  });
  
  next();
};

// Metrics endpoint handler
export const getMetrics = async (req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    const metrics = await register.metrics();
    res.end(metrics);
  } catch (error) {
    res.status(500).end(error.message);
  }
};

// Prometheus API compatibility endpoints
export const getQuery = async (req, res) => {
  res.json({ status: 'success', data: { resultType: 'vector', result: [] } });
};

export const getQueryRange = async (req, res) => {
  res.json({ status: 'success', data: { resultType: 'matrix', result: [] } });
};

export const getSeries = async (req, res) => {
  res.json({ status: 'success', data: [] });
};

export const getLabels = async (req, res) => {
  res.json({ status: 'success', data: [] });
};

export default register;
