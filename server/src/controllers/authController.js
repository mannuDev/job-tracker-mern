const User = require('../models/User');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const { sendTokenCookie, clearTokenCookie } = require('../utils/token');

const publicUser = (u) => ({ id: u._id, name: u.name, email: u.email });

// POST /api/auth/register
exports.register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const exists = await User.findOne({ email });
  if (exists) throw new AppError('An account with this email already exists.', 409);

  const user = await User.create({ name, email, password });
  sendTokenCookie(res, user._id);
  res.status(201).json({ user: publicUser(user) });
});

// POST /api/auth/login
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  // Same message for "no such user" and "wrong password" so emails cannot be probed.
  if (!user || !(await user.matchPassword(password))) {
    throw new AppError('Incorrect email or password.', 401);
  }

  sendTokenCookie(res, user._id);
  res.json({ user: publicUser(user) });
});

// POST /api/auth/logout
exports.logout = (req, res) => {
  clearTokenCookie(res);
  res.json({ message: 'Logged out.' });
};

// GET /api/auth/me
exports.me = (req, res) => {
  res.json({ user: publicUser(req.user) });
};
