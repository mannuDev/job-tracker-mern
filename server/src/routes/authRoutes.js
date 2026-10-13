const router = require('express').Router();
const { body } = require('express-validator');
const rateLimit = require('express-rate-limit');
const { register, login, logout, me } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');

// Slows down password guessing: 20 attempts per 15 minutes per IP.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many attempts. Try again in a few minutes.' },
});

const emailRule = body('email')
  .isString().withMessage('Enter your email.')
  .trim()
  .isEmail().withMessage('Enter a valid email address.')
  .normalizeEmail();

router.post(
  '/register',
  authLimiter,
  body('name').isString().trim().notEmpty().withMessage('Enter your name.')
    .isLength({ max: 60 }).withMessage('Name must be 60 characters or fewer.'),
  emailRule,
  body('password').isString().isLength({ min: 8, max: 72 })
    .withMessage('Password must be 8 to 72 characters.'),
  validate,
  register
);

router.post(
  '/login',
  authLimiter,
  emailRule,
  body('password').isString().notEmpty().withMessage('Enter your password.'),
  validate,
  login
);

router.post('/logout', logout);
router.get('/me', protect, me);

module.exports = router;
