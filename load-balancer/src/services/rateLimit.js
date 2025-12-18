class RateLimit {
  constructor(maxRequests = 10, windowMs = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requests = new Map();
  }

  isAllowed(ip) {
    const now = Date.now();
    const ipData = this.requests.get(ip) || { count: 0, resetTime: now + this.windowMs };

    if (now > ipData.resetTime) {
      ipData.count = 1;
      ipData.resetTime = now + this.windowMs;
      this.requests.set(ip, ipData);
      return true;
    }

    if (ipData.count >= this.maxRequests) {
      return false;
    }

    ipData.count++;
    this.requests.set(ip, ipData);
    return true;
  }

  getRemainingRequests(ip) {
    const ipData = this.requests.get(ip);
    if (!ipData) return this.maxRequests;
    
    const now = Date.now();
    if (now > ipData.resetTime) return this.maxRequests;
    
    return Math.max(0, this.maxRequests - ipData.count);
  }

  reset(ip) {
    if (ip) {
      this.requests.delete(ip);
    } else {
      this.requests.clear();
    }
  }
}

module.exports = RateLimit;