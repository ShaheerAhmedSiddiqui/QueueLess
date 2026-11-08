exports.requireRole = (...roles) => (req, res, next) => {
  if (!req.session.user || !roles.includes(req.session.user.role))
    return res.status(403).send('403 - You are not allowed to view this page.');
  next();
};