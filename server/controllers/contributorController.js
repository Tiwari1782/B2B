const { validationResult } = require('express-validator');
const Contributor = require('../models/Contributor');

const getAll = async (req, res, next) => {
  try {
    const contributors = await Contributor.find({ isActive: true }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: contributors });
  } catch (error) { next(error); }
};

const getAllAdmin = async (req, res, next) => {
  try {
    const contributors = await Contributor.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: contributors });
  } catch (error) { next(error); }
};

const create = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
    const { name, github, role, avatar, bio, isActive } = req.body;
    const contributor = await Contributor.create({ name, github, role, avatar, bio, isActive });
    req.activityMessage = `Added contributor: ${contributor.name}`;
    res.status(201).json({ success: true, data: contributor, message: 'Contributor added successfully.' });
  } catch (error) { next(error); }
};

const update = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
    const contributor = await Contributor.findById(req.params.id);
    if (!contributor) return res.status(404).json({ success: false, message: 'Contributor not found.' });
    const { name, github, role, avatar, bio, isActive } = req.body;
    if (name) contributor.name = name;
    if (github !== undefined) contributor.github = github;
    if (role !== undefined) contributor.role = role;
    if (avatar !== undefined) contributor.avatar = avatar;
    if (bio !== undefined) contributor.bio = bio;
    if (isActive !== undefined) contributor.isActive = isActive;
    await contributor.save();
    req.activityMessage = `Updated contributor: ${contributor.name}`;
    res.status(200).json({ success: true, data: contributor, message: 'Contributor updated successfully.' });
  } catch (error) { next(error); }
};

const remove = async (req, res, next) => {
  try {
    const contributor = await Contributor.findById(req.params.id);
    if (!contributor) return res.status(404).json({ success: false, message: 'Contributor not found.' });
    await Contributor.findByIdAndDelete(req.params.id);
    req.activityMessage = `Deleted contributor: ${contributor.name}`;
    res.status(200).json({ success: true, message: 'Contributor deleted successfully.' });
  } catch (error) { next(error); }
};

module.exports = { getAll, getAllAdmin, create, update, remove };
