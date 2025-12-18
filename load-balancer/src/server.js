const express = require('express');
const LoadBalancer = require('./services/loadBalancer');
const Metrics = require('./services/metrics');
const HealthCheck = require('./services/healthCheck');
const RateLimit = require('./services/rateLimit');
const rateLimiterMiddleware = require('./middleware/rateLimiter');
const createRoutes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const loadBalancer = new LoadBalancer();
const metrics = new Metrics();
const healthCheck = new HealthCheck(loadBalancer);
const rateLimit = new RateLimit(10, 60000);

healthCheck.startHealthChecks(30000);

const routes = createRoutes(
  loadBalancer,
  metrics,
  healthCheck,
  rateLimit,
  rateLimiterMiddleware(rateLimit)
);

app.use('/api', routes);

app.get('/', (req, res) => {
  res.json({
    message: 'Load Balancer API',
    endpoints: {
      route: 'POST /api/route',
      nodes: 'GET /api/nodes',
      addNode: 'POST /api/nodes',
      removeNode: 'DELETE /api/nodes/:id',
      updateHealth: 'PUT /api/nodes/:id/health',
      updateWeight: 'PUT /api/nodes/:id/weight',
      metrics: 'GET /api/metrics',
      resetMetrics: 'POST /api/metrics/reset'
    }
  });
});

app.listen(PORT, () => {
  console.log(`Load Balancer running on port ${PORT}`);
  console.log(`Access API at http://localhost:${PORT}`);
});

process.on('SIGINT', () => {
  healthCheck.stopHealthChecks();
  process.exit();
});