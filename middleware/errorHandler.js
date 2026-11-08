function notFound(req, res, next) {
  res.status(404).render('errors/404', { title: 'Page not found' });
}

function errorHandler(err, req, res, next) {
  console.error(err);
  const status = err.status || 500;
  res.status(status).render(status === 403 ? 'errors/403' : 'errors/500', {
    title: status === 403 ? 'Access denied' : 'Something went wrong'
  });
}

module.exports = { notFound, errorHandler };
