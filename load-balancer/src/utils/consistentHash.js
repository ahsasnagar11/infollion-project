const crypto = require('crypto');

class ConsistentHash {
  constructor(nodes = [], replicas = 150) {
    this.replicas = replicas;
    this.ring = new Map();
    this.sortedKeys = [];
    this.nodes = new Map();
    
    nodes.forEach(node => this.addNode(node));
  }

  hash(key) {
    return crypto.createHash('md5').update(key).digest('hex');
  }

  hashToInt(hashStr) {
    return parseInt(hashStr.substring(0, 8), 16);
  }

  addNode(node) {
    const nodeId = node.id || node;
    this.nodes.set(nodeId, node);
    
    for (let i = 0; i < this.replicas; i++) {
      const hash = this.hash(`${nodeId}:${i}`);
      const hashInt = this.hashToInt(hash);
      this.ring.set(hashInt, nodeId);
    }
    
    this.sortedKeys = Array.from(this.ring.keys()).sort((a, b) => a - b);
  }

  removeNode(nodeId) {
    this.nodes.delete(nodeId);
    
    for (let i = 0; i < this.replicas; i++) {
      const hash = this.hash(`${nodeId}:${i}`);
      const hashInt = this.hashToInt(hash);
      this.ring.delete(hashInt);
    }
    
    this.sortedKeys = Array.from(this.ring.keys()).sort((a, b) => a - b);
  }

  getNode(key) {
    if (this.sortedKeys.length === 0) {
      return null;
    }

    const hash = this.hash(key);
    const hashInt = this.hashToInt(hash);

    for (let i = 0; i < this.sortedKeys.length; i++) {
      if (this.sortedKeys[i] >= hashInt) {
        return this.ring.get(this.sortedKeys[i]);
      }
    }

    return this.ring.get(this.sortedKeys[0]);
  }

  getAllNodes() {
    return Array.from(this.nodes.values());
  }

  getNodeDetails(nodeId) {
    return this.nodes.get(nodeId);
  }

  updateNodeHealth(nodeId, healthy) {
    const node = this.nodes.get(nodeId);
    if (node) {
      node.healthy = healthy;
    }
  }

  updateNodeWeight(nodeId, weight) {
    const node = this.nodes.get(nodeId);
    if (node) {
      node.weight = weight;
    }
  }
}

module.exports = ConsistentHash;