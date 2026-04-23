const { validationResult } = require('express-validator');
const Partner = require('../models/Partner');
const { cloudinary } = require('../config/cloudinary');

// @desc    Get all active partners (public)
// @route   GET /api/partners
// @access  Public
const getAll = async (req, res, next) => {
  try {
    const partners = await Partner.find({ isActive: true }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: partners });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all partners (admin — includes inactive)
// @route   GET /api/admin/partners/all
// @access  Admin
const getAllAdmin = async (req, res, next) => {
  try {
    const partners = await Partner.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: partners });
  } catch (error) {
    next(error);
  }
};

// @desc    Create partner
// @route   POST /api/admin/partners
// @access  Admin
const create = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, website, category, isActive } = req.body;
    const partnerData = { name, website, category, isActive };

    if (req.file) {
      partnerData.logo = req.file.path;
    }

    const partner = await Partner.create(partnerData);
    req.activityMessage = `Added partner: ${partner.name}`;

    res.status(201).json({ success: true, data: partner, message: 'Partner added successfully.' });
  } catch (error) {
    next(error);
  }
};

// @desc    Update partner
// @route   PUT /api/admin/partners/:id
// @access  Admin
const update = async (req, res, next) => {
  try {
    const partner = await Partner.findById(req.params.id);
    if (!partner) {
      return res.status(404).json({ success: false, message: 'Partner not found.' });
    }

    const { name, website, category, isActive } = req.body;
    if (name) partner.name = name;
    if (website !== undefined) partner.website = website;
    if (category !== undefined) partner.category = category;
    if (isActive !== undefined) partner.isActive = isActive;

    if (req.file) {
      if (partner.logo) {
        const publicId = partner.logo.split('/').slice(-2).join('/').split('.')[0];
        await cloudinary.uploader.destroy(publicId).catch(() => {});
      }
      partner.logo = req.file.path;
    }

    await partner.save();
    req.activityMessage = `Updated partner: ${partner.name}`;

    res.status(200).json({ success: true, data: partner, message: 'Partner updated successfully.' });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete partner
// @route   DELETE /api/admin/partners/:id
// @access  Admin
const remove = async (req, res, next) => {
  try {
    const partner = await Partner.findById(req.params.id);
    if (!partner) {
      return res.status(404).json({ success: false, message: 'Partner not found.' });
    }

    if (partner.logo) {
      const publicId = partner.logo.split('/').slice(-2).join('/').split('.')[0];
      await cloudinary.uploader.destroy(publicId).catch(() => {});
    }

    await Partner.findByIdAndDelete(req.params.id);
    req.activityMessage = `Deleted partner: ${partner.name}`;

    res.status(200).json({ success: true, message: 'Partner deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAll, getAllAdmin, create, update, remove };
