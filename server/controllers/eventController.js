const { validationResult } = require('express-validator');
const Event = require('../models/Event');
const cloudinary = require('cloudinary').v2;

// ═══════════════════════════════════════════
// PUBLIC ENDPOINTS
// ═══════════════════════════════════════════

// GET /api/events — Public list (only published events)
const getAll = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const skip = (page - 1) * limit;

    const filter = { published: true };
    if (req.query.status && req.query.status !== 'all') {
      filter.status = req.query.status;
    }
    if (req.query.category) {
      filter.category = req.query.category;
    }
    if (req.query.search) {
      filter.$text = { $search: req.query.search };
    }

    const [events, total] = await Promise.all([
      Event.find(filter).sort({ date: -1 }).skip(skip).limit(limit),
      Event.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: events,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/events/:id — Public single event (only if published)
const getById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }
    if (!event.published) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }
    res.status(200).json({ success: true, data: event });
  } catch (error) {
    next(error);
  }
};

// ═══════════════════════════════════════════
// ADMIN ENDPOINTS
// ═══════════════════════════════════════════

// GET /api/admin/events — Admin list (includes drafts)
const getAllAdmin = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.published !== undefined) filter.published = req.query.published === 'true';
    if (req.query.search) filter.$text = { $search: req.query.search };

    const [events, total] = await Promise.all([
      Event.find(filter).sort({ date: -1 }).skip(skip).limit(limit),
      Event.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: events,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/admin/events — Create event with multi-image upload
const create = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { title, description, date, location, category, status, published, eventLink } = req.body;

    const eventData = {
      title,
      description: description || '',
      date,
      location: location || '',
      category: category || 'other',
      status: status || 'upcoming',
      published: published !== undefined ? published === 'true' || published === true : true,
      eventLink: eventLink || '',
      createdBy: req.user._id || req.user.id,
      gallery: [],
    };

    // Handle multi-image upload (field name: 'gallery')
    if (req.files && req.files.length > 0) {
      if (req.files.length > 10) {
        return res.status(400).json({ success: false, message: 'Maximum 10 images allowed per event.' });
      }
      req.files.forEach((file, index) => {
        eventData.gallery.push({
          url: file.path,
          publicId: file.filename,
          altText: title,
          order: index,
        });
      });
      // Set cover image to first uploaded image
      eventData.coverImage = eventData.gallery[0].url;
      // Also set legacy image field
      eventData.image = eventData.gallery[0].url;
    }

    // Handle single-image upload (backward compat, field name: 'image')
    if (req.file && !req.files) {
      eventData.image = req.file.path;
      eventData.coverImage = req.file.path;
      eventData.gallery.push({
        url: req.file.path,
        publicId: req.file.filename,
        altText: title,
        order: 0,
      });
    }

    const event = await Event.create(eventData);
    req.activityMessage = `Created event: ${title}`;
    res.status(201).json({ success: true, data: event, message: 'Event created successfully.' });
  } catch (error) {
    next(error);
  }
};

// PUT /api/admin/events/:id — Update event metadata (and optionally replace gallery)
const update = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }

    const { title, description, date, location, category, status, published, eventLink, coverImage } = req.body;

    if (title !== undefined) event.title = title;
    if (description !== undefined) event.description = description;
    if (date !== undefined) event.date = date;
    if (location !== undefined) event.location = location;
    if (category !== undefined) event.category = category;
    if (status !== undefined) event.status = status;
    if (published !== undefined) event.published = published === 'true' || published === true;
    if (eventLink !== undefined) event.eventLink = eventLink;
    if (coverImage !== undefined) event.coverImage = coverImage;

    // Handle multi-image upload on update (appends to existing gallery)
    if (req.files && req.files.length > 0) {
      const totalImages = event.gallery.length + req.files.length;
      if (totalImages > 10) {
        return res.status(400).json({
          success: false,
          message: `Cannot add ${req.files.length} images. Event already has ${event.gallery.length}/10 images.`,
        });
      }
      const startOrder = event.gallery.length;
      req.files.forEach((file, index) => {
        event.gallery.push({
          url: file.path,
          publicId: file.filename,
          altText: event.title,
          order: startOrder + index,
        });
      });
      // Update cover if no cover set
      if (!event.coverImage && event.gallery.length > 0) {
        event.coverImage = event.gallery[0].url;
      }
      // Update legacy image field
      if (!event.image && event.gallery.length > 0) {
        event.image = event.gallery[0].url;
      }
    }

    // Handle single-image upload (backward compat)
    if (req.file && !req.files) {
      if (event.gallery.length >= 10) {
        return res.status(400).json({ success: false, message: 'Gallery is full (10/10 images).' });
      }
      event.gallery.push({
        url: req.file.path,
        publicId: req.file.filename,
        altText: event.title,
        order: event.gallery.length,
      });
      event.image = req.file.path;
      if (!event.coverImage) event.coverImage = req.file.path;
    }

    await event.save();
    req.activityMessage = `Updated event: ${event.title}`;
    res.status(200).json({ success: true, data: event, message: 'Event updated successfully.' });
  } catch (error) {
    next(error);
  }
};

