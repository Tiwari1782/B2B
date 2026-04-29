import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineCalendar, HiOutlineLocationMarker, HiOutlineExternalLink,
  HiOutlineArrowLeft, HiOutlineX, HiOutlineChevronLeft, HiOutlineChevronRight,
  HiOutlinePhotograph, HiOutlineClock, HiOutlineGlobe, HiOutlineUsers,
  HiOutlineArrowRight, HiOutlineShare, HiOutlineHeart,
} from 'react-icons/hi';
import api from '../services/api';

/* ─── config ─────────────────────────────────────────────────── */
const CATEGORY = {
  workshop:   { label: 'Workshop',   color: '#3B82F6' },
  hackathon:  { label: 'Hackathon',  color: '#5B7FE6' },
  meetup:     { label: 'Meetup',     color: '#10B981' },
  webinar:    { label: 'Webinar',    color: '#06B6D4' },
  conference: { label: 'Conference', color: '#F59E0B' },
  other:      { label: 'Event',      color: '#6B7280' },
};

const STATUS = {
  upcoming: { label: 'Upcoming', cls: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  ongoing:  { label: 'Live Now', cls: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  past:     { label: 'Concluded', cls: 'bg-white/5 text-text-muted border-white/10' },
};

/* ─── skeleton ───────────────────────────────────────────────── */
const Skeleton = () => (
  <div className="min-h-screen pt-28 pb-24 animate-pulse">
    <div className="section-container space-y-6">
      <div className="h-4 w-28 rounded-lg bg-white/5" />
      <div className="h-[420px] rounded-2xl bg-white/5" />
      <div className="flex gap-2">
        <div className="h-6 w-20 rounded-full bg-white/5" />
        <div className="h-6 w-24 rounded-full bg-white/5" />
      </div>
      <div className="h-10 w-3/4 rounded-lg bg-white/5" />
      <div className="h-40 rounded-xl bg-white/5" />
    </div>
  </div>
);

/* ─── info row ───────────────────────────────────────────────── */
const InfoRow = ({ icon: Icon, label, value, color = '#3B5FCC' }) => (
  <div className="flex items-start gap-3.5 py-4">
    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
      style={{ background: `${color}15` }}>
      <Icon className="w-4.5 h-4.5" style={{ color }} />
    </div>
    <div>
      <p className="text-[10px] text-text-muted mb-0.5 uppercase tracking-[0.15em] font-semibold">{label}</p>
      <p className="text-sm text-text-primary font-medium leading-snug">{value}</p>
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════ */
const EventDetail = () => {
  const { id } = useParams();
  const [event, setEvent]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [lightbox, setLightbox] = useState(null);
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.get(`/events/${id}`)
      .then((res) => setEvent(res.data.data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  /* keyboard nav for lightbox */
  useEffect(() => {
    const gallery = event?.gallery || [];
    const handleKey = (e) => {
      if (lightbox === null) return;
      if (e.key === 'Escape')      setLightbox(null);
      if (e.key === 'ArrowRight')  setLightbox((p) => (p + 1) % gallery.length);
      if (e.key === 'ArrowLeft')   setLightbox((p) => (p - 1 + gallery.length) % gallery.length);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightbox, event]);

  if (loading) return <Skeleton />;

  if (notFound || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <p className="text-7xl font-bold font-heading gradient-text">404</p>
          <p className="text-text-secondary text-lg">This event doesn't exist or was removed.</p>
          <Link to="/events" className="gradient-btn inline-flex items-center gap-2 text-white font-semibold px-6 py-3 rounded-xl mt-2">
            <HiOutlineArrowLeft className="w-4 h-4" /> Back to Events
          </Link>
        </div>
      </div>
    );
  }

  const gallery   = event.gallery || [];
  const heroImage = event.coverImage || event.image || gallery[0]?.url || null;
  const cat       = CATEGORY[event.category] || CATEGORY.other;
  const status    = STATUS[event.status]     || STATUS.past;
  const isOnline  = !event.location || event.location.toLowerCase().includes('online') || event.location.toLowerCase().includes('virtual');
  const gridImages = heroImage && gallery[0]?.url === heroImage ? gallery.slice(1) : gallery;

  const formattedDate = new Date(event.date).toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  const shortMonth = new Date(event.date).toLocaleDateString('en', { month: 'short' }).toUpperCase();
  const dayNum = new Date(event.date).getDate();

  return (
    <div className="min-h-screen pt-24 pb-32">
      <div className="section-container">

        {/* ── Breadcrumb ───────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <Link to="/events"
            className="inline-flex items-center gap-1.5 text-xs font-medium tracking-wide uppercase text-text-muted hover:text-text-primary transition-colors">
            <HiOutlineArrowLeft className="w-3.5 h-3.5" /> All Events
          </Link>
        </motion.div>

        {/* ── Hero Card (Commudle-style) ────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl border border-border/60 bg-bg-surface/50 overflow-hidden mb-10"
        >
          {/* Type badge */}
          <div className="px-6 pt-6 pb-3 flex items-center gap-3">
            <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase border ${
              isOnline ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
            }`}>
              {isOnline ? <HiOutlineGlobe className="w-3.5 h-3.5" /> : <HiOutlineUsers className="w-3.5 h-3.5" />}
              {isOnline ? 'Virtual' : 'In-Person'}
            </span>

            {/* Status dot */}
            {event.status === 'ongoing' && (
              <span className="relative flex w-2.5 h-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-400" />
              </span>
            )}
          </div>

          {/* Hero image */}
          {heroImage && (
            <div className="px-6 pb-6">
              <div
                className="relative rounded-xl overflow-hidden cursor-pointer group"
                style={{ aspectRatio: '16/7.5' }}
                onClick={() => setLightbox(0)}
              >
                <img
                  src={heroImage} alt={event.title}
                  onLoad={() => setImgLoaded(true)}
                  className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-[1.025] ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

                {gallery.length > 1 && (
                  <div className="absolute bottom-4 right-4 flex items-center gap-1.5 bg-black/50 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full font-medium border border-white/10">
                    <HiOutlinePhotograph className="w-3.5 h-3.5" />
                    {gallery.length} photos
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>

        {/* ── Content Grid ─────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 items-start">

          {/* ── Left: Info ──────────────────────────────────── */}
          <div>
            {/* Date badge + Category */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="flex flex-wrap items-center gap-3 mb-5">
              {/* Calendar chip */}
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-border/60 bg-bg-surface/60">
                <HiOutlineCalendar className="w-4 h-4 text-accent-primary" />
                <span className="text-xs font-bold tracking-widest uppercase text-text-muted">{shortMonth} {dayNum}</span>
              </div>

              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold tracking-widest uppercase border ${status.cls}`}>
                {status.label}
              </span>

              <span className="px-3 py-1.5 rounded-full text-[11px] font-semibold tracking-widest uppercase border"
                style={{ background: `${cat.color}15`, color: cat.color, borderColor: `${cat.color}30` }}>
                {cat.label}
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="text-3xl md:text-4xl xl:text-5xl font-black font-heading text-text-primary leading-[1.12] mb-8 uppercase tracking-wide"
            >
              {event.title}
            </motion.h1>

            {/* Description */}
            {event.description && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                <h2 className="text-xs font-semibold tracking-widest uppercase text-text-muted mb-4 flex items-center gap-2">
                  <span className="w-5 h-px bg-accent-primary" /> About This Event
                </h2>
                <div className="prose prose-invert prose-sm max-w-none">
                  <p className="text-text-secondary leading-[1.85] text-[15px] whitespace-pre-wrap">
                    {event.description}
                  </p>
                </div>
              </motion.div>
            )}

            {/* Action buttons at bottom of left col */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="flex flex-wrap items-center gap-4 mt-10">
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-accent-primary">View Details</span>

              <div className="ml-auto flex items-center gap-3">
                <button className="w-10 h-10 rounded-full border border-border/60 flex items-center justify-center text-text-muted hover:text-text-primary hover:border-accent-primary/40 transition-all">
                  <HiOutlineShare className="w-4 h-4" />
                </button>
                <button className="w-10 h-10 rounded-full border border-border/60 flex items-center justify-center text-text-muted hover:text-[#4E8AE6] hover:border-[#4E8AE6]/40 transition-all">
                  <HiOutlineHeart className="w-4 h-4" />
                </button>

                {/* Coral arrow */}
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#4E8AE6] to-[#5B94F0] flex items-center justify-center shadow-lg shadow-[#4E8AE6]/30 cursor-pointer hover:scale-105 transition-transform">
                  <HiOutlineArrowRight className="w-5 h-5 text-white -rotate-45" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* ── Right: Details Card ────────────────────────── */}
          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.45 }}
            className="lg:sticky lg:top-28"
          >
            <div className="rounded-2xl border border-border/60 bg-bg-surface/50 overflow-hidden">
              {/* Header strip */}
              <div className="px-5 py-4 border-b border-border/40">
                <p className="text-[11px] font-semibold tracking-widest uppercase text-text-muted">Event Details</p>
              </div>

              <div className="px-5 divide-y divide-border/30">
                <InfoRow icon={HiOutlineCalendar} label="Date" value={formattedDate} color="#3B5FCC" />
                {event.location && (
                  <InfoRow icon={HiOutlineLocationMarker} label="Location" value={event.location} color="#5B7FE6" />
                )}
                {event.time && (
                  <InfoRow icon={HiOutlineClock} label="Time" value={event.time} color="#1A8FBC" />
                )}
              </div>

              {/* CTA */}
              {event.eventLink && (
                <div className="p-5 border-t border-border/40">
                  <a href={event.eventLink} target="_blank" rel="noopener noreferrer"
                    className="gradient-btn flex items-center justify-center gap-2 w-full text-white text-sm font-bold px-4 py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-accent-primary/25">
                    Register Now <HiOutlineArrowRight className="w-4 h-4" />
                  </a>
                  <a href={event.eventLink} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full text-text-primary text-sm font-bold px-4 py-3 rounded-xl border border-border/60 mt-3 hover:border-accent-primary/40 transition-colors">
                    Learn More <HiOutlineExternalLink className="w-4 h-4" />
                  </a>
                </div>
              )}
            </div>
          </motion.aside>
        </div>

        {/* ── Photo Gallery ────────────────────────────────── */}
        {gridImages.length > 0 && (
          <motion.section initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="mt-20">
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-xl font-bold font-heading gradient-text">Photo Gallery</h2>
              <div className="flex-1 h-px bg-border/30" />
              <span className="text-xs text-text-muted font-medium">{gridImages.length} images</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
              {gridImages.map((img, i) => (
                <motion.button key={img._id || i} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => setLightbox(gallery.indexOf(img))}
                  className="relative rounded-xl overflow-hidden aspect-square group focus:outline-none focus:ring-2 focus:ring-accent-primary">
                  <img src={img.url} alt={img.altText || `Photo ${i + 1}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-300 flex items-center justify-center">
                    <HiOutlinePhotograph className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.section>
        )}
      </div>

      {/* ── Lightbox ─────────────────────────────────────── */}
      <AnimatePresence>
        {lightbox !== null && gallery.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }} className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center"
            onClick={() => setLightbox(null)}>

            <button onClick={() => setLightbox(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors border border-white/10" aria-label="Close">
              <HiOutlineX className="w-5 h-5 text-white" />
            </button>

            {gallery.length > 1 && (
              <button onClick={(e) => { e.stopPropagation(); setLightbox((p) => (p - 1 + gallery.length) % gallery.length); }}
                className="absolute left-5 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors border border-white/10" aria-label="Previous">
                <HiOutlineChevronLeft className="w-5 h-5 text-white" />
              </button>
            )}

            <motion.img key={lightbox} initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }} transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              src={gallery[lightbox]?.url} alt={gallery[lightbox]?.altText || ''}
              className="max-w-[88vw] max-h-[84vh] object-contain rounded-xl shadow-2xl"
              onClick={(e) => e.stopPropagation()} />

            {gallery.length > 1 && (
              <button onClick={(e) => { e.stopPropagation(); setLightbox((p) => (p + 1) % gallery.length); }}
                className="absolute right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors border border-white/10" aria-label="Next">
                <HiOutlineChevronRight className="w-5 h-5 text-white" />
              </button>
            )}

            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
              {gallery[lightbox]?.altText && (
                <p className="text-white/70 text-sm">{gallery[lightbox].altText}</p>
              )}
              <div className="flex items-center gap-1.5">
                {gallery.map((_, i) => (
                  <button key={i} onClick={(e) => { e.stopPropagation(); setLightbox(i); }}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${i === lightbox ? 'bg-white w-4' : 'bg-white/30'}`}
                    aria-label={`Go to photo ${i + 1}`} />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EventDetail;