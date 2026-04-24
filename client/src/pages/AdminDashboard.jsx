import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  HiOutlineCalendar, HiOutlineUsers, HiOutlineGlobe, HiOutlineBriefcase,
  HiOutlineCode, HiOutlineMail, HiOutlineUser, HiOutlineLogout,
  HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineX,
  HiOutlinePhotograph, HiOutlineStar, HiOutlineEye, HiOutlineEyeOff,
  HiOutlineChevronRight, HiOutlineSparkles, HiOutlineMenuAlt2,
  HiOutlineCheck,
} from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { useToast } from '../components/common/ToastNotification';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } };

const modules = [
  { key: 'events', label: 'Events', icon: HiOutlineCalendar, color: '#5B5FEF', desc: 'Manage all events' },
  { key: 'team', label: 'Team', icon: HiOutlineUsers, color: '#8B5CF6', desc: 'Team members' },
  { key: 'partners', label: 'Partners', icon: HiOutlineGlobe, color: '#00C2FF', desc: 'Community partners' },
  { key: 'brands', label: 'Brands', icon: HiOutlineBriefcase, color: '#F59E0B', desc: 'Trusted brands' },
  { key: 'contributors', label: 'Contributors', icon: HiOutlineCode, color: '#10B981', desc: 'Open source contributors' },
  { key: 'contacts', label: 'Messages', icon: HiOutlineMail, color: '#FF6B8A', desc: 'Contact submissions' },
  { key: 'profile', label: 'Profile', icon: HiOutlineUser, color: '#94A3B8', desc: 'Account settings' },
];

