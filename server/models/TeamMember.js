const mongoose = require('mongoose');

const teamMemberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    role: {
      type: String,
      required: [true, 'Role/designation is required'],
      trim: true,
      maxlength: [100, 'Role cannot exceed 100 characters'],
    },
    photo: {
      type: String,
      default: '',
    },
    linkedin: {
      type: String,
      trim: true,
      default: '',
    },
    github: {
      type: String,
      trim: true,
      default: '',
    },
    category: {
      type: String,
      enum: ['executive', 'tech', 'event', 'sponsors', 'digital_media', 'marketing', 'research'],
      required: [true, 'Category is required'],
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Index for efficient sorting by category and order
teamMemberSchema.index({ category: 1, order: 1 });

module.exports = mongoose.model('TeamMember', teamMemberSchema);
