const ActivityLog = require('../models/ActivityLog');

const activityLogger = async (req, res, next) => {
  // Store the original json method
  const originalJson = res.json.bind(res);

  res.json = function (body) {
    // Only log on successful mutating requests
    const mutatingMethods = ['POST', 'PUT', 'PATCH', 'DELETE'];
    if (
      mutatingMethods.includes(req.method) &&
      req.user &&
      req.activityMessage &&
      res.statusCode >= 200 &&
      res.statusCode < 300
    ) {
      // Fire and forget — don't await to avoid slowing the response
      ActivityLog.create({
        user: req.user._id || req.user.id,
        action: req.activityMessage,
        ip: req.ip || req.socket?.remoteAddress || 'Unknown',
        timestamp: new Date(),
      }).catch((err) => console.error('Activity log error:', err.message));
    }

    return originalJson(body);
  };

  next();
};

module.exports = activityLogger;
