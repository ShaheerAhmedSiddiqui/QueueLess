exports.requireRole = (...roles) => (req, res, next) => {
  const userRole = String(req.session.user?.role || '').toLowerCase();
  const allowedRoles = roles.map(role => String(role).toLowerCase());

  if (!req.session.user || !allowedRoles.includes(userRole)) {
    return res.status(403).send('403 - You are not allowed to view this page.');
  }

  next();
};