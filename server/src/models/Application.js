const mongoose = require('mongoose');

const STATUSES = ['Applied', 'Interview', 'Offer', 'Rejected'];

const applicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    company: { type: String, required: true, trim: true, maxlength: 100 },
    role: { type: String, required: true, trim: true, maxlength: 100 },
    status: { type: String, enum: STATUSES, default: 'Applied' },
    appliedDate: { type: Date, default: Date.now },
    location: { type: String, trim: true, maxlength: 100, default: '' },
    jobLink: { type: String, trim: true, maxlength: 500, default: '' },
    notes: { type: String, trim: true, maxlength: 2000, default: '' },
  },
  { timestamps: true }
);

applicationSchema.index({ user: 1, status: 1, appliedDate: -1 });

module.exports = mongoose.model('Application', applicationSchema);
module.exports.STATUSES = STATUSES;
