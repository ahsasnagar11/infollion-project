function identifyNode(ip, selectedNode) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] Incoming IP: ${ip} → Routed to: ${selectedNode}`);
}

function logNodeChange(action, nodeId) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] Node ${action}: ${nodeId}`);
}

function logHealthChange(nodeId, status) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] Node ${nodeId} health: ${status ? 'HEALTHY' : 'UNHEALTHY'}`);
}

function logRateLimit(ip) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] Rate limit exceeded for IP: ${ip}`);
}

module.exports = { identifyNode, logNodeChange, logHealthChange, logRateLimit };