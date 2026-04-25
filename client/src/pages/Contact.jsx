import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker,
  HiOutlineArrowRight, HiOutlineCheck, HiOutlinePaperAirplane,
  HiOutlineExternalLink, HiOutlineChevronRight,
} from 'react-icons/hi';
import { useToast } from '../components/common/ToastNotification';
import api from '../services/api';

/* ── animation helpers ── */
const fadeUp   = (delay = 0) => ({ hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] } } });
const fadeLeft = (delay = 0) => ({ hidden: { opacity: 0, x: -32 }, visible: { opacity: 1, x: 0, transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] } } });
const fadeRight= (delay = 0) => ({ hidden: { opacity: 0, x: 32  }, visible: { opacity: 1, x: 0, transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] } } });

/* CGC Landran, Mohali coordinates */
const CGC_LAT = 30.6942;
const CGC_LNG = 76.8606;

const Contact = () => {
  const [content, setContent]     = useState({});
  const [form, setForm]           = useState({ name: '', email: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent]           = useState(false);
  const [focused, setFocused]     = useState(null);
  const mapRef = useRef(null);
  const toast  = useToast();
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: '-80px' });

  useEffect(() => {
    api.get('/content/bulk?keys=contact_email,contact_phone,contact_address')
      .then((res) => setContent(res.data.data || {}))
      .catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.warning('Please fill in all required fields.', { title: 'Missing Fields' });
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/contact', form);
      setSent(true);
      toast.success('Message sent successfully!', { title: 'Message Sent' });
      setForm({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSent(false), 4000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send message.', { title: 'Error' });
    } finally {
      setSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: HiOutlineMail,
      label: 'Email Us',
      value: content.contact_email || 'contact@bug2build.in',
      href: `mailto:${content.contact_email || 'contact@bug2build.in'}`,
      color: '#6366f1',
      gradient: 'from-indigo-500/20 to-violet-500/10',
      desc: 'Drop us a line anytime',
    },
    {
      icon: HiOutlinePhone,
      label: 'Call Us',
      value: content.contact_phone || '+91 9876543210',
      href: `tel:${content.contact_phone || '+919876543210'}`,
      color: '#06b6d4',
      gradient: 'from-cyan-500/20 to-sky-500/10',
      desc: 'Mon–Fri, 10am–6pm IST',
    },
    {
      icon: HiOutlineLocationMarker,
      label: 'Visit Us',
      value: content.contact_address || 'CGC Landran, Mohali, Punjab',
      href: `https://maps.google.com/?q=CGC+University+Mohali`,
      color: '#8b5cf6',
      gradient: 'from-violet-500/20 to-purple-500/10',
      desc: 'CGC University, Landran',
    },
  ];

  /* Google Maps embed URL for CGC Landran */
  const mapEmbedUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3431.332817261604!2d76.60319107557841!3d30.680910674609247!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390fe5b795735cfd%3A0xb287b4430b6720fb!2sCGC%20University%2C%20Mohali!5e0!3m2!1sen!2sin!4v1777085963932!5m2!1sen!2sin`;

  const inputClass = (field) =>
    `w-full bg-bg-primary border rounded-xl px-4 py-3 text-sm text-text-primary outline-none transition-all duration-300 placeholder:text-text-muted/40 ${
      focused === field
        ? 'border-[#6366f1]/60 ring-2 ring-[#6366f1]/12 shadow-[0_0_0_4px_rgba(99,102,241,0.06)]'
        : 'border-border hover:border-[#6366f1]/30'
    }`;

  return (
    <div className="min-h-screen pt-24 pb-28 relative overflow-hidden">

      {/* ── Background decoration ── */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        {/* Top-left glow */}
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full opacity-[0.06]"
          style={{ background: 'radial-gradient(circle, #6366f1, transparent 70%)' }} />
        {/* Bottom-right glow */}
        <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full opacity-[0.05]"
          style={{ background: 'radial-gradient(circle, #8b5cf6, transparent 70%)' }} />
        {/* Dot grid */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dots" width="32" height="32" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.2" fill="#6366f1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
      </div>

      <div className="section-container relative z-10">

        {/* ── Hero header ── */}
        <motion.div
          variants={fadeUp(0)}
          initial="hidden"
          animate="visible"
          className="text-center mb-20"
        >
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[.2em] px-4 py-2 rounded-full mb-6"
            style={{ background: 'rgba(99,102,241,0.1)', color: '#6366f1', border: '1px solid rgba(99,102,241,0.2)' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#6366f1] animate-pulse" />
            Get In Touch
          </div>
          <h1 className="text-5xl md:text-7xl font-black font-heading mb-6 leading-[0.95] tracking-tight">
            <span className="gradient-text">Let's Build</span>
            <br />
            <span className="text-text-primary">Something Great</span>
          </h1>
          <p className="text-text-secondary text-lg md:text-xl max-w-xl mx-auto leading-relaxed">
            Have a question, want to collaborate, or just want to say hi?<br className="hidden md:block" /> We'd love to hear from you.
          </p>

          {/* Decorative line */}
          <div className="flex items-center justify-center gap-3 mt-8">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#6366f1]/40" />
            <div className="w-2 h-2 rounded-full bg-[#6366f1]/60" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#6366f1]/40" />
          </div>
        </motion.div>

        {/* ── Top row: info cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto mb-12">
          {contactInfo.map((item, i) => (
            <motion.div
              key={i}
              variants={fadeUp(0.1 + i * 0.07)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
            >
              {item.href ? (
                <a href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                  className="group card-base p-6 flex gap-4 relative overflow-hidden block hover:border-opacity-50 transition-all duration-300"
                  style={{ '--accent': item.color }}>
                  <CardInner item={item} />
                </a>
              ) : (
                <div className="group card-base p-6 flex gap-4 relative overflow-hidden"
                  style={{ '--accent': item.color }}>
                  <CardInner item={item} />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* ── Main grid: form + map ── */}
        <div ref={sectionRef} className="grid grid-cols-1 lg:grid-cols-5 gap-6 max-w-5xl mx-auto">

          {/* ── Contact Form ── */}
          <motion.div
            variants={fadeLeft(0.15)}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="lg:col-span-3"
          >
            <div className="card-base p-8 md:p-10 h-full relative overflow-hidden">
              {/* Subtle corner accent */}
              <div className="absolute top-0 right-0 w-32 h-32 opacity-[0.04] pointer-events-none"
                style={{ background: 'radial-gradient(circle at top right, #6366f1, transparent 70%)' }} />

              <div className="mb-7">
                <h2 className="text-xl font-black font-heading text-text-primary mb-1.5">Send a Message</h2>
                <p className="text-text-muted text-sm">We'll get back to you within 24 hours.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-text-secondary mb-2 uppercase tracking-wider">Name <span className="text-[#f43f5e]">*</span></label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      onFocus={() => setFocused('name')}
                      onBlur={() => setFocused(null)}
                      placeholder="Your full name"
                      className={inputClass('name')}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-secondary mb-2 uppercase tracking-wider">Email <span className="text-[#f43f5e]">*</span></label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      onFocus={() => setFocused('email')}
                      onBlur={() => setFocused(null)}
                      placeholder="you@example.com"
                      className={inputClass('email')}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-secondary mb-2 uppercase tracking-wider">Subject</label>
                  <input
                    type="text"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    onFocus={() => setFocused('subject')}
                    onBlur={() => setFocused(null)}
                    placeholder="What's this about?"
                    className={inputClass('subject')}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-secondary mb-2 uppercase tracking-wider">Message <span className="text-[#f43f5e]">*</span></label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    onFocus={() => setFocused('message')}
                    onBlur={() => setFocused(null)}
                    rows="5"
                    placeholder="Tell us what's on your mind…"
                    className={`${inputClass('message')} resize-none`}
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={submitting || sent}
                  whileHover={!submitting && !sent ? { scale: 1.01, y: -1 } : {}}
                  whileTap={!submitting && !sent ? { scale: 0.99 } : {}}
                  className="w-full font-black py-4 rounded-xl text-white flex items-center justify-center gap-2.5 text-sm transition-all duration-300 disabled:opacity-70"
                  style={sent
                    ? { background: 'linear-gradient(135deg, #10b981, #059669)', boxShadow: '0 6px 24px rgba(16,185,129,0.35)' }
                    : { background: 'linear-gradient(135deg, #FF6B8A, #8B5CF6)', boxShadow: '0 6px 24px rgba(139,92,246,0.35)' }}
                >
                  {submitting ? (
                    <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Sending…</>
                  ) : sent ? (
                    <><HiOutlineCheck className="w-4.5 h-4.5" />Message Sent!</>
                  ) : (
                    <><HiOutlinePaperAirplane className="w-4.5 h-4.5 -rotate-45" />Send Message</>
                  )}
                </motion.button>
              </form>

              {/* Privacy note */}
              <p className="text-[11px] text-text-muted text-center mt-4 opacity-60">
                We respect your privacy. Your info will never be shared.
              </p>
            </div>
          </motion.div>

          {/* ── Map + location card ── */}
          <motion.div
            variants={fadeRight(0.2)}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="lg:col-span-2 flex flex-col gap-4"
          >
            {/* Map iframe */}
            <div className="card-base overflow-hidden flex-1 relative" style={{ minHeight: 280 }}>
              {/* Custom header bar */}
              <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-3"
                style={{ background: 'linear-gradient(180deg, rgba(7,9,18,0.85) 0%, transparent 100%)' }}>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center"
                    style={{ background: 'rgba(99,102,241,0.25)', border: '1px solid rgba(99,102,241,0.4)' }}>
                    <HiOutlineLocationMarker className="w-3.5 h-3.5 text-[#6366f1]" />
                  </div>
                  <span className="text-xs font-bold text-white/90">CGC Landran, Mohali</span>
                </div>
                <a
                  href="https://maps.google.com/?q=CGC+University+Mohali"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[10px] font-bold text-white/60 hover:text-white/90 transition-colors"
                >
                  Open Maps <HiOutlineExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* The iframe */}
              <iframe
                ref={mapRef}
                title="CGC Landran Mohali"
                src={mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 'none', minHeight: 280, display: 'block', filter: 'hue-rotate(220deg) saturate(0.7) brightness(0.85)' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />

              {/* SVG custom pin overlay */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                {/* Outer pulse rings */}
                <div className="absolute" style={{ transform: 'translate(-2px, -18px)' }}>
                  <div className="relative flex items-center justify-center">
                    <span className="absolute w-14 h-14 rounded-full animate-ping opacity-20"
                      style={{ background: '#FF6B8A', animationDuration: '2s' }} />
                    <span className="absolute w-10 h-10 rounded-full animate-ping opacity-30"
                      style={{ background: '#8B5CF6', animationDuration: '2s', animationDelay: '0.4s' }} />
                    {/* Pin body */}
                    <svg width="38" height="50" viewBox="0 0 38 50" fill="none" xmlns="http://www.w3.org/2000/svg"
                      style={{ filter: 'drop-shadow(0 6px 14px rgba(139,92,246,0.6)) drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}>
                      <defs>
                        <linearGradient id="pinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#FF6B8A" />
                          <stop offset="100%" stopColor="#8B5CF6" />
                        </linearGradient>
                        <radialGradient id="pinShine" cx="35%" cy="30%" r="50%">
                          <stop offset="0%" stopColor="rgba(255,255,255,0.35)" />
                          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                        </radialGradient>
                      </defs>
                      {/* Pin teardrop */}
                      <path d="M19 2C10.163 2 3 9.163 3 18c0 10.627 14.293 27.47 15.27 28.617a.998.998 0 001.46 0C20.707 45.47 35 28.627 35 18 35 9.163 27.837 2 19 2z"
                        fill="url(#pinGrad)" />
                      {/* Shine overlay */}
                      <path d="M19 2C10.163 2 3 9.163 3 18c0 10.627 14.293 27.47 15.27 28.617a.998.998 0 001.46 0C20.707 45.47 35 28.627 35 18 35 9.163 27.837 2 19 2z"
                        fill="url(#pinShine)" />
                      {/* Inner white circle */}
                      <circle cx="19" cy="18" r="7" fill="white" opacity="0.95" />
                      {/* B2B dot */}
                      <circle cx="19" cy="18" r="4" fill="url(#pinGrad)" />
                      <circle cx="19" cy="18" r="1.8" fill="white" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Bottom gradient fade */}
              <div className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none"
                style={{ background: 'linear-gradient(0deg, rgba(7,9,18,0.4) 0%, transparent 100%)' }} />
            </div>

            {/* Location detail card */}
            <div className="card-base p-5 relative overflow-hidden"
              style={{ border: '1px solid rgba(99,102,241,0.2)', background: 'linear-gradient(135deg, rgba(99,102,241,0.06), rgba(139,92,246,0.04))' }}>
              {/* Accent strip */}
              <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl"
                style={{ background: 'linear-gradient(180deg, #6366f1, #8b5cf6)' }} />

              <div className="flex items-start gap-4 pl-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.25)' }}>
                  <HiOutlineLocationMarker className="w-5 h-5 text-[#6366f1]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-text-primary font-black text-sm leading-snug">CGC Landran</p>
                  <p className="text-text-muted text-xs mt-0.5 leading-relaxed">
                    Chandigarh Group of Colleges<br />
                    Landran, Mohali, Punjab 140307
                  </p>
                  <a
                    href="https://maps.google.com/dir/?api=1&destination=CGC+University+Mohali"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 mt-2.5 text-[11px] font-bold transition-all duration-200"
                    style={{ color: '#6366f1' }}
                  >
                    Get Directions <HiOutlineChevronRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── Bottom CTA strip ── */}
        <motion.div
          variants={fadeUp(0.3)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-5xl mx-auto mt-12"
        >
          <div className="relative overflow-hidden rounded-2xl p-7 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6"
            style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(139,92,246,0.08) 50%, rgba(6,182,212,0.06) 100%)', border: '1px solid rgba(99,102,241,0.18)' }}>
            {/* BG orbs */}
            <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full opacity-10 pointer-events-none"
              style={{ background: 'radial-gradient(circle, #8b5cf6, transparent)' }} />
            <div className="absolute -bottom-6 left-16 w-28 h-28 rounded-full opacity-8 pointer-events-none"
              style={{ background: 'radial-gradient(circle, #6366f1, transparent)' }} />

            <div className="relative z-10">
              <h3 className="text-xl font-black font-heading text-text-primary mb-1.5">Join the Bug2Build Community</h3>
              <p className="text-text-secondary text-sm">Connect with builders, hackers, and creators across India.</p>
            </div>
            <div className="flex items-center gap-3 relative z-10 flex-shrink-0">
              <a
                href="mailto:contact@bug2build.in"
                className="flex items-center gap-2 text-sm font-black px-5 py-2.5 rounded-xl text-white transition-all duration-200"
                style={{ background: 'linear-gradient(135deg, #FF6B8A, #8B5CF6)', boxShadow: '0 4px 16px rgba(139,92,246,0.35)' }}
              >
                <HiOutlineMail className="w-4 h-4" />
                Email Us
              </a>
              <a
                href="https://maps.google.com/?q=CGC+University+Mohali"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl transition-all duration-200 text-text-secondary hover:text-text-primary"
                style={{ border: '1px solid rgba(99,102,241,0.25)', background: 'rgba(99,102,241,0.06)' }}
              >
                <HiOutlineLocationMarker className="w-4 h-4" />
                Find Us
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

/* ── Info card inner (shared between <a> and <div>) ── */
const CardInner = ({ item }) => (
  <>
    {/* Gradient bg on hover */}
    <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 bg-gradient-to-br ${item.gradient}`} />
    {/* Left strip */}
    <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-xl transition-all duration-300 opacity-60 group-hover:opacity-100"
      style={{ background: `linear-gradient(180deg, ${item.color}, ${item.color}66)` }} />
    {/* Icon */}
    <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
      style={{ background: `${item.color}15`, border: `1px solid ${item.color}25` }}>
      <item.icon className="w-5 h-5" style={{ color: item.color }} />
    </div>
    {/* Text */}
    <div className="relative z-10 min-w-0">
      <p className="text-[10px] font-black uppercase tracking-[.18em] mb-1" style={{ color: item.color }}>{item.label}</p>
      <p className="text-text-primary text-sm font-bold truncate leading-snug">{item.value}</p>
      <p className="text-text-muted text-[11px] mt-0.5">{item.desc}</p>
    </div>
    {/* Arrow hint */}
    {item.href && (
      <HiOutlineChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted opacity-0 group-hover:opacity-60 transition-all duration-200 group-hover:translate-x-0.5" />
    )}
  </>
);

export default Contact;