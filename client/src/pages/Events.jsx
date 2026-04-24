import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HiOutlineCalendar, HiOutlineLocationMarker, HiOutlineSearch,
  HiOutlineArrowRight, HiOutlineGlobe, HiOutlineUsers,
} from 'react-icons/hi';
import api from '../services/api';

/* ── animations ─────────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };

/* ── helpers ────────────────────────────────────────────────── */
const isOnline = (loc) =>
  !loc || loc.toLowerCase().includes('online') || loc.toLowerCase().includes('virtual');

const shortDate = (d) => {
  const dt = new Date(d);
  return {
    month: dt.toLocaleDateString('en', { month: 'short' }).toUpperCase(),
    day: dt.getDate(),
  };
};

const fullDate = (d) =>
  new Date(d).toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

/* ── badge component ────────────────────────────────────────── */
const TypeBadge = ({ online, size = 'sm' }) => {
  const cls = online
    ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
    : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
  const Icon = online ? HiOutlineGlobe : HiOutlineUsers;
  const text = online ? 'Virtual' : 'In-Person';
  const px = size === 'lg' ? 'px-4 py-2 text-xs' : 'px-3 py-1.5 text-[10px]';
  return (
    <span className={`inline-flex items-center gap-1.5 ${px} rounded-full font-bold tracking-widest uppercase border ${cls}`}>
      <Icon className="w-3.5 h-3.5" />
      {text}
    </span>
  );
};

