// Fixed: P0-2 (hardcoded password), P3-26 (insertMany optimization)
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const SiteContent = require('../models/SiteContent');

// ── SuperAdmin credentials from environment ──
const SUPERADMIN_EMAIL = process.env.SUPERADMIN_EMAIL || 'superadmin@bug2build.in';
const SUPERADMIN_PASSWORD = process.env.SUPERADMIN_PASSWORD;

if (!SUPERADMIN_PASSWORD) {
  console.error('ERROR: SUPERADMIN_PASSWORD environment variable is required.');
  console.error('Set it in your .env file: SUPERADMIN_PASSWORD=YourSecurePassword');
  process.exit(1);
}

const SITE_CONTENT_KEYS = [
  // Hero Section
  { key: 'hero_title', value: 'Bug2Build' },
  { key: 'hero_subtitle', value: 'Transforming bugs into builds, one project at a time.' },
  { key: 'hero_cta', value: 'Explore Events' },

  // About
  { key: 'about_description', value: 'Bug2Build is a vibrant tech community dedicated to empowering students and developers through hands-on projects, hackathons, and collaborative learning. We believe in learning by building — turning every bug into a stepping stone.' },

  // Contact Info
  { key: 'contact_email', value: 'contact@bug2build.in' },
  { key: 'contact_phone', value: '+91 9876543210' },
  { key: 'contact_address', value: 'Greater Noida, Uttar Pradesh, India' },
  { key: 'contact_map_lat', value: '28.4744' },
  { key: 'contact_map_lng', value: '77.5040' },

  // Chatbot
  { key: 'chatbot_system_context', value: 'You are Bug2Build Assistant, a friendly and knowledgeable AI helper for the Bug2Build tech community. You help visitors learn about our events, team, partnerships, and community initiatives. Be concise, helpful, and enthusiastic about technology and learning.' },

  // SEO
  { key: 'seo_title', value: 'Bug2Build — Tech Community Platform' },
  { key: 'seo_description', value: 'Bug2Build is a student-led tech community focused on project-based learning, hackathons, and open source contributions.' },

  // Social Media Links
  { key: 'social_github', value: 'https://github.com/bug2build' },
  { key: 'social_linkedin', value: 'https://linkedin.com/company/bug2build' },
  { key: 'social_instagram', value: 'https://instagram.com/bug2build' },
  { key: 'social_twitter', value: 'https://twitter.com/bug2build' },
  { key: 'social_youtube', value: 'https://youtube.com/@bug2build' },

  // Partner Stats (for marquee stat bar)
  { key: 'partner_stat_partners', value: '25' },
  { key: 'partner_stat_industries', value: '8' },
  { key: 'partner_stat_cities', value: '12' },
  { key: 'partner_stat_years', value: '3' },
];

const seed = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // --- Seed SuperAdmin ---
    const existingAdmin = await User.findOne({ email: SUPERADMIN_EMAIL });
    if (existingAdmin) {
      console.log('SuperAdmin already exists. Skipping user creation.');
    } else {
      const hashedPassword = await bcrypt.hash(SUPERADMIN_PASSWORD, 12);
      await User.create({
        name: 'Super Admin',
        email: SUPERADMIN_EMAIL,
        password: hashedPassword,
        role: 'superadmin',
        isActive: true,
      });
      console.log('SuperAdmin created successfully.');
    }

    // --- Seed SiteContent (bulk insert, skip existing) ---
    const existingKeys = await SiteContent.find({}).select('key');
    const existingKeySet = new Set(existingKeys.map((k) => k.key));
    const newItems = SITE_CONTENT_KEYS.filter((item) => !existingKeySet.has(item.key));

    if (newItems.length > 0) {
      await SiteContent.insertMany(newItems, { ordered: false });
    }
    console.log(`SiteContent: ${newItems.length} created, ${SITE_CONTENT_KEYS.length - newItems.length} already existed.`);

    console.log('\nSeed completed successfully!');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error.message);
    await mongoose.connection.close();
    process.exit(1);
  }
};

seed();
