// Fixed: P0-3 (SMTP secure), P1-7 (XSS in email template)
const { validationResult } = require('express-validator');
const ContactSubmission = require('../models/ContactSubmission');
const nodemailer = require('nodemailer');
const he = require('he');

/* ─────────────────────────────────────────────────────────────
   SMTP TRANSPORTER (shared)
───────────────────────────────────────────────────────────── */
const createTransporter = () => {
  const smtpPort = Number(process.env.SMTP_PORT) || 465;
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
};

/* ─────────────────────────────────────────────────────────────
   PROFESSIONAL EMAIL TEMPLATES
   White card layout with Bug2Build branding
───────────────────────────────────────────────────────────── */

/**
 * Generates the outer email shell (header + footer + card wrapper).
 * All styles are inline for maximum email-client compatibility.
 */
const emailShell = (badgeColor, badgeIcon, badgeLabel, cardContent) => `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#F1F5F9;font-family:'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <!-- Outer wrapper -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F1F5F9;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- ═══ HEADER ═══ -->
        <tr><td style="padding-bottom:24px;text-align:center;">
          <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;">
            <tr>
              <td style="padding-right:10px;vertical-align:middle;">
                <div style="width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,#5B5FEF,#8B5CF6);display:inline-block;text-align:center;line-height:36px;font-size:18px;color:#fff;font-weight:800;">B</div>
              </td>
              <td style="vertical-align:middle;">
                <span style="font-size:18px;font-weight:800;background:linear-gradient(135deg,#5B5FEF,#8B5CF6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;letter-spacing:-0.3px;">Bug2Build</span>
              </td>
            </tr>
          </table>
        </td></tr>

        <!-- ═══ MAIN CARD ═══ -->
        <tr><td>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FFFFFF;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06),0 1px 3px rgba(0,0,0,0.04);">

            <!-- Gradient accent bar -->
            <tr><td style="height:4px;background:linear-gradient(90deg,#FF6B8A,#8B5CF6,#5B5FEF,#00C2FF);"></td></tr>

            <!-- Badge row -->
            <tr><td style="padding:28px 32px 0 32px;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="width:40px;height:40px;border-radius:12px;background:${badgeColor}15;text-align:center;vertical-align:middle;">
                    <span style="font-size:20px;line-height:40px;">${badgeIcon}</span>
                  </td>
                  <td style="padding-left:14px;vertical-align:middle;">
                    <span style="display:inline-block;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:${badgeColor};background:${badgeColor}12;padding:4px 12px;border-radius:20px;border:1px solid ${badgeColor}25;">${badgeLabel}</span>
                  </td>
                </tr>
              </table>
            </td></tr>

            <!-- Card body content -->
            ${cardContent}

            <!-- Timestamp footer inside card -->
            <tr><td style="padding:0 32px 28px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #F1F5F9;padding-top:16px;">
                <tr>
                  <td style="font-size:11px;color:#94A3B8;line-height:1.4;">
                    📅 Received on ${new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    at ${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
                  </td>
                </tr>
              </table>
            </td></tr>

          </table>
        </td></tr>

        <!-- ═══ FOOTER ═══ -->
        <tr><td style="padding-top:24px;text-align:center;">
          <p style="margin:0 0 6px 0;font-size:12px;color:#94A3B8;line-height:1.5;">
            This is an automated notification from <span style="font-weight:600;color:#64748B;">Bug2Build</span>
          </p>
          <p style="margin:0;font-size:11px;color:#CBD5E1;">
            Building the future, one bug at a time 🐛→🏗️
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>
`;

/**
 * Renders a single info row inside the card
 */
const infoRow = (iconEmoji, label, value, isLast = false) => `
  <tr><td style="padding:0 32px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:14px 0;${isLast ? '' : 'border-bottom:1px solid #F8FAFC;'}">
      <tr>
        <td style="width:32px;vertical-align:top;padding-top:2px;">
          <span style="font-size:16px;">${iconEmoji}</span>
        </td>
        <td style="vertical-align:top;">
          <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.2px;color:#94A3B8;margin-bottom:4px;">${label}</div>
          <div style="font-size:14px;color:#1E293B;font-weight:500;line-height:1.5;">${value}</div>
        </td>
      </tr>
    </table>
  </td></tr>
`;

/**
 * Renders the message block (larger, with background)
 */
const messageBlock = (message) => `
  <tr><td style="padding:4px 32px 24px 32px;">
    <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.2px;color:#94A3B8;margin-bottom:10px;padding-left:2px;">
      💬 Message
    </div>
    <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:12px;padding:20px;font-size:14px;color:#334155;line-height:1.75;white-space:pre-wrap;">
      ${message}
    </div>
  </td></tr>
`;


