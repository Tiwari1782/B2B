import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  HiOutlineCalendar, HiOutlineUsers, HiOutlineGlobe, HiOutlineBriefcase,
  HiOutlineCode, HiOutlineMail, HiOutlineUser, HiOutlineLogout,
  HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineX,
  HiOutlinePhotograph, HiOutlineStar, HiOutlineEye, HiOutlineEyeOff,
  HiOutlineChevronRight, HiOutlineSparkles, HiOutlineMenuAlt2,
  HiOutlineCheck, HiOutlineBell, HiOutlineSearch, HiOutlineChartBar,
  HiOutlineLightningBolt, HiOutlineShieldCheck, HiOutlineCog,
} from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { useToast } from '../components/common/ToastNotification';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';

/* ─── Animation presets ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };
const scaleIn = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

/* ─── Module config ─── */
const modules = [
  { key: 'events',       label: 'Events',       icon: HiOutlineCalendar,    color: '#6366f1', gradient: 'from-indigo-500 to-violet-600',  bg: 'rgba(99,102,241,0.12)',  desc: 'Manage all events',           badge: null },
  { key: 'team',         label: 'Team',          icon: HiOutlineUsers,       color: '#8b5cf6', gradient: 'from-violet-500 to-purple-600',  bg: 'rgba(139,92,246,0.12)',  desc: 'Team members',                badge: null },
  { key: 'partners',     label: 'Partners',      icon: HiOutlineGlobe,       color: '#06b6d4', gradient: 'from-cyan-500 to-sky-600',       bg: 'rgba(6,182,212,0.12)',   desc: 'Community partners',          badge: null },
  { key: 'brands',       label: 'Brands',        icon: HiOutlineBriefcase,   color: '#f59e0b', gradient: 'from-amber-500 to-orange-500',   bg: 'rgba(245,158,11,0.12)',  desc: 'Trusted brands',              badge: null },
  { key: 'contributors', label: 'Contributors',  icon: HiOutlineCode,        color: '#10b981', gradient: 'from-emerald-500 to-teal-500',   bg: 'rgba(16,185,129,0.12)',  desc: 'Open source contributors',    badge: null },
  { key: 'contacts',     label: 'Messages',      icon: HiOutlineMail,        color: '#f43f5e', gradient: 'from-rose-500 to-pink-600',      bg: 'rgba(244,63,94,0.12)',   desc: 'Contact submissions',         badge: '3' },
  { key: 'profile',      label: 'Profile',       icon: HiOutlineUser,        color: '#64748b', gradient: 'from-slate-500 to-slate-600',    bg: 'rgba(100,116,139,0.12)', desc: 'Account settings',            badge: null },
];

