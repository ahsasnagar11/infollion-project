const { generateRandomIP } = require('./src/utils/ipGenerator');
const LoadBalancer = require('./src/services/loadBalancer');

function simulateTraffic(requestCount = 10) {
  const loadBalancer = new LoadBalancer();
  
  console.log(`\nSimulating ${requestCount} requests...\n`);
  
  for (let i = 0; i < requestCount; i++) {
    const ip = generateRandomIP();
    loadBalancer.route(ip);
  }
  
  console.log('\nSimulation complete\n');
  
  console.log('Testing consistency - same IPs should route to same nodes:\n');
  const testIPs = ['192.168.1.1', '10.0.0.1', '172.16.0.1'];
  
  testIPs.forEach(ip => {
    console.log(`\nFirst routing for ${ip}:`);
    const node1 = loadBalancer.route(ip);
    
    console.log(`Second routing for ${ip}:`);
    const node2 = loadBalancer.route(ip);
    
    console.log(`Consistent: ${node1 === node2 ? 'YES' : 'NO'}\n`);
  });
}

simulateTraffic(10);