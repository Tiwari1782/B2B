const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  action: {
    type: String,
    required: [true, 'Action description is required'],
    trim: true,
  },
  ip: {
    type: String,
    default: '',
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Index for efficient querying by user and time
activityLogSchema.index({ timestamp: -1 });
activityLogSchema.index({ user: 1, timestamp: -1 });

module.exports = mongoose.model('ActivityLog', activityLogSchema);
