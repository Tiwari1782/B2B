import { useEffect, useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, useMotionValue, useTransform, animate, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import {
  HiOutlineCalendar, HiOutlineLocationMarker, HiOutlineArrowRight,
  HiOutlineUsers, HiOutlineLightningBolt, HiOutlineCode,
  HiOutlineAcademicCap, HiOutlineDesktopComputer, HiOutlineFlag,
  HiOutlineSparkles, HiOutlineGlobe, HiOutlineFire,
} from 'react-icons/hi';
import api from '../services/api';

/* ─────────────────────────────────────────────────────────────
   ANIMATION VARIANTS
───────────────────────────────────────────────────────────── */
const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};

const fadeIn = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
};

/* ─────────────────────────────────────────────────────────────
   SCROLL PROGRESS BAR
───────────────────────────────────────────────────────────── */
const ScrollProgressBar = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] z-[9999] origin-left"
      style={{
        scaleX,
        background: 'linear-gradient(90deg, #3B5FCC, #5B7FE6, #1A8FBC)',
      }}
    />
  );
};

/* ─────────────────────────────────────────────────────────────
   SCROLL-TRIGGERED SECTION
───────────────────────────────────────────────────────────── */
const ScrollSection = ({ children, className = '', delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: {
          opacity: 1, y: 0,
          transition: { duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] },
        },
      }}
      className={className}
    >
      {children}
    </motion.section>
  );
};

/* ─────────────────────────────────────────────────────────────
   COUNT-UP ANIMATION
───────────────────────────────────────────────────────────── */
const CountUp = ({ to, suffix = '', duration = 2.5 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v) + suffix);

  useEffect(() => {
    if (!isInView) return;
    const ctrl = animate(count, to, { duration, ease: 'easeOut' });
    return ctrl.stop;
  }, [isInView, count, to, duration]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
};

