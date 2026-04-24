import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  HiOutlineLightningBolt, HiOutlineLightBulb, HiOutlineUserGroup,
  HiOutlineGlobe, HiOutlineAcademicCap, HiOutlineCode, HiOutlineHeart,
  HiOutlineArrowRight, HiOutlineArrowLeft, HiOutlineChevronRight,
  HiOutlineChevronLeft, HiOutlineFire, HiOutlineSparkles,
  HiOutlineDesktopComputer, HiOutlineCog, HiOutlineShare,
} from 'react-icons/hi';
import { Link } from 'react-router-dom';
import api from '../services/api';

/* ─── animation helpers ─── */
const fadeChild = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};
const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const ScrollSection = ({ children, className = '' }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } },
      }}
      className={className}
    >
      {children}
    </motion.section>
  );
};

/* ─── stat data for the "Who We Are" grid ─── */
const stats = [
  { value: '500+', label: 'Community Members', color: '#5B5FEF', icon: HiOutlineUserGroup },
  { value: '50+', label: 'Partners & Sponsors', color: '#22C55E', icon: HiOutlineLightningBolt },
  { value: '100+', label: 'Open Source Projects', color: '#00C2FF', icon: HiOutlineCode },
  { value: '100%', label: 'Community Driven', color: '#FF6B8A', icon: HiOutlineHeart },
];

/* ─── methodology cards ─── */
const methodologyCards = [
  {
    icon: HiOutlineAcademicCap,
    title: 'Learn',
    description:
      'The Bug2Build philosophy starts here. We break complex concepts into atomic, hands-on workshops. Mastering fundamentals is key to scalable growth.',
    tags: ['Workshops', 'Bootcamps', 'Mentorship'],
    color: '#5B5FEF',
    borderColor: 'rgba(91, 95, 239, 0.5)',
    bgGlow: 'rgba(91, 95, 239, 0.06)',
  },
  {
    icon: HiOutlineCode,
    title: 'Build',
    description:
      'Builders at heart. We foster clean, self-documenting code. Whether frontend or backend, we emphasize modern stacks and craftsmanship.',
    tags: ['Clean Code', 'Modern Stack', 'Open Source'],
    color: '#22C55E',
    borderColor: 'rgba(34, 197, 94, 0.5)',
    bgGlow: 'rgba(34, 197, 94, 0.06)',
  },
  {
    icon: HiOutlineCog,
    title: 'Debug',
    description:
      'Bugs are learning opportunities. We treat debugging as a collaborative detective game, turning edge cases into resilient features.',
    tags: ['Peer Review', 'Resilience', 'Root Cause'],
    color: '#F59E0B',
    borderColor: 'rgba(245, 158, 11, 0.5)',
    bgGlow: 'rgba(245, 158, 11, 0.06)',
  },
  {
    icon: HiOutlineShare,
    title: 'Deploy',
    description:
      'Shipping value to the world. From CI/CD pipelines to production releases, we empower students to deliver real impact at scale.',
    tags: ['CI/CD', 'Production', 'Impact'],
    color: '#FF6B8A',
    borderColor: 'rgba(255, 107, 138, 0.5)',
    bgGlow: 'rgba(255, 107, 138, 0.06)',
  },
];

/* ─── values data ─── */
const values = [
  { icon: HiOutlineCode, title: 'Open Source First', desc: 'We build in the open. All our projects, tools, and resources are freely available for everyone.', color: '#FF6B8A' },
  { icon: HiOutlineHeart, title: 'Community Driven', desc: 'Every decision is made with our community in mind. We grow together, we build together.', color: '#5B5FEF' },
  { icon: HiOutlineAcademicCap, title: 'Education for All', desc: 'We believe quality tech education should be free and accessible to every student, everywhere.', color: '#00C2FF' },
  { icon: HiOutlineGlobe, title: 'Impact at Scale', desc: 'From local workshops to national hackathons — we aim to create lasting impact across communities.', color: '#8B5CF6' },
];

/* ═══════════════════════════════════════════════════════════════
   ABOUT PAGE
   ═══════════════════════════════════════════════════════════════ */
