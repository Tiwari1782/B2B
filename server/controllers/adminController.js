const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { cloudinary } = require('../config/cloudinary');

// Update own profile
const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    const { name, bio } = req.body;
    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (req.file) {
      if (user.profilePicture) {
        const publicId = user.profilePicture.split('/').slice(-2).join('/').split('.')[0];
        await cloudinary.uploader.destroy(publicId).catch(() => {});
      }
      user.profilePicture = req.file.path;
    }
    await user.save();
    req.activityMessage = `Updated profile`;
    const userData = user.toObject();
    delete userData.password;
    res.status(200).json({ success: true, data: userData, message: 'Profile updated successfully.' });
  } catch (error) { next(error); }
};

module.exports = { updateProfile };
