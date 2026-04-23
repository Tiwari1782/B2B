const { validationResult } = require('express-validator');
const TeamMember = require('../models/TeamMember');
const { cloudinary } = require('../config/cloudinary');

// @desc    Get all team members (public)
// @route   GET /api/team
// @access  Public
const getAll = async (req, res, next) => {
  try {
    const members = await TeamMember.find({ isActive: true }).sort({ category: 1, order: 1 });
    res.status(200).json({ success: true, data: members });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all team members (admin — includes inactive)
// @route   GET /api/admin/team/all
// @access  Admin
const getAllAdmin = async (req, res, next) => {
  try {
    const members = await TeamMember.find().sort({ category: 1, order: 1 });
    res.status(200).json({ success: true, data: members });
  } catch (error) {
    next(error);
  }
};

// @desc    Create team member
// @route   POST /api/admin/team
// @access  Admin
const create = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, role, linkedin, github, category, order, isActive } = req.body;
    const memberData = { name, role, linkedin, github, category, order: order || 0, isActive };

    if (req.file) {
      memberData.photo = req.file.path;
    }

    const member = await TeamMember.create(memberData);
    req.activityMessage = `Added team member: ${member.name}`;

    res.status(201).json({ success: true, data: member, message: 'Team member added successfully.' });
  } catch (error) {
    next(error);
  }
};

// @desc    Update team member
// @route   PUT /api/admin/team/:id
// @access  Admin
const update = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const member = await TeamMember.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ success: false, message: 'Team member not found.' });
    }

    const { name, role, linkedin, github, category, order, isActive } = req.body;
    if (name) member.name = name;
    if (role) member.role = role;
    if (linkedin !== undefined) member.linkedin = linkedin;
    if (github !== undefined) member.github = github;
    if (category) member.category = category;
    if (order !== undefined) member.order = order;
    if (isActive !== undefined) member.isActive = isActive;

    if (req.file) {
      if (member.photo) {
        const publicId = member.photo.split('/').slice(-2).join('/').split('.')[0];
        await cloudinary.uploader.destroy(publicId).catch(() => {});
      }
      member.photo = req.file.path;
    }

    await member.save();
    req.activityMessage = `Updated team member: ${member.name}`;

    res.status(200).json({ success: true, data: member, message: 'Team member updated successfully.' });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete team member
// @route   DELETE /api/admin/team/:id
// @access  Admin
const remove = async (req, res, next) => {
  try {
    const member = await TeamMember.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ success: false, message: 'Team member not found.' });
    }

    if (member.photo) {
      const publicId = member.photo.split('/').slice(-2).join('/').split('.')[0];
      await cloudinary.uploader.destroy(publicId).catch(() => {});
    }

    await TeamMember.findByIdAndDelete(req.params.id);
    req.activityMessage = `Deleted team member: ${member.name}`;

    res.status(200).json({ success: true, message: 'Team member deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

// @desc    Bulk reorder team members (drag-and-drop)
// @route   PATCH /api/admin/team/reorder
// @access  Admin
const reorder = async (req, res, next) => {
  try {
    const { members } = req.body; // Array of { id, order }

    if (!Array.isArray(members)) {
      return res.status(400).json({ success: false, message: 'Members array is required.' });
    }

    const bulkOps = members.map((m) => ({
      updateOne: {
        filter: { _id: m.id },
        update: { $set: { order: m.order } },
      },
    }));

    await TeamMember.bulkWrite(bulkOps);
    req.activityMessage = `Reordered ${members.length} team members`;

    res.status(200).json({ success: true, message: 'Team members reordered successfully.' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAll, getAllAdmin, create, update, remove, reorder };
