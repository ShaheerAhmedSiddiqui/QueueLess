const notFound = (req, res) => {
  res.status(404).send('404 - Page not found');
};

const errorHandler = (err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).send('500 - Something went wrong');
};

module.exports = { notFound, errorHandler };