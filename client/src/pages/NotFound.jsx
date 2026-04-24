import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useTransform, animate, AnimatePresence } from 'framer-motion';
import { HiOutlineHome, HiOutlineArrowRight, HiOutlineCode, HiOutlineLightningBolt, HiOutlineRefresh } from 'react-icons/hi';

/* ── Glitchy 404 text ── */
const GlitchText = ({ text }) => {
  const [glitching, setGlitching] = useState(false);
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitching(true);
      setTimeout(() => setGlitching(false), 300);
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative select-none">
      {/* Main text */}
      <h1
        className="text-[clamp(7rem,22vw,14rem)] font-black leading-none tracking-tighter gradient-text"
        style={{ fontFamily: "'font-heading', sans-serif" }}
      >
        {text}
      </h1>

      {/* Glitch layer 1 */}
      <AnimatePresence>
        {glitching && (
          <>
            <motion.h1
              className="absolute inset-0 text-[clamp(7rem,22vw,14rem)] font-black leading-none tracking-tighter text-accent-primary pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.7, 0, 0.5, 0], x: [-4, 4, -2, 3, 0], skewX: [0, -2, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              aria-hidden
            >
              {text}
            </motion.h1>
            <motion.h1
              className="absolute inset-0 text-[clamp(7rem,22vw,14rem)] font-black leading-none tracking-tighter text-accent-blue pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.5, 0, 0.4, 0], x: [4, -4, 2, -3, 0], skewX: [0, 2, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.05 }}
              aria-hidden
            >
              {text}
            </motion.h1>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ── Terminal-style message ── */
const TERMINAL_LINES = [
  { prefix: '$', text: 'cd /page/that/does/not/exist', delay: 0.2 },
  { prefix: '>', text: 'Error: ENOENT: no such file or directory', delay: 0.8, error: true },
  { prefix: '$', text: 'git status', delay: 1.4 },
  { prefix: '>', text: 'Nothing to commit. Page lost in the void.', delay: 2.0, warn: true },
  { prefix: '$', text: 'bug2build --find-page', delay: 2.6 },
  { prefix: '>', text: 'Redirecting you to safety...', delay: 3.2, success: true },
];

const Terminal = () => {
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    let i = 0;
    const timers = TERMINAL_LINES.map((line, idx) =>
      setTimeout(() => setVisibleLines(idx + 1), line.delay * 1000)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="w-full max-w-md rounded-2xl overflow-hidden border border-border/60 shadow-[0_24px_60px_rgba(0,0,0,0.35)]"
    >
      {/* Window chrome */}
      <div className="flex items-center gap-2 px-4 py-3 bg-[#1a1a2e] border-b border-border/40">
        <div className="w-3 h-3 rounded-full bg-[#FF6B8A]" />
        <div className="w-3 h-3 rounded-full bg-[#F59E0B]" />
        <div className="w-3 h-3 rounded-full bg-[#10B981]" />
        <span className="ml-auto text-[11px] font-mono text-text-muted tracking-widest">bug2build ~ terminal</span>
      </div>

      {/* Terminal body */}
      <div className="bg-[#0d0d1a] p-5 font-mono text-sm space-y-1.5 min-h-[180px]">
        {TERMINAL_LINES.slice(0, visibleLines).map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-start gap-2.5"
          >
            <span className={`shrink-0 font-bold ${
              line.prefix === '$' ? 'text-accent-primary' : 'text-text-muted'
            }`}>{line.prefix}</span>
            <span className={
              line.error ? 'text-[#FF6B8A]' :
              line.warn ? 'text-[#F59E0B]' :
              line.success ? 'text-[#10B981]' :
              'text-text-secondary'
            }>
              {line.text}
              {i === visibleLines - 1 && !line.error && !line.warn && !line.success && (
                <motion.span
                  className="inline-block w-2 h-4 bg-accent-primary ml-1 align-middle"
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                />
              )}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

/* ── Floating orbit particles ── */
const OrbitRing = ({ radius, count, color, duration, offset = 0 }) => (
  <>
    {Array.from({ length: count }).map((_, i) => {
      const angle = (360 / count) * i + offset;
      return (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: 6 + (i % 3) * 2,
            height: 6 + (i % 3) * 2,
            background: color,
            top: '50%',
            left: '50%',
            marginTop: -(3 + (i % 3)),
            marginLeft: -(3 + (i % 3)),
          }}
          animate={{
            x: [
              Math.cos((angle * Math.PI) / 180) * radius,
              Math.cos(((angle + 360) * Math.PI) / 180) * radius,
            ],
            y: [
              Math.sin((angle * Math.PI) / 180) * radius,
              Math.sin(((angle + 360) * Math.PI) / 180) * radius,
            ],
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.4, 1],
          }}
          transition={{
            duration,
            repeat: Infinity,
            ease: 'linear',
            delay: (duration / count) * i,
          }}
        />
      );
    })}
  </>
);

/* ── Quick links ── */
const QUICK_LINKS = [
  { label: 'Home', to: '/', icon: HiOutlineHome },
  { label: 'Events', to: '/events', icon: HiOutlineLightningBolt },
  { label: 'Projects', to: '/projects', icon: HiOutlineCode },
];

/* ── MAIN COMPONENT ── */
const NotFound = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handle = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handle);
    return () => window.removeEventListener('mousemove', handle);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">

      {/* ── Background layers ── */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/6 via-transparent to-accent-purple/6" />

      {/* Mouse-tracking spotlight */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full pointer-events-none transition-all duration-1000 ease-out"
        style={{
          background: 'radial-gradient(circle, rgba(91,95,239,0.08) 0%, transparent 70%)',
          left: mousePos.x,
          top: mousePos.y,
          transform: 'translate(-50%, -50%)',
        }}
      />

      {/* Ambient orbs */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-accent-primary/6 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-accent-purple/6 rounded-full blur-[100px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent-blue/4 rounded-full blur-[160px]" />

      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(91,95,239,0.8) 1px, transparent 1px),
            linear-gradient(90deg, rgba(91,95,239,0.8) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Floating particles background */}
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-accent-primary/25"
          style={{
            left: `${8 + (i * 7.5) % 84}%`,
            top: `${6 + (i * 8.3) % 88}%`,
          }}
          animate={{ y: [0, -30, 0], opacity: [0.15, 0.5, 0.15], scale: [1, 1.6, 1] }}
          transition={{ duration: 4 + (i % 3), delay: i * 0.4, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      {/* ── Orbit rings around "404" ── */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none hidden md:block">
        <div className="relative w-0 h-0">
          <OrbitRing radius={220} count={6} color="rgba(91,95,239,0.35)" duration={18} />
          <OrbitRing radius={300} count={8} color="rgba(139,92,246,0.22)" duration={26} offset={30} />
          <OrbitRing radius={370} count={5} color="rgba(0,194,255,0.18)" duration={34} offset={15} />
        </div>
      </div>

      {/* ── Content ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 flex flex-col items-center text-center gap-8 max-w-2xl w-full"
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <img
            src="/logo.png"
            alt="Bug2Build"
            className="h-12 mx-auto opacity-80"
            style={{ filter: 'drop-shadow(0 0 16px rgba(91,95,239,0.4))' }}
          />
        </motion.div>

        {/* 404 glitch */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <GlitchText text="404" />
        </motion.div>

        {/* Divider line with bug icon */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex items-center gap-4 w-full max-w-xs"
        >
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-border" />
          <span className="text-lg">🐛</span>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-border" />
        </motion.div>

        {/* Headline + subtext */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="space-y-3"
        >
          <h2 className="text-2xl md:text-3xl font-bold font-heading text-text-primary">
            Lost in the void?
          </h2>
          <p className="text-text-secondary text-base md:text-lg leading-relaxed max-w-sm mx-auto">
            Looks like this page wandered off. Even the best builders hit dead ends — let's get you back on track.
          </p>
        </motion.div>

        {/* Terminal widget */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="w-full flex justify-center"
        >
          <Terminal />
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto"
        >
          <Link
            to="/"
            className="gradient-btn text-white font-bold px-8 py-3.5 rounded-2xl text-sm inline-flex items-center justify-center gap-2.5 shadow-[0_8px_24px_rgba(91,95,239,0.35)] hover:shadow-[0_12px_32px_rgba(91,95,239,0.5)] hover:-translate-y-0.5 transition-all duration-200"
          >
            <HiOutlineHome className="w-4.5 h-4.5" />
            Back to Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="px-8 py-3.5 rounded-2xl border border-border/70 bg-bg-surface/40 backdrop-blur-sm text-text-primary font-bold text-sm inline-flex items-center justify-center gap-2.5 hover:border-accent-primary/50 hover:bg-accent-primary/5 hover:-translate-y-0.5 transition-all duration-200"
          >
            <HiOutlineRefresh className="w-4 h-4" />
            Go Back
          </button>
        </motion.div>

        {/* Quick nav */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.75 }}
          className="flex items-center gap-2 flex-wrap justify-center"
        >
          <span className="text-xs text-text-muted font-medium">Quick jump:</span>
          {QUICK_LINKS.map(({ label, to, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-secondary hover:text-accent-primary border border-border/50 hover:border-accent-primary/40 px-3 py-1.5 rounded-full bg-bg-surface/40 hover:bg-accent-primary/5 transition-all duration-200"
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </Link>
          ))}
        </motion.div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.9 }}
          className="text-[11px] text-text-muted"
        >
          Bug2Build · Open Source · Non-Profit · Community Driven
        </motion.p>
      </motion.div>
    </div>
  );
};

export default NotFound;