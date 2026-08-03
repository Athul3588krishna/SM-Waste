/**
 * Basic Memory Rate Limiter Middleware for Auth Endpoints
 */

const requestCounts = new Map();

const rateLimiter = (options = { windowMs: 15 * 60 * 1000, max: 100 }) => {
  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    const now = Date.now();

    if (!requestCounts.has(ip)) {
      requestCounts.set(ip, { count: 1, resetTime: now + options.windowMs });
      return next();
    }

    const record = requestCounts.get(ip);
    if (now > record.resetTime) {
      record.count = 1;
      record.resetTime = now + options.windowMs;
      return next();
    }

    record.count += 1;
    if (record.count > options.max) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests from this IP, please try again later.',
      });
    }

    next();
  };
};

module.exports = rateLimiter;
