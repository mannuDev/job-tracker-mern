const jwt = require('jsonwebtoken');

const COOKIE_NAME = 'token';
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

const signToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

const cookieOptions = () => {
  const isProd = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true, // JavaScript in the browser cannot read this cookie
    secure: isProd, // HTTPS only in production
    sameSite: isProd ? 'none' : 'lax', // 'none' lets a separately hosted client send it
    maxAge: SEVEN_DAYS_MS,
  };
};

const sendTokenCookie = (res, userId) => {
  res.cookie(COOKIE_NAME, signToken(userId), cookieOptions());
};

const clearTokenCookie = (res) => {
  const { maxAge, ...opts } = cookieOptions();
  res.clearCookie(COOKIE_NAME, opts);
};

module.exports = { COOKIE_NAME, sendTokenCookie, clearTokenCookie };
