# Load Balancer with Consistent Hashing

A Node.js load balancer that routes IP addresses to server nodes using consistent hashing. Same IP always goes to the same node.

## Features

- Consistent hashing for stable routing
- Health checks with automatic failover
- Weighted routing for server prioritization
- Rate limiting (10 requests/minute per IP)
- Real-time metrics tracking

## Setup
```bash
git clone https://github.com/ahsasnagar11/infollion-project.git
cd infollion-project
npm install
npm start
```

Server runs on `http://localhost:3000`

## Quick Test
```bash
npm run simulate
```

## API Endpoints
```bash
# Route an IP
curl -X POST http://localhost:3000/api/route \
  -H "Content-Type: application/json" \
  -d '{"ip":"192.168.1.100"}'

# Get all nodes
curl http://localhost:3000/api/nodes

# View metrics
curl http://localhost:3000/api/metrics

# Add node
curl -X POST http://localhost:3000/api/nodes \
  -H "Content-Type: application/json" \
  -d '{"id":"Node-D","weight":1}'

# Mark node unhealthy
curl -X PUT http://localhost:3000/api/nodes/Node-B/health \
  -H "Content-Type: application/json" \
  -d '{"healthy":false}'
```


## Tech Stack

Node.js, Express.js, Consistent Hashing (MD5)
