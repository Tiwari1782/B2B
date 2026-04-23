const { validationResult } = require('express-validator');
const Brand = require('../models/Brand');
const { cloudinary } = require('../config/cloudinary');

// @desc    Get all active brands (public)
// @route   GET /api/brands
// @access  Public
const getAll = async (req, res, next) => {
  try {
    const brands = await Brand.find({ isActive: true }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: brands });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all brands (admin)
const getAllAdmin = async (req, res, next) => {
  try {
    const brands = await Brand.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: brands });
  } catch (error) {
    next(error);
  }
};

// @desc    Create brand
// @route   POST /api/admin/brands
// @access  Admin
const create = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, website, isActive } = req.body;
    const brandData = { name, website, isActive };

    if (req.file) {
      brandData.logo = req.file.path;
    }

    const brand = await Brand.create(brandData);
    req.activityMessage = `Added brand: ${brand.name}`;

    res.status(201).json({ success: true, data: brand, message: 'Brand added successfully.' });
  } catch (error) {
    next(error);
  }
};

// @desc    Update brand
// @route   PUT /api/admin/brands/:id
// @access  Admin
const update = async (req, res, next) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      return res.status(404).json({ success: false, message: 'Brand not found.' });
    }

    const { name, website, isActive } = req.body;
    if (name) brand.name = name;
    if (website !== undefined) brand.website = website;
    if (isActive !== undefined) brand.isActive = isActive;

    if (req.file) {
      if (brand.logo) {
        const publicId = brand.logo.split('/').slice(-2).join('/').split('.')[0];
        await cloudinary.uploader.destroy(publicId).catch(() => {});
      }
      brand.logo = req.file.path;
    }

    await brand.save();
    req.activityMessage = `Updated brand: ${brand.name}`;

    res.status(200).json({ success: true, data: brand, message: 'Brand updated successfully.' });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete brand
// @route   DELETE /api/admin/brands/:id
// @access  Admin
const remove = async (req, res, next) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      return res.status(404).json({ success: false, message: 'Brand not found.' });
    }

    if (brand.logo) {
      const publicId = brand.logo.split('/').slice(-2).join('/').split('.')[0];
      await cloudinary.uploader.destroy(publicId).catch(() => {});
    }

    await Brand.findByIdAndDelete(req.params.id);
    req.activityMessage = `Deleted brand: ${brand.name}`;

    res.status(200).json({ success: true, message: 'Brand deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAll, getAllAdmin, create, update, remove };
