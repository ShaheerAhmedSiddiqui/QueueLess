const { requireRole } = require('./roleMiddleware');

// Preview mode is available only in development and must be explicitly requested.
// Production always requires an authenticated student session.
module.exports = (req, res, next) => {
  if (process.env.NODE_ENV !== 'production' && req.query.preview === '1') {
    req.session.demoStudent = true;
    res.locals.demoMode = true;
    return next();
  }
  return requireRole('student')(req, res, next);
};
