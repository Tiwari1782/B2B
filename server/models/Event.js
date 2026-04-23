const mongoose = require('mongoose');

const galleryImageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  publicId: {
    type: String,
    required: true,
  },
  altText: {
    type: String,
    default: '',
  },
  order: {
    type: Number,
    default: 0,
  },
}, { _id: true });

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters'],
  },
  description: {
    type: String,
    trim: true,
    default: '',
  },
  date: {
    type: Date,
    required: [true, 'Event date is required'],
  },
  location: {
    type: String,
    trim: true,
    default: '',
  },
  category: {
    type: String,
    enum: ['workshop', 'hackathon', 'meetup', 'webinar', 'conference', 'other'],
    default: 'other',
  },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'past'],
    default: 'upcoming',
  },
  published: {
    type: Boolean,
    default: true,
  },
  eventLink: {
    type: String,
    trim: true,
    default: '',
  },
  // Legacy single image field — kept for backward compat
  image: {
    type: String,
    default: '',
  },
  // New gallery system (max 10 images)
  gallery: {
    type: [galleryImageSchema],
    validate: {
      validator: function (arr) {
        return arr.length <= 10;
      },
      message: 'Gallery cannot exceed 10 images.',
    },
    default: [],
  },
  // Cover image URL — defaults to first gallery image or legacy image
  coverImage: {
    type: String,
    default: '',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

// Indexes
eventSchema.index({ date: -1 });
eventSchema.index({ status: 1 });
eventSchema.index({ published: 1 });
eventSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Event', eventSchema);
