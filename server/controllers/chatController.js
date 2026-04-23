const Groq = require('groq-sdk');
const { validationResult } = require('express-validator');
const ChatSession = require('../models/ChatSession');
const Event = require('../models/Event');
const TeamMember = require('../models/TeamMember');
const SiteContent = require('../models/SiteContent');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const chat = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

    const { message, sessionId } = req.body;

    // Fetch live DB context
    const [upcomingEvents, activeTeam, aboutContent, contactEmail, systemContext] = await Promise.all([
      Event.find({ status: 'upcoming' }).sort({ date: 1 }).limit(5).select('title date location'),
      TeamMember.find({ isActive: true }).select('name role category'),
      SiteContent.findOne({ key: 'about_description' }),
      SiteContent.findOne({ key: 'contact_email' }),
      SiteContent.findOne({ key: 'chatbot_system_context' }),
    ]);

    const dbContext = `
LIVE DATA (use this to answer questions):
Upcoming Events: ${upcomingEvents.length > 0 ? upcomingEvents.map(e => `${e.title} on ${new Date(e.date).toLocaleDateString()} at ${e.location || 'TBA'}`).join('; ') : 'No upcoming events currently.'}
Active Team Members: ${activeTeam.length} members across various teams.
About: ${aboutContent?.value || 'Bug2Build is a tech community.'}
Contact Email: ${contactEmail?.value || 'contact@bug2build.in'}
`;

    const systemPrompt = `${systemContext?.value || 'You are Bug2Build Assistant.'}\n${dbContext}`;

    // Load or create session
    let session = await ChatSession.findOne({ sessionId });
    if (!session) {
      session = new ChatSession({ sessionId, messages: [] });
    }

    // Build messages array for Groq
    const messages = [
      { role: 'system', content: systemPrompt },
      ...session.messages.slice(-10).map(m => ({ role: m.role, content: m.content })),
      { role: 'user', content: message },
    ];

    try {
      const completion = await groq.chat.completions.create({
        model: 'llama3-70b-8192',
        messages,
        temperature: 0.7,
        max_tokens: 1024,
      });

      const reply = completion.choices[0]?.message?.content || 'I could not generate a response.';

      // Save to session
      session.messages.push({ role: 'user', content: message, timestamp: new Date() });
      session.messages.push({ role: 'assistant', content: reply, timestamp: new Date() });
      await session.save();

      res.status(200).json({ success: true, data: { reply, sessionId: session.sessionId } });
    } catch (groqError) {
      // Groq fallback
      const fallbackEmail = contactEmail?.value || 'contact@bug2build.in';
      const fallbackReply = `I'm currently unable to process your request. Our AI service is temporarily unavailable. Please reach out to us directly at **${fallbackEmail}** and we'll be happy to help!`;
      res.status(200).json({ success: true, data: { reply: fallbackReply, sessionId: sessionId || 'fallback' } });
    }
  } catch (error) { next(error); }
};

module.exports = { chat };
