const mongoose = require('mongoose');

const siteContentSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: [true, 'Content key is required'],
      unique: true,
      trim: true,
    },
    value: {
      type: String,
      default: '',
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

siteContentSchema.index({ key: 1 }, { unique: true });

module.exports = mongoose.model('SiteContent', siteContentSchema);