/* ══════════════════════════════════════════════════════════════
   FEATURED UPCOMING CARD — hero split layout
══════════════════════════════════════════════════════════════ */
const FeaturedCard = ({ event }) => (
  <motion.div variants={fadeUp}>
    <Link
      to={`/events/${event._id}`}
      className="block rounded-2xl border border-border/60 overflow-hidden bg-bg-surface/50 group transition-all duration-300 hover:border-accent-primary/30 hover:shadow-[0_20px_60px_-12px_rgba(91,95,239,0.15)]"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr]">
        {/* Image */}
        <div className="relative p-5 md:p-7">
          <div className="rounded-xl overflow-hidden border border-border/40 aspect-[16/9.5]">
            {(event.coverImage || event.image) ? (
              <img src={event.coverImage || event.image} alt={event.title}
                className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-accent-primary/10 to-accent-purple/10 flex items-center justify-center">
                <HiOutlineCalendar className="w-16 h-16 text-accent-primary/20" />
              </div>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="p-5 md:p-7 lg:pl-2 flex flex-col justify-center">
          <div className="flex flex-wrap gap-2 mb-5">
            <TypeBadge online={isOnline(event.location)} size="lg" />
          </div>

          <h2 className="text-2xl md:text-3xl lg:text-[2.1rem] font-black font-heading text-text-primary leading-[1.15] mb-4 group-hover:text-accent-primary transition-colors duration-300">
            {event.title}
          </h2>

          {event.description && (
            <p className="text-text-secondary text-sm leading-relaxed mb-6 line-clamp-2">{event.description}</p>
          )}

          <div className="space-y-3 mb-8">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-accent-primary/10 flex items-center justify-center flex-shrink-0">
                <HiOutlineCalendar className="w-3.5 h-3.5 text-accent-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-text-primary">{fullDate(event.date)}</p>
                {event.time && <p className="text-xs text-text-muted mt-0.5">{event.time}</p>}
              </div>
            </div>
            {event.location && (
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-accent-primary/10 flex items-center justify-center flex-shrink-0">
                  <HiOutlineLocationMarker className="w-3.5 h-3.5 text-accent-primary" />
                </div>
                <span className="text-sm text-text-primary">{event.location}</span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            {event.eventLink && (
              <span className="gradient-btn text-white font-bold px-7 py-3 rounded-xl text-sm inline-flex items-center gap-2 shadow-lg shadow-accent-primary/25">
                Register Now <HiOutlineArrowRight className="w-4 h-4" />
              </span>
            )}
            <span className="px-7 py-3 rounded-xl border border-border/60 text-text-primary font-bold text-sm inline-flex items-center gap-2">
              Learn More <HiOutlineArrowRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  </motion.div>
);

/* ══════════════════════════════════════════════════════════════
   PAST EVENT CARD — dark card with hover arrow
══════════════════════════════════════════════════════════════ */
const PastCard = ({ event }) => {
  const [hovered, setHovered] = useState(false);
  const { month, day } = shortDate(event.date);

  return (
    <motion.div variants={fadeUp} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <Link
        to={`/events/${event._id}`}
        className="block rounded-2xl border border-border/50 bg-bg-surface/60 overflow-hidden group"
        style={{
          boxShadow: hovered
            ? '0 20px 50px -12px rgba(91,95,239,0.2), 0 0 0 1px rgba(91,95,239,0.15)'
            : '0 4px 16px -4px rgba(0,0,0,0.15)',
          transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
          borderColor: hovered ? 'rgba(91,95,239,0.25)' : undefined,
          transition: 'all 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        {/* Badge */}
        <div className="px-5 pt-5 pb-3">
          <TypeBadge online={isOnline(event.location)} />
        </div>

        {/* Image */}
        <div className="px-5 pb-4">
          <div className="rounded-xl overflow-hidden aspect-[16/9] border border-border/30">
            {(event.coverImage || event.image) ? (
              <img src={event.coverImage || event.image} alt={event.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-accent-primary/8 to-accent-purple/8 flex items-center justify-center">
                <HiOutlineCalendar className="w-10 h-10 text-accent-primary/15" />
              </div>
            )}
          </div>
        </div>

        {/* Separator */}
        <div className="h-px bg-border/40 mx-5" />

        {/* Info */}
        <div className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <HiOutlineCalendar className="w-4 h-4 text-accent-primary/70" />
            <span className="text-xs font-bold tracking-widest uppercase text-text-muted">{month} {day}</span>
          </div>

          <h3 className="font-heading font-black text-[15px] text-text-primary leading-snug uppercase tracking-wide mb-3 line-clamp-2 group-hover:text-accent-primary transition-colors duration-300">
            {event.title}
          </h3>

          <div className="flex items-end justify-between min-h-[40px]">
            {event.location ? (
              <div className="flex items-center gap-1.5">
                <HiOutlineLocationMarker className="w-3.5 h-3.5 text-accent-primary/50" />
                <span className="text-xs text-text-muted font-medium uppercase tracking-wide truncate max-w-[160px]">{event.location}</span>
              </div>
            ) : <div />}

            {/* Redirect arrow — coral circle */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={hovered ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="flex-shrink-0"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF6B8A] to-[#FF8A6B] flex items-center justify-center shadow-lg shadow-[#FF6B8A]/30">
                <HiOutlineArrowRight className="w-4 h-4 text-white -rotate-45" />
              </div>
            </motion.div>
          </div>

          {/* View Details text */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={hovered ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
            transition={{ duration: 0.2, delay: 0.05 }}
            className="mt-2"
          >
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-accent-primary">View Details</span>
          </motion.div>
        </div>
      </Link>
    </motion.div>
  );
};

/* ══════════════════════════════════════════════════════════════
   MAIN EVENTS PAGE
══════════════════════════════════════════════════════════════ */
const Events = () => {
  const [upcoming, setUpcoming] = useState([]);
  const [past, setPast] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const sParam = search ? `&search=${encodeURIComponent(search)}` : '';
    Promise.allSettled([
      api.get(`/events?status=upcoming&limit=6${sParam}`),
      api.get(`/events?status=past&limit=9${sParam}`),
    ]).then(([upRes, pastRes]) => {
      if (upRes.status === 'fulfilled') setUpcoming(upRes.value.data.data || []);
      if (pastRes.status === 'fulfilled') setPast(pastRes.value.data.data || []);
    }).finally(() => setLoading(false));
  }, [search]);

  const featured = upcoming[0];
  const otherUpcoming = upcoming.slice(1);

  return (
    <div className="min-h-screen pt-28 pb-24">
      <div className="section-container">

        {/* Search bar */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="flex justify-center mb-16"
        >
          <div className="relative w-full max-w-md">
            <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text" value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search events..."
              className="input-premium pl-11"
              id="event-search"
            />
          </div>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-24">
            <div className="w-10 h-10 border-2 border-accent-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* ── UPCOMING ─────────────────────────────────── */}
            {upcoming.length > 0 && (
              <>
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                  className="text-center mb-12"
                >
                  <h1 className="text-4xl md:text-6xl font-bold font-heading mb-3">
                    <span className="text-text-primary">Upcoming </span>
                    <span className="gradient-text">Events.</span>
                  </h1>
                </motion.div>

                {/* Featured card */}
                {featured && <FeaturedCard event={featured} />}

                {/* Other upcoming */}
                {otherUpcoming.length > 0 && (
                  <motion.div variants={stagger} initial="hidden" animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8"
                  >
                    {otherUpcoming.map((e) => (
                      <PastCard key={e._id} event={{ ...e, status: 'upcoming' }} />
                    ))}
                  </motion.div>
                )}
              </>
            )}

            {/* ── PAST ─────────────────────────────────────── */}
            {past.length > 0 && (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-center mt-28 mb-12"
                >
                  <h2 className="text-3xl md:text-5xl font-bold font-heading">
                    <span className="text-text-primary">Past </span>
                    <span className="gradient-text">Events.</span>
                  </h2>
                </motion.div>

                <motion.div variants={stagger} initial="hidden" whileInView="visible"
                  viewport={{ once: true }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {past.map((e) => <PastCard key={e._id} event={e} />)}
                </motion.div>
              </>
            )}

            {/* Empty state */}
            {upcoming.length === 0 && past.length === 0 && (
              <div className="text-center py-24">
                <p className="text-text-secondary text-lg">No events found.</p>
                <p className="text-text-muted text-sm mt-2">Try adjusting your search query.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Events;
