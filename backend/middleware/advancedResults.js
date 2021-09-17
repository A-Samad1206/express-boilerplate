const advancedResults = (model, populate) => async (req, res, next) => {
  let query;

  // Copy req.query
  const reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ['select', 'sort', 'page', 'limit'];

  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);

  // Create query string
  let queryStr = JSON.stringify(reqQuery);

  // Create operators ($gt, $gte, etc)
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  // Finding resource
  query = model.find(JSON.parse(queryStr));

  // Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }
  // Populate fields
  if (populate) {
    query = query.populate(populate);
  }
  const results = await query;
  const totalCount = results.length;
  let temp = [];
  let pagination = null;
  if (req.query.page && req.query.limit) {
    const page = Number(req.query.page) || 1;

    let limit = Number(req.query.limit) || 20;

    if (limit > totalCount) limit = totalCount;

    const totalPage = Math.ceil(totalCount / limit);
    if (totalPage < page || page < 1 || req.query.limit < 0)
      return res.status(404).json({ data: null, msg: 'No records...' });

    let startIndex = (page - 1) * limit;
    temp = results.slice(startIndex, startIndex + limit);

    pagination = {};
    pagination = {
      prev: page > 1 ? page - 1 : null,
      crtPage: page,
      next: page < totalPage ? page + 1 : null,
      totalPage,
    };
  }
  let response = {
    totalCount,
    success: true,
    data: temp.length ? temp : results,
  };
  if (pagination) response.pagination = pagination;

  res.advancedResults = response;

  next();
};

module.exports = advancedResults;
