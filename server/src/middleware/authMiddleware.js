const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const { COOKIE_NAME } = require('../utils/token');

const protect = asyncHandler(async (req, res, next) => {
  const token = req.cookies[COOKIE_NAME];
  if (!token) throw new AppError('Not signed in. Log in to continue.', 401);

  const decoded = jwt.verify(token, process.env.JWT_SECRET); // throws on bad/expired token
  const user = await User.findById(decoded.id);
  if (!user) throw new AppError('This account no longer exists.', 401);

  req.user = user;
  next();
});

module.exports = { protect };
