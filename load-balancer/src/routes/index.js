const express = require('express');
const router = express.Router();

function createRoutes(loadBalancer, metrics, healthCheck, rateLimit, rateLimiterMiddleware) {
  
  router.post('/route', rateLimiterMiddleware, (req, res) => {
    const { ip } = req.body;
    
    if (!ip) {
      return res.status(400).json({ error: 'IP address is required' });
    }

    const node = loadBalancer.route(ip);
    metrics.recordRequest(ip, node);

    res.json({
      ip,
      node,
      remaining: rateLimit.getRemainingRequests(ip)
    });
  });

  router.get('/nodes', (req, res) => {
    const nodes = loadBalancer.getNodes();
    res.json({ nodes });
  });

  router.post('/nodes', (req, res) => {
    const { id, weight } = req.body;
    
    if (!id) {
      return res.status(400).json({ error: 'Node ID is required' });
    }

    const node = loadBalancer.addNode(id, weight || 1);
    res.status(201).json({ node });
  });

  router.delete('/nodes/:id', (req, res) => {
    const { id } = req.params;
    loadBalancer.removeNode(id);
    res.json({ message: `Node ${id} removed` });
  });

  router.put('/nodes/:id/health', (req, res) => {
    const { id } = req.params;
    const { healthy } = req.body;
    
    if (typeof healthy !== 'boolean') {
      return res.status(400).json({ error: 'healthy field must be boolean' });
    }

    healthCheck.manualHealthCheck(id, healthy);
    res.json({ node: id, healthy });
  });

  router.put('/nodes/:id/weight', (req, res) => {
    const { id } = req.params;
    const { weight } = req.body;
    
    if (typeof weight !== 'number' || weight < 1) {
      return res.status(400).json({ error: 'weight must be a positive number' });
    }

    loadBalancer.updateNodeWeight(id, weight);
    res.json({ node: id, weight });
  });

  router.get('/metrics', (req, res) => {
    const metricsData = metrics.getMetrics();
    res.json(metricsData);
  });

  router.post('/metrics/reset', (req, res) => {
    metrics.reset();
    res.json({ message: 'Metrics reset successfully' });
  });

  return router;
}

module.exports = createRoutes;