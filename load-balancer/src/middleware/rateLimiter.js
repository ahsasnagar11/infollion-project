const { logRateLimit } = require('../utils/logger');

function rateLimiterMiddleware(rateLimitService) {
  return (req, res, next) => {
    const ip = req.body.ip || req.ip;
    
    if (!rateLimitService.isAllowed(ip)) {
      logRateLimit(ip);
      return res.status(429).json({
        error: 'Rate limit exceeded',
        ip,
        remaining: 0
      });
    }

    next();
  };
}

module.exports = rateLimiterMiddleware;