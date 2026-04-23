const { validationResult } = require('express-validator');
const ContactSubmission = require('../models/ContactSubmission');
const nodemailer = require('nodemailer');

// Public: submit contact form
const submitContact = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
    const { name, email, subject, message } = req.body;
    const submission = await ContactSubmission.create({ name, email, subject, message });
    res.status(201).json({ success: true, message: 'Message sent successfully! We will get back to you soon.' });
  } catch (error) { next(error); }
};

// Public: submit partnership form (sends email via Nodemailer)
const submitPartnership = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
    const { firstName, lastName, email, company, optingFor, message } = req.body;

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });

    const mailOptions = {
      from: `"Bug2Build Partnership" <${process.env.SMTP_USER}>`,
      to: process.env.PARTNERSHIP_EMAIL,
      replyTo: email,
      subject: `New Partnership Inquiry: ${optingFor} - ${firstName} ${lastName}`,
      html: `
        <h2>New Partnership Inquiry</h2>
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Company:</strong> ${company || 'Not specified'}</p>
        <p><strong>Opting For:</strong> ${optingFor}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Partnership inquiry sent successfully!' });
  } catch (error) {
    console.error('Email send error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to send inquiry. Please try again later.' });
  }
};

// Admin: get all contact submissions (paginated)
const getAllContacts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const filter = {};
    if (req.query.isRead !== undefined) filter.isRead = req.query.isRead === 'true';

    const [submissions, total] = await Promise.all([
      ContactSubmission.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      ContactSubmission.countDocuments(filter),
    ]);
    res.status(200).json({
      success: true, data: submissions,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) { next(error); }
};

// Admin: toggle read/unread
const toggleRead = async (req, res, next) => {
  try {
    const submission = await ContactSubmission.findById(req.params.id);
    if (!submission) return res.status(404).json({ success: false, message: 'Submission not found.' });
    submission.isRead = !submission.isRead;
    await submission.save();
    req.activityMessage = `Marked contact submission as ${submission.isRead ? 'read' : 'unread'}`;
    res.status(200).json({ success: true, data: submission });
  } catch (error) { next(error); }
};

module.exports = { submitContact, submitPartnership, getAllContacts, toggleRead };
