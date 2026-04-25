import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  HiOutlineDocumentText, HiOutlineUsers, HiOutlineClipboardList,
  HiOutlineCog, HiOutlineLogout, HiOutlinePlus, HiOutlinePencil,
  HiOutlineTrash, HiOutlineX, HiOutlineKey, HiOutlineShieldCheck,
  HiOutlineBan, HiOutlineSparkles,
  HiOutlineMenuAlt2, HiOutlineCheck, HiOutlineLockClosed,
  HiOutlineSearch, HiOutlineFilter, HiOutlineLightningBolt,
  HiOutlineChip, HiOutlineGlobe, HiOutlineTag,
} from 'react-icons/hi';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useToast } from '../components/common/ToastNotification';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';

/* ─── Motion Presets ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 28, filter: 'blur(4px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.055 } } };
const slideIn = {
  hidden: { opacity: 0, x: -16 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

const modules = [
  { key: 'content',  label: 'Site Content',  icon: HiOutlineDocumentText, color: '#5B5FEF', grad: 'from-indigo-500 to-violet-600', glow: 'rgba(91,95,239,0.35)', desc: 'Manage site-wide content keys' },
  { key: 'admins',   label: 'Admin Manager', icon: HiOutlineUsers,        color: '#8B5CF6', grad: 'from-violet-500 to-purple-700', glow: 'rgba(139,92,246,0.35)', desc: 'Create and manage admin accounts' },
  { key: 'logs',     label: 'Activity Logs', icon: HiOutlineClipboardList,color: '#00C2FF', grad: 'from-cyan-400 to-blue-600',   glow: 'rgba(0,194,255,0.3)',   desc: 'View system activity and audit trail' },
  { key: 'settings', label: 'Settings',      icon: HiOutlineCog,          color: '#F59E0B', grad: 'from-amber-400 to-orange-600', glow: 'rgba(245,158,11,0.3)',  desc: 'Global site configuration' },
];

/* ─── Content key category inference ─── */
const getCategoryMeta = (key = '') => {
  if (key.includes('email') || key.includes('contact'))
    return { icon: HiOutlineGlobe, label: 'Contact', accent: '#00C2FF', bg: 'rgba(0,194,255,0.08)' };
  if (key.includes('chat') || key.includes('bot') || key.includes('ai'))
    return { icon: HiOutlineChip, label: 'AI/Bot', accent: '#8B5CF6', bg: 'rgba(139,92,246,0.08)' };
  if (key.includes('setting') || key.includes('config'))
    return { icon: HiOutlineCog, label: 'Config', accent: '#F59E0B', bg: 'rgba(245,158,11,0.08)' };
  if (key.includes('about') || key.includes('description') || key.includes('text'))
    return { icon: HiOutlineDocumentText, label: 'Content', accent: '#10B981', bg: 'rgba(16,185,129,0.08)' };
  return { icon: HiOutlineTag, label: 'General', accent: '#5B5FEF', bg: 'rgba(91,95,239,0.08)' };
};

