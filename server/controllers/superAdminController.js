const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');
const SiteContent = require('../models/SiteContent');

// List all admins
const listAdmins = async (req, res, next) => {
  try {
    const admins = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: admins });
  } catch (error) { next(error); }
};

// Create new admin
const createAdmin = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
    const { name, email, password, role } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ success: false, message: 'Email already in use.' });
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, password: hashedPassword, role: role || 'admin' });
    req.activityMessage = `Created admin account: ${email}`;
    const userData = user.toObject();
    delete userData.password;
    res.status(201).json({ success: true, data: userData, message: 'Admin created successfully.' });
  } catch (error) { next(error); }
};

// Update admin
const updateAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    const { name, role } = req.body;
    if (name) user.name = name;
    if (role) user.role = role;
    if (req.file) user.profilePicture = req.file.path;
    await user.save();
    req.activityMessage = `Updated admin: ${user.email}`;
    const userData = user.toObject();
    delete userData.password;
    res.status(200).json({ success: true, data: userData, message: 'Admin updated successfully.' });
  } catch (error) { next(error); }
};

// Delete admin
const deleteAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    if (user.role === 'superadmin') return res.status(403).json({ success: false, message: 'Cannot delete SuperAdmin.' });
    await User.findByIdAndDelete(req.params.id);
    req.activityMessage = `Deleted admin: ${user.email}`;
    res.status(200).json({ success: true, message: 'Admin deleted successfully.' });
  } catch (error) { next(error); }
};

// Reset admin password
const resetPassword = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    user.password = hashedPassword;
    await user.save();
    req.activityMessage = `Reset password for: ${user.email}`;
    res.status(200).json({ success: true, message: 'Password reset successfully.' });
  } catch (error) { next(error); }
};

// Toggle active/inactive
const toggleActive = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    if (user.role === 'superadmin') return res.status(403).json({ success: false, message: 'Cannot deactivate SuperAdmin.' });
    user.isActive = !user.isActive;
    await user.save();
    req.activityMessage = `${user.isActive ? 'Activated' : 'Deactivated'} admin: ${user.email}`;
    res.status(200).json({ success: true, data: { isActive: user.isActive }, message: `Admin ${user.isActive ? 'activated' : 'deactivated'}.` });
  } catch (error) { next(error); }
};

// Get activity logs (paginated, filterable)
const getLogs = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 30;
    const skip = (page - 1) * limit;
    const filter = {};
    if (req.query.userId) filter.user = req.query.userId;
    const [logs, total] = await Promise.all([
      ActivityLog.find(filter).sort({ timestamp: -1 }).skip(skip).limit(limit).populate('user', 'name email'),
      ActivityLog.countDocuments(filter),
    ]);
    res.status(200).json({ success: true, data: logs, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) { next(error); }
};

// Get site settings (SEO + social)
const getSettings = async (req, res, next) => {
  try {
    const keys = ['seo_title', 'seo_description', 'social_github', 'social_linkedin', 'social_instagram', 'social_twitter', 'social_youtube'];
    const content = await SiteContent.find({ key: { $in: keys } });
    const result = {};
    content.forEach(c => { result[c.key] = c.value; });
    res.status(200).json({ success: true, data: result });
  } catch (error) { next(error); }
};

// Update site settings
const updateSettings = async (req, res, next) => {
  try {
    const settings = req.body;
    for (const [key, value] of Object.entries(settings)) {
      await SiteContent.findOneAndUpdate({ key }, { value, updatedBy: req.user._id }, { upsert: true });
    }
    req.activityMessage = `Updated site settings`;
    res.status(200).json({ success: true, message: 'Settings updated successfully.' });
  } catch (error) { next(error); }
};

module.exports = { listAdmins, createAdmin, updateAdmin, deleteAdmin, resetPassword, toggleActive, getLogs, getSettings, updateSettings };
