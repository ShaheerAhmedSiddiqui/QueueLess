
const { requireRole } = require('./roleMiddleware');

module.exports = (req, res, next) => {
  // Explicit demo preview mode
  if (process.env.NODE_ENV !== 'production' && req.query.preview === '1') {
    req.session.demoStudent = true;
    res.locals.demoMode = true;
    return next();
  }

  // Normal authenticated student mode
  req.session.demoStudent = false;
  res.locals.demoMode = false;

  return requireRole('student')(req, res, next);
};