// POST /api/admin/events/:id/images — Add images to existing event gallery
const addImages = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No images provided.' });
    }

    const totalImages = event.gallery.length + req.files.length;
    if (totalImages > 10) {
      return res.status(400).json({
        success: false,
        message: `Cannot add ${req.files.length} images. Event has ${event.gallery.length}/10 images. Maximum allowed: ${10 - event.gallery.length} more.`,
      });
    }

    const startOrder = event.gallery.length;
    req.files.forEach((file, index) => {
      event.gallery.push({
        url: file.path,
        publicId: file.filename,
        altText: event.title,
        order: startOrder + index,
      });
    });

    // Set cover image if none exists
    if (!event.coverImage && event.gallery.length > 0) {
      event.coverImage = event.gallery[0].url;
    }
    // Set legacy image if none exists
    if (!event.image && event.gallery.length > 0) {
      event.image = event.gallery[0].url;
    }

    await event.save();
    req.activityMessage = `Added ${req.files.length} image(s) to event: ${event.title}`;
    res.status(200).json({ success: true, data: event, message: `${req.files.length} image(s) added.` });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/admin/events/:id/images/:imageId — Remove single image from gallery
const removeImage = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }

    const imageIndex = event.gallery.findIndex(
      (img) => img._id.toString() === req.params.imageId
    );
    if (imageIndex === -1) {
      return res.status(404).json({ success: false, message: 'Image not found in gallery.' });
    }

    const removedImage = event.gallery[imageIndex];

    // Delete from Cloudinary
    try {
      await cloudinary.uploader.destroy(removedImage.publicId);
    } catch (cloudErr) {
      console.error('Cloudinary delete error:', cloudErr.message);
    }

    // Remove from gallery array
    event.gallery.splice(imageIndex, 1);

    // Re-order remaining images
    event.gallery.forEach((img, i) => {
      img.order = i;
    });

    // Update cover image if deleted image was the cover
    if (event.coverImage === removedImage.url) {
      event.coverImage = event.gallery.length > 0 ? event.gallery[0].url : '';
    }

    // Update legacy image field
    if (event.image === removedImage.url) {
      event.image = event.gallery.length > 0 ? event.gallery[0].url : '';
    }

    await event.save();
    req.activityMessage = `Removed image from event: ${event.title}`;
    res.status(200).json({ success: true, data: event, message: 'Image removed.' });
  } catch (error) {
    next(error);
  }
};

// PUT /api/admin/events/:id/cover — Set cover image from gallery
const setCoverImage = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }

    const { imageId } = req.body;
    const image = event.gallery.find((img) => img._id.toString() === imageId);
    if (!image) {
      return res.status(404).json({ success: false, message: 'Image not found in gallery.' });
    }

    event.coverImage = image.url;
    event.image = image.url; // Also update legacy field
    await event.save();
    req.activityMessage = `Set cover image for event: ${event.title}`;
    res.status(200).json({ success: true, data: event, message: 'Cover image updated.' });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/admin/events/:id — Delete event + all its Cloudinary images
const remove = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }

    // Delete all gallery images from Cloudinary
    const deletePromises = event.gallery
      .filter((img) => img.publicId)
      .map((img) => cloudinary.uploader.destroy(img.publicId).catch(() => {}));
    await Promise.all(deletePromises);

    await Event.findByIdAndDelete(req.params.id);
    req.activityMessage = `Deleted event: ${event.title}`;
    res.status(200).json({ success: true, message: 'Event deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAll, getById, getAllAdmin, create, update, addImages, removeImage, setCoverImage, remove };
