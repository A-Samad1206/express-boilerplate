const responseTime =
  (parentUrl = '') =>
  (req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
      const end = Date.now();
      const diff = (end - start) / 1000;
      console.log(
        `${req.method} ${parentUrl}${req.url} Completed in ${diff} seconds`
      );
    });
    next();
  };

module.exports = responseTime;
