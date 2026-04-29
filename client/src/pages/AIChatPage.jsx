import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineSparkles, HiOutlinePaperAirplane } from 'react-icons/hi';
import ReactMarkdown from 'react-markdown';
import api from '../services/api';

const AIChatPage = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am the Bug2Build AI Assistant. I can tell you about what our community does, our upcoming events, and how you can get involved!' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => `session_full_${Date.now()}_${Math.random().toString(36).slice(2)}`);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const res = await api.post('/chat', { message: userMsg, sessionId });
      setMessages((prev) => [...prev, { role: 'assistant', content: res.data.data.reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Sorry, I\'m having trouble right now. Please try again later or email us at contact@bug2build.in' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickPrompt = (prompt) => {
    setInput(prompt);
  };

  const quickPrompts = [
    "What does Bug2Build do?",
    "What are the upcoming events?",
    "How can I join the community?",
    "Who is on the team?"
  ];

  return (
    <div className="min-h-screen bg-bg-primary pt-24 pb-12 px-4 sm:px-6 lg:px-8 flex flex-col">
      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col bg-bg-surface border border-border rounded-2xl shadow-xl overflow-hidden relative">

        {/* Header */}
        <div className="px-6 py-5 border-b border-border flex items-center justify-between" style={{ background: 'linear-gradient(135deg, rgba(59,95,204,0.1), rgba(26,143,188,0.05))' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full gradient-hero flex items-center justify-center">
              <HiOutlineSparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-text-primary">Bug2Build AI Assistant</h1>
              <p className="text-sm text-text-secondary">Trained on live community data</p>
            </div>
          </div>
        </div>

        {/* Layout Split for Desktop */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">

          {/* Sidebar / Quick Prompts */}
          <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-border p-4 flex flex-col gap-3 bg-bg-primary/30">
            <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">Quick Questions</h3>
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickPrompt(prompt)}
                className="text-left text-sm text-text-primary bg-bg-elevated border border-border px-3 py-2.5 rounded-lg hover:border-accent-cyan hover:text-accent-cyan transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col bg-bg-primary relative overflow-hidden">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
              {messages.map((msg, i) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={i}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] md:max-w-[75%] px-4 py-3 rounded-2xl text-[15px] leading-relaxed shadow-sm ${msg.role === 'user'
                      ? 'bg-accent-primary text-white rounded-br-sm'
                      : 'bg-bg-elevated text-text-primary border border-border rounded-bl-sm'
                    }`}>
                    {msg.role === 'assistant' ? (
                      <div className="prose prose-sm md:prose-base prose-invert max-w-none [&_p]:m-0 [&_p]:mb-2 [&_p:last-child]:mb-0 [&_ul]:my-2 [&_li]:my-1">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    ) : msg.content}
                  </div>
                </motion.div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-bg-elevated border border-border px-4 py-3.5 rounded-2xl rounded-bl-sm">
                    <div className="flex gap-1.5 items-center h-5">
                      {[0, 1, 2].map((i) => (
                        <div key={i} className="w-2.5 h-2.5 rounded-full bg-accent-primary/60 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} className="h-1" />
            </div>

            {/* Input Form */}
            <div className="p-4 bg-bg-surface border-t border-border">
              <form onSubmit={sendMessage} className="relative flex items-center max-w-4xl mx-auto">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything about Bug2Build..."
                  className="w-full bg-bg-primary border border-border rounded-xl pl-5 pr-14 py-3.5 text-base text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan transition-all shadow-sm"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="absolute right-2 p-2.5 rounded-lg gradient-btn text-white disabled:opacity-40 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all"
                >
                  <HiOutlinePaperAirplane className="w-5 h-5 rotate-90" />
                </button>
              </form>
              <p className="text-center text-[11px] text-text-muted mt-3">
                AI can make mistakes. Consider verifying critical information with the community team.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChatPage;