const SuperAdminDashboard = () => {
  const [active, setActive] = useState('content');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const { isDark } = useTheme();
  const toast = useToast();
  const navigate = useNavigate();
  const activeMod = modules.find((m) => m.key === active);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);
  useEffect(() => { setMobileOpen(false); }, [active]);

  const handleLogout = () => { logout(); toast.success('Logged out.'); navigate('/'); };

  const glass = {
    background: isDark ? 'rgba(8,11,20,0.6)' : 'rgba(255,255,255,0.5)',
    backdropFilter: 'blur(32px) saturate(200%)',
    WebkitBackdropFilter: 'blur(32px) saturate(200%)',
    border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.07)',
    boxShadow: scrolled
      ? isDark ? '0 8px 48px rgba(0,0,0,0.7), inset 0 .5px 0 rgba(255,255,255,0.07)' : '0 8px 48px rgba(0,0,0,0.1), inset 0 .5px 0 rgba(255,255,255,0.8)'
      : isDark ? '0 4px 24px rgba(0,0,0,0.4)' : '0 4px 24px rgba(0,0,0,0.05)',
    transition: 'all 0.5s cubic-bezier(0.22,1,0.36,1)',
  };
  const tc = (a, b) => isDark ? a : b;

  return (
    <div className="min-h-screen bg-bg-primary font-sans">

      {/* ═══ Floating Navbar ═══ */}
      <nav className="fixed top-0 left-0 right-0 z-50" style={{ padding: scrolled ? '8px 16px' : '14px 16px', transition: 'padding .5s cubic-bezier(.22,1,.36,1)' }}>
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [.22,1,.36,1] }}
          style={{ ...glass, maxWidth: 1360, margin: '0 auto', borderRadius: 80, height: scrolled ? 58 : 64, padding: '0 12px 0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <img src="/logo.png" alt="B2B" className="h-8 transition-transform duration-300 group-hover:scale-110" />
            <div className="hidden sm:block">
              <div className="font-heading text-sm font-bold gradient-text leading-none">Bug2Build</div>
              <div className="text-[9px] font-bold uppercase tracking-[.15em] flex items-center gap-1" style={{ color: '#8B5CF6' }}>
                <HiOutlineSparkles className="w-2.5 h-2.5" />Super Admin
              </div>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-1 mx-auto">
            {modules.map((m) => (
              <button
                key={m.key}
                onClick={() => setActive(m.key)}
                className="relative px-4 py-1.5 rounded-full text-[13px] font-medium transition-all duration-300"
                style={{ color: active === m.key ? tc('#F1F5F9','#0F172A') : tc('#94A3B8','#64748B') }}
              >
                {active === m.key && (
                  <motion.div
                    layoutId="super-tab"
                    className="absolute inset-0 rounded-full"
                    style={{ background: `${m.color}18`, border: `1px solid ${m.color}30` }}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  <m.icon className="w-3.5 h-3.5" style={active === m.key ? { color: m.color } : {}} />
                  {m.label}
                </span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => navigate('/admin')}
              className="hidden md:flex items-center gap-1.5 text-[12.5px] font-semibold rounded-full px-4 py-1.5 transition-all duration-300"
              style={{ border: tc('1px solid rgba(255,255,255,.12)','1px solid rgba(0,0,0,.1)'), color: tc('#94A3B8','#64748B'), background: tc('rgba(255,255,255,.04)','rgba(0,0,0,.03)') }}
            >
              <HiOutlineCog className="w-3.5 h-3.5" />Admin Panel
            </button>
            <div className="hidden md:flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black border" style={{ background: tc('rgba(139,92,246,.15)','rgba(139,92,246,.08)'), color: '#8B5CF6', borderColor: tc('rgba(139,92,246,.25)','rgba(139,92,246,.15)') }}>
                {user?.name?.[0]}
              </div>
              <div className="text-right mr-1">
                <div className="text-xs font-semibold leading-none" style={{ color: tc('#F1F5F9','#0F172A') }}>{user?.name}</div>
                <div className="text-[9px] font-bold uppercase tracking-wider mt-0.5 flex items-center gap-0.5 justify-end" style={{ color: '#8B5CF6' }}>
                  <HiOutlineSparkles className="w-2.5 h-2.5" />SuperAdmin
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="hidden md:flex items-center gap-1.5 text-[12.5px] font-semibold rounded-full px-4 py-1.5 transition-all duration-300"
              style={{ border: tc('1px solid rgba(239,68,68,.2)','1px solid rgba(239,68,68,.15)'), color: '#EF4444', background: tc('rgba(239,68,68,.08)','rgba(239,68,68,.05)') }}
            >
              <HiOutlineLogout className="w-3.5 h-3.5" />Logout
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden w-9 h-9 rounded-full flex items-center justify-center"
              style={{ border: tc('1px solid rgba(255,255,255,.1)','1px solid rgba(0,0,0,.1)'), background: tc('rgba(255,255,255,.04)','rgba(0,0,0,.03)') }}
            >
              {mobileOpen ? <HiOutlineX className="w-4 h-4" /> : <HiOutlineMenuAlt2 className="w-4 h-4" />}
            </button>
          </div>
        </motion.div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -16, scale: .96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: .96 }}
              transition={{ duration: .3, ease: [.22,1,.36,1] }}
              className="lg:hidden"
              style={{ maxWidth: 1360, margin: '10px auto 0', borderRadius: 28, overflow: 'hidden', background: tc('rgba(8,11,20,.92)','rgba(255,255,255,.92)'), backdropFilter: 'blur(28px) saturate(190%)', border: tc('1px solid rgba(255,255,255,.06)','1px solid rgba(0,0,0,.06)'), boxShadow: tc('0 16px 48px rgba(0,0,0,.6)','0 16px 48px rgba(0,0,0,.1)') }}
            >
              <div className="p-4 space-y-1">
                {modules.map((m) => (
                  <button key={m.key} onClick={() => { setActive(m.key); setMobileOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all"
                    style={{ background: active === m.key ? `${m.color}15` : 'transparent', color: active === m.key ? m.color : tc('#94A3B8','#64748B') }}>
                    <m.icon className="w-4 h-4" />{m.label}
                  </button>
                ))}
                <div className="pt-3 mt-2 space-y-1" style={{ borderTop: tc('1px solid rgba(255,255,255,.06)','1px solid rgba(0,0,0,.06)') }}>
                  <button onClick={() => { navigate('/admin'); setMobileOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all" style={{ color: tc('#94A3B8','#64748B') }}>
                    <HiOutlineCog className="w-4 h-4" />Admin Panel
                  </button>
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all">
                    <HiOutlineLogout className="w-4 h-4" />Logout
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ═══ Page Header ═══ */}
      <main className="pt-28 px-4 lg:px-8 max-w-[1360px] mx-auto pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: .5, delay: .2 }}
          className="mb-10"
        >
          <div className="flex items-center gap-5">
            {/* Animated icon block */}
            <motion.div
              whileHover={{ scale: 1.08, rotate: 3 }}
              className="relative w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 overflow-hidden"
              style={{ background: `${activeMod?.color}12`, border: `1px solid ${activeMod?.color}25` }}
            >
              {/* Shimmer sweep */}
              <motion.div
                animate={{ x: ['-100%', '200%'] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: 'linear', repeatDelay: 1 }}
                className="absolute inset-0 w-1/2"
                style={{ background: `linear-gradient(90deg, transparent, ${activeMod?.color}18, transparent)` }}
              />
              {activeMod && <activeMod.icon className="w-7 h-7 relative z-10" style={{ color: activeMod.color }} />}
            </motion.div>

            <div>
              <div className="flex items-center gap-3 mb-0.5">
                <h1 className="text-2xl font-black font-heading text-text-primary">{activeMod?.label}</h1>
                <motion.span
                  key={active}
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
                  style={{ background: `${activeMod?.color}15`, color: activeMod?.color, border: `1px solid ${activeMod?.color}25` }}
                >
                  Live
                </motion.span>
              </div>
              <p className="text-sm text-text-muted">{activeMod?.desc}</p>
            </div>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: .35, ease: [.22,1,.36,1] }}
          >
            {active === 'content'  && <ContentEditor />}
            {active === 'admins'   && <AdminManager />}
            {active === 'logs'     && <ActivityLogs />}
            {active === 'settings' && <SiteSettings />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   SECTION HEADER
───────────────────────────────────────────────────────────── */
const SectionHeader = ({ count, countLabel = 'items', onAdd, addLabel = 'Add', searchValue, onSearch }) => (
  <div className="flex items-center justify-between mb-7 gap-4 flex-wrap">
    <div className="flex items-center gap-3">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl"
        style={{ background: 'rgba(91,95,239,0.08)', border: '1px solid rgba(91,95,239,0.15)' }}
      >
        <div className="w-1.5 h-1.5 rounded-full bg-accent-primary animate-pulse" />
        <span className="text-xs font-bold text-accent-primary">{count}</span>
        <span className="text-xs text-text-muted">{countLabel}</span>
      </motion.div>
    </div>

    <div className="flex items-center gap-2">
      {onSearch !== undefined && (
        <div className="relative">
          <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
          <input
            type="text"
            placeholder="Search keys…"
            value={searchValue}
            onChange={(e) => onSearch(e.target.value)}
            className="pl-9 pr-4 py-2 text-xs rounded-xl border border-border bg-bg-primary text-text-primary focus:outline-none focus:border-accent-primary/60 focus:ring-2 focus:ring-accent-primary/10 transition-all w-44"
          />
        </div>
      )}
      {onAdd && (
        <motion.button
          whileHover={{ scale: 1.03, y: -1 }}
          whileTap={{ scale: 0.97 }}
          onClick={onAdd}
          className="gradient-btn text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg shadow-accent-primary/25 relative overflow-hidden"
        >
          <motion.div
            animate={{ x: ['-100%', '200%'] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'linear', repeatDelay: 2 }}
            className="absolute inset-0 w-1/3 bg-white/10"
            style={{ skewX: '-20deg' }}
          />
          <HiOutlinePlus className="w-3.5 h-3.5 relative z-10" />
          <span className="relative z-10">{addLabel}</span>
        </motion.button>
      )}
    </div>
  </div>
);

/* ─────────────────────────────────────────────────────────────
   ★ ENHANCED CONTENT EDITOR
───────────────────────────────────────────────────────────── */
const ContentEditor = () => {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [search, setSearch]   = useState('');
  const [copied, setCopied]   = useState(null);
  const toast = useToast();

  useEffect(() => {
    api.get('/superadmin/content')
      .then((r) => setItems(r.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (key) => {
    try {
      await api.put(`/superadmin/content/${key}`, { value: editValue });
      setItems((prev) => prev.map((i) => i.key === key ? { ...i, value: editValue } : i));
      setEditing(null);
      toast.success('Content updated!');
    } catch { toast.error('Error updating.'); }
  };

  const handleCopy = (key) => {
    navigator.clipboard.writeText(key);
    setCopied(key);
    setTimeout(() => setCopied(null), 1800);
  };

  const filtered = items.filter(
    (i) => !search || i.key.toLowerCase().includes(search.toLowerCase()) || (i.value || '').toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <Spinner />;

  return (
    <div>
      <SectionHeader
        count={filtered.length}
        countLabel="content keys"
        searchValue={search}
        onSearch={setSearch}
      />

      <motion.div variants={stagger} initial="hidden" animate="visible" className="grid gap-3">
        {filtered.map((item, idx) => (
          <ContentCard
            key={item.key}
            item={item}
            idx={idx}
            editing={editing}
            editValue={editValue}
            copied={copied}
            onEdit={() => { setEditing(item.key); setEditValue(item.value || ''); }}
            onSave={() => handleSave(item.key)}
            onCancel={() => setEditing(null)}
            onCopy={() => handleCopy(item.key)}
            onEditValueChange={setEditValue}
          />
        ))}
        {filtered.length === 0 && (
          <EmptyState icon={HiOutlineDocumentText} message={search ? `No results for "${search}"` : 'No content keys found.'} />
        )}
      </motion.div>
    </div>
  );
};

/* ─── Individual Content Card ─── */
const ContentCard = ({ item, idx, editing, editValue, copied, onEdit, onSave, onCancel, onEditValueChange, onCopy }) => {
  const isEditing = editing === item.key;
  const meta = getCategoryMeta(item.key);
  const CatIcon = meta.icon;
  const charCount = (item.value || '').length;
  const isLong = charCount > 120;

  return (
    <motion.div
      variants={fadeUp}
      layout
      whileHover={!isEditing ? { y: -3, transition: { duration: 0.2 } } : {}}
      className="group relative overflow-hidden rounded-2xl transition-all duration-300"
      style={{
        background: isEditing
          ? 'linear-gradient(135deg, rgba(91,95,239,0.06) 0%, rgba(139,92,246,0.04) 100%)'
          : 'var(--bg-card, rgba(255,255,255,0.03))',
        border: isEditing
          ? '1px solid rgba(91,95,239,0.35)'
          : '1px solid rgba(255,255,255,0.07)',
        boxShadow: isEditing
          ? '0 0 0 4px rgba(91,95,239,0.08), 0 8px 32px rgba(91,95,239,0.12)'
          : '0 2px 12px rgba(0,0,0,0.08)',
      }}
    >
      {/* Left accent stripe */}
      <motion.div
        className="absolute left-0 top-0 bottom-0 w-[3px] rounded-r-full"
        style={{ background: `linear-gradient(180deg, ${meta.accent}, transparent)` }}
        initial={{ scaleY: 0, originY: 0 }}
        animate={{ scaleY: isEditing ? 1 : 0 }}
        whileMotionHover={{ scaleY: 1 }}
        transition={{ duration: 0.3 }}
      />
      {/* Hover stripe */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[3px] rounded-r-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `linear-gradient(180deg, ${meta.accent}90, transparent)` }}
      />

      {/* Top ambient glow when editing */}
      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-x-0 top-0 h-px"
            style={{ background: `linear-gradient(90deg, transparent, ${meta.accent}60, transparent)` }}
          />
        )}
      </AnimatePresence>

      <div className="p-5">
        {/* Card header */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Category badge */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest cursor-pointer"
              style={{ background: meta.bg, color: meta.accent, border: `1px solid ${meta.accent}20` }}
              onClick={onCopy}
              title="Click to copy key"
            >
              <CatIcon className="w-3 h-3" />
              {meta.label}
            </motion.div>

            {/* Key name */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={onCopy}
              className="flex items-center gap-1.5 group/key"
              title="Copy key to clipboard"
            >
              <code
                className="text-accent-primary text-xs font-mono px-2.5 py-1 rounded-lg border transition-all duration-200 group-hover/key:border-accent-primary/50"
                style={{ background: 'rgba(91,95,239,0.08)', borderColor: 'rgba(91,95,239,0.18)' }}
              >
                {item.key}
              </code>
              <AnimatePresence mode="wait">
                {copied === item.key ? (
                  <motion.span key="copied" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="text-emerald-400">
                    <HiOutlineCheck className="w-3 h-3" />
                  </motion.span>
                ) : (
                  <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 0 }} whileHover={{ opacity: 1 }} className="text-text-muted opacity-0 group-hover/key:opacity-100 transition-opacity">
                    {/* copy icon hint */}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Length badge */}
            {charCount > 0 && (
              <span
                className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                style={{ background: isLong ? 'rgba(245,158,11,0.1)' : 'rgba(16,185,129,0.08)', color: isLong ? '#F59E0B' : '#10B981' }}
              >
                {charCount} chars
              </span>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {isEditing ? (
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05, y: -1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onSave}
                  className="gradient-btn text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-md shadow-accent-primary/25"
                >
                  <HiOutlineCheck className="w-3.5 h-3.5" /> Save
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onCancel}
                  className="text-text-secondary text-xs font-medium px-3 py-2 rounded-xl border border-border hover:bg-white/5 transition-colors"
                >
                  Cancel
                </motion.button>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                onClick={onEdit}
                className="w-8 h-8 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200"
                style={{ background: 'rgba(91,95,239,0.1)', color: '#5B5FEF', border: '1px solid rgba(91,95,239,0.2)' }}
              >
                <HiOutlinePencil className="w-3.5 h-3.5" />
              </motion.button>
            )}
          </div>
        </div>

        {/* Content area */}
        <AnimatePresence mode="wait">
          {isEditing ? (
            <motion.div
              key="editing"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.25 }}
            >
              <textarea
                value={editValue}
                onChange={(e) => onEditValueChange(e.target.value)}
                rows={Math.min(Math.max(3, Math.ceil(editValue.length / 80)), 8)}
                autoFocus
                className="w-full bg-bg-primary border border-accent-primary/30 rounded-xl px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-accent-primary/60 focus:ring-2 focus:ring-accent-primary/10 transition-all resize-none font-mono leading-relaxed"
                style={{ minHeight: 90 }}
              />
              <div className="flex items-center justify-between mt-2">
                <span className="text-[10px] text-text-muted font-mono">{editValue.length} characters</span>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-primary animate-pulse" />
                  <span className="text-[10px] text-accent-primary font-semibold">Editing</span>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="pl-1"
            >
              {item.value ? (
                <p className="text-text-secondary text-sm leading-relaxed whitespace-pre-wrap group-hover:text-text-primary transition-colors duration-200">
                  {item.value}
                </p>
              ) : (
                <span className="text-text-muted text-xs italic flex items-center gap-2">
                  <span className="w-4 h-px bg-border inline-block" />
                  Empty — click edit to add content
                </span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom progress bar for text length */}
      {!isEditing && charCount > 0 && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: `linear-gradient(90deg, ${meta.accent}60, transparent)` }}
          initial={{ scaleX: 0, originX: 0 }}
          whileHover={{ scaleX: Math.min(charCount / 300, 1) }}
          transition={{ duration: 0.5 }}
        />
      )}
    </motion.div>
  );
};

/* ─────────────────────────────────────────────────────────────
   ADMIN MANAGER
───────────────────────────────────────────────────────────── */
const AdminManager = () => {
  const [admins, setAdmins]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]     = useState(null);
  const [pwModal, setPwModal] = useState(null);
  const toast = useToast();

  const load = useCallback(() => {
    setLoading(true);
    api.get('/superadmin/admins')
      .then((r) => setAdmins(r.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);
  useEffect(() => { load(); }, [load]);

  const handleCreate = async (form) => {
    try { await api.post('/superadmin/admins', form); toast.success('Admin created!'); setModal(null); load(); }
    catch (err) { toast.error(err.response?.data?.message || 'Error.'); }
  };
  const handleDelete = async (id) => {
    if (!confirm('Delete this admin?')) return;
    try { await api.delete(`/superadmin/admins/${id}`); toast.success('Admin deleted!'); load(); }
    catch (err) { toast.error(err.response?.data?.message || 'Cannot delete.'); }
  };
  const handleToggleActive = async (id) => {
    try { await api.patch(`/superadmin/admins/${id}/activate`); toast.success('Status toggled!'); load(); }
    catch (err) { toast.error(err.response?.data?.message || 'Error.'); }
  };
  const handleResetPassword = async (id, password) => {
    try { await api.patch(`/superadmin/admins/${id}/password`, { password }); toast.success('Password reset!'); setPwModal(null); }
    catch (err) { toast.error(err.response?.data?.message || 'Error.'); }
  };

  const roleColor = (role) => role === 'superadmin' ? '#8B5CF6' : '#5B5FEF';

  return (
    <div>
      <SectionHeader count={admins.length} countLabel="admins" onAdd={() => setModal({})} addLabel="Add Admin" />
      {loading ? <Spinner /> : (
        <motion.div variants={stagger} initial="hidden" animate="visible" className="grid gap-3">
          {admins.map((admin) => (
            <motion.div
              key={admin._id}
              variants={fadeUp}
              whileHover={{ y: -2 }}
              className="group card-base p-4 flex items-center gap-4 transition-all duration-200 hover:border-accent-primary/30 relative overflow-hidden"
            >
              <div className="absolute left-0 top-0 bottom-0 w-0.5 rounded-full bg-accent-primary/0 group-hover:bg-accent-primary/60 transition-all duration-300" />
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black flex-shrink-0 border"
                style={{ background: `${roleColor(admin.role)}20`, color: roleColor(admin.role), borderColor: `${roleColor(admin.role)}30` }}>
                {admin.name?.[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="font-heading font-bold text-sm text-text-primary group-hover:text-accent-primary transition-colors">{admin.name}</h3>
                  <span className="text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-md"
                    style={{ background: `${roleColor(admin.role)}15`, color: roleColor(admin.role) }}>
                    {admin.role}
                  </span>
                </div>
                <p className="text-text-muted text-xs">{admin.email}</p>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${admin.isActive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                  {admin.isActive ? 'Active' : 'Inactive'}
                </span>
                {admin.role !== 'superadmin' && (
                  <>
                    <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }} onClick={() => handleToggleActive(admin._id)} className="p-2 rounded-xl hover:bg-white/5 transition-colors">
                      {admin.isActive ? <HiOutlineBan className="w-4 h-4 text-yellow-400" /> : <HiOutlineShieldCheck className="w-4 h-4 text-emerald-400" />}
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }} onClick={() => setPwModal(admin._id)} className="p-2 rounded-xl hover:bg-accent-primary/10 transition-colors text-text-muted hover:text-accent-primary">
                      <HiOutlineKey className="w-4 h-4" />
                    </motion.button>
                    <ActionBtn icon={HiOutlineTrash} onClick={() => handleDelete(admin._id)} danger />
                  </>
                )}
              </div>
            </motion.div>
          ))}
          {admins.length === 0 && <EmptyState icon={HiOutlineUsers} message="No admins found." />}
        </motion.div>
      )}
      <AnimatePresence>
        {modal !== null && <CreateAdminModal onSave={handleCreate} onClose={() => setModal(null)} />}
      </AnimatePresence>
      <AnimatePresence>
        {pwModal && <ResetPwModal adminId={pwModal} onSave={handleResetPassword} onClose={() => setPwModal(null)} />}
      </AnimatePresence>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   CREATE ADMIN MODAL
───────────────────────────────────────────────────────────── */
const CreateAdminModal = ({ onSave, onClose }) => {
  const [form, setForm]     = useState({ name: '', email: '', password: '', role: 'admin' });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onSave(form);
    setSaving(false);
  };

  return (
    <ModalShell title="Create Admin" icon={HiOutlineUsers} color="#8B5CF6" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
        <Input label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
        <Input label="Password" type="password" value={form.password} onChange={(v) => setForm({ ...form, password: v })} />
        <div>
          <label className="block text-xs font-bold text-text-secondary mb-1.5 uppercase tracking-wide">Role</label>
          <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="w-full bg-bg-primary border border-border rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent-primary/60 focus:ring-2 focus:ring-accent-primary/10 transition-all">
            <option value="admin">Admin</option>
            <option value="superadmin">SuperAdmin</option>
          </select>
        </div>
        <button type="submit" disabled={saving}
          className="w-full gradient-btn text-white font-bold py-3 rounded-xl disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-accent-primary/25 mt-2">
          {saving
            ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Creating…</>
            : <><HiOutlineCheck className="w-4 h-4" />Create Admin</>}
        </button>
      </form>
    </ModalShell>
  );
};

/* ─────────────────────────────────────────────────────────────
   RESET PASSWORD MODAL
───────────────────────────────────────────────────────────── */
const ResetPwModal = ({ adminId, onSave, onClose }) => {
  const [password, setPassword] = useState('');
  return (
    <ModalShell title="Reset Password" icon={HiOutlineLockClosed} color="#00C2FF" onClose={onClose}>
      <div className="space-y-4">
        <Input label="New Password" type="password" value={password} onChange={setPassword} />
        <motion.button
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSave(adminId, password)}
          disabled={!password || password.length < 8}
          className="w-full gradient-btn text-white font-bold py-3 rounded-xl disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-accent-primary/25">
          <HiOutlineKey className="w-4 h-4" />Reset Password
        </motion.button>
      </div>
    </ModalShell>
  );
};

/* ─────────────────────────────────────────────────────────────
   ACTIVITY LOGS
───────────────────────────────────────────────────────────── */
const ActivityLogs = () => {
  const [logs, setLogs]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage]       = useState(1);
  const [pages, setPages]     = useState(1);

  useEffect(() => {
    setLoading(true);
    api.get(`/superadmin/logs?page=${page}&limit=20`)
      .then((r) => { setLogs(r.data.data || []); setPages(r.data.pagination?.pages || 1); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page]);

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <span className="text-sm text-text-secondary">
          <span className="text-text-primary font-bold">{logs.length}</span> log entries
        </span>
        <span className="text-xs text-text-muted">Page {page} of {pages}</span>
      </div>
      <motion.div variants={stagger} initial="hidden" animate="visible" className="grid gap-2">
        {logs.map((log) => (
          <motion.div key={log._id} variants={fadeUp}
            className="group card-base px-4 py-3 flex items-start gap-3 transition-all duration-200 hover:border-accent-primary/20">
            <div className="w-8 h-8 rounded-xl bg-accent-primary/10 flex items-center justify-center text-xs font-black text-accent-primary flex-shrink-0 mt-0.5 border border-accent-primary/20">
              {log.user?.name?.[0] || '?'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-text-primary">
                <span className="font-semibold">{log.user?.name || 'System'}</span>{' '}
                <span className="text-text-secondary">{log.action}</span>
              </p>
              <p className="text-xs text-text-muted mt-0.5 flex items-center gap-2">
                <span>{new Date(log.timestamp || log.createdAt).toLocaleString()}</span>
                {log.ip && <><span>·</span><code className="text-[10px] font-mono bg-white/5 px-1.5 py-0.5 rounded">{log.ip}</code></>}
              </p>
            </div>
          </motion.div>
        ))}
        {logs.length === 0 && <EmptyState icon={HiOutlineClipboardList} message="No activity logs found." />}
      </motion.div>
      {pages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
            <motion.button key={p} whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }} onClick={() => setPage(p)}
              className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${page === p ? 'gradient-btn text-white shadow-lg shadow-accent-primary/25' : 'border border-border text-text-secondary hover:border-accent-primary/50 hover:text-text-primary'}`}>
              {p}
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   SITE SETTINGS
───────────────────────────────────────────────────────────── */
const SiteSettings = () => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const toast = useToast();

  useEffect(() => {
    api.get('/superadmin/settings')
      .then((r) => setSettings(r.data.data || {}))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try { await api.put('/superadmin/settings', settings); toast.success('Settings saved!'); }
    catch { toast.error('Error saving settings.'); }
    finally { setSaving(false); }
  };

  if (loading) return <Spinner />;

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <span className="text-sm text-text-secondary">
          <span className="text-text-primary font-bold">{Object.keys(settings).length}</span> settings
        </span>
      </div>
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="card-base overflow-hidden">
        <div className="p-6 space-y-4">
          {Object.entries(settings).map(([key, value]) => (
            <div key={key}>
              <label className="block text-xs font-bold text-text-secondary mb-1.5 uppercase tracking-wide">
                <code className="text-accent-primary font-mono bg-accent-primary/10 px-1.5 py-0.5 rounded-md border border-accent-primary/20 normal-case tracking-normal text-[11px]">{key}</code>
              </label>
              <input type="text" value={value} onChange={(e) => setSettings({ ...settings, [key]: e.target.value })}
                className="w-full bg-bg-primary border border-border rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent-primary/60 focus:ring-2 focus:ring-accent-primary/10 transition-all" />
            </div>
          ))}
        </div>
        <div className="px-6 pb-6">
          <motion.button whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.98 }} onClick={handleSave} disabled={saving}
            className="gradient-btn text-white font-bold px-6 py-2.5 rounded-xl disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-accent-primary/25">
            {saving
              ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving…</>
              : <><HiOutlineCheck className="w-4 h-4" />Save Settings</>}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   MODAL SHELL
───────────────────────────────────────────────────────────── */
const ModalShell = ({ title, icon: Icon, color = '#5B5FEF', children, onClose }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
    onClick={onClose}>
    <motion.div initial={{ scale: 0.96, y: 24 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96, y: 16, opacity: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="bg-bg-surface border border-border/60 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
      onClick={(e) => e.stopPropagation()}>
      <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-border/50"
        style={{ background: 'color-mix(in srgb, var(--bg-surface) 90%, transparent)', backdropFilter: 'blur(8px)' }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}20` }}>
            {Icon && <Icon className="w-4 h-4" style={{ color }} />}
          </div>
          <h2 className="text-base font-black font-heading">{title}</h2>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
          <HiOutlineX className="w-5 h-5 text-text-secondary" />
        </button>
      </div>
      <div className="p-6">{children}</div>
    </motion.div>
  </motion.div>
);

/* ─────────────────────────────────────────────────────────────
   SHARED COMPONENTS
───────────────────────────────────────────────────────────── */
const Input = ({ label, value, onChange, type = 'text' }) => (
  <div>
    <label className="block text-xs font-bold text-text-secondary mb-1.5 uppercase tracking-wide capitalize">
      {label.replace('*', '').trim()}
      {label.includes('*') && <span className="text-red-400 ml-0.5">*</span>}
    </label>
    <input type={type} value={value} onChange={(e) => onChange(e.target.value)}
      className="w-full bg-bg-primary border border-border rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent-primary/60 focus:ring-2 focus:ring-accent-primary/10 transition-all placeholder:text-text-muted/50" />
  </div>
);

const ActionBtn = ({ icon: Icon, onClick, danger = false }) => (
  <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }} onClick={onClick}
    className={`p-2 rounded-xl transition-all duration-200 ${danger ? 'hover:bg-red-500/15 text-text-muted hover:text-red-400' : 'hover:bg-accent-primary/10 text-text-muted hover:text-accent-primary'}`}>
    <Icon className="w-4 h-4" />
  </motion.button>
);

const Spinner = () => (
  <div className="flex flex-col items-center justify-center py-24 gap-4">
    <div className="relative w-12 h-12">
      <div className="absolute inset-0 rounded-full border-2 border-accent-primary/10" />
      <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-accent-primary animate-spin" />
      <div className="absolute inset-2 rounded-full border border-transparent border-t-violet-400/60 animate-spin" style={{ animationDuration: '0.6s', animationDirection: 'reverse' }} />
    </div>
    <p className="text-text-muted text-sm">Loading…</p>
  </div>
);

const EmptyState = ({ icon: Icon, message }) => (
  <motion.div variants={fadeUp} className="card-base p-14 text-center">
    <div className="w-14 h-14 rounded-2xl bg-accent-primary/10 flex items-center justify-center mx-auto mb-4">
      <Icon className="w-7 h-7 text-accent-primary/40" />
    </div>
    <p className="text-text-secondary text-sm">{message}</p>
  </motion.div>
);

export default SuperAdminDashboard;