/* ─────────────────────────────────────────────────────────────
   CONTACT FORM EMAIL TEMPLATE
───────────────────────────────────────────────────────────── */
const buildContactEmailHTML = (safe) => {
  const cardContent = `
    <!-- Title -->
    <tr><td style="padding:20px 32px 4px 32px;">
      <h1 style="margin:0;font-size:22px;font-weight:800;color:#0F172A;line-height:1.3;">
        New Contact Message
      </h1>
      <p style="margin:6px 0 0 0;font-size:13px;color:#64748B;">Someone reached out through the Bug2Build contact form</p>
    </td></tr>

    <!-- Divider -->
    <tr><td style="padding:16px 32px 0 32px;">
      <div style="height:1px;background:linear-gradient(90deg,#5B5FEF20,#8B5CF620,transparent);"></div>
    </td></tr>

    <!-- Info rows -->
    ${infoRow('👤', 'Full Name', safe.name)}
    ${infoRow('✉️', 'Email Address', `<a href="mailto:${safe.email}" style="color:#5B5FEF;text-decoration:none;font-weight:600;">${safe.email}</a>`)}
    ${infoRow('📋', 'Subject', safe.subject, true)}

    <!-- Message -->
    ${messageBlock(safe.message)}
  `;

  return emailShell('#5B5FEF', '✉️', 'Contact Form', cardContent);
};


/* ─────────────────────────────────────────────────────────────
   PARTNERSHIP FORM EMAIL TEMPLATE
───────────────────────────────────────────────────────────── */
const buildPartnershipEmailHTML = (safe) => {
  const typeColor = safe.optingFor === 'Sponsorship' ? '#F59E0B' : '#10B981';
  const typeIcon = safe.optingFor === 'Sponsorship' ? '💰' : '🤝';

  const cardContent = `
    <!-- Title -->
    <tr><td style="padding:20px 32px 4px 32px;">
      <h1 style="margin:0;font-size:22px;font-weight:800;color:#0F172A;line-height:1.3;">
        New Partnership Inquiry
      </h1>
      <p style="margin:6px 0 0 0;font-size:13px;color:#64748B;">A potential partner wants to collaborate with Bug2Build</p>
    </td></tr>

    <!-- Partnership type badge -->
    <tr><td style="padding:16px 32px 0 32px;">
      <table role="presentation" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding:8px 16px;border-radius:10px;background:${typeColor}12;border:1px solid ${typeColor}30;">
            <span style="font-size:13px;font-weight:700;color:${typeColor};">${typeIcon} ${safe.optingFor}</span>
          </td>
        </tr>
      </table>
    </td></tr>

    <!-- Divider -->
    <tr><td style="padding:16px 32px 0 32px;">
      <div style="height:1px;background:linear-gradient(90deg,#8B5CF620,#FF6B8A20,transparent);"></div>
    </td></tr>

    <!-- Info rows -->
    ${infoRow('👤', 'Full Name', `${safe.firstName} ${safe.lastName}`)}
    ${infoRow('✉️', 'Email Address', `<a href="mailto:${safe.email}" style="color:#8B5CF6;text-decoration:none;font-weight:600;">${safe.email}</a>`)}
    ${infoRow('🏢', 'Company', safe.company, true)}

    <!-- Message -->
    ${messageBlock(safe.message)}
  `;

  return emailShell('#8B5CF6', '🤝', 'Partnership Inquiry', cardContent);
};


/* ─────────────────────────────────────────────────────────────
   CONTROLLERS
───────────────────────────────────────────────────────────── */

// Public: submit contact form
const submitContact = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
    const { name, email, subject, message } = req.body;
    const submission = await ContactSubmission.create({ name, email, subject, message });

    // Send email notification to admin
    try {
      const safe = {
        name: he.escape(name),
        email: he.escape(email),
        subject: he.escape(subject || 'No subject'),
        message: he.escape(message),
      };

      await createTransporter().sendMail({
        from: `"Bug2Build Contact" <${process.env.SMTP_USER}>`,
        to: process.env.PARTNERSHIP_EMAIL,
        replyTo: email,
        subject: `📬 New Contact: ${safe.subject} — ${safe.name}`,
        html: buildContactEmailHTML(safe),
      });
    } catch (emailErr) {
      console.error('Contact email notification failed:', emailErr.message);
    }

    res.status(201).json({ success: true, message: 'Message sent successfully! We will get back to you soon.' });
  } catch (error) { next(error); }
};

// Public: submit partnership form (sends email via Nodemailer)
const submitPartnership = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
    const { firstName, lastName, email, company, optingFor, message } = req.body;

    const safe = {
      firstName: he.escape(firstName),
      lastName: he.escape(lastName),
      email: he.escape(email),
      company: he.escape(company || 'Not specified'),
      optingFor: he.escape(optingFor),
      message: he.escape(message),
    };

    await createTransporter().sendMail({
      from: `"Bug2Build Partnership" <${process.env.SMTP_USER}>`,
      to: process.env.PARTNERSHIP_EMAIL,
      replyTo: email,
      subject: `🤝 Partnership: ${safe.optingFor} — ${safe.firstName} ${safe.lastName}`,
      html: buildPartnershipEmailHTML(safe),
    });

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
