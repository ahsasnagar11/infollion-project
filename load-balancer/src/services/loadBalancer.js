const ConsistentHash = require('../utils/consistentHash');
const { identifyNode } = require('../utils/logger');
const { nodes } = require('../config/nodes');

class LoadBalancer {
  constructor() {
    this.consistentHash = new ConsistentHash(nodes);
  }

  route(ip) {
    let selectedNode = this.consistentHash.getNode(ip);
    let nodeDetails = this.consistentHash.getNodeDetails(selectedNode);

    if (!nodeDetails || !nodeDetails.healthy) {
      const healthyNodes = this.consistentHash.getAllNodes().filter(n => n.healthy);
      
      if (healthyNodes.length === 0) {
        identifyNode(ip, 'NONE (All nodes unhealthy)');
        return null;
      }

      const weightedNodes = [];
      healthyNodes.forEach(node => {
        for (let i = 0; i < node.weight; i++) {
          weightedNodes.push(node.id);
        }
      });

      selectedNode = weightedNodes[Math.floor(Math.random() * weightedNodes.length)];
      nodeDetails = this.consistentHash.getNodeDetails(selectedNode);
    }

    identifyNode(ip, selectedNode);
    return selectedNode;
  }

  addNode(nodeId, weight = 1) {
    const node = { id: nodeId, weight, healthy: true };
    this.consistentHash.addNode(node);
    return node;
  }

  removeNode(nodeId) {
    this.consistentHash.removeNode(nodeId);
  }

  updateNodeHealth(nodeId, healthy) {
    this.consistentHash.updateNodeHealth(nodeId, healthy);
  }

  updateNodeWeight(nodeId, weight) {
    this.consistentHash.updateNodeWeight(nodeId, weight);
  }

  getNodes() {
    return this.consistentHash.getAllNodes();
  }

  getNodeDetails(nodeId) {
    return this.consistentHash.getNodeDetails(nodeId);
  }
}

module.exports = LoadBalancer;