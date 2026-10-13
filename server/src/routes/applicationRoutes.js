const router = require('express').Router();
const { body, param, query } = require('express-validator');
const ctrl = require('../controllers/applicationController');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');
const { STATUSES } = require('../models/Application');

router.use(protect); // every route below requires a logged-in user

const idRule = param('id').isMongoId().withMessage('Invalid application ID.');

// On create, company and role are required. On update, each is only checked if sent.
const text = (name, isCreate) => {
  const chain = body(name);
  return isCreate ? chain : chain.optional();
};

const fields = (isCreate) => [
  text('company', isCreate)
    .isString().withMessage('Enter the company name.')
    .trim().notEmpty().withMessage('Enter the company name.')
    .isLength({ max: 100 }).withMessage('Company must be 100 characters or fewer.'),
  text('role', isCreate)
    .isString().withMessage('Enter the job role.')
    .trim().notEmpty().withMessage('Enter the job role.')
    .isLength({ max: 100 }).withMessage('Role must be 100 characters or fewer.'),
  body('status').optional().isIn(STATUSES).withMessage(`Status must be one of: ${STATUSES.join(', ')}.`),
  body('appliedDate').optional({ values: 'falsy' }).isISO8601().withMessage('Enter a valid date.'),
  body('location').optional().isString().isLength({ max: 100 }).withMessage('Location is too long.'),
  body('jobLink').optional({ values: 'falsy' })
    .isURL({ protocols: ['http', 'https'], require_protocol: true })
    .withMessage('Enter a full link starting with http:// or https://.')
    .isLength({ max: 500 }).withMessage('Link is too long.'),
  body('notes').optional().isString().isLength({ max: 2000 }).withMessage('Notes must be 2000 characters or fewer.'),
];

router.get(
  '/',
  query('status').optional({ values: 'falsy' }).isIn(STATUSES).withMessage('Unknown status.'),
  query('sort').optional({ values: 'falsy' }).isIn(['newest', 'oldest', 'company']),
  validate,
  ctrl.list
);
router.get('/stats', ctrl.stats);
router.post('/', ...fields(true), validate, ctrl.create);
router.put('/:id', idRule, ...fields(false), validate, ctrl.update);
router.delete('/:id', idRule, validate, ctrl.remove);

module.exports = router;
