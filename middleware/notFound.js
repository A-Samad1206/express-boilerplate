const notFound = (req, res, next) => {
  const error = new Error(
    `Not Found - ${req.protocol}://${req.get('host')}${req.originalUrl}`
  );
  res.status(404);
  next(error);
};
module.exports = notFound;
