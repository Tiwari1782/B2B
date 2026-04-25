const mongoose = require('mongoose');

const contributorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Contributor name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    github: {
      type: String,
      trim: true,
      default: '',
    },
    role: {
      type: String,
      trim: true,
      default: '',
    },
    avatar: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      default: '',
      maxlength: [300, 'Bio cannot exceed 300 characters'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

contributorSchema.index({ isActive: 1 });

module.exports = mongoose.model('Contributor', contributorSchema);