/* ─── Stat cards shown in hero ─── */
const quickStats = [
  { label: 'Total Events', value: '24', change: '+3', icon: HiOutlineCalendar, color: '#6366f1', bg: 'rgba(99,102,241,0.1)' },
  { label: 'Team Members', value: '18', change: '+2', icon: HiOutlineUsers,    color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
  { label: 'New Messages', value: '7',  change: 'new', icon: HiOutlineMail,    color: '#f43f5e', bg: 'rgba(244,63,94,0.1)' },
  { label: 'Contributors', value: '42', change: '+5', icon: HiOutlineCode,     color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
];

const AdminDashboard = () => {
  const [active, setActive]         = useState('events');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled]     = useState(false);
  const [confirmModal, setConfirmModal] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const { user, logout, updateUser } = useAuth();
  const { isDark } = useTheme();
  const toast = useToast();
  const navigate = useNavigate();
  const activeMod = modules.find((m) => m.key === active);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);
  useEffect(() => { setMobileOpen(false); }, [active]);

  const handleLogout = () => { logout(); toast.success('Logged out.'); navigate('/'); };
  const showConfirm  = (message, onConfirm) => setConfirmModal({ message, onConfirm });
  const tc = (d, l) => isDark ? d : l;

  /* Glassmorphism helper */
  const navStyle = {
    background: scrolled
      ? tc('rgba(7,9,18,0.82)', 'rgba(255,255,255,0.82)')
      : tc('rgba(7,9,18,0.6)', 'rgba(255,255,255,0.6)'),
    backdropFilter: 'blur(32px) saturate(200%)',
    WebkitBackdropFilter: 'blur(32px) saturate(200%)',
    border: tc('1px solid rgba(255,255,255,0.07)', '1px solid rgba(0,0,0,0.07)'),
    boxShadow: scrolled
      ? tc('0 4px 32px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.05) inset',
           '0 4px 32px rgba(0,0,0,0.08), 0 1px 0 rgba(255,255,255,0.9) inset')
      : 'none',
    transition: 'all 0.5s cubic-bezier(.22,1,.36,1)',
  };

  return (
    <div className="min-h-screen bg-bg-primary font-sans">

      {/* ═══ NAVBAR ═══ */}
      <nav className="fixed top-0 left-0 right-0 z-50" style={{ padding: '10px 16px' }}>
        <motion.div
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: [.22,1,.36,1] }}
          style={{ ...navStyle, maxWidth: 1400, margin: '0 auto', borderRadius: 100, height: 60, padding: '0 8px 0 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="relative">
              <img src="/logo.png" alt="B2B" className="h-7 transition-transform duration-300 group-hover:scale-110" />
              <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400" style={{ boxShadow: '0 0 6px rgba(52,211,153,0.8)' }} />
            </div>
            <div className="hidden sm:block">
              <div className="font-heading text-[13px] font-black gradient-text leading-none tracking-tight">Bug2Build</div>
              <div className="text-[8.5px] font-bold uppercase tracking-[.18em] mt-0.5" style={{ color: tc('#475569','#94a3b8') }}>Control Panel</div>
            </div>
          </Link>

          {/* Nav tabs — desktop */}
          <div className="hidden xl:flex items-center gap-0.5 bg-black/0 rounded-full p-0.5">
            {modules.map((m) => (
              <button
                key={m.key}
                onClick={() => setActive(m.key)}
                className="relative px-3.5 py-1.5 rounded-full text-[12.5px] font-semibold transition-all duration-250 flex items-center gap-1.5"
                style={{ color: active === m.key ? '#fff' : tc('#64748b','#94a3b8') }}
              >
                {active === m.key && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full"
                    style={{ background: `linear-gradient(135deg, ${m.color}dd, ${m.color}99)`, boxShadow: `0 2px 12px ${m.color}50` }}
                    transition={{ type: 'spring', stiffness: 450, damping: 34 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  <m.icon className="w-3.5 h-3.5" />
                  {m.label}
                  {m.badge && (
                    <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full leading-none"
                      style={{ background: active === m.key ? 'rgba(255,255,255,0.25)' : '#f43f5e', color: '#fff' }}>
                      {m.badge}
                    </span>
                  )}
                </span>
              </button>
            ))}
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="hidden md:flex w-9 h-9 rounded-full items-center justify-center transition-all duration-200"
              style={{ border: tc('1px solid rgba(255,255,255,0.08)','1px solid rgba(0,0,0,0.08)'), background: tc('rgba(255,255,255,0.04)','rgba(0,0,0,0.03)'), color: tc('#64748b','#94a3b8') }}>
              <HiOutlineSearch className="w-4 h-4" />
            </button>

            {/* Notification bell */}
            <button className="hidden md:flex relative w-9 h-9 rounded-full items-center justify-center transition-all duration-200"
              style={{ border: tc('1px solid rgba(255,255,255,0.08)','1px solid rgba(0,0,0,0.08)'), background: tc('rgba(255,255,255,0.04)','rgba(0,0,0,0.03)'), color: tc('#64748b','#94a3b8') }}>
              <HiOutlineBell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-500" />
            </button>

            {/* User chip */}
            <div className="hidden md:flex items-center gap-2 pl-2 pr-1 py-1 rounded-full ml-1"
              style={{ border: tc('1px solid rgba(255,255,255,0.08)','1px solid rgba(0,0,0,0.08)'), background: tc('rgba(255,255,255,0.04)','rgba(0,0,0,0.03)') }}>
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black"
                style={{ background: `linear-gradient(135deg, #6366f1, #8b5cf6)`, color: '#fff' }}>
                {user?.name?.[0]}
              </div>
              <div className="text-right pr-1.5">
                <div className="text-[11.5px] font-semibold leading-none" style={{ color: tc('#e2e8f0','#1e293b') }}>{user?.name}</div>
                <div className="text-[9px] font-bold uppercase tracking-wider mt-0.5 gradient-text">{user?.role}</div>
              </div>
            </div>

            {/* Logout */}
            <button onClick={handleLogout}
              className="hidden md:flex items-center gap-1.5 text-[12px] font-semibold rounded-full px-3.5 py-2 transition-all duration-200"
              style={{ border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', background: 'rgba(239,68,68,0.06)' }}>
              <HiOutlineLogout className="w-3.5 h-3.5" />
            </button>

            {/* Mobile hamburger */}
            <button onClick={() => setMobileOpen(!mobileOpen)}
              className="xl:hidden w-9 h-9 rounded-full flex items-center justify-center"
              style={{ border: tc('1px solid rgba(255,255,255,0.1)','1px solid rgba(0,0,0,0.1)'), background: tc('rgba(255,255,255,0.04)','rgba(0,0,0,0.03)') }}>
              {mobileOpen ? <HiOutlineX className="w-4 h-4" /> : <HiOutlineMenuAlt2 className="w-4 h-4" />}
            </button>
          </div>
        </motion.div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.97 }}
              transition={{ duration: .28, ease: [.22,1,.36,1] }}
              className="xl:hidden"
              style={{ maxWidth: 1400, margin: '8px auto 0', borderRadius: 24, overflow: 'hidden',
                background: tc('rgba(7,9,18,0.95)','rgba(255,255,255,0.95)'), backdropFilter: 'blur(32px) saturate(200%)',
                border: tc('1px solid rgba(255,255,255,0.07)','1px solid rgba(0,0,0,0.07)'),
                boxShadow: tc('0 20px 60px rgba(0,0,0,0.7)','0 20px 60px rgba(0,0,0,0.12)') }}>
              <div className="p-3 grid grid-cols-2 gap-1.5">
                {modules.map((m) => (
                  <button key={m.key} onClick={() => setActive(m.key)}
                    className="flex items-center gap-2.5 px-4 py-3 rounded-2xl text-sm font-semibold transition-all text-left"
                    style={{ background: active === m.key ? `${m.color}18` : 'transparent', color: active === m.key ? m.color : tc('#94a3b8','#64748b') }}>
                    <m.icon className="w-4 h-4 flex-shrink-0" />
                    <span>{m.label}</span>
                    {m.badge && <span className="ml-auto text-[9px] font-black px-1.5 py-0.5 rounded-full" style={{ background: '#f43f5e', color: '#fff' }}>{m.badge}</span>}
                  </button>
                ))}
              </div>
              <div className="px-3 pb-3" style={{ borderTop: tc('1px solid rgba(255,255,255,0.06)','1px solid rgba(0,0,0,0.06)') }}>
                <button onClick={handleLogout} className="w-full mt-3 flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-red-400 hover:bg-red-500/10 transition-all">
                  <HiOutlineLogout className="w-4 h-4" />Logout
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ═══ MAIN ═══ */}
      <main className="pt-24 px-4 lg:px-8 max-w-[1400px] mx-auto pb-20">

        {/* Hero header with stats */}
        {active === 'events' && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5, delay: .1 }} className="mb-8">
            {/* Page title strip */}
            <div className="flex items-center gap-4 mb-6">
              <div className="relative">
                <div className="w-13 h-13 rounded-2xl flex items-center justify-center"
                  style={{ background: `linear-gradient(135deg, ${activeMod.color}25, ${activeMod.color}10)`, border: `1px solid ${activeMod.color}30` }}>
                  <activeMod.icon className="w-6 h-6" style={{ color: activeMod.color }} />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center"
                  style={{ background: `linear-gradient(135deg, ${activeMod.color}, ${activeMod.color}cc)` }}>
                  <HiOutlineLightningBolt className="w-2.5 h-2.5 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-black font-heading text-text-primary leading-none">{activeMod.label}</h1>
                <p className="text-sm text-text-muted mt-0.5">{activeMod.desc}</p>
              </div>
              <div className="ml-auto hidden md:flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full"
                style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981', border: '1px solid rgba(16,185,129,0.2)' }}>
                <HiOutlineShieldCheck className="w-3.5 h-3.5" />System online
              </div>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
              {quickStats.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i, duration: .4, ease: [.22,1,.36,1] }}
                  className="card-base p-4 flex items-center gap-3 group hover:border-opacity-50 transition-all duration-200 overflow-hidden relative"
                  style={{ '--hover-color': s.color }}
                  whileHover={{ y: -2 }}
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: `linear-gradient(135deg, ${s.color}08, transparent)` }} />
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: s.bg, border: `1px solid ${s.color}25` }}>
                    <s.icon className="w-5 h-5" style={{ color: s.color }} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xl font-black text-text-primary leading-none">{s.value}</div>
                    <div className="text-[11px] text-text-muted mt-0.5 truncate">{s.label}</div>
                  </div>
                  <div className="ml-auto flex-shrink-0">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                      style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981' }}>
                      {s.change}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Module header for non-events */}
        {active !== 'events' && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .4, delay: .1 }} className="mb-8">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{ background: `linear-gradient(135deg, ${activeMod.color}22, ${activeMod.color}0d)`, border: `1px solid ${activeMod.color}28` }}>
                  <activeMod.icon className="w-5.5 h-5.5" style={{ color: activeMod.color }} />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-black font-heading text-text-primary">{activeMod.label}</h1>
                <p className="text-sm text-text-muted">{activeMod.desc}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tab content */}
        <AnimatePresence mode="wait">
          <motion.div key={active}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: .3, ease: [.22,1,.36,1] }}>
            {active === 'events'       && <EventsManager  showConfirm={showConfirm} toast={toast} />}
            {active === 'team'         && <CrudManager endpoint="team" fields={['name','role','category','linkedin','github']} imageField="photo" categoryOptions={['executive','tech','event','sponsors','digital_media','marketing','research']} showConfirm={showConfirm} toast={toast} />}
            {active === 'partners'     && <CrudManager endpoint="partners" fields={['name','website','category']} imageField="logo" showConfirm={showConfirm} toast={toast} />}
            {active === 'brands'       && <CrudManager endpoint="brands" fields={['name','website']} imageField="logo" showConfirm={showConfirm} toast={toast} />}
            {active === 'contributors' && <CrudManager endpoint="contributors" fields={['name','github','role','avatar','bio']} showConfirm={showConfirm} toast={toast} />}
            {active === 'contacts'     && <ContactsManager toast={toast} />}
            {active === 'profile'      && <ProfileManager user={user} updateUser={updateUser} toast={toast} />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* ═══ CONFIRM MODAL ═══ */}
      <AnimatePresence>
        {confirmModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/75 backdrop-blur-md p-4"
            onClick={() => setConfirmModal(null)}>
            <motion.div
              initial={{ scale: 0.9, y: 24, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 10, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className="bg-bg-surface border border-border/60 rounded-3xl p-7 w-full max-w-sm shadow-2xl text-center"
              onClick={(e) => e.stopPropagation()}>
              {/* Icon */}
              <div className="relative w-16 h-16 mx-auto mb-5">
                <div className="absolute inset-0 rounded-2xl bg-red-500/15 animate-pulse" />
                <div className="relative w-full h-full rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                  <HiOutlineTrash className="w-7 h-7 text-red-400" />
                </div>
              </div>
              <h3 className="text-lg font-black text-text-primary mb-2">Confirm Delete</h3>
              <p className="text-sm text-text-secondary mb-7 leading-relaxed">{confirmModal.message}</p>
              <div className="flex gap-3">
                <button onClick={() => setConfirmModal(null)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-border text-text-secondary hover:bg-white/5 transition-colors">Cancel</button>
                <button onClick={() => { confirmModal.onConfirm(); setConfirmModal(null); }}
                  className="flex-1 py-2.5 rounded-xl text-sm font-black text-white transition-all duration-200 hover:scale-[1.02]"
                  style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)', boxShadow: '0 4px 16px rgba(239,68,68,0.35)' }}>
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   SECTION HEADER
───────────────────────────────────────────────────────────── */
const SectionHeader = ({ count, countLabel = 'items', onAdd, addLabel = 'Add', accent = '#6366f1' }) => (
  <div className="flex items-center justify-between mb-5">
    <div className="flex items-center gap-2.5">
      <div className="text-sm font-semibold text-text-secondary">
        <span className="text-text-primary font-black text-base">{count}</span>{' '}
        <span className="text-text-muted">{countLabel}</span>
      </div>
      {count > 0 && (
        <div className="h-1 w-1 rounded-full bg-text-muted/30" />
      )}
    </div>
    {onAdd && (
      <motion.button
        whileHover={{ scale: 1.03, y: -1 }}
        whileTap={{ scale: 0.97 }}
        onClick={onAdd}
        className="flex items-center gap-2 text-sm font-bold px-4 py-2.5 rounded-xl text-white"
        style={{
          background: `linear-gradient(135deg, ${accent}, ${accent}cc)`,
          boxShadow: `0 4px 16px ${accent}40`,
        }}
      >
        <HiOutlinePlus className="w-4 h-4" />
        {addLabel}
      </motion.button>
    )}
  </div>
);

/* ─────────────────────────────────────────────────────────────
   EVENTS MANAGER
───────────────────────────────────────────────────────────── */
const EventsManager = ({ showConfirm, toast }) => {
  const [items, setItems]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]   = useState(null);
  const [filter, setFilter] = useState('all');

  const load = useCallback(() => {
    setLoading(true);
    api.get('/admin/events').then((r) => setItems(r.data.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);
  useEffect(() => { load(); }, [load]);

  const handleSave = async (formData) => {
    try {
      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
      if (modal?._id) { await api.put(`/admin/events/${modal._id}`, formData, config); toast.success('Event updated!'); }
      else             { await api.post('/admin/events', formData, config);            toast.success('Event created!'); }
      setModal(null); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Error saving event.'); }
  };

  const handleDelete = (id) =>
    showConfirm('Delete this event and all its images?', async () => {
      try { await api.delete(`/admin/events/${id}`); toast.success('Event deleted!'); load(); }
      catch { toast.error('Error deleting event.'); }
    });

  const statusConfig = {
    upcoming: { bg: 'rgba(16,185,129,0.1)',  text: '#10b981', dot: '#10b981', label: 'Upcoming' },
    ongoing:  { bg: 'rgba(99,102,241,0.1)',  text: '#6366f1', dot: '#6366f1', label: 'Live',      pulse: true },
    past:     { bg: 'rgba(100,116,139,0.1)', text: '#64748b', dot: '#64748b', label: 'Past' },
  };

  const filters = ['all', 'upcoming', 'ongoing', 'past'];
  const filtered = filter === 'all' ? items : items.filter((i) => i.status === filter);

  return (
    <div>
      {/* Filter pills + add button row */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div className="flex items-center gap-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all duration-200"
              style={filter === f
                ? { background: 'rgba(99,102,241,0.15)', color: '#6366f1', border: '1px solid rgba(99,102,241,0.3)' }
                : { background: 'transparent', color: '#64748b', border: '1px solid transparent' }}>
              {f === 'all' ? `All (${items.length})` : f}
            </button>
          ))}
        </div>
        <motion.button
          whileHover={{ scale: 1.03, y: -1 }} whileTap={{ scale: 0.97 }}
          onClick={() => setModal({})}
          className="flex items-center gap-2 text-sm font-bold px-4 py-2.5 rounded-xl text-white"
          style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', boxShadow: '0 4px 16px rgba(99,102,241,0.4)' }}>
          <HiOutlinePlus className="w-4 h-4" />Add Event
        </motion.button>
      </div>

      {loading ? <Spinner /> : (
        <motion.div variants={stagger} initial="hidden" animate="visible" className="grid gap-3">
          {filtered.map((item, idx) => {
            const s = statusConfig[item.status] || statusConfig.past;
            return (
              <motion.div
                key={item._id}
                variants={fadeUp}
                whileHover={{ y: -2, transition: { duration: 0.15 } }}
                className="group relative card-base overflow-hidden transition-all duration-200 cursor-default"
                style={{ '--accent': s.text }}
              >
                {/* Left color strip */}
                <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-full transition-all duration-300 opacity-0 group-hover:opacity-100"
                  style={{ background: `linear-gradient(180deg, ${s.dot}, ${s.dot}66)` }} />

                <div className="flex items-center gap-4 p-4 pl-5">
                  {/* Thumbnail */}
                  {(item.coverImage || item.image) ? (
                    <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 ring-1 ring-border group-hover:ring-2 transition-all duration-300" style={{ '--tw-ring-color': s.dot + '40' }}>
                      <img src={item.coverImage || item.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-2xl flex-shrink-0 flex items-center justify-center ring-1 ring-border"
                      style={{ background: `linear-gradient(135deg, ${s.dot}18, ${s.dot}08)` }}>
                      <HiOutlineCalendar className="w-6 h-6" style={{ color: s.dot + '80' }} />
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <h3 className="font-heading font-black text-sm text-text-primary truncate transition-colors duration-200 group-hover:text-[--accent]"
                        style={{ '--accent': s.text }}>{item.title}</h3>
                      {!item.published && (
                        <span className="text-[9px] px-2 py-0.5 rounded-lg font-black tracking-wide uppercase flex-shrink-0"
                          style={{ background: 'rgba(245,158,11,0.12)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.2)' }}>
                          Draft
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      {/* Status badge */}
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{ background: s.bg, color: s.text, border: `1px solid ${s.dot}30` }}>
                        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${s.pulse ? 'animate-pulse' : ''}`}
                          style={{ background: s.dot }} />
                        {s.label}
                      </span>
                      {/* Date */}
                      <span className="text-text-muted text-xs flex items-center gap-1">
                        <HiOutlineCalendar className="w-3 h-3" />
                        {new Date(item.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                      {/* Gallery count */}
                      {item.gallery?.length > 0 && (
                        <span className="text-text-muted text-xs flex items-center gap-1">
                          <HiOutlinePhotograph className="w-3 h-3" />
                          {item.gallery.length} photo{item.gallery.length !== 1 ? 's' : ''}
                        </span>
                      )}
                      {/* Category */}
                      {item.category && item.category !== 'other' && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md capitalize"
                          style={{ background: 'rgba(99,102,241,0.08)', color: '#6366f1' }}>
                          {item.category}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-1.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <ActionBtn icon={HiOutlinePencil} onClick={() => setModal(item)} label="Edit" />
                    <ActionBtn icon={HiOutlineTrash}  onClick={() => handleDelete(item._id)} danger label="Delete" />
                  </div>
                  {/* Always visible actions on mobile */}
                  <div className="flex gap-1.5 flex-shrink-0 group-hover:hidden md:hidden">
                    <ActionBtn icon={HiOutlinePencil} onClick={() => setModal(item)} />
                    <ActionBtn icon={HiOutlineTrash}  onClick={() => handleDelete(item._id)} danger />
                  </div>
                </div>
              </motion.div>
            );
          })}
          {filtered.length === 0 && <EmptyState icon={HiOutlineCalendar} message={filter === 'all' ? 'No events yet — create your first!' : `No ${filter} events.`} accent="#6366f1" />}
        </motion.div>
      )}

      <AnimatePresence>
        {modal !== null && <EventModal item={modal} onSave={handleSave} onClose={() => setModal(null)} onReload={load} />}
      </AnimatePresence>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   EVENT MODAL
───────────────────────────────────────────────────────────── */
const EventModal = ({ item, onSave, onClose, onReload }) => {
  const [form, setForm] = useState({
    title:       item.title || '',
    date:        item.date ? new Date(item.date).toISOString().split('T')[0] : '',
    description: item.description || '',
    location:    item.location || '',
    eventLink:   item.eventLink || '',
    status:      item.status || 'upcoming',
    category:    item.category || 'other',
    published:   item.published !== undefined ? item.published : true,
  });
  const [newFiles, setNewFiles]         = useState([]);
  const [existingGallery, setExistingGallery] = useState(item.gallery || []);
  const [saving, setSaving]             = useState(false);
  const [activeTab, setActiveTab]       = useState('details');

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.gif'] },
    maxFiles: 10 - existingGallery.length,
    onDrop: (accepted) => {
      const total = existingGallery.length + newFiles.length + accepted.length;
      if (total > 10) { return; }
      setNewFiles((prev) => [...prev, ...accepted]);
    },
  });

  const removeExistingImage = async (imageId) => {
    if (!item._id) return;
    try {
      await api.delete(`/admin/events/${item._id}/images/${imageId}`);
      setExistingGallery((prev) => prev.filter((img) => img._id !== imageId));
    } catch {}
  };

  const setCover = async (imageUrl) => {
    if (!item._id) return;
    const img = existingGallery.find((g) => g.url === imageUrl);
    if (!img) return;
    try { await api.put(`/admin/events/${item._id}/cover`, { imageId: img._id }); if (onReload) onReload(); } catch {}
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.date) return;
    setSaving(true);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, String(v)));
    newFiles.forEach((file) => fd.append('gallery', file));
    await onSave(fd);
    setSaving(false);
  };

  const slotsLeft = 10 - existingGallery.length - newFiles.length;
  const tabs = [{ key: 'details', label: 'Details', icon: HiOutlineCog }, { key: 'gallery', label: `Gallery (${existingGallery.length + newFiles.length})`, icon: HiOutlinePhotograph }];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4"
      onClick={onClose}>
      <motion.div
        initial={{ scale: 0.94, y: 28, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.94, y: 16, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 32 }}
        className="bg-bg-surface border border-border/60 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-5 flex-shrink-0"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'linear-gradient(135deg, rgba(99,102,241,0.06), rgba(139,92,246,0.04))' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.25)' }}>
              <HiOutlineCalendar className="w-5 h-5 text-[#6366f1]" />
            </div>
            <div>
              <h2 className="text-base font-black font-heading text-text-primary">{item._id ? 'Edit Event' : 'New Event'}</h2>
              <p className="text-[11px] text-text-muted">{item._id ? 'Update event details' : 'Fill in the details below'}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/8 transition-colors">
            <HiOutlineX className="w-5 h-5 text-text-secondary" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex px-6 pt-4 gap-1 flex-shrink-0">
          {tabs.map((t) => (
            <button key={t.key} onClick={() => setActiveTab(t.key)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200"
              style={activeTab === t.key
                ? { background: 'rgba(99,102,241,0.15)', color: '#6366f1', border: '1px solid rgba(99,102,241,0.25)' }
                : { background: 'transparent', color: '#64748b', border: '1px solid transparent' }}>
              <t.icon className="w-3.5 h-3.5" />{t.label}
            </button>
          ))}
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1">
          <form onSubmit={handleSubmit}>
            {activeTab === 'details' && (
              <div className="px-6 py-5 space-y-5">
                <Input label="Title *" value={form.title} onChange={(v) => setForm({ ...form, title: v })} accent="#6366f1" />

                <div className="grid grid-cols-2 gap-4">
                  <Input label="Date *" type="date" value={form.date} onChange={(v) => setForm({ ...form, date: v })} accent="#6366f1" />
                  <Input label="Location" value={form.location} onChange={(v) => setForm({ ...form, location: v })} accent="#6366f1" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-secondary mb-1.5 uppercase tracking-wider">Description</label>
                  <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows="3"
                    className="w-full bg-bg-primary border border-border rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-[#6366f1]/60 focus:ring-2 focus:ring-[#6366f1]/10 transition-all resize-none" />
                </div>

                <Input label="Event Link" value={form.eventLink} onChange={(v) => setForm({ ...form, eventLink: v })} accent="#6366f1" />

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-text-secondary mb-1.5 uppercase tracking-wider">Status</label>
                    <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                      className="w-full bg-bg-primary border border-border rounded-xl px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-[#6366f1]/60 transition-all">
                      <option value="upcoming">Upcoming</option>
                      <option value="ongoing">Ongoing</option>
                      <option value="past">Past</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-secondary mb-1.5 uppercase tracking-wider">Category</label>
                    <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="w-full bg-bg-primary border border-border rounded-xl px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-[#6366f1]/60 transition-all">
                      {['workshop','hackathon','meetup','webinar','conference','other'].map((c) => (
                        <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-secondary mb-1.5 uppercase tracking-wider">Visibility</label>
                    <button type="button" onClick={() => setForm({ ...form, published: !form.published })}
                      className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold border transition-all duration-200"
                      style={form.published
                        ? { borderColor: 'rgba(16,185,129,0.3)', background: 'rgba(16,185,129,0.1)', color: '#10b981' }
                        : { borderColor: 'rgba(245,158,11,0.3)', background: 'rgba(245,158,11,0.1)', color: '#f59e0b' }}>
                      {form.published ? <><HiOutlineEye className="w-3.5 h-3.5" />Published</> : <><HiOutlineEyeOff className="w-3.5 h-3.5" />Draft</>}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'gallery' && (
              <div className="px-6 py-5 space-y-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">Gallery Images</span>
                  <span className="text-xs text-text-muted">{existingGallery.length + newFiles.length} / 10</span>
                </div>

                {existingGallery.length > 0 && (
                  <div className="grid grid-cols-5 gap-2">
                    {existingGallery.map((img) => (
                      <div key={img._id} className="relative group rounded-2xl overflow-hidden aspect-square ring-1 ring-border">
                        <img src={img.url} alt={img.altText || ''} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/65 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                          <button type="button" onClick={() => setCover(img.url)} className="p-1.5 rounded-lg bg-white/20 hover:bg-white/40 transition-colors" title="Set cover">
                            <HiOutlineStar className="w-3 h-3 text-white" />
                          </button>
                          <button type="button" onClick={() => removeExistingImage(img._id)} className="p-1.5 rounded-lg bg-red-500/70 hover:bg-red-500 transition-colors">
                            <HiOutlineTrash className="w-3 h-3 text-white" />
                          </button>
                        </div>
                        {item.coverImage === img.url && (
                          <div className="absolute top-1 left-1 text-[8px] px-1.5 py-0.5 rounded-md font-black uppercase"
                            style={{ background: '#6366f1', color: '#fff' }}>Cover</div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {newFiles.length > 0 && (
                  <div className="grid grid-cols-5 gap-2">
                    {newFiles.map((file, i) => (
                      <div key={i} className="relative group rounded-2xl overflow-hidden aspect-square ring-2" style={{ '--tw-ring-color': 'rgba(6,182,212,0.4)' }}>
                        <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/65 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button type="button" onClick={() => setNewFiles((p) => p.filter((_, j) => j !== i))} className="p-1.5 rounded-lg bg-red-500/70 hover:bg-red-500 transition-colors">
                            <HiOutlineTrash className="w-3 h-3 text-white" />
                          </button>
                        </div>
                        <div className="absolute top-1 left-1 text-[8px] px-1.5 py-0.5 rounded-md font-black uppercase"
                          style={{ background: '#06b6d4', color: '#fff' }}>New</div>
                      </div>
                    ))}
                  </div>
                )}

                {slotsLeft > 0 && (
                  <div {...getRootProps()}
                    className="border-2 border-dashed rounded-2xl px-4 py-10 text-center cursor-pointer transition-all duration-200"
                    style={isDragActive
                      ? { borderColor: '#6366f1', background: 'rgba(99,102,241,0.08)' }
                      : { borderColor: 'rgba(255,255,255,0.12)', background: 'transparent' }}>
                    <input {...getInputProps()} />
                    <HiOutlinePhotograph className="w-10 h-10 text-text-muted mx-auto mb-2.5 opacity-40" />
                    <p className="text-sm font-semibold text-text-secondary">
                      {isDragActive ? 'Drop images here…' : 'Drag & drop or click to upload'}
                    </p>
                    <p className="text-[11px] text-text-muted mt-1">{slotsLeft} slot{slotsLeft !== 1 ? 's' : ''} remaining · JPG, PNG, WEBP</p>
                  </div>
                )}
              </div>
            )}

            {/* Save button */}
            <div className="px-6 pb-6 pt-2">
              <button type="submit" disabled={saving}
                className="w-full font-black py-3.5 rounded-2xl text-white flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', boxShadow: '0 6px 24px rgba(99,102,241,0.4)' }}>
                {saving
                  ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving…</>
                  : <><HiOutlineCheck className="w-4.5 h-4.5" />{item._id ? 'Update Event' : 'Create Event'}</>
                }
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ─────────────────────────────────────────────────────────────
   GENERIC CRUD MANAGER
───────────────────────────────────────────────────────────── */
const CrudManager = ({ endpoint, fields, imageField, categoryOptions, showConfirm, toast }) => {
  const [items, setItems]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]   = useState(null);
  const [search, setSearch] = useState('');

  const load = useCallback(() => {
    setLoading(true);
    api.get(`/admin/${endpoint}/all`).then((r) => setItems(r.data.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, [endpoint]);
  useEffect(() => { load(); }, [load]);

  const handleSave = async (formData) => {
    try {
      const isFormData = formData instanceof FormData;
      const config = isFormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
      if (modal?._id) { await api.put(`/admin/${endpoint}/${modal._id}`, formData, config); toast.success('Updated!'); }
      else            { await api.post(`/admin/${endpoint}`, formData, config);             toast.success('Created!'); }
      setModal(null); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Error saving.'); }
  };

  const handleDelete = (id) =>
    showConfirm('Delete this item?', async () => {
      try { await api.delete(`/admin/${endpoint}/${id}`); toast.success('Deleted!'); load(); }
      catch { toast.error('Error deleting.'); }
    });

  const filtered = search
    ? items.filter((i) => (i.name || i.title || '').toLowerCase().includes(search.toLowerCase()))
    : items;

  /* Resolve accent from endpoint */
  const accent = { team: '#8b5cf6', partners: '#06b6d4', brands: '#f59e0b', contributors: '#10b981' }[endpoint] || '#6366f1';

  return (
    <div>
      {/* Search + add */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="flex-1 relative min-w-[180px]">
          <HiOutlineSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
          <input
            type="text"
            placeholder={`Search ${endpoint}…`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-bg-primary border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent-primary/60 transition-all placeholder:text-text-muted/50"
          />
        </div>
        <div className="text-sm text-text-muted shrink-0">
          <span className="font-black text-text-primary">{filtered.length}</span> items
        </div>
        <motion.button
          whileHover={{ scale: 1.03, y: -1 }} whileTap={{ scale: 0.97 }}
          onClick={() => setModal({})}
          className="flex items-center gap-2 text-sm font-bold px-4 py-2.5 rounded-xl text-white shrink-0"
          style={{ background: `linear-gradient(135deg, ${accent}, ${accent}cc)`, boxShadow: `0 4px 16px ${accent}40` }}>
          <HiOutlinePlus className="w-4 h-4" />Add
        </motion.button>
      </div>

      {loading ? <Spinner /> : (
        <motion.div variants={stagger} initial="hidden" animate="visible" className="grid gap-2.5">
          {filtered.map((item) => (
            <motion.div
              key={item._id}
              variants={fadeUp}
              whileHover={{ y: -2, transition: { duration: 0.15 } }}
              className="group relative card-base p-4 flex items-center gap-4 transition-all duration-200 hover:border-opacity-50 overflow-hidden"
              style={{ '--accent': accent }}>

              <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-full opacity-0 group-hover:opacity-100 transition-all duration-300"
                style={{ background: `linear-gradient(180deg, ${accent}, ${accent}66)` }} />

              {/* Avatar */}
              {imageField && item[imageField] ? (
                <div className="w-11 h-11 rounded-xl overflow-hidden flex-shrink-0 ring-1 ring-border group-hover:ring-2 transition-all" style={{ '--tw-ring-color': accent + '40' }}>
                  <img src={item[imageField]} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
              ) : imageField ? (
                <div className="w-11 h-11 rounded-xl flex-shrink-0 flex items-center justify-center ring-1 ring-border text-sm font-black"
                  style={{ background: accent + '15', color: accent }}>
                  {(item.name || item.title || '?')[0].toUpperCase()}
                </div>
              ) : null}

              <div className="flex-1 min-w-0">
                <h3 className="font-heading font-bold text-sm text-text-primary truncate transition-colors duration-200 group-hover:text-[--accent]">{item.name || item.title}</h3>
                <p className="text-text-muted text-xs truncate mt-0.5">{item.role || item.category || item.website || item.github || ''}</p>
              </div>

              <div className="flex gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <ActionBtn icon={HiOutlinePencil} onClick={() => setModal(item)} color={accent} />
                <ActionBtn icon={HiOutlineTrash}  onClick={() => handleDelete(item._id)} danger />
              </div>
            </motion.div>
          ))}
          {filtered.length === 0 && <EmptyState icon={HiOutlineSparkles} message={search ? `No results for "${search}"` : 'Nothing here yet — add your first item!'} accent={accent} />}
        </motion.div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {modal !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4"
            onClick={() => setModal(null)}>
            <motion.div
              initial={{ scale: 0.94, y: 24, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.94, y: 16, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 32 }}
              className="bg-bg-surface border border-border/60 rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}>
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 flex-shrink-0"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', background: `linear-gradient(135deg, ${accent}0a, transparent)` }}>
                <div>
                  <h2 className="text-base font-black font-heading text-text-primary">{modal._id ? 'Edit Item' : 'Add New'}</h2>
                  <p className="text-[11px] text-text-muted mt-0.5">{endpoint.charAt(0).toUpperCase() + endpoint.slice(1)}</p>
                </div>
                <button onClick={() => setModal(null)} className="p-2 rounded-xl hover:bg-white/8 transition-colors">
                  <HiOutlineX className="w-5 h-5 text-text-secondary" />
                </button>
              </div>
              <div className="p-6">
                <CrudForm item={modal} fields={fields} imageField={imageField} categoryOptions={categoryOptions} onSave={handleSave} accent={accent} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const CrudForm = ({ item, fields, imageField, categoryOptions, onSave, accent = '#6366f1' }) => {
  const [form, setForm] = useState(() => fields.reduce((acc, f) => ({ ...acc, [f]: item[f] || '' }), {}));
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    if (imageField && file) {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      fd.append(imageField, file);
      await onSave(fd);
    } else { await onSave(form); }
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map((field) =>
        field === 'category' && categoryOptions ? (
          <div key={field}>
            <label className="block text-xs font-bold text-text-secondary mb-1.5 uppercase tracking-wider capitalize">{field}</label>
            <select value={form[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })}
              className="w-full bg-bg-primary border border-border rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent-primary/60 focus:ring-2 focus:ring-accent-primary/10 transition-all">
              <option value="">Select…</option>
              {categoryOptions.map((o) => <option key={o} value={o}>{o.replace('_', ' ')}</option>)}
            </select>
          </div>
        ) : (field === 'bio' || field === 'description') ? (
          <div key={field}>
            <label className="block text-xs font-bold text-text-secondary mb-1.5 uppercase tracking-wider capitalize">{field}</label>
            <textarea value={form[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })} rows="3"
              className="w-full bg-bg-primary border border-border rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent-primary/60 focus:ring-2 focus:ring-accent-primary/10 transition-all resize-none" />
          </div>
        ) : (
          <Input key={field} label={field} value={form[field]} onChange={(v) => setForm({ ...form, [field]: v })} accent={accent} />
        )
      )}

      {imageField && (
        <div>
          <label className="block text-xs font-bold text-text-secondary mb-1.5 uppercase tracking-wider capitalize">{imageField}</label>
          <label className="flex items-center gap-3 cursor-pointer border border-dashed border-border rounded-xl px-4 py-3.5 hover:border-opacity-60 transition-all duration-200 group"
            style={{ '--hover-border': accent }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
              style={{ background: accent + '12' }}>
              <HiOutlinePhotograph className="w-4.5 h-4.5" style={{ color: accent }} />
            </div>
            <span className="text-sm text-text-muted">{file ? file.name : 'Choose image…'}</span>
            {file && <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: accent + '15', color: accent }}>Selected</span>}
            <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} className="hidden" />
          </label>
        </div>
      )}

      <button type="submit" disabled={saving}
        className="w-full font-black py-3.5 rounded-2xl text-white flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 mt-2"
        style={{ background: `linear-gradient(135deg, ${accent}, ${accent}cc)`, boxShadow: `0 6px 24px ${accent}40` }}>
        {saving
          ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving…</>
          : <><HiOutlineCheck className="w-4 h-4" />{item._id ? 'Update' : 'Create'}</>
        }
      </button>
    </form>
  );
};

/* ─────────────────────────────────────────────────────────────
   CONTACTS MANAGER
───────────────────────────────────────────────────────────── */
const ContactsManager = ({ toast }) => {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [filter, setFilter]   = useState('all');

  useEffect(() => {
    api.get('/admin/contacts?limit=100').then((r) => setItems(r.data.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const toggleRead = async (id) => {
    try {
      const r = await api.patch(`/admin/contacts/${id}/read`);
      setItems((prev) => prev.map((i) => i._id === id ? r.data.data : i));
    } catch { toast.error('Error.'); }
  };

  const unreadCount = items.filter((i) => !i.isRead).length;
  const filtered = filter === 'all' ? items : filter === 'unread' ? items.filter((i) => !i.isRead) : items.filter((i) => i.isRead);

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div className="flex items-center gap-2">
          {['all', 'unread', 'read'].map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all duration-200 flex items-center gap-1.5"
              style={filter === f
                ? { background: 'rgba(244,63,94,0.12)', color: '#f43f5e', border: '1px solid rgba(244,63,94,0.25)' }
                : { background: 'transparent', color: '#64748b', border: '1px solid transparent' }}>
              {f === 'unread' && unreadCount > 0 && <span className="w-1.5 h-1.5 rounded-full bg-[#f43f5e]" />}
              {f === 'all' ? `All (${items.length})` : f === 'unread' ? `Unread (${unreadCount})` : 'Read'}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0
        ? <EmptyState icon={HiOutlineMail} message="No messages here." accent="#f43f5e" />
        : (
          <motion.div variants={stagger} initial="hidden" animate="visible" className="grid gap-2.5">
            {filtered.map((item) => (
              <motion.div key={item._id} variants={fadeUp}
                className={`group card-base overflow-hidden transition-all duration-200 ${!item.isRead ? 'hover:border-[#f43f5e]/30' : 'opacity-60'}`}>
                <div className="p-4 cursor-pointer" onClick={() => setExpanded(expanded === item._id ? null : item._id)}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-black text-sm transition-all"
                        style={item.isRead
                          ? { background: 'rgba(100,116,139,0.1)', color: '#64748b' }
                          : { background: 'rgba(244,63,94,0.12)', color: '#f43f5e' }}>
                        {item.name[0].toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-heading font-bold text-sm text-text-primary">{item.name}</h3>
                          {!item.isRead && <span className="w-1.5 h-1.5 rounded-full bg-[#f43f5e] flex-shrink-0 animate-pulse" />}
                        </div>
                        <p className="text-text-muted text-xs truncate">{item.email} · {new Date(item.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={item.isRead
                          ? { background: 'rgba(100,116,139,0.1)', color: '#64748b' }
                          : { background: 'rgba(244,63,94,0.1)', color: '#f43f5e' }}>
                        {item.isRead ? 'Read' : 'New'}
                      </span>
                      <motion.div animate={{ rotate: expanded === item._id ? 90 : 0 }} transition={{ duration: 0.2 }}>
                        <HiOutlineChevronRight className="w-4 h-4 text-text-muted" />
                      </motion.div>
                    </div>
                  </div>
                  {item.subject && (
                    <p className="text-[#f43f5e] text-xs font-semibold mt-1.5 ml-13 truncate">{item.subject}</p>
                  )}
                </div>

                <AnimatePresence>
                  {expanded === item._id && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22, ease: 'easeOut' }} className="overflow-hidden">
                      <div className="px-4 pb-4 pt-3 ml-13" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                        <p className="text-text-secondary text-sm leading-relaxed whitespace-pre-wrap">{item.message}</p>
                        <div className="flex items-center gap-3 mt-3">
                          <a href={`mailto:${item.email}`}
                            className="text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all"
                            style={{ background: 'rgba(244,63,94,0.1)', color: '#f43f5e', border: '1px solid rgba(244,63,94,0.2)' }}>
                            <HiOutlineMail className="w-3.5 h-3.5" />Reply
                          </a>
                          <button onClick={() => toggleRead(item._id)} className="text-xs font-semibold text-text-muted hover:text-text-primary transition-colors">
                            Mark as {item.isRead ? 'unread' : 'read'}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        )
      }
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   PROFILE MANAGER
───────────────────────────────────────────────────────────── */
const ProfileManager = ({ user, updateUser, toast }) => {
  const [form, setForm]     = useState({ name: user?.name || '', bio: user?.bio || '' });
  const [file, setFile]     = useState(null);
  const [preview, setPreview] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);

  const handleFileChange = (e) => {
    const f = e.target.files[0]; if (!f) return;
    if (preview) URL.revokeObjectURL(preview);
    setFile(f); setPreview(URL.createObjectURL(f));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('bio', form.bio);
      if (file) fd.append('profilePicture', file);
      const res = await api.put('/admin/profile', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      updateUser(res.data.data);
      toast.success('Profile updated!');
    } catch (err) { toast.error(err.response?.data?.message || 'Error.'); }
    finally { setSaving(false); }
  };

  const avatar = preview || user?.profilePicture;

  return (
    <div className="max-w-lg">
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="card-base overflow-hidden">
        {/* Banner */}
        <div className="h-28 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #6366f140 0%, #8b5cf630 50%, #06b6d420 100%)' }}>
          {/* Decorative grid */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.12]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
                <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#6366f1" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
          {/* Accent orbs */}
          <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #8b5cf6, transparent)' }} />
          <div className="absolute -bottom-4 left-10 w-20 h-20 rounded-full opacity-15" style={{ background: 'radial-gradient(circle, #06b6d4, transparent)' }} />
        </div>

        <div className="px-6 pb-7">
          <div className="flex items-end gap-4 -mt-12 mb-6">
            {/* Avatar */}
            <div className="relative group flex-shrink-0">
              <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-bg-surface shadow-2xl"
                style={{ boxShadow: '0 8px 32px rgba(99,102,241,0.3)' }}>
                {avatar
                  ? <img src={avatar} alt="" className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center text-3xl font-black text-white"
                      style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                      {user?.name?.[0]}
                    </div>
                }
              </div>
              <label className="absolute inset-0 rounded-2xl bg-black/55 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer gap-1">
                <HiOutlinePhotograph className="w-5 h-5 text-white" />
                <span className="text-[10px] text-white font-bold">Change</span>
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </label>
            </div>

            <div className="pb-1 min-w-0">
              <h3 className="font-heading font-black text-xl text-text-primary leading-none">{user?.name}</h3>
              <p className="text-text-muted text-sm mt-0.5 truncate">{user?.email}</p>
              <div className="flex items-center gap-1.5 mt-1.5">
                <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full text-white"
                  style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                  <HiOutlineSparkles className="w-3 h-3" />{user?.role}
                </span>
              </div>
            </div>
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-3 gap-2 mb-6 p-3 rounded-2xl" style={{ background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.1)' }}>
            {[{ label: 'Role', value: user?.role || 'Admin' }, { label: 'Status', value: 'Active' }, { label: 'Since', value: '2024' }].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-sm font-black text-text-primary">{s.value}</div>
                <div className="text-[10px] text-text-muted font-semibold mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Display Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} accent="#6366f1" />
            <div>
              <label className="block text-xs font-bold text-text-secondary mb-1.5 uppercase tracking-wider">Bio</label>
              <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows="3"
                placeholder="Tell us about yourself…"
                className="w-full bg-bg-primary border border-border rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-[#6366f1]/60 focus:ring-2 focus:ring-[#6366f1]/10 transition-all resize-none placeholder:text-text-muted/40" />
            </div>
            <button type="submit" disabled={saving}
              className="flex items-center gap-2 font-black px-6 py-2.5 rounded-xl text-white transition-all duration-200 disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', boxShadow: '0 4px 16px rgba(99,102,241,0.4)' }}>
              {saving
                ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving…</>
                : <><HiOutlineCheck className="w-4 h-4" />Save Profile</>
              }
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   SHARED COMPONENTS
───────────────────────────────────────────────────────────── */
const Input = ({ label, value, onChange, type = 'text', accent = '#6366f1' }) => (
  <div>
    <label className="block text-xs font-bold text-text-secondary mb-1.5 uppercase tracking-wider">
      {label.replace('*', '').trim()}
      {label.includes('*') && <span className="text-red-400 ml-0.5">*</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-bg-primary border border-border rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none transition-all placeholder:text-text-muted/40"
      style={{ '--focus-color': accent }}
      onFocus={(e) => { e.target.style.borderColor = accent + '70'; e.target.style.boxShadow = `0 0 0 3px ${accent}15`; }}
      onBlur={(e) => { e.target.style.borderColor = ''; e.target.style.boxShadow = ''; }}
    />
  </div>
);

const ActionBtn = ({ icon: Icon, onClick, danger = false, color = '#6366f1', label }) => (
  <motion.button
    whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
    onClick={onClick}
    title={label}
    className="p-2 rounded-xl transition-all duration-200 flex items-center gap-1.5"
    style={danger
      ? { background: 'transparent', color: '#94a3b8' }
      : { background: 'transparent', color: '#94a3b8' }}
    onMouseEnter={(e) => {
      e.currentTarget.style.background = danger ? 'rgba(239,68,68,0.12)' : color + '15';
      e.currentTarget.style.color = danger ? '#f87171' : color;
    }}
    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#94a3b8'; }}>
    <Icon className="w-4 h-4" />
  </motion.button>
);

const Spinner = () => (
  <div className="flex flex-col items-center justify-center py-28 gap-4">
    <div className="relative w-12 h-12">
      <div className="absolute inset-0 rounded-full border-2 opacity-10" style={{ borderColor: '#6366f1' }} />
      <div className="absolute inset-0 rounded-full border-2 border-transparent animate-spin" style={{ borderTopColor: '#6366f1' }} />
      <div className="absolute inset-2 rounded-full border border-transparent animate-spin" style={{ borderTopColor: '#8b5cf6', animationDirection: 'reverse', animationDuration: '0.6s' }} />
    </div>
    <p className="text-text-muted text-sm font-medium">Loading…</p>
  </div>
);

const EmptyState = ({ icon: Icon, message, accent = '#6366f1' }) => (
  <motion.div variants={fadeUp} className="card-base p-16 text-center">
    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
      style={{ background: accent + '12', border: `1px solid ${accent}20` }}>
      <Icon className="w-7 h-7 opacity-40" style={{ color: accent }} />
    </div>
    <p className="text-text-secondary text-sm font-medium">{message}</p>
  </motion.div>
);

export default AdminDashboard;