/* ─────────────────────────────────────────────────────────────
   MOUSE SPOTLIGHT HERO BACKGROUND
───────────────────────────────────────────────────────────── */
const HeroBackground = () => {
  const [mouse, setMouse] = useState({ x: 50, y: 50 });
  const handleMove = useCallback((e) => {
    setMouse({
      x: (e.clientX / window.innerWidth) * 100,
      y: (e.clientY / window.innerHeight) * 100,
    });
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, [handleMove]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Mouse-following spotlight */}
      <div
        className="absolute w-[700px] h-[700px] rounded-full transition-all duration-700 ease-out"
        style={{
          background: 'radial-gradient(circle, rgba(59,95,204,0.25) 0%, transparent 70%)',
          left: `${mouse.x}%`,
          top: `${mouse.y}%`,
          transform: 'translate(-50%, -50%)',
        }}
      />

      {/* Static ambient orbs */}
      <div className="absolute top-16 left-16 w-80 h-80 rounded-full bg-accent-primary/25 blur-[100px]" />
      <div className="absolute bottom-24 right-16 w-96 h-96 rounded-full bg-[var(--color-accent-cyan)]/25 blur-[120px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-[var(--color-accent-secondary)]/15 blur-[180px]" />

      {/* Animated particles */}
      {Array.from({ length: 18 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full bg-accent-primary/80"
          style={{
            left: `${10 + (i * 5.2) % 82}%`,
            top: `${5 + (i * 7.3) % 88}%`,
          }}
          animate={{
            y: [0, -40, 0],
            x: [0, (i % 2 === 0 ? 1 : -1) * 20, 0],
            opacity: [0.5, 1, 0.5],
            scale: [1, 1.8, 1],
          }}
          transition={{
            duration: 4 + (i % 4),
            delay: i * 0.3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Floating geometric shapes */}
      {[
        { size: 56, x: '14%', y: '22%', d: 6, color: 'var(--color-shape-blue)', rotate: 45 },
        { size: 38, x: '79%', y: '18%', d: 8, color: 'var(--color-shape-cyan)', rotate: 12 },
        { size: 72, x: '68%', y: '62%', d: 10, color: 'var(--color-shape-bright)', rotate: 30 },
        { size: 28, x: '24%', y: '72%', d: 7, color: 'var(--color-shape-navy)', rotate: 60 },
        { size: 48, x: '88%', y: '38%', d: 9, color: 'var(--color-shape-blue)', rotate: 20 },
        { size: 34, x: '6%', y: '55%', d: 6, color: 'var(--color-shape-cyan)', rotate: 75 },
      ].map((s, i) => (
        <motion.div
          key={`shape-${i}`}
          className="absolute rounded-2xl"
          style={{
            width: s.size, height: s.size,
            left: s.x, top: s.y,
            background: s.color,
            border: `1px solid ${s.color.replace('0.22', '0.6')}`,
            rotate: s.rotate,
          }}
          animate={{
            y: [0, -28, 8, 0],
            rotate: [s.rotate, s.rotate + 90, s.rotate + 180, s.rotate + 270, s.rotate + 360],
            scale: [1, 1.08, 0.96, 1],
          }}
          transition={{ duration: s.d, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
        />
      ))}

      {/* Grid mesh overlay */}
      <div
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(59,95,204,0.8) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59,95,204,0.8) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   STAT CARD (hero)
───────────────────────────────────────────────────────────── */
const StatCard = ({ icon: Icon, value, suffix, label, color, delay }) => (
  <motion.div
    variants={fadeUp}
    transition={{ delay }}
    className="relative flex-1 text-center px-4 py-6 group cursor-default"
  >
    {/* hover glow */}
    <div className="absolute inset-0 rounded-2xl bg-accent-primary/0 group-hover:bg-accent-primary/5 transition-all duration-300" />
    <div
      className="w-11 h-11 rounded-xl flex items-center justify-center mx-auto mb-3 transition-transform duration-300 group-hover:scale-110"
      style={{ background: `${color}18` }}
    >
      <Icon className="w-5 h-5" style={{ color }} />
    </div>
    <div className="text-3xl md:text-4xl font-black font-heading tracking-tight" style={{ color }}>
      <CountUp to={value} suffix={suffix} />
    </div>
    <div className="text-[11px] text-text-muted font-semibold tracking-[0.18em] uppercase mt-1.5">{label}</div>
    <div className="absolute right-0 top-1/4 bottom-1/4 w-px bg-border/50 last:hidden" />
  </motion.div>
);

/* ─────────────────────────────────────────────────────────────
   TIMELINE DATA
───────────────────────────────────────────────────────────── */
const milestones = [
  {
    date: 'August 2025',
    title: 'Establishment of Community',
    description: 'Bug2Build was officially founded — a community built by students, for students, to bridge the gap between bugs and real-world builds.',
    icon: HiOutlineFlag,
    color: '#3B5FCC',
    tag: 'Origin Story',
  },
  {
    date: '18 October 2025',
    title: 'Cyber Security, IOT & AI Workshop',
    description: 'Conducted a comprehensive workshop covering Cyber Security, IOT, AI, and General Computer Skills at a government school, bringing tech education to underserved communities.',
    icon: HiOutlineAcademicCap,
    color: '#1A8FBC',
    tag: 'Workshop',
  },
  {
    date: '10 April 2026',
    title: 'Code Clash Hosted',
    description: 'Successfully hosted Code Clash — an intense competitive programming event that brought together developers to compete, collaborate, and showcase their skills.',
    icon: HiOutlineDesktopComputer,
    color: '#5B7FE6',
    tag: 'Event',
  },
];

/* ─────────────────────────────────────────────────────────────
   TIMELINE CARD (redesigned alternating)
───────────────────────────────────────────────────────────── */
const TimelineCard = ({ milestone, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const isLeft = index % 2 === 0;
  const [hovered, setHovered] = useState(false);

  return (
    <div ref={ref} className="relative flex items-center mb-12 md:mb-16 last:mb-0">
      {/* Center dot */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="absolute left-1/2 -translate-x-1/2 z-10 w-5 h-5 rounded-full border-2 border-accent-primary bg-bg-primary shadow-[0_0_16px_rgba(59,95,204,0.5)]"
        style={{ top: '1.75rem' }}
      >
        <motion.div
          className="absolute inset-1 rounded-full bg-accent-primary"
          animate={hovered ? { scale: [1, 1.4, 1] } : {}}
          transition={{ duration: 0.4 }}
        />
      </motion.div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        className={`w-full md:w-[calc(50%-3.5rem)] ${isLeft ? 'md:mr-auto' : 'md:ml-auto'}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ duration: 0.25 }}
          className="relative card-base overflow-hidden group"
          style={{
            boxShadow: hovered
              ? `0 20px 40px -12px ${milestone.color}25, 0 0 0 1px ${milestone.color}30`
              : undefined,
          }}
        >
          {/* Color bar top */}
          <div
            className="h-1 w-full"
            style={{ background: `linear-gradient(90deg, ${milestone.color}, ${milestone.color}55)` }}
          />

          <div className="p-6 md:p-7">
            {/* Tag + date row */}
            <div className="flex items-center justify-between mb-4">
              <span
                className="text-[10px] font-bold tracking-[0.2em] uppercase px-2.5 py-1 rounded-full"
                style={{ background: `${milestone.color}15`, color: milestone.color }}
              >
                {milestone.tag}
              </span>
              <span className="text-xs text-text-muted font-medium flex items-center gap-1.5">
                <HiOutlineCalendar className="w-3.5 h-3.5" />
                {milestone.date}
              </span>
            </div>

            {/* Icon + title */}
            <div className="flex items-start gap-4 mb-3">
              <motion.div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                style={{ background: `${milestone.color}15` }}
                animate={hovered ? { rotate: [0, -8, 8, 0] } : {}}
                transition={{ duration: 0.4 }}
              >
                <milestone.icon className="w-5 h-5" style={{ color: milestone.color }} />
              </motion.div>
              <h3 className="font-heading font-bold text-lg md:text-xl text-text-primary leading-snug group-hover:text-accent-primary transition-colors duration-300">
                {milestone.title}
              </h3>
            </div>

            <p className="text-text-secondary text-sm leading-relaxed">{milestone.description}</p>

            {/* Read more hint */}
            <div className="flex items-center gap-1.5 mt-4 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ color: milestone.color }}>
              <HiOutlineSparkles className="w-3.5 h-3.5" />
              <span>Milestone achieved</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   EVENT CARD (redesigned)
───────────────────────────────────────────────────────────── */
const EventCard = ({ event, index }) => {
  const [hovered, setHovered] = useState(false);
  const statusConfig = {
    upcoming: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', dot: 'bg-emerald-400', label: 'Upcoming' },
    ongoing:  { bg: 'bg-accent-cyan/10',  text: 'text-accent-cyan',  dot: 'bg-accent-cyan',  label: 'Live Now' },
    past:     { bg: 'bg-text-muted/10',   text: 'text-text-muted',   dot: 'bg-text-muted',   label: 'Past' },
  };
  const s = statusConfig[event.status] || statusConfig.past;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="h-full"
    >
      <Link
        to={`/events/${event._id}`}
        className="block h-full relative overflow-hidden rounded-2xl border border-border bg-bg-surface transition-all duration-300"
        style={{
          boxShadow: hovered
            ? '0 24px 48px -12px rgba(59,95,204,0.2), 0 0 0 1px rgba(59,95,204,0.2)'
            : '0 4px 16px -4px rgba(0,0,0,0.2)',
          transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
          transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        {/* Image */}
        {(event.coverImage || event.image) ? (
          <div className="h-48 overflow-hidden relative">
            <img
              src={event.coverImage || event.image}
              alt={event.title}
              className="w-full h-full object-cover transition-transform duration-700"
              style={{ transform: hovered ? 'scale(1.08)' : 'scale(1)' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bg-surface/80 to-transparent" />
            {/* Status badge over image */}
            <div className="absolute top-4 left-4">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${s.bg} ${s.text}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${s.dot} ${event.status === 'ongoing' ? 'animate-pulse' : ''}`} />
                {s.label}
              </span>
            </div>
          </div>
        ) : (
          <div className="h-48 relative overflow-hidden bg-gradient-to-br from-accent-primary/10 to-accent-secondary/10 flex items-center justify-center">
            <HiOutlineCalendar className="w-16 h-16 text-accent-primary/20" />
            <div className="absolute top-4 left-4">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${s.bg} ${s.text}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                {s.label}
              </span>
            </div>
          </div>
        )}

        <div className="p-6">
          <h3 className="font-heading font-bold text-base md:text-lg text-text-primary mb-3 leading-snug group-hover:text-accent-primary transition-colors line-clamp-2"
            style={{ color: hovered ? 'var(--accent-primary)' : undefined }}>
            {event.title}
          </h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-text-secondary text-xs">
              <HiOutlineCalendar className="w-3.5 h-3.5 shrink-0 text-accent-primary/60" />
              <span>{new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            </div>
            {event.location && (
              <div className="flex items-center gap-2 text-text-secondary text-xs">
                <HiOutlineLocationMarker className="w-3.5 h-3.5 shrink-0 text-accent-primary/60" />
                <span className="truncate">{event.location}</span>
              </div>
            )}
          </div>
          <div className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-accent-primary">
            View Details
            <motion.span animate={hovered ? { x: 4 } : { x: 0 }} transition={{ duration: 0.2 }}>
              <HiOutlineArrowRight className="w-3.5 h-3.5" />
            </motion.span>
          </div>
        </div>
      </Link>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   TEAM MEMBER CARD
───────────────────────────────────────────────────────────── */
const TeamCard = ({ member }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      variants={fadeUp}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="text-center group"
    >
      <div className="relative mx-auto w-28 h-28 mb-4">
        {/* Animated ring */}
        <motion.div
          className="absolute -inset-1.5 rounded-full"
          style={{
            background: 'conic-gradient(from 0deg, #3B5FCC, #5B7FE6, #1A8FBC, #3B5FCC)',
            opacity: hovered ? 1 : 0,
          }}
          animate={hovered ? { rotate: 360 } : {}}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />
        <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-border bg-bg-surface">
          {member.photo
            ? <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
            : (
              <div className="w-full h-full flex items-center justify-center text-2xl font-black text-accent-primary bg-accent-primary/10">
                {member.name[0]}
              </div>
            )
          }
        </div>
        {/* Online dot */}
        <div className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-bg-primary" />
      </div>
      <h4 className="font-heading font-bold text-sm text-text-primary transition-colors duration-200 group-hover:text-accent-primary">{member.name}</h4>
      <p className="text-text-muted text-xs mt-0.5">{member.role}</p>
    </motion.div>
  );
};

/* ─────────────────────────────────────────────────────────────
   SECTION HEADER
───────────────────────────────────────────────────────────── */
const SectionHeader = ({ eyebrow, title, subtitle, align = 'center' }) => (
  <div className={`mb-14 md:mb-16 ${align === 'center' ? 'text-center' : ''}`}>
    {eyebrow && (
      <motion.span
        variants={fadeIn}
        className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.22em] uppercase text-accent-primary mb-4"
      >
        <span className="w-6 h-px bg-accent-primary" />
        {eyebrow}
        <span className="w-6 h-px bg-accent-primary" />
      </motion.span>
    )}
    <motion.h2 variants={fadeUp} className="text-3xl md:text-5xl font-black font-heading leading-[1.1] mb-4">
      <span className="gradient-text">{title}</span>
    </motion.h2>
    {subtitle && (
      <motion.p variants={fadeUp} className="text-text-secondary text-base md:text-lg max-w-2xl mx-auto">
        {subtitle}
      </motion.p>
    )}
  </div>
);

/* ─────────────────────────────────────────────────────────────
   FEATURE PILL (about section)
───────────────────────────────────────────────────────────── */
const FeaturePill = ({ icon: Icon, text, color }) => (
  <motion.div
    variants={fadeIn}
    whileHover={{ scale: 1.04, y: -2 }}
    className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full border border-border bg-bg-surface/60 backdrop-blur-sm cursor-default"
  >
    <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: `${color}20` }}>
      <Icon className="w-3.5 h-3.5" style={{ color }} />
    </div>
    <span className="text-sm font-medium text-text-secondary">{text}</span>
  </motion.div>
);

/* ─────────────────────────────────────────────────────────────
   MAIN HOME COMPONENT
───────────────────────────────────────────────────────────── */
const Home = () => {
  const [content, setContent] = useState({});
  const [events, setEvents] = useState([]);
  const [team, setTeam] = useState([]);
  const [partners, setPartners] = useState([]);
  const [brands, setBrands] = useState([]);
  const [activeTab, setActiveTab] = useState('upcoming');

  useEffect(() => {
    Promise.allSettled([
      api.get('/content/bulk?keys=hero_title,hero_subtitle,hero_cta,about_description'),
      api.get('/events?limit=6'),
      api.get('/team'),
      api.get('/partners'),
      api.get('/brands'),
    ]).then(([contentRes, eventsRes, teamRes, partnersRes, brandsRes]) => {
      if (contentRes.status === 'fulfilled') setContent(contentRes.value.data.data || {});
      if (eventsRes.status === 'fulfilled')  setEvents(eventsRes.value.data.data || []);
      if (teamRes.status === 'fulfilled')    setTeam(teamRes.value.data.data?.filter(m => m.category === 'executive').slice(0, 8) || []);
      if (partnersRes.status === 'fulfilled') setPartners(partnersRes.value.data.data || []);
      if (brandsRes.status === 'fulfilled')  setBrands(brandsRes.value.data.data || []);
    });
  }, []);

  const displayedEvents = events.slice(0, 3);

  return (
    <div className="min-h-screen">
      <ScrollProgressBar />

      {/* ══════════════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <HeroBackground />
        <div className="absolute inset-0 bg-gradient-to-b from-bg-primary/20 via-transparent to-bg-primary/60" />

        <div className="section-container relative z-10 pt-36 pb-28">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-5xl mx-auto text-center"
          >
            {/* Badge */}
            <motion.div variants={fadeIn} className="mb-8">
              <span className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full border border-border/60 bg-bg-surface/40 backdrop-blur-md text-xs font-semibold tracking-[0.18em] uppercase text-text-secondary shadow-lg shadow-black/10">
                <span className="relative flex w-2 h-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
                Open Source · Non-Profit · Community Driven
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fadeUp}
              className="text-5xl sm:text-6xl md:text-8xl font-black font-heading leading-[1.0] mb-6 tracking-tight"
            >
              <span className="gradient-text">{content.hero_title || 'Bug2Build'}</span>
            </motion.h1>

            {/* Typewriter */}
            <motion.div variants={fadeUp} className="min-h-[4rem] flex items-center justify-center mb-10">
              <TypeAnimation
                sequence={[
                  'An open-source community empowering the next generation of developers.',
                  2800,
                  'A non-profit initiative bridging the gap between learning and building.',
                  2800,
                  'Where students transform bugs into real-world solutions, together.',
                  2800,
                  'Free workshops, hackathons, and hands-on projects for everyone.',
                  2800,
                ]}
                wrapper="p"
                speed={50}
                deletionSpeed={65}
                repeat={Infinity}
                className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed"
              />
            </motion.div>

            {/* CTA Buttons */}
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
              <Link
                to="/events"
                className="group gradient-btn text-white font-bold px-9 py-4 rounded-2xl text-base inline-flex items-center justify-center gap-2.5 shadow-[0_8px_24px_rgba(59,95,204,0.35)] hover:shadow-[0_12px_32px_rgba(59,95,204,0.5)] transition-all duration-300 hover:-translate-y-0.5"
              >
                {content.hero_cta || 'Explore Events'}
                <motion.span
                  className="flex items-center"
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <HiOutlineArrowRight className="w-5 h-5" />
                </motion.span>
              </Link>
              <Link
                to="/contact"
                className="px-9 py-4 rounded-2xl border border-border/80 text-text-primary font-bold hover:border-accent-primary/60 hover:bg-accent-primary/5 transition-all duration-300 text-base text-center backdrop-blur-sm hover:-translate-y-0.5"
              >
                Get In Touch
              </Link>
            </motion.div>

            {/* Stats Card */}
            <motion.div
              variants={fadeIn}
              className="relative max-w-3xl mx-auto"
            >
              <div className="absolute -inset-px rounded-[2rem] bg-gradient-to-r from-accent-primary/30 via-accent-secondary/30 to-accent-cyan/30 blur-sm" />
              <div className="relative rounded-[2rem] border border-border/50 bg-bg-surface/60 backdrop-blur-xl overflow-hidden">
                {/* Shimmer line */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-primary/60 to-transparent" />

                <div className="flex divide-x divide-border/40">
                  {[
                    { icon: HiOutlineUsers, value: 1000, suffix: '+', label: 'Members', color: '#3B5FCC' },
                    { icon: HiOutlineLightningBolt, value: 15, suffix: '+', label: 'Events', color: '#5B7FE6' },
                    { icon: HiOutlineCode, value: 100, suffix: '+', label: 'Projects', color: '#1A8FBC' },
                  ].map((stat, i) => (
                    <StatCard key={i} {...stat} delay={0.1 * i} />
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-bg-primary to-transparent" />
      </section>

      {/* ══════════════════════════════════════════════
          ABOUT PREVIEW
      ══════════════════════════════════════════════ */}
      <ScrollSection className="py-24 md:py-32">
        <div className="section-container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="max-w-5xl mx-auto"
          >
            <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
              {/* Left: text */}
              <div>
                <motion.span variants={fadeIn} className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.22em] uppercase text-accent-primary mb-5">
                  <span className="w-6 h-px bg-accent-primary" /> About Us
                </motion.span>
                <motion.h2 variants={fadeUp} className="text-3xl md:text-5xl font-black font-heading leading-[1.1] mb-6">
                  <span className="gradient-text">Powering the Next Generation of Builders</span>
                </motion.h2>
                <motion.p variants={fadeUp} className="text-text-secondary text-base md:text-lg leading-relaxed mb-8">
                  {content.about_description || 'Bug2Build is a vibrant tech community dedicated to empowering students and developers through hands-on projects, hackathons, and collaborative learning.'}
                </motion.p>
                <motion.div variants={fadeUp}>
                  <Link
                    to="/about"
                    className="inline-flex items-center gap-2.5 text-accent-primary font-bold text-base group"
                  >
                    Learn More
                    <motion.span
                      className="w-8 h-8 rounded-full border border-accent-primary/40 flex items-center justify-center group-hover:bg-accent-primary/10 transition-colors"
                      whileHover={{ x: 4 }}
                    >
                      <HiOutlineArrowRight className="w-4 h-4" />
                    </motion.span>
                  </Link>
                </motion.div>
              </div>

              {/* Right: feature pills */}
              <motion.div variants={staggerContainer} className="flex flex-wrap gap-3">
                {[
                  { icon: HiOutlineCode, text: 'Open Source Projects', color: '#3B5FCC' },
                  { icon: HiOutlineLightningBolt, text: 'Hackathons & Events', color: '#5B7FE6' },
                  { icon: HiOutlineAcademicCap, text: 'Free Workshops', color: '#4E8AE6' },
                  { icon: HiOutlineUsers, text: 'Peer Learning', color: '#1A8FBC' },
                  { icon: HiOutlineGlobe, text: 'Global Community', color: '#10B981' },
                  { icon: HiOutlineFire, text: 'Real-World Impact', color: '#F59E0B' },
                  { icon: HiOutlineSparkles, text: 'Student-Led Initiatives', color: '#EC4899' },
                  { icon: HiOutlineFlag, text: 'Non-Profit Mission', color: '#3B5FCC' },
                ].map((pill, i) => (
                  <FeaturePill key={i} {...pill} />
                ))}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </ScrollSection>

      <div className="section-divider" />

      {/* ══════════════════════════════════════════════
          JOURNEY TIMELINE
      ══════════════════════════════════════════════ */}
      <ScrollSection className="py-24 md:py-32">
        <div className="section-container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <SectionHeader
              eyebrow="Our Story"
              title="Our Journey"
              subtitle="Key milestones that have shaped Bug2Build into what it is today."
            />
          </motion.div>

          <div className="relative max-w-4xl mx-auto">
            {/* Center line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 hidden md:block">
              <div className="h-full bg-gradient-to-b from-accent-primary/60 via-accent-secondary/40 to-transparent" />
            </div>
            {/* Mobile line */}
            <div className="absolute left-4 top-0 bottom-0 w-px md:hidden bg-gradient-to-b from-accent-primary/50 to-transparent" />

            {milestones.map((milestone, index) => (
              <TimelineCard key={index} milestone={milestone} index={index} />
            ))}
          </div>
        </div>
      </ScrollSection>

      <div className="section-divider" />

      {/* ══════════════════════════════════════════════
          EVENTS SECTION
      ══════════════════════════════════════════════ */}
      <ScrollSection className="py-24 md:py-32">
        <div className="section-container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {/* Header row */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
              <div>
                <motion.span variants={fadeIn} className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.22em] uppercase text-accent-primary mb-4">
                  <span className="w-6 h-px bg-accent-primary" /> What's Coming
                </motion.span>
                <motion.h2 variants={fadeUp} className="text-3xl md:text-5xl font-black font-heading">
                  <span className="gradient-text">Latest Events</span>
                </motion.h2>
                <motion.p variants={fadeUp} className="text-text-secondary text-base mt-2">Don't miss out on what's coming next.</motion.p>
              </div>
              <motion.div variants={fadeIn}>
                <Link
                  to="/events"
                  className="hidden md:inline-flex items-center gap-2.5 text-sm font-bold text-accent-primary border border-accent-primary/30 px-5 py-2.5 rounded-xl hover:bg-accent-primary/10 transition-all duration-200 group"
                >
                  View All Events
                  <HiOutlineArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </div>

            {displayedEvents.length > 0 ? (
              <div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
              >
                {displayedEvents.map((event, index) => (
                  <EventCard key={event._id} event={event} index={index} />
                ))}
              </div>
            ) : (
              <motion.div variants={fadeIn} className="card-base p-14 text-center">
                <div className="w-16 h-16 rounded-2xl bg-accent-primary/10 flex items-center justify-center mx-auto mb-5">
                  <HiOutlineCalendar className="w-8 h-8 text-accent-primary/60" />
                </div>
                <h3 className="font-heading font-bold text-lg text-text-primary mb-2">No events yet</h3>
                <p className="text-text-secondary text-sm mb-7">Stay tuned — exciting events are on the way!</p>
                <Link to="/events" className="gradient-btn text-white font-bold px-7 py-3 rounded-xl text-sm inline-flex items-center gap-2">
                  Browse All Events <HiOutlineArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            )}

            <div className="mt-8 text-center md:hidden">
              <Link to="/events" className="inline-flex items-center gap-2 text-accent-primary font-bold text-sm">
                View All Events <HiOutlineArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </ScrollSection>

      <div className="section-divider" />

      {/* ══════════════════════════════════════════════
          TEAM SECTION
      ══════════════════════════════════════════════ */}
      {team.length > 0 && (
        <ScrollSection className="py-24 md:py-32">
          <div className="section-container">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
                <div>
                  <motion.span variants={fadeIn} className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.22em] uppercase text-accent-primary mb-4">
                    <span className="w-6 h-px bg-accent-primary" /> The People
                  </motion.span>
                  <motion.h2 variants={fadeUp} className="text-3xl md:text-5xl font-black font-heading">
                    <span className="gradient-text">Meet Our Team</span>
                  </motion.h2>
                  <motion.p variants={fadeUp} className="text-text-secondary text-base mt-2">The passionate minds driving Bug2Build forward.</motion.p>
                </div>
                <motion.div variants={fadeIn}>
                  <Link
                    to="/team"
                    className="hidden md:inline-flex items-center gap-2.5 text-sm font-bold text-accent-primary border border-accent-primary/30 px-5 py-2.5 rounded-xl hover:bg-accent-primary/10 transition-all duration-200 group"
                  >
                    View Full Team
                    <HiOutlineArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
              </div>

              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 md:gap-10"
              >
                {team.map((member) => (
                  <TeamCard key={member._id} member={member} />
                ))}
              </motion.div>
            </motion.div>
          </div>
        </ScrollSection>
      )}

      <div className="section-divider" />

      {/* ══════════════════════════════════════════════
          COMMUNITY PARTNERS — MARQUEE
      ══════════════════════════════════════════════ */}
      <ScrollSection className="py-24 md:py-32 overflow-hidden relative">
        {/* Decorative background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] rounded-full bg-accent-primary/[0.03] blur-[120px] pointer-events-none" />

        <div className="section-container relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {/* Section header */}
            <div className="text-center mb-14 md:mb-16">
              <motion.span variants={fadeIn} className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.22em] uppercase text-accent-primary mb-4">
                <span className="w-6 h-px bg-accent-primary" />
                Trusted Network
                <span className="w-6 h-px bg-accent-primary" />
              </motion.span>
              <motion.h2 variants={fadeUp} className="text-3xl md:text-5xl font-black font-heading leading-[1.1] mb-4">
                <span className="text-text-primary">Community </span>
                <span className="gradient-text">Partners.</span>
              </motion.h2>
              <motion.p variants={fadeUp} className="text-text-secondary text-base md:text-lg max-w-xl mx-auto">
                Trusted by industry leaders and innovators building the future of tech together.
              </motion.p>
            </div>
          </motion.div>
        </div>

        {partners.length > 0 ? (
          <>
            {/* Row 1 */}
            <div className="marquee-track-outer mb-4">
              <div className="marquee-track">
                {[...Array(2)].flatMap((_, belt) =>
                  partners.map((p, i) => (
                    <div key={`r1-${belt}-${i}`} className="flex items-center gap-3">
                      <a href={p.website || '#'} target="_blank" rel="noopener noreferrer" className="logo-pill group">
                        <div
                          className="logo-icon transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
                          style={{
                            backgroundColor: `hsl(${(p.name.charCodeAt(0) * 37) % 360}, 30%, 92%)`,
                            color: `hsl(${(p.name.charCodeAt(0) * 37) % 360}, 50%, 35%)`,
                          }}
                        >
                          {p.logo
                            ? <img src={p.logo} alt={p.name} className="w-full h-full object-contain rounded-md" />
                            : <span className="font-bold">{p.name.substring(0, 2).toUpperCase()}</span>
                          }
                        </div>
                        <div>
                          <div className="logo-name font-semibold">{p.name}</div>
                          {p.category && <div className="logo-type">{p.category}</div>}
                        </div>
                      </a>
                      <div className="dot-sep" />
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Row 2 reverse */}
            <div className="marquee-track-outer">
              <div className="marquee-track reverse">
                {[...Array(2)].flatMap((_, belt) =>
                  [...partners].reverse().map((p, i) => (
                    <div key={`r2-${belt}-${i}`} className="flex items-center gap-3">
                      <a href={p.website || '#'} target="_blank" rel="noopener noreferrer" className="logo-pill group">
                        <div
                          className="logo-icon transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
                          style={{
                            backgroundColor: `hsl(${(p.name.charCodeAt(0) * 53) % 360}, 28%, 93%)`,
                            color: `hsl(${(p.name.charCodeAt(0) * 53) % 360}, 45%, 38%)`,
                          }}
                        >
                          {p.logo
                            ? <img src={p.logo} alt={p.name} className="w-full h-full object-contain rounded-md" />
                            : <span className="font-bold">{p.name.substring(0, 2).toUpperCase()}</span>
                          }
                        </div>
                        <div>
                          <div className="logo-name font-semibold">{p.name}</div>
                          {p.category && <div className="logo-type">{p.category}</div>}
                        </div>
                      </a>
                      <div className="dot-sep" />
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="section-container">
            <div className="card-base p-10 text-center">
              <p className="text-text-secondary text-sm">Partner list coming soon.</p>
            </div>
          </div>
        )}

        {/* Stat bar */}
        <div className="section-container mt-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="relative"
          >
            {/* Glow border */}
            <div className="absolute -inset-px rounded-[15px] bg-gradient-to-r from-accent-primary/20 via-accent-secondary/20 to-accent-cyan/20 blur-sm" />
            <div className="relative stat-bar" style={{ marginTop: 0 }}>
              {[
                { num: partners.length || 0, suffix: '+', label: 'Community Partners', icon: HiOutlineGlobe, color: '#3B5FCC' },
                { num: 5, suffix: '+', label: 'Industries Served', icon: HiOutlineLightningBolt, color: '#5B7FE6' },
                { num: 3, suffix: '+', label: 'Cities Worldwide', icon: HiOutlineLocationMarker, color: '#1A8FBC' },
                { num: 1, suffix: 'yr', label: 'Active Partnerships', icon: HiOutlineSparkles, color: '#2B4EB8' },
              ].map((s, i) => (
                <motion.div key={i} variants={fadeUp} className="stat-item group cursor-default">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-2 transition-transform duration-300 group-hover:scale-110"
                    style={{ background: `${s.color}15` }}
                  >
                    <s.icon className="w-4 h-4" style={{ color: s.color }} />
                  </div>
                  <div className="stat-num">
                    <CountUp to={s.num} suffix={s.suffix} />
                  </div>
                  <div className="stat-lbl">{s.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </ScrollSection>

      <div className="section-divider" />

      {/* ══════════════════════════════════════════════
          BRANDS GRID
      ══════════════════════════════════════════════ */}
      {brands.length > 0 && (
        <ScrollSection className="py-24 md:py-32">
          <div className="section-container">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <SectionHeader eyebrow="Trusted By" title="Brands That Trust Us" />
              <motion.div
                variants={staggerContainer}
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
              >
                {brands.map((brand) => (
                  <motion.a
                    key={brand._id}
                    variants={fadeIn}
                    href={brand.website || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -4, scale: 1.03 }}
                    className="card-base card-glow p-5 flex items-center justify-center h-20 group transition-all duration-300"
                  >
                    {brand.logo
                      ? <img src={brand.logo} alt={brand.name} className="max-h-8 w-auto object-contain opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
                      : <span className="text-text-secondary text-xs text-center font-semibold">{brand.name}</span>
                    }
                  </motion.a>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </ScrollSection>
      )}

      {/* ══════════════════════════════════════════════
          CTA BANNER
      ══════════════════════════════════════════════ */}
      <ScrollSection className="py-20 md:py-28">
        <div className="section-container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="relative rounded-3xl overflow-hidden"
          >
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/20 via-accent-secondary/15 to-accent-cyan/20" />
            <div className="absolute inset-0 border border-accent-primary/20 rounded-3xl" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-primary/60 to-transparent" />

            {/* Floating orbs inside */}
            <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-accent-cyan/15 blur-3xl" />
            <div className="absolute -bottom-12 -left-12 w-56 h-56 rounded-full bg-accent-primary/15 blur-3xl" />

            <div className="relative z-10 px-8 py-16 md:px-16 md:py-20 text-center">
              <motion.div variants={fadeIn} className="mb-4">
                <span className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.22em] uppercase text-accent-primary">
                  <span className="w-6 h-px bg-accent-primary" /> Join the Movement
                </span>
              </motion.div>
              <motion.h2 variants={fadeUp} className="text-3xl md:text-5xl font-black font-heading mb-6">
                <span className="gradient-text">Ready to Build Something Real?</span>
              </motion.h2>
              <motion.p variants={fadeUp} className="text-text-secondary text-lg max-w-xl mx-auto mb-10">
                Join hundreds of students turning their ideas into impactful projects. It's free, open-source, and community-powered.
              </motion.p>
              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/events"
                  className="gradient-btn text-white font-bold px-9 py-4 rounded-2xl text-base inline-flex items-center justify-center gap-2.5 shadow-[0_8px_24px_rgba(59,95,204,0.35)] hover:-translate-y-0.5 transition-all duration-200"
                >
                  View Events <HiOutlineArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/contact"
                  className="px-9 py-4 rounded-2xl border border-border/60 bg-bg-surface/40 backdrop-blur-sm text-text-primary font-bold hover:border-accent-primary/60 hover:bg-accent-primary/5 transition-all duration-200 text-base text-center hover:-translate-y-0.5"
                >
                  Contact Us
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </ScrollSection>

    </div>
  );
};

export default Home;