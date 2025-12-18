const { logHealthChange } = require('../utils/logger');

class HealthCheck {
  constructor(loadBalancer) {
    this.loadBalancer = loadBalancer;
    this.checkInterval = null;
  }

  startHealthChecks(intervalMs = 30000) {
    this.checkInterval = setInterval(() => {
      this.performHealthCheck();
    }, intervalMs);
  }

  stopHealthChecks() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  performHealthCheck() {
    const nodes = this.loadBalancer.getNodes();
    
    nodes.forEach(node => {
      const isHealthy = Math.random() > 0.1;
      
      if (node.healthy !== isHealthy) {
        this.loadBalancer.updateNodeHealth(node.id, isHealthy);
        logHealthChange(node.id, isHealthy);
      }
    });
  }

  manualHealthCheck(nodeId, healthy) {
    this.loadBalancer.updateNodeHealth(nodeId, healthy);
    logHealthChange(nodeId, healthy);
  }
}

module.exports = HealthCheck;