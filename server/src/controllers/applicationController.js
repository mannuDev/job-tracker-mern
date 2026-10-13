const Application = require('../models/Application');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const ALLOWED_FIELDS = ['company', 'role', 'status', 'appliedDate', 'location', 'jobLink', 'notes'];
const pick = (body) =>
  ALLOWED_FIELDS.reduce((acc, key) => {
    if (body[key] !== undefined) acc[key] = body[key];
    return acc;
  }, {});

// GET /api/applications?status=&search=&sort=newest|oldest|company
exports.list = asyncHandler(async (req, res) => {
  const { status, search, sort = 'newest' } = req.query;
  const filter = { user: req.user._id };

  if (status) filter.status = status;
  if (search) {
    const rx = new RegExp(escapeRegex(String(search).slice(0, 100)), 'i');
    filter.$or = [{ company: rx }, { role: rx }];
  }

  const sortMap = {
    newest: { appliedDate: -1, createdAt: -1 },
    oldest: { appliedDate: 1, createdAt: 1 },
    company: { company: 1 },
  };

  const applications = await Application.find(filter).sort(sortMap[sort] || sortMap.newest);
  res.json({ applications });
});

// GET /api/applications/stats
exports.stats = asyncHandler(async (req, res) => {
  const rows = await Application.aggregate([
    { $match: { user: req.user._id } },
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  const counts = { Applied: 0, Interview: 0, Offer: 0, Rejected: 0 };
  rows.forEach((r) => {
    counts[r._id] = r.count;
  });
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  res.json({ total, counts });
});

// POST /api/applications
exports.create = asyncHandler(async (req, res) => {
  const application = await Application.create({ ...pick(req.body), user: req.user._id });
  res.status(201).json({ application });
});

// PUT /api/applications/:id
exports.update = asyncHandler(async (req, res) => {
  // Filtering by user means you can never edit someone else's record.
  const application = await Application.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    pick(req.body),
    { new: true, runValidators: true }
  );
  if (!application) throw new AppError('Application not found.', 404);
  res.json({ application });
});

// DELETE /api/applications/:id
exports.remove = asyncHandler(async (req, res) => {
  const application = await Application.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });
  if (!application) throw new AppError('Application not found.', 404);
  res.json({ message: 'Application deleted.', id: req.params.id });
});
