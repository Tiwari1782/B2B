const SiteContent = require('../models/SiteContent');
const { validationResult } = require('express-validator');

// Public: get single content by key
const getByKey = async (req, res, next) => {
  try {
    const content = await SiteContent.findOne({ key: req.params.key });
    if (!content) return res.status(404).json({ success: false, message: 'Content key not found.' });
    res.status(200).json({ success: true, data: content });
  } catch (error) { next(error); }
};

// SuperAdmin: get all content keys
const getAll = async (req, res, next) => {
  try {
    const content = await SiteContent.find().sort({ key: 1 }).populate('updatedBy', 'name');
    res.status(200).json({ success: true, data: content });
  } catch (error) { next(error); }
};

// Public: get multiple content keys at once
const getBulk = async (req, res, next) => {
  try {
    const keys = req.query.keys ? req.query.keys.split(',') : [];
    if (!keys.length) return res.status(400).json({ success: false, message: 'No keys provided.' });
    const content = await SiteContent.find({ key: { $in: keys } });
    const result = {};
    content.forEach(c => { result[c.key] = c.value; });
    res.status(200).json({ success: true, data: result });
  } catch (error) { next(error); }
};

// SuperAdmin: update content by key
const update = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
    const content = await SiteContent.findOne({ key: req.params.key });
    if (!content) return res.status(404).json({ success: false, message: 'Content key not found.' });
    content.value = req.body.value;
    content.updatedBy = req.user._id;
    await content.save();
    req.activityMessage = `Updated site content: ${req.params.key}`;
    res.status(200).json({ success: true, data: content, message: 'Content updated successfully.' });
  } catch (error) { next(error); }
};

module.exports = { getByKey, getAll, getBulk, update };
