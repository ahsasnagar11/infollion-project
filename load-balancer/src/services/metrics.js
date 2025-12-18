class Metrics {
  constructor() {
    this.requestCount = 0;
    this.nodeRequests = new Map();
    this.ipRequests = new Map();
    this.startTime = Date.now();
  }

  recordRequest(ip, node) {
    this.requestCount++;
    
    if (node) {
      this.nodeRequests.set(node, (this.nodeRequests.get(node) || 0) + 1);
    }
    
    this.ipRequests.set(ip, (this.ipRequests.get(ip) || 0) + 1);
  }

  getMetrics() {
    const uptime = Math.floor((Date.now() - this.startTime) / 1000);
    const nodeDistribution = {};
    
    this.nodeRequests.forEach((count, node) => {
      nodeDistribution[node] = {
        count,
        percentage: ((count / this.requestCount) * 100).toFixed(2)
      };
    });

    return {
      totalRequests: this.requestCount,
      uptimeSeconds: uptime,
      nodeDistribution,
      uniqueIPs: this.ipRequests.size
    };
  }

  reset() {
    this.requestCount = 0;
    this.nodeRequests.clear();
    this.ipRequests.clear();
    this.startTime = Date.now();
  }
}

module.exports = Metrics;