const AdminDashboard = () => {
  const [active, setActive] = useState('events');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [confirmModal, setConfirmModal] = useState(null);
  const { user, logout, updateUser } = useAuth();
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

  const showConfirm = (message, onConfirm) => setConfirmModal({ message, onConfirm });

  const glass = {
    background: isDark ? 'rgba(8,11,20,0.55)' : 'rgba(255,255,255,0.45)',
    backdropFilter: 'blur(28px) saturate(190%)', WebkitBackdropFilter: 'blur(28px) saturate(190%)',
    border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
    boxShadow: scrolled
      ? isDark ? '0 8px 48px rgba(0,0,0,0.6), inset 0 .5px 0 rgba(255,255,255,0.06)' : '0 8px 48px rgba(0,0,0,0.08), inset 0 .5px 0 rgba(255,255,255,0.7)'
      : isDark ? '0 4px 24px rgba(0,0,0,0.35), inset 0 .5px 0 rgba(255,255,255,0.04)' : '0 4px 24px rgba(0,0,0,0.04), inset 0 .5px 0 rgba(255,255,255,0.6)',
    transition: 'all 0.5s cubic-bezier(0.22,1,0.36,1)',
  };
  const tc = (a, b) => isDark ? a : b;

  return (
    <div className="min-h-screen bg-bg-primary font-sans">
      {/* ═══ Floating Navbar ═══ */}
      <nav className="fixed top-0 left-0 right-0 z-50" style={{ padding: scrolled ? '8px 16px' : '14px 16px', transition: 'padding .5s cubic-bezier(.22,1,.36,1)' }}>
        <motion.div initial={{ y: -100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, ease: [.22,1,.36,1] }}
          style={{ ...glass, maxWidth: 1360, margin: '0 auto', borderRadius: 80, height: scrolled ? 58 : 64, padding: '0 12px 0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <img src="/logo.png" alt="B2B" className="h-8 transition-transform duration-300 group-hover:scale-110" />
            <div className="hidden sm:block">
              <div className="font-heading text-sm font-bold gradient-text leading-none">Bug2Build</div>
              <div className="text-[9px] font-bold uppercase tracking-[.15em]" style={{ color: tc('#94A3B8','#64748B') }}>Admin Panel</div>
            </div>
          </Link>

          <div className="hidden xl:flex items-center gap-0.5 mx-auto">
            {modules.map((m) => (
              <button key={m.key} onClick={() => setActive(m.key)}
                className="relative px-3 py-1.5 rounded-full text-[12.5px] font-medium transition-all duration-300"
                style={{ color: active === m.key ? tc('#F1F5F9','#0F172A') : tc('#94A3B8','#64748B') }}>
                {active === m.key && (
                  <motion.div layoutId="admin-tab" className="absolute inset-0 rounded-full"
                    style={{ background: `${m.color}18`, border: `1px solid ${m.color}30` }}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }} />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  <m.icon className="w-3.5 h-3.5" style={active === m.key ? { color: m.color } : {}} />{m.label}
                </span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="hidden md:flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black border"
                style={{ background: tc('rgba(91,95,239,.15)','rgba(79,70,229,.08)'), color: '#5B5FEF', borderColor: tc('rgba(91,95,239,.25)','rgba(79,70,229,.15)') }}>
                {user?.name?.[0]}
              </div>
              <div className="text-right mr-1">
                <div className="text-xs font-semibold leading-none" style={{ color: tc('#F1F5F9','#0F172A') }}>{user?.name}</div>
                <div className="text-[9px] font-bold uppercase tracking-wider mt-0.5" style={{ color: '#5B5FEF' }}>{user?.role}</div>
              </div>
            </div>
            <button onClick={handleLogout} className="hidden md:flex items-center gap-1.5 text-[12.5px] font-semibold rounded-full px-4 py-1.5 transition-all duration-300"
              style={{ border: tc('1px solid rgba(239,68,68,.2)','1px solid rgba(239,68,68,.15)'), color: '#EF4444', background: tc('rgba(239,68,68,.08)','rgba(239,68,68,.05)') }}>
              <HiOutlineLogout className="w-3.5 h-3.5" />Logout
            </button>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="xl:hidden w-9 h-9 rounded-full flex items-center justify-center"
              style={{ border: tc('1px solid rgba(255,255,255,.1)','1px solid rgba(0,0,0,.1)'), background: tc('rgba(255,255,255,.04)','rgba(0,0,0,.03)') }}>
              {mobileOpen ? <HiOutlineX className="w-4 h-4" /> : <HiOutlineMenuAlt2 className="w-4 h-4" />}
            </button>
          </div>
        </motion.div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div initial={{ opacity: 0, y: -16, scale: .96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -16, scale: .96 }}
              transition={{ duration: .3, ease: [.22,1,.36,1] }} className="xl:hidden"
              style={{ maxWidth: 1360, margin: '10px auto 0', borderRadius: 28, overflow: 'hidden',
                background: tc('rgba(8,11,20,.92)','rgba(255,255,255,.92)'), backdropFilter: 'blur(28px) saturate(190%)',
                border: tc('1px solid rgba(255,255,255,.06)','1px solid rgba(0,0,0,.06)'),
                boxShadow: tc('0 16px 48px rgba(0,0,0,.6)','0 16px 48px rgba(0,0,0,.1)') }}>
              <div className="p-4 space-y-1">
                {modules.map((m) => (
                  <button key={m.key} onClick={() => { setActive(m.key); setMobileOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all"
                    style={{ background: active === m.key ? `${m.color}15` : 'transparent', color: active === m.key ? m.color : tc('#94A3B8','#64748B') }}>
                    <m.icon className="w-4 h-4" />{m.label}
                  </button>
                ))}
                <div className="pt-3 mt-2" style={{ borderTop: tc('1px solid rgba(255,255,255,.06)','1px solid rgba(0,0,0,.06)') }}>
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all">
                    <HiOutlineLogout className="w-4 h-4" />Logout
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ═══ Main Content ═══ */}
      <main className="pt-28 px-4 lg:px-8 max-w-[1360px] mx-auto pb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5, delay: .2 }} className="mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: `${activeMod?.color}15` }}>
              {activeMod && <activeMod.icon className="w-6 h-6" style={{ color: activeMod.color }} />}
            </div>
            <div>
              <h1 className="text-2xl font-black font-heading text-text-primary">{activeMod?.label}</h1>
              <p className="text-sm text-text-muted">{activeMod?.desc}</p>
            </div>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div key={active} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            transition={{ duration: .35, ease: [.22,1,.36,1] }}>
            {active === 'events' && <EventsManager showConfirm={showConfirm} toast={toast} />}
            {active === 'team' && <CrudManager endpoint="team" fields={['name', 'role', 'category', 'linkedin', 'github']} imageField="photo" categoryOptions={['executive', 'tech', 'event', 'sponsors', 'digital_media', 'marketing', 'research']} showConfirm={showConfirm} toast={toast} />}
            {active === 'partners' && <CrudManager endpoint="partners" fields={['name', 'website', 'category']} imageField="logo" showConfirm={showConfirm} toast={toast} />}
            {active === 'brands' && <CrudManager endpoint="brands" fields={['name', 'website']} imageField="logo" showConfirm={showConfirm} toast={toast} />}
            {active === 'contributors' && <CrudManager endpoint="contributors" fields={['name', 'github', 'role', 'avatar', 'bio']} showConfirm={showConfirm} toast={toast} />}
            {active === 'contacts' && <ContactsManager toast={toast} />}
            {active === 'profile' && <ProfileManager user={user} updateUser={updateUser} toast={toast} />}
          </motion.div>
        </AnimatePresence>

        {/* Confirm Modal */}
        <AnimatePresence>
          {confirmModal && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
              onClick={() => setConfirmModal(null)}>
              <motion.div initial={{ scale: 0.92, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, y: 10, opacity: 0 }}
                className="bg-bg-surface border border-border/60 rounded-2xl p-6 w-full max-w-sm shadow-2xl text-center"
                onClick={(e) => e.stopPropagation()}>
                <div className="w-12 h-12 rounded-2xl bg-red-500/15 flex items-center justify-center mx-auto mb-4">
                  <HiOutlineTrash className="w-6 h-6 text-red-400" />
                </div>
                <h3 className="text-lg font-bold text-text-primary mb-2">Confirm Delete</h3>
                <p className="text-sm text-text-secondary mb-6">{confirmModal.message}</p>
                <div className="flex gap-3">
                  <button onClick={() => setConfirmModal(null)}
                    className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-border text-text-secondary hover:bg-white/5 transition-colors">Cancel</button>
                  <button onClick={() => { confirmModal.onConfirm(); setConfirmModal(null); }}
                    className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-red-500 text-white hover:bg-red-600 transition-colors">Delete</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   SECTION HEADER (reusable)
───────────────────────────────────────────────────────────── */
const SectionHeader = ({ count, countLabel = 'items', onAdd, addLabel = 'Add' }) => (
  <div className="flex items-center justify-between mb-6">
    <div className="flex items-center gap-2">
      <span className="text-sm text-text-secondary">
        <span className="text-text-primary font-bold">{count}</span> {countLabel}
      </span>
    </div>
    {onAdd && (
      <motion.button
        whileHover={{ scale: 1.02, y: -1 }}
        whileTap={{ scale: 0.98 }}
        onClick={onAdd}
        className="gradient-btn text-white text-sm font-semibold px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg shadow-accent-primary/25"
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
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    api.get('/admin/events').then((r) => setItems(r.data.data || [])).catch(() => { }).finally(() => setLoading(false));
  }, []);
  useEffect(() => { load(); }, [load]);

  const handleSave = async (formData) => {
    try {
      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
      if (modal?._id) {
        await api.put(`/admin/events/${modal._id}`, formData, config);
        toast.success('Event updated!');
      } else {
        await api.post('/admin/events', formData, config);
        toast.success('Event created!');
      }
      setModal(null);
      load();
    } catch (err) { toast.error(err.response?.data?.message || 'Error saving event.'); }
  };

  const handleDelete = (id) => {
    showConfirm('Delete this event and all its images?', async () => {
      try { await api.delete(`/admin/events/${id}`); toast.success('Event deleted!'); load(); } catch { toast.error('Error deleting event.'); }
    });
  };

  const statusConfig = {
    upcoming: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', dot: 'bg-emerald-400' },
    ongoing: { bg: 'bg-accent-blue/10', text: 'text-accent-blue', dot: 'bg-accent-blue animate-pulse' },
    past: { bg: 'bg-text-muted/10', text: 'text-text-muted', dot: 'bg-text-muted' },
  };

  return (
    <div>
      <SectionHeader count={items.length} countLabel="events" onAdd={() => setModal({})} addLabel="Add Event" />

      {loading ? <Spinner /> : (
        <motion.div variants={stagger} initial="hidden" animate="visible" className="grid gap-3">
          {items.map((item) => {
            const s = statusConfig[item.status] || statusConfig.past;
            return (
              <motion.div
                key={item._id}
                variants={fadeUp}
                whileHover={{ y: -2 }}
                className="group relative card-base p-4 flex items-center gap-4 overflow-hidden transition-all duration-200 hover:border-accent-primary/30"
                style={{ boxShadow: 'none' }}
              >
                <div className="absolute left-0 top-0 bottom-0 w-0.5 rounded-full bg-accent-primary/0 group-hover:bg-accent-primary/60 transition-all duration-300" />

                {(item.coverImage || item.image) ? (
                  <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 ring-1 ring-border">
                    <img src={item.coverImage || item.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-xl flex-shrink-0 bg-accent-primary/10 flex items-center justify-center ring-1 ring-border">
                    <HiOutlineCalendar className="w-6 h-6 text-accent-primary/40" />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-heading font-bold text-sm text-text-primary truncate group-hover:text-accent-primary transition-colors">{item.title}</h3>
                    {!item.published && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-yellow-500/10 text-yellow-400 font-bold tracking-wide uppercase flex-shrink-0">Draft</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${s.bg} ${s.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                      {item.status}
                    </span>
                    <span className="text-text-muted text-xs flex items-center gap-1">
                      <HiOutlineCalendar className="w-3 h-3" />
                      {new Date(item.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    {item.gallery?.length > 0 && (
                      <span className="text-text-muted text-xs flex items-center gap-1">
                        <HiOutlinePhotograph className="w-3 h-3" />
                        {item.gallery.length} photo{item.gallery.length !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex gap-1.5 flex-shrink-0">
                  <ActionBtn icon={HiOutlinePencil} onClick={() => setModal(item)} />
                  <ActionBtn icon={HiOutlineTrash} onClick={() => handleDelete(item._id)} danger />
                </div>
              </motion.div>
            );
          })}
          {items.length === 0 && <EmptyState icon={HiOutlineCalendar} message="No events yet. Create your first one!" />}
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
    title: item.title || '',
    date: item.date ? new Date(item.date).toISOString().split('T')[0] : '',
    description: item.description || '',
    location: item.location || '',
    eventLink: item.eventLink || '',
    status: item.status || 'upcoming',
    category: item.category || 'other',
    published: item.published !== undefined ? item.published : true,
  });
  const [newFiles, setNewFiles] = useState([]);
  const [existingGallery, setExistingGallery] = useState(item.gallery || []);
  const [saving, setSaving] = useState(false);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.gif'] },
    maxFiles: 10 - existingGallery.length,
    onDrop: (accepted) => {
      const total = existingGallery.length + newFiles.length + accepted.length;
      if (total > 10) { toast.error(`Max 10 images. ${10 - existingGallery.length - newFiles.length} slot(s) left.`); return; }
      setNewFiles((prev) => [...prev, ...accepted]);
    },
  });

  const removeNewFile = (index) => setNewFiles((prev) => prev.filter((_, i) => i !== index));

  const removeExistingImage = async (imageId) => {
    if (!item._id) return;
    try {
      await api.delete(`/admin/events/${item._id}/images/${imageId}`);
      setExistingGallery((prev) => prev.filter((img) => img._id !== imageId));
      toast.success('Image removed.');
    } catch { toast.error('Error removing image.'); }
  };

  const setCover = async (imageUrl) => {
    if (!item._id) return;
    const img = existingGallery.find((g) => g.url === imageUrl);
    if (!img) return;
    try {
      await api.put(`/admin/events/${item._id}/cover`, { imageId: img._id });
      toast.success('Cover image set!');
      if (onReload) onReload();
    } catch { toast.error('Error setting cover.'); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.date) { toast.error('Title and Date are required.'); return; }
    setSaving(true);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, String(v)));
    newFiles.forEach((file) => fd.append('gallery', file));
    await onSave(fd);
    setSaving(false);
  };

  const slotsLeft = 10 - existingGallery.length - newFiles.length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.96, y: 24 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.96, y: 16, opacity: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="bg-bg-surface border border-border/60 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-border/50"
          style={{ background: 'color-mix(in srgb, var(--bg-surface) 90%, transparent)', backdropFilter: 'blur(8px)' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent-primary/15 flex items-center justify-center">
              <HiOutlineCalendar className="w-4 h-4 text-accent-primary" />
            </div>
            <h2 className="text-base font-black font-heading">{item._id ? 'Edit Event' : 'New Event'}</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
            <HiOutlineX className="w-5 h-5 text-text-secondary" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <Input label="Title *" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />

          <div className="grid grid-cols-2 gap-4">
            <Input label="Date *" type="date" value={form.date} onChange={(v) => setForm({ ...form, date: v })} />
            <Input label="Location" value={form.location} onChange={(v) => setForm({ ...form, location: v })} />
          </div>

          <div>
            <label className="block text-xs font-bold text-text-secondary mb-1.5 uppercase tracking-wide">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows="3"
              className="w-full bg-bg-primary border border-border rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent-primary/60 focus:ring-2 focus:ring-accent-primary/10 transition-all resize-none"
            />
          </div>

          <Input label="Event Link" value={form.eventLink} onChange={(v) => setForm({ ...form, eventLink: v })} />

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-text-secondary mb-1.5 uppercase tracking-wide">Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full bg-bg-primary border border-border rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent-primary/60 transition-all">
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="past">Past</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-text-secondary mb-1.5 uppercase tracking-wide">Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full bg-bg-primary border border-border rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent-primary/60 transition-all">
                {['workshop', 'hackathon', 'meetup', 'webinar', 'conference', 'other'].map((c) => (
                  <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-text-secondary mb-1.5 uppercase tracking-wide">Visibility</label>
              <button
                type="button"
                onClick={() => setForm({ ...form, published: !form.published })}
                className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-200 ${form.published
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                  : 'border-yellow-500/30 bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20'
                  }`}
              >
                {form.published
                  ? <><HiOutlineEye className="w-4 h-4" /> Published</>
                  : <><HiOutlineEyeOff className="w-4 h-4" /> Draft</>
                }
              </button>
            </div>
          </div>

          {/* Gallery */}
          <div>
            <label className="block text-xs font-bold text-text-secondary mb-2 uppercase tracking-wide">
              Gallery
              <span className="ml-2 text-text-muted font-normal normal-case tracking-normal">
                ({existingGallery.length + newFiles.length}/10 images)
              </span>
            </label>

            {existingGallery.length > 0 && (
              <div className="grid grid-cols-5 gap-2 mb-3">
                {existingGallery.map((img) => (
                  <div key={img._id} className="relative group rounded-xl overflow-hidden aspect-square ring-1 ring-border">
                    <img src={img.url} alt={img.altText || ''} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                      <button type="button" onClick={() => setCover(img.url)} className="p-1.5 rounded-lg bg-white/20 hover:bg-white/40 transition-colors" title="Set as cover">
                        <HiOutlineStar className="w-3 h-3 text-white" />
                      </button>
                      <button type="button" onClick={() => removeExistingImage(img._id)} className="p-1.5 rounded-lg bg-red-500/60 hover:bg-red-500/90 transition-colors" title="Remove">
                        <HiOutlineTrash className="w-3 h-3 text-white" />
                      </button>
                    </div>
                    {item.coverImage === img.url && (
                      <div className="absolute top-1 left-1 bg-accent-primary text-white text-[8px] px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wide">Cover</div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {newFiles.length > 0 && (
              <div className="grid grid-cols-5 gap-2 mb-3">
                {newFiles.map((file, i) => (
                  <div key={i} className="relative group rounded-xl overflow-hidden aspect-square ring-1 ring-accent-blue/40">
                    <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button type="button" onClick={() => removeNewFile(i)} className="p-1.5 rounded-lg bg-red-500/60 hover:bg-red-500/90 transition-colors">
                        <HiOutlineTrash className="w-3 h-3 text-white" />
                      </button>
                    </div>
                    <div className="absolute top-1 left-1 bg-accent-blue text-white text-[8px] px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wide">New</div>
                  </div>
                ))}
              </div>
            )}

            {slotsLeft > 0 && (
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl px-4 py-7 text-center cursor-pointer transition-all duration-200 ${isDragActive
                  ? 'border-accent-primary bg-accent-primary/8 scale-[0.99]'
                  : 'border-border hover:border-accent-primary/60 hover:bg-accent-primary/4'
                  }`}
              >
                <input {...getInputProps()} />
                <motion.div animate={isDragActive ? { scale: 1.1 } : { scale: 1 }} transition={{ duration: 0.2 }}>
                  <HiOutlinePhotograph className="w-8 h-8 text-text-muted mx-auto mb-2" />
                </motion.div>
                <p className="text-sm text-text-muted">
                  {isDragActive ? 'Drop images here...' : `Drag & drop or click · ${slotsLeft} slot${slotsLeft !== 1 ? 's' : ''} remaining`}
                </p>
                <p className="text-[11px] text-text-muted/60 mt-1">JPG, PNG, WEBP, GIF up to 10MB</p>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full gradient-btn text-white font-bold py-3 rounded-xl disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-accent-primary/25 transition-all"
          >
            {saving
              ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
              : <><HiOutlineCheck className="w-4 h-4" /> {item._id ? 'Update Event' : 'Create Event'}</>
            }
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};

/* ─────────────────────────────────────────────────────────────
   GENERIC CRUD MANAGER
───────────────────────────────────────────────────────────── */
const CrudManager = ({ endpoint, fields, imageField, categoryOptions, showConfirm, toast }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    api.get(`/admin/${endpoint}/all`).then((r) => setItems(r.data.data || [])).catch(() => { }).finally(() => setLoading(false));
  }, [endpoint]);
  useEffect(() => { load(); }, [load]);

  const handleSave = async (formData) => {
    try {
      const isFormData = formData instanceof FormData;
      const config = isFormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
      if (modal?._id) {
        await api.put(`/admin/${endpoint}/${modal._id}`, formData, config);
        toast.success('Updated successfully!');
      } else {
        await api.post(`/admin/${endpoint}`, formData, config);
        toast.success('Created successfully!');
      }
      setModal(null);
      load();
    } catch (err) { toast.error(err.response?.data?.message || 'Error saving.'); }
  };

  const handleDelete = (id) => {
    showConfirm('Delete this item?', async () => {
      try { await api.delete(`/admin/${endpoint}/${id}`); toast.success('Deleted!'); load(); } catch { toast.error('Error deleting.'); }
    });
  };

  return (
    <div>
      <SectionHeader count={items.length} onAdd={() => setModal({})} />

      {loading ? <Spinner /> : (
        <motion.div variants={stagger} initial="hidden" animate="visible" className="grid gap-3">
          {items.map((item) => (
            <motion.div
              key={item._id}
              variants={fadeUp}
              whileHover={{ y: -2 }}
              className="group card-base p-4 flex items-center gap-4 transition-all duration-200 hover:border-accent-primary/30 relative overflow-hidden"
            >
              <div className="absolute left-0 top-0 bottom-0 w-0.5 rounded-full bg-accent-primary/0 group-hover:bg-accent-primary/60 transition-all duration-300" />

              {imageField && item[imageField] ? (
                <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 ring-1 ring-border">
                  <img src={item[imageField]} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              ) : imageField ? (
                <div className="w-12 h-12 rounded-xl flex-shrink-0 bg-accent-primary/10 flex items-center justify-center ring-1 ring-border text-base font-black text-accent-primary">
                  {(item.name || item.title || '?')[0].toUpperCase()}
                </div>
              ) : null}

              <div className="flex-1 min-w-0">
                <h3 className="font-heading font-bold text-sm text-text-primary truncate group-hover:text-accent-primary transition-colors">
                  {item.name || item.title}
                </h3>
                <p className="text-text-muted text-xs truncate mt-0.5">{item.role || item.category || item.website || item.github || ''}</p>
              </div>

              <div className="flex gap-1.5 flex-shrink-0">
                <ActionBtn icon={HiOutlinePencil} onClick={() => setModal(item)} />
                <ActionBtn icon={HiOutlineTrash} onClick={() => handleDelete(item._id)} danger />
              </div>
            </motion.div>
          ))}
          {items.length === 0 && <EmptyState icon={HiOutlineSparkles} message="Nothing here yet. Add your first item!" />}
        </motion.div>
      )}

      <AnimatePresence>
        {modal !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            onClick={() => setModal(null)}
          >
            <motion.div
              initial={{ scale: 0.96, y: 24 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 16, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="bg-bg-surface border border-border/60 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-border/50"
                style={{ background: 'color-mix(in srgb, var(--bg-surface) 90%, transparent)', backdropFilter: 'blur(8px)' }}
              >
                <h2 className="text-base font-black font-heading">{modal._id ? 'Edit Item' : 'Add New'}</h2>
                <button onClick={() => setModal(null)} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
                  <HiOutlineX className="w-5 h-5 text-text-secondary" />
                </button>
              </div>
              <div className="p-6">
                <CrudForm item={modal} fields={fields} imageField={imageField} categoryOptions={categoryOptions} onSave={handleSave} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const CrudForm = ({ item, fields, imageField, categoryOptions, onSave }) => {
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
    } else {
      await onSave(form);
    }
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map((field) => (
        field === 'category' && categoryOptions ? (
          <div key={field}>
            <label className="block text-xs font-bold text-text-secondary mb-1.5 uppercase tracking-wide capitalize">{field}</label>
            <select
              value={form[field]}
              onChange={(e) => setForm({ ...form, [field]: e.target.value })}
              className="w-full bg-bg-primary border border-border rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent-primary/60 focus:ring-2 focus:ring-accent-primary/10 transition-all"
            >
              <option value="">Select category...</option>
              {categoryOptions.map((o) => <option key={o} value={o}>{o.replace('_', ' ')}</option>)}
            </select>
          </div>
        ) : (field === 'bio' || field === 'description') ? (
          <div key={field}>
            <label className="block text-xs font-bold text-text-secondary mb-1.5 uppercase tracking-wide capitalize">{field}</label>
            <textarea
              value={form[field]}
              onChange={(e) => setForm({ ...form, [field]: e.target.value })}
              rows="3"
              className="w-full bg-bg-primary border border-border rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent-primary/60 focus:ring-2 focus:ring-accent-primary/10 transition-all resize-none"
            />
          </div>
        ) : (
          <Input key={field} label={field} value={form[field]} onChange={(v) => setForm({ ...form, [field]: v })} />
        )
      ))}

      {imageField && (
        <div>
          <label className="block text-xs font-bold text-text-secondary mb-1.5 uppercase tracking-wide capitalize">{imageField}</label>
          <label className="flex items-center gap-3 cursor-pointer border border-dashed border-border rounded-xl px-4 py-3 hover:border-accent-primary/60 hover:bg-accent-primary/4 transition-all duration-200 group">
            <div className="w-8 h-8 rounded-lg bg-accent-primary/10 flex items-center justify-center group-hover:bg-accent-primary/20 transition-colors">
              <HiOutlinePhotograph className="w-4 h-4 text-accent-primary" />
            </div>
            <span className="text-sm text-text-muted">{file ? file.name : 'Choose image file...'}</span>
            <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} className="hidden" />
          </label>
        </div>
      )}

      <button
        type="submit"
        disabled={saving}
        className="w-full gradient-btn text-white font-bold py-3 rounded-xl disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-accent-primary/25 mt-2"
      >
        {saving
          ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
          : <><HiOutlineCheck className="w-4 h-4" /> {item._id ? 'Update' : 'Create'}</>
        }
      </button>
    </form>
  );
};

/* ─────────────────────────────────────────────────────────────
   CONTACTS MANAGER
───────────────────────────────────────────────────────────── */
const ContactsManager = ({ toast }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    api.get('/admin/contacts?limit=100').then((r) => setItems(r.data.data || [])).catch(() => { }).finally(() => setLoading(false));
  }, []);

  const toggleRead = async (id) => {
    try {
      const r = await api.patch(`/admin/contacts/${id}/read`);
      setItems((prev) => prev.map((i) => i._id === id ? r.data.data : i));
    } catch { toast.error('Error.'); }
  };

  const unreadCount = items.filter((i) => !i.isRead).length;

  return loading ? <Spinner /> : (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="text-sm text-text-secondary">
            <span className="text-text-primary font-bold">{items.length}</span> messages
          </span>
          {unreadCount > 0 && (
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-accent-primary/15 text-accent-primary">
              {unreadCount} new
            </span>
          )}
        </div>
      </div>

      {items.length === 0
        ? <EmptyState icon={HiOutlineMail} message="No contact submissions yet." />
        : (
          <motion.div variants={stagger} initial="hidden" animate="visible" className="grid gap-3">
            {items.map((item) => (
              <motion.div
                key={item._id}
                variants={fadeUp}
                className={`group card-base overflow-hidden transition-all duration-200 ${item.isRead ? 'opacity-60' : 'hover:border-accent-primary/30'}`}
              >
                <div className="p-4 cursor-pointer" onClick={() => setExpanded(expanded === item._id ? null : item._id)}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 font-black text-sm ${item.isRead ? 'bg-white/5 text-text-muted' : 'bg-accent-primary/15 text-accent-primary'}`}>
                        {item.name[0].toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-heading font-bold text-sm text-text-primary">{item.name}</h3>
                          {!item.isRead && <span className="w-1.5 h-1.5 rounded-full bg-accent-primary flex-shrink-0" />}
                        </div>
                        <p className="text-text-muted text-xs">{item.email} · {new Date(item.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${item.isRead ? 'bg-text-muted/10 text-text-muted' : 'bg-accent-primary/15 text-accent-primary'}`}>
                        {item.isRead ? 'Read' : 'New'}
                      </span>
                      <motion.div animate={{ rotate: expanded === item._id ? 90 : 0 }} transition={{ duration: 0.2 }}>
                        <HiOutlineChevronRight className="w-4 h-4 text-text-muted" />
                      </motion.div>
                    </div>
                  </div>
                  {item.subject && (
                    <p className="text-accent-primary text-xs font-medium mt-2 ml-12">{item.subject}</p>
                  )}
                </div>

                <AnimatePresence>
                  {expanded === item._id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 border-t border-border/40 pt-3 ml-12">
                        <p className="text-text-secondary text-sm leading-relaxed">{item.message}</p>
                        <div className="flex items-center gap-3 mt-3">
                          <a href={`mailto:${item.email}`} className="text-xs font-semibold text-accent-primary hover:underline flex items-center gap-1">
                            <HiOutlineMail className="w-3.5 h-3.5" /> Reply
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
  const [form, setForm] = useState({ name: user?.name || '', bio: user?.bio || '' });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [saving, setSaving] = useState(false);

  // FIX 17: Revoke object URLs on cleanup to prevent memory leaks
  useEffect(() => {
    return () => { if (preview) URL.revokeObjectURL(preview); };
  }, [preview]);

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (preview) URL.revokeObjectURL(preview);
    setFile(f);
    setPreview(URL.createObjectURL(f));
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
        <div className="h-24 bg-gradient-to-br from-accent-primary/20 via-accent-purple/15 to-accent-blue/10 relative">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: 'linear-gradient(rgba(91,95,239,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(91,95,239,0.4) 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />
        </div>

        <div className="px-6 pb-6">
          <div className="flex items-end gap-4 -mt-10 mb-6">
            <div className="relative group">
              <div className="w-20 h-20 rounded-2xl overflow-hidden border-4 border-bg-surface shadow-xl">
                {avatar
                  ? <img src={avatar} alt="" className="w-full h-full object-cover" />
                  : <div className="w-full h-full bg-gradient-to-br from-accent-primary/30 to-accent-purple/30 flex items-center justify-center text-2xl font-black text-accent-primary">{user?.name?.[0]}</div>
                }
              </div>
              <label className="absolute inset-0 rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                <HiOutlinePhotograph className="w-5 h-5 text-white" />
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </label>
            </div>
            <div className="pb-1">
              <h3 className="font-heading font-black text-lg text-text-primary">{user?.name}</h3>
              <p className="text-text-muted text-sm">{user?.email}</p>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-accent-primary mt-1">
                <HiOutlineSparkles className="w-3 h-3" />
                {user?.role}
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
            <div>
              <label className="block text-xs font-bold text-text-secondary mb-1.5 uppercase tracking-wide">Bio</label>
              <textarea
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                rows="3"
                placeholder="Tell us about yourself..."
                className="w-full bg-bg-primary border border-border rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent-primary/60 focus:ring-2 focus:ring-accent-primary/10 transition-all resize-none placeholder:text-text-muted/50"
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              className="gradient-btn text-white font-bold px-6 py-2.5 rounded-xl disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-accent-primary/25"
            >
              {saving
                ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
                : <><HiOutlineCheck className="w-4 h-4" /> Update Profile</>
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
const Input = ({ label, value, onChange, type = 'text' }) => (
  <div>
    <label className="block text-xs font-bold text-text-secondary mb-1.5 uppercase tracking-wide capitalize">
      {label.replace('*', '').trim()}
      {label.includes('*') && <span className="text-red-400 ml-0.5">*</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-bg-primary border border-border rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent-primary/60 focus:ring-2 focus:ring-accent-primary/10 transition-all placeholder:text-text-muted/50"
    />
  </div>
);

const ActionBtn = ({ icon: Icon, onClick, danger = false }) => (
  <motion.button
    whileHover={{ scale: 1.08 }}
    whileTap={{ scale: 0.92 }}
    onClick={onClick}
    className={`p-2 rounded-xl transition-all duration-200 ${danger
      ? 'hover:bg-red-500/15 text-text-muted hover:text-red-400'
      : 'hover:bg-accent-primary/10 text-text-muted hover:text-accent-primary'
      }`}
  >
    <Icon className="w-4 h-4" />
  </motion.button>
);

const Spinner = () => (
  <div className="flex flex-col items-center justify-center py-24 gap-4">
    <div className="relative w-10 h-10">
      <div className="absolute inset-0 rounded-full border-2 border-accent-primary/20" />
      <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-accent-primary animate-spin" />
    </div>
    <p className="text-text-muted text-sm">Loading...</p>
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

export default AdminDashboard;