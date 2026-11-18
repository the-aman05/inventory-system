const mongoose = require('mongoose');

module.exports = (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    const err = new Error('Invalid product ID');
    err.statusCode = 400;
    return next(err);
  }
  next();
};