const About = () => {
  const [content, setContent] = useState({});
  const [activeCard, setActiveCard] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    api.get('/content/bulk?keys=about_description')
      .then((res) => setContent(res.data.data || {}))
      .catch(() => { });
  }, []);

  /* auto-rotate carousel */
  useEffect(() => {
    if (isPaused) return;
    intervalRef.current = setInterval(() => {
      setActiveCard((prev) => (prev + 1) % methodologyCards.length);
    }, 4000);
    return () => clearInterval(intervalRef.current);
  }, [isPaused]);

  const goNext = () => setActiveCard((p) => (p + 1) % methodologyCards.length);
  const goPrev = () => setActiveCard((p) => (p - 1 + methodologyCards.length) % methodologyCards.length);

  return (
    <div className="min-h-screen pt-28 pb-24">

      {/* ═══════════════════ WHO WE ARE ═══════════════════ */}
      <ScrollSection className="py-16 md:py-24">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">

            {/* ── Left column: text ── */}
            <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              {/* Badge */}
              <motion.div variants={fadeChild} className="mb-6">
                <span
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-bold tracking-[0.18em] uppercase"
                  style={{ background: 'rgba(91,95,239,0.1)', color: '#5B5FEF', border: '1px solid rgba(91,95,239,0.15)' }}
                >
                  <HiOutlineSparkles className="w-3.5 h-3.5" />
                  Who We Are
                </span>
              </motion.div>

              {/* Heading */}
              <motion.h1 variants={fadeChild} className="text-4xl md:text-5xl lg:text-6xl font-black font-heading leading-[1.05] mb-6">
                We are the{' '}
                <span className="gradient-text">Bug2Build</span>{' '}
                Community
              </motion.h1>

              {/* Description */}
              <motion.p variants={fadeChild} className="text-text-secondary text-base md:text-lg leading-relaxed mb-4">
                {content.about_description ||
                  'Bug2Build is more than just a name; it\'s our methodology. We are an inclusive, open-source initiative driven by passionate developers building tools for the next generation.'}
              </motion.p>
              <motion.p variants={fadeChild} className="text-text-secondary text-base leading-relaxed mb-8">
                Whether you're just starting your journey or are a seasoned engineer, Bug2Build provides the platform to connect, collaborate, and contribute to projects that matter. We bridge the gap between abstract theory and deployed reality.
              </motion.p>

              {/* Feature tags */}
              <motion.div variants={fadeChild} className="flex flex-wrap gap-2.5">
                {[
                  { icon: HiOutlineGlobe, text: 'Global Reach', color: '#5B5FEF' },
                  { icon: HiOutlineHeart, text: 'Open Source', color: '#FF6B8A' },
                  { icon: HiOutlineFire, text: 'Innovation', color: '#F59E0B' },
                ].map((tag, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
                    style={{
                      background: 'var(--color-bg-surface)',
                      border: '1px solid var(--color-border)',
                      color: 'var(--color-text-secondary)',
                    }}
                  >
                    <tag.icon className="w-4 h-4" style={{ color: tag.color }} />
                    {tag.text}
                  </span>
                ))}
              </motion.div>
            </motion.div>

            {/* ── Right column: stats grid (asymmetric like D4) ── */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  variants={fadeChild}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="relative overflow-hidden rounded-2xl p-6 group cursor-default"
                  style={{
                    background: 'var(--color-bg-surface)',
                    border: '1px solid var(--color-border)',
                    gridRow: i === 3 ? 'span 1' : undefined,
                  }}
                >
                  {/* bg glow on hover */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: `radial-gradient(circle at 70% 30%, ${stat.color}12, transparent 70%)` }}
                  />
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <span
                        className="text-3xl md:text-4xl font-black font-heading"
                        style={{ color: stat.color }}
                      >
                        {stat.value}
                      </span>
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center opacity-40 group-hover:opacity-70 transition-opacity"
                        style={{ background: `${stat.color}15` }}
                      >
                        <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                      </div>
                    </div>
                    <span className="text-[11px] font-bold tracking-[0.16em] uppercase text-text-muted">
                      {stat.label}
                    </span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </ScrollSection>

      <div className="section-divider" />

      {/* ═══════════════════ THE B2B METHODOLOGY — CAROUSEL ═══════════════════ */}
      <ScrollSection className="py-20 md:py-32">
        <div className="section-container">

          {/* Header row */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <motion.div variants={fadeChild} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-4">
                <span
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-bold tracking-[0.18em] uppercase"
                  style={{ background: 'rgba(91,95,239,0.1)', color: '#5B5FEF', border: '1px solid rgba(91,95,239,0.15)' }}
                >
                  <HiOutlineLightningBolt className="w-3.5 h-3.5" />
                  The B2B Methodology
                </span>
              </motion.div>
              <motion.h2 variants={fadeChild} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-3xl md:text-5xl font-black font-heading leading-[1.1] mb-3">
                <span className="gradient-text">Built for the Community</span>
              </motion.h2>
              <motion.p variants={fadeChild} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-text-secondary text-base md:text-lg max-w-xl">
                An end-to-end ecosystem covering the entire lifecycle of modern software engineering.
              </motion.p>
            </div>

            {/* Nav controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={goPrev}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105"
                style={{ border: '1px solid var(--color-border)', background: 'var(--color-bg-surface)', color: 'var(--color-text-secondary)' }}
              >
                <HiOutlineChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsPaused((p) => !p)}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105"
                style={{ border: '1px solid var(--color-border)', background: 'var(--color-bg-surface)', color: 'var(--color-text-secondary)' }}
              >
                {isPaused ? (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><polygon points="3,1 13,7 3,13" /></svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><rect x="2" y="1" width="3.5" height="12" rx="1" /><rect x="8.5" y="1" width="3.5" height="12" rx="1" /></svg>
                )}
              </button>
              <button
                onClick={goNext}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105"
                style={{ border: '1px solid var(--color-border)', background: 'var(--color-bg-surface)', color: 'var(--color-text-secondary)' }}
              >
                <HiOutlineChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* ── Carousel row ── */}
          <div className="flex gap-4" style={{ height: '380px' }}>
            {methodologyCards.map((card, i) => {
              const isActive = i === activeCard;
              return (
                <div
                  key={i}
                  onClick={() => setActiveCard(i)}
                  className="relative rounded-2xl cursor-pointer"
                  style={{
                    flex: isActive ? '3 1 0%' : '0.3 1 0%',
                    minWidth: '70px',
                    height: '380px',
                    overflow: 'hidden',
                    background: 'var(--color-bg-surface)',
                    border: isActive ? `1px solid ${card.borderColor}` : '1px solid var(--color-border)',
                    transition: 'flex 0.85s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.5s ease',
                  }}
                >
                  {/* Subtle glow */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: `radial-gradient(ellipse at 30% 80%, ${card.bgGlow}, transparent 60%)`,
                      opacity: isActive ? 1 : 0,
                      transition: 'opacity 0.6s ease',
                    }}
                  />

                  {/* Large background number */}
                  <span
                    className="absolute font-black font-heading pointer-events-none select-none"
                    style={{
                      fontSize: isActive ? '160px' : '70px',
                      lineHeight: 1,
                      right: isActive ? '16px' : '50%',
                      bottom: isActive ? '-16px' : '40px',
                      transform: isActive ? 'none' : 'translateX(50%)',
                      color: card.color,
                      opacity: isActive ? 0.08 : 0.05,
                      transition: 'font-size 0.8s cubic-bezier(0.4, 0, 0.2, 1), right 0.8s cubic-bezier(0.4, 0, 0.2, 1), bottom 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.5s ease',
                    }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  {/* Icon — always top-left */}
                  <div className="absolute top-5 left-5 z-10">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: `${card.color}18`, border: `1px solid ${card.color}25` }}
                    >
                      <card.icon className="w-5 h-5" style={{ color: card.color }} />
                    </div>
                  </div>


                  {/* ── Active content — always absolutely positioned ── */}
                  <div
                    className="absolute left-5 right-5 bottom-5 z-10"
                    style={{
                      opacity: isActive ? 1 : 0,
                      transform: isActive ? 'translateY(0)' : 'translateY(12px)',
                      transition: isActive
                        ? 'opacity 0.5s ease 0.4s, transform 0.5s ease 0.4s'
                        : 'opacity 0.25s ease, transform 0.25s ease',
                      pointerEvents: isActive ? 'auto' : 'none',
                    }}
                  >
                    <h3 className="text-2xl md:text-3xl font-black font-heading text-text-primary mb-3">
                      {card.title}
                    </h3>
                    <p className="text-text-secondary text-sm leading-relaxed mb-4 max-w-md">
                      {card.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {card.tags.map((tag, t) => (
                        <span
                          key={t}
                          className="px-3 py-1 rounded-md text-xs font-semibold"
                          style={{
                            background: 'var(--color-bg-elevated)',
                            border: '1px solid var(--color-border)',
                            color: 'var(--color-text-secondary)',
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <Link
                      to="/events"
                      className="inline-flex items-center gap-1.5 text-xs font-bold tracking-[0.14em] uppercase"
                      style={{ color: card.color }}
                    >
                      Explore <HiOutlineArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  {/* ── Collapsed vertical title — always absolutely positioned ── */}
                  <div
                    className="absolute inset-0 flex items-center justify-center z-10"
                    style={{
                      opacity: isActive ? 0 : 1,
                      transition: isActive
                        ? 'opacity 0.25s ease'
                        : 'opacity 0.4s ease 0.45s',
                      pointerEvents: isActive ? 'none' : 'auto',
                      paddingTop: '60px',
                    }}
                  >
                    <span
                      className="text-base font-black font-heading tracking-[0.2em] uppercase text-text-muted"
                      style={{
                        writingMode: 'vertical-rl',
                        textOrientation: 'mixed',
                        transform: 'rotate(180deg)',
                      }}
                    >
                      {card.title}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </ScrollSection>

      <div className="section-divider" />

      {/* ═══════════════════ OUR VALUES ═══════════════════ */}
      <ScrollSection className="py-24 md:py-32">
        <div className="section-container">
          <div className="text-center mb-16">
            <motion.div variants={fadeChild} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-4">
              <span
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-bold tracking-[0.18em] uppercase"
                style={{ background: 'rgba(91,95,239,0.1)', color: '#5B5FEF', border: '1px solid rgba(91,95,239,0.15)' }}
              >
                <HiOutlineHeart className="w-3.5 h-3.5" />
                Our Principles
              </span>
            </motion.div>
            <h2 className="text-3xl md:text-5xl font-bold font-heading mb-4">
              <span className="gradient-text">Our Core Values</span>
            </h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">The principles that drive our community forward every single day.</p>
          </div>
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((val, i) => (
              <motion.div key={i} variants={fadeChild} className="card-base card-glow p-6 text-center group">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-5" style={{ backgroundColor: `${val.color}12` }}>
                  <val.icon className="w-6 h-6" style={{ color: val.color }} />
                </div>
                <h3 className="font-heading font-bold text-text-primary mb-2">{val.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{val.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </ScrollSection>

      <div className="section-divider" />

      {/* ═══════════════════ CTA ═══════════════════ */}
      <ScrollSection className="py-24 md:py-32">
        <div className="section-container">
          <div className="card-base p-12 md:p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/5 via-transparent to-accent-purple/5" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold font-heading mb-5">
                <span className="gradient-text">Ready to Join the Community?</span>
              </h2>
              <p className="text-text-secondary text-lg max-w-xl mx-auto mb-8">Whether you're a beginner or an experienced developer, there's a place for you at Bug2Build.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/events" className="gradient-btn text-white font-semibold px-8 py-3.5 rounded-xl text-base inline-flex items-center justify-center gap-2">
                  Explore Events <HiOutlineArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/contact" className="px-8 py-3.5 rounded-xl border border-border text-text-primary font-semibold hover:border-accent-primary hover:bg-accent-primary/5 transition-all text-base text-center">
                  Get In Touch
                </Link>
              </div>
            </div>
          </div>
        </div>
      </ScrollSection>
    </div>
  );
};

export default About;
