module.exports = (req, res, next) => {
  res.locals.currentUser = (req.session && req.session.user) || null;
  res.locals.currentPath = req.path;
  res.locals.title = 'QueueLess';
  res.locals.messages = [];
  next();
};