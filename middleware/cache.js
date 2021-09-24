const NodeCache = require('Node-Cache');

const cache = new NodeCache();

module.exports = (duration) => (req, res, next) => {
  // Not cache parameterised url.
  // if (Object.keys(req.query).length !== 0) return next();

  if (req.method !== 'GET') return next();
  const key = req.originalUrl;

  const cacheResponse = cache.get(key);
  if (cacheResponse) return res.send(cacheResponse);
  else {
    res.originalSend = res.send;
    res.send = (body) => {
      res.originalSend(body);
      cache.set(key, body, duration);
    };
  }
  next();
};
