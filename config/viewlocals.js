module.exports = (req, res, next) => {
  res.locals.currentPath = req.path;
  res.locals.currentUser = req.session?.user || null;
  res.locals.flash = req.session?.flash || null;
  if (req.session) delete req.session.flash;
  next();
};
