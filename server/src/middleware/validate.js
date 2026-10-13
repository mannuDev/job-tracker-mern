const { validationResult } = require('express-validator');

// Runs after a chain of express-validator rules; responds 422 with field errors.
module.exports = (req, res, next) => {
  const result = validationResult(req);
  if (result.isEmpty()) return next();

  const errors = {};
  result.array().forEach((e) => {
    if (!errors[e.path]) errors[e.path] = e.msg;
  });
  return res.status(422).json({ message: 'Please fix the highlighted fields.', errors });
};
