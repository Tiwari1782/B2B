---
name: groq-chatbot-context
description: Use this skill when modifying, debugging, or extending the AI chatbot feature. Covers how the system prompt is built, how live DB context is injected, and how to safely extend what the chatbot knows about.
---

# Skill: Groq Chatbot — Context Injection Pattern

**Model:** `llama3-70b-8192` via Groq SDK  
**Rate limit:** 20 req/min on `/api/chat`  
**Key rule:** All Groq logic is server-side only — API key never touches the client

## Before you start

Run the `api-mapper` subagent on `/api/chat` to understand the current middleware and handler setup.
Run the `db-explorer` subagent if you need to know which models are currently injected as context.

---

## How the System Prompt Is Built

In `server/controllers/chatController.js`, before every Groq call:

**1. Fetch live DB context:**
```js
const upcomingEvents = await Event.find({ status: 'upcoming', published: true })
  .select('title date location');
const teamMembers = await TeamMember.find({ isActive: true })
  .select('name role category');
const systemContext = await SiteContent.findOne({ key: 'chatbot_system_context' });
```

**2. Build and inject system prompt:**
```js
const systemPrompt = `
${systemContext.value}

Current site context:
- Upcoming Events: ${JSON.stringify(upcomingEvents)}
- Team: ${JSON.stringify(teamMembers)}
`;
```

**3. Call Groq:**
```js
const completion = await groq.chat.completions.create({
  model: 'llama3-70b-8192',
  messages: [
    { role: 'system', content: systemPrompt },
    ...sessionMessages,
    { role: 'user', content: userMessage }
  ]
});
```

---

## Adding New Context to the Chatbot

To make the chatbot aware of a new data type (e.g., partners, contributors):

1. Query the new model at the top of `chatController.js`
2. Add it to the system prompt string
3. Keep the query lean — use `.select()` to return only fields the chatbot needs
4. Never expose this DB fetch as a public API endpoint — it stays server-side only

---

## Extending the System Prompt Text

The `chatbot_system_context` SiteContent key holds the base instructions editable by SuperAdmins. To add a new editable prompt section, use the `add-sitecontent-key` skill and reference the new key in `chatController.js`.

---

## Error Handling Rule

If Groq is unreachable, always return a graceful offline message — never let raw errors reach the client:

```js
catch (error) {
  console.error('Groq error:', error);
  return res.json({
    reply: "I'm currently offline. Please try again in a moment."
  });
}
```

---

## Checklist

- [ ] New DB queries use `.select()` — no full document dumps into the prompt
- [ ] Groq API key accessed via `process.env.GROQ_API_KEY` — never hardcoded
- [ ] Error catch returns graceful offline message — no stack traces to client
- [ ] Rate limit on `/api/chat` untouched (20 req/min)
- [ ] Session history passed correctly so conversation context is maintained