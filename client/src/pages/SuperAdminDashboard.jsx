import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  HiOutlineDocumentText, HiOutlineUsers, HiOutlineClipboardList,
  HiOutlineCog, HiOutlineLogout, HiOutlinePlus, HiOutlinePencil,
  HiOutlineTrash, HiOutlineX, HiOutlineKey, HiOutlineShieldCheck,
  HiOutlineBan, HiOutlineSparkles,
  HiOutlineMenuAlt2, HiOutlineCheck, HiOutlineLockClosed,
} from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';
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
  { key: 'content',  label: 'Site Content',   icon: HiOutlineDocumentText, color: '#5B5FEF', desc: 'Manage site-wide content keys' },
  { key: 'admins',   label: 'Admin Manager',  icon: HiOutlineUsers,        color: '#8B5CF6', desc: 'Create and manage admin accounts' },
  { key: 'logs',     label: 'Activity Logs',  icon: HiOutlineClipboardList,color: '#00C2FF', desc: 'View system activity and audit trail' },
  { key: 'settings', label: 'Settings',       icon: HiOutlineCog,          color: '#F59E0B', desc: 'Global site configuration' },
];

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
              <div className="text-[9px] font-bold uppercase tracking-[.15em] flex items-center gap-1" style={{ color: '#8B5CF6' }}>
                <HiOutlineSparkles className="w-2.5 h-2.5" />Super Admin
              </div>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-1 mx-auto">
            {modules.map((m) => (
              <button key={m.key} onClick={() => setActive(m.key)}
                className="relative px-4 py-1.5 rounded-full text-[13px] font-medium transition-all duration-300"
                style={{ color: active === m.key ? tc('#F1F5F9','#0F172A') : tc('#94A3B8','#64748B') }}>
                {active === m.key && (
                  <motion.div layoutId="super-tab" className="absolute inset-0 rounded-full"
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
            <button onClick={() => navigate('/admin')} className="hidden md:flex items-center gap-1.5 text-[12.5px] font-semibold rounded-full px-4 py-1.5 transition-all duration-300"
              style={{ border: tc('1px solid rgba(255,255,255,.12)','1px solid rgba(0,0,0,.1)'), color: tc('#94A3B8','#64748B'), background: tc('rgba(255,255,255,.04)','rgba(0,0,0,.03)') }}>
              <HiOutlineCog className="w-3.5 h-3.5" />Admin Panel
            </button>
            <div className="hidden md:flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black border"
                style={{ background: tc('rgba(139,92,246,.15)','rgba(139,92,246,.08)'), color: '#8B5CF6', borderColor: tc('rgba(139,92,246,.25)','rgba(139,92,246,.15)') }}>
                {user?.name?.[0]}
              </div>
              <div className="text-right mr-1">
                <div className="text-xs font-semibold leading-none" style={{ color: tc('#F1F5F9','#0F172A') }}>{user?.name}</div>
                <div className="text-[9px] font-bold uppercase tracking-wider mt-0.5 flex items-center gap-0.5 justify-end" style={{ color: '#8B5CF6' }}>
                  <HiOutlineSparkles className="w-2.5 h-2.5" />SuperAdmin
                </div>
              </div>
            </div>
            <button onClick={handleLogout} className="hidden md:flex items-center gap-1.5 text-[12.5px] font-semibold rounded-full px-4 py-1.5 transition-all duration-300"
              style={{ border: tc('1px solid rgba(239,68,68,.2)','1px solid rgba(239,68,68,.15)'), color: '#EF4444', background: tc('rgba(239,68,68,.08)','rgba(239,68,68,.05)') }}>
              <HiOutlineLogout className="w-3.5 h-3.5" />Logout
            </button>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden w-9 h-9 rounded-full flex items-center justify-center"
              style={{ border: tc('1px solid rgba(255,255,255,.1)','1px solid rgba(0,0,0,.1)'), background: tc('rgba(255,255,255,.04)','rgba(0,0,0,.03)') }}>
              {mobileOpen ? <HiOutlineX className="w-4 h-4" /> : <HiOutlineMenuAlt2 className="w-4 h-4" />}
            </button>
          </div>
        </motion.div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div initial={{ opacity: 0, y: -16, scale: .96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -16, scale: .96 }}
              transition={{ duration: .3, ease: [.22,1,.36,1] }} className="lg:hidden"
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
                <div className="pt-3 mt-2 space-y-1" style={{ borderTop: tc('1px solid rgba(255,255,255,.06)','1px solid rgba(0,0,0,.06)') }}>
                  <button onClick={() => { navigate('/admin'); setMobileOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all"
                    style={{ color: tc('#94A3B8','#64748B') }}>
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
   CONTENT EDITOR
───────────────────────────────────────────────────────────── */
const ContentEditor = () => {
  const [items, setItems]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [editValue, setEditValue] = useState('');

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

  if (loading) return <Spinner />;

  return (
    <div>
      <SectionHeader count={items.length} countLabel="content keys" />
      <motion.div variants={stagger} initial="hidden" animate="visible" className="grid gap-3">
        {items.map((item) => (
          <motion.div
            key={item.key}
            variants={fadeUp}
            whileHover={{ y: -2 }}
            className="group card-base p-4 transition-all duration-200 hover:border-accent-primary/30 relative overflow-hidden"
          >
            <div className="absolute left-0 top-0 bottom-0 w-0.5 rounded-full bg-accent-primary/0 group-hover:bg-accent-primary/60 transition-all duration-300" />
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <code className="text-accent-primary text-xs font-mono bg-accent-primary/10 px-2 py-0.5 rounded-lg border border-accent-primary/20">
                  {item.key}
                </code>
                {editing === item.key ? (
                  <textarea
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    rows="3"
                    autoFocus
                    className="w-full mt-3 bg-bg-primary border border-accent-primary/40 rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent-primary/60 focus:ring-2 focus:ring-accent-primary/10 transition-all resize-none"
                  />
                ) : (
                  <p className="text-text-secondary text-sm mt-2 whitespace-pre-wrap leading-relaxed">
                    {item.value || <span className="italic text-text-muted">Empty</span>}
                  </p>
                )}
              </div>
              {editing === item.key ? (
                <div className="flex gap-2 flex-shrink-0">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSave(item.key)}
                    className="gradient-btn text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-md shadow-accent-primary/20"
                  >
                    <HiOutlineCheck className="w-3 h-3" /> Save
                  </motion.button>
                  <button
                    onClick={() => setEditing(null)}
                    className="text-text-secondary text-xs font-medium px-3 py-1.5 rounded-lg border border-border hover:bg-white/5 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <ActionBtn
                  icon={HiOutlinePencil}
                  onClick={() => { setEditing(item.key); setEditValue(item.value || ''); }}
                />
              )}
            </div>
          </motion.div>
        ))}
        {items.length === 0 && <EmptyState icon={HiOutlineDocumentText} message="No content keys found." />}
      </motion.div>
    </div>
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

  const load = useCallback(() => {
    setLoading(true);
    api.get('/superadmin/admins')
      .then((r) => setAdmins(r.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);
  useEffect(() => { load(); }, [load]);

  const handleCreate = async (form) => {
    try {
      await api.post('/superadmin/admins', form);
      toast.success('Admin created!');
      setModal(null);
      load();
    } catch (err) { toast.error(err.response?.data?.message || 'Error.'); }
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

              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black flex-shrink-0 border"
                style={{
                  background: `${roleColor(admin.role)}20`,
                  color: roleColor(admin.role),
                  borderColor: `${roleColor(admin.role)}30`,
                }}
              >
                {admin.name?.[0]}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="font-heading font-bold text-sm text-text-primary group-hover:text-accent-primary transition-colors">
                    {admin.name}
                  </h3>
                  <span
                    className="text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-md"
                    style={{ background: `${roleColor(admin.role)}15`, color: roleColor(admin.role) }}
                  >
                    {admin.role}
                  </span>
                </div>
                <p className="text-text-muted text-xs">{admin.email}</p>
              </div>

              <div className="flex items-center gap-1.5 flex-shrink-0">
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                  admin.isActive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                }`}>
                  {admin.isActive ? 'Active' : 'Inactive'}
                </span>

                {admin.role !== 'superadmin' && (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.92 }}
                      onClick={() => handleToggleActive(admin._id)}
                      title="Toggle active"
                      className="p-2 rounded-xl hover:bg-white/5 transition-colors"
                    >
                      {admin.isActive
                        ? <HiOutlineBan className="w-4 h-4 text-yellow-400" />
                        : <HiOutlineShieldCheck className="w-4 h-4 text-emerald-400" />
                      }
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.92 }}
                      onClick={() => setPwModal(admin._id)}
                      title="Reset password"
                      className="p-2 rounded-xl hover:bg-accent-primary/10 transition-colors text-text-muted hover:text-accent-primary"
                    >
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
  const [form, setForm]   = useState({ name: '', email: '', password: '', role: 'admin' });
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
          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="w-full bg-bg-primary border border-border rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent-primary/60 focus:ring-2 focus:ring-accent-primary/10 transition-all"
          >
            <option value="admin">Admin</option>
            <option value="superadmin">SuperAdmin</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="w-full gradient-btn text-white font-bold py-3 rounded-xl disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-accent-primary/25 mt-2"
        >
          {saving
            ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating...</>
            : <><HiOutlineCheck className="w-4 h-4" /> Create Admin</>
          }
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
          className="w-full gradient-btn text-white font-bold py-3 rounded-xl disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-accent-primary/25"
        >
          <HiOutlineKey className="w-4 h-4" /> Reset Password
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
          <motion.div
            key={log._id}
            variants={fadeUp}
            className="group card-base px-4 py-3 flex items-start gap-3 transition-all duration-200 hover:border-accent-primary/20"
          >
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
            <motion.button
              key={p}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setPage(p)}
              className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                page === p
                  ? 'gradient-btn text-white shadow-lg shadow-accent-primary/25'
                  : 'border border-border text-text-secondary hover:border-accent-primary/50 hover:text-text-primary'
              }`}
            >
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

  useEffect(() => {
    api.get('/superadmin/settings')
      .then((r) => setSettings(r.data.data || {}))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/superadmin/settings', settings);
      toast.success('Settings saved!');
    } catch { toast.error('Error saving settings.'); }
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

      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="card-base overflow-hidden"
      >
        <div className="p-6 space-y-4">
          {Object.entries(settings).map(([key, value]) => (
            <div key={key}>
              <label className="block text-xs font-bold text-text-secondary mb-1.5 uppercase tracking-wide">
                <code className="text-accent-primary font-mono bg-accent-primary/10 px-1.5 py-0.5 rounded-md border border-accent-primary/20 normal-case tracking-normal text-[11px]">
                  {key}
                </code>
              </label>
              <input
                type="text"
                value={value}
                onChange={(e) => setSettings({ ...settings, [key]: e.target.value })}
                className="w-full bg-bg-primary border border-border rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent-primary/60 focus:ring-2 focus:ring-accent-primary/10 transition-all"
              />
            </div>
          ))}
        </div>
        <div className="px-6 pb-6">
          <motion.button
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            disabled={saving}
            className="gradient-btn text-white font-bold px-6 py-2.5 rounded-xl disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-accent-primary/25"
          >
            {saving
              ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
              : <><HiOutlineCheck className="w-4 h-4" /> Save Settings</>
            }
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   SHARED MODAL SHELL
───────────────────────────────────────────────────────────── */
const ModalShell = ({ title, icon: Icon, color = '#5B5FEF', children, onClose }) => (
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
      className="bg-bg-surface border border-border/60 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-border/50"
        style={{ background: 'color-mix(in srgb, var(--bg-surface) 90%, transparent)', backdropFilter: 'blur(8px)' }}
      >
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
    className={`p-2 rounded-xl transition-all duration-200 ${
      danger
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

export default SuperAdminDashboard;