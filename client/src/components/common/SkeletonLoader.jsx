import { AnimatePresence, motion } from 'framer-motion';
import { useLocation, matchPath } from 'react-router-dom';
import { useLoader } from '../../context/LoaderContext';

/* ── Shimmer block ── */
const S = ({ w, h, r = 8, className = '', style = {} }) => (
  <div
    className={`skel-block ${className}`}
    style={{ width: w, height: h, borderRadius: r, ...style }}
  />
);

/* ─────────────────────────────────────────────
   COMMON NAVBAR
───────────────────────────────────────────── */
const NavbarSkeleton = () => (
  <div className="skel-navbar">
    <div className="skel-navbar-inner">
      <div className="skel-row" style={{ gap: 12 }}>
        <S w={36} h={36} r={10} />
        <S w={110} h={18} r={6} />
      </div>
      <div className="skel-row skel-hide-mobile" style={{ gap: 8 }}>
        {[72, 56, 60, 48, 64, 80, 60].map((w, i) => (
          <S key={i} w={w} h={14} r={6} />
        ))}
      </div>
      <div className="skel-row" style={{ gap: 10 }}>
        <S w={34} h={34} r={999} />
        <S w={90} h={34} r={8} className="skel-hide-mobile" />
      </div>
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   PAGE-SPECIFIC SKELETONS
───────────────────────────────────────────── */

// ── 1. Home ──
const HomeSkeleton = () => (
  <div className="skel-page">
    <NavbarSkeleton />
    <div className="skel-hero">
      <S w={140} h={24} r={999} style={{ marginBottom: 20 }} />
      <S w="80%" h={40} r={10} style={{ maxWidth: 600, marginBottom: 12 }} />
      <S w="60%" h={40} r={10} style={{ maxWidth: 440, marginBottom: 20 }} />
      <S w="50%" h={16} r={6} style={{ maxWidth: 360, marginBottom: 8 }} />
      <S w="40%" h={16} r={6} style={{ maxWidth: 280, marginBottom: 32 }} />
      <div className="skel-row" style={{ gap: 14 }}>
        <S w={150} h={44} r={10} />
        <S w={130} h={44} r={10} />
      </div>
    </div>
    <div className="skel-stats">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="skel-stat-item">
          <S w={48} h={24} r={6} style={{ marginBottom: 6 }} />
          <S w={64} h={12} r={4} />
        </div>
      ))}
    </div>
    <div className="skel-cards">
      {[1, 2, 3].map((i) => (
        <div key={i} className="skel-card">
          <S w="100%" h={180} r={12} />
          <div style={{ padding: 20 }}>
            <S w="70%" h={18} r={6} style={{ marginBottom: 10 }} />
            <S w="100%" h={12} r={4} style={{ marginBottom: 6 }} />
            <S w="85%" h={12} r={4} />
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ── 2. About ──
const AboutSkeleton = () => (
  <div className="skel-page">
    <NavbarSkeleton />
    <div style={{ padding: '80px 20px', maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <S w={200} h={48} r={12} style={{ marginBottom: 24 }} />
      <S w="80%" h={16} r={6} style={{ marginBottom: 12, maxWidth: 600 }} />
      <S w="70%" h={16} r={6} style={{ marginBottom: 64, maxWidth: 500 }} />
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, width: '100%' }}>
        {[1, 2, 3].map(i => (
          <div key={i} style={{ padding: 32, border: '1px solid var(--color-border)', borderRadius: 24, background: 'var(--color-bg-surface)' }}>
            <S w={48} h={48} r={12} style={{ marginBottom: 24 }} />
            <S w={150} h={24} r={8} style={{ marginBottom: 16 }} />
            <S w="100%" h={14} r={4} style={{ marginBottom: 8 }} />
            <S w="90%" h={14} r={4} style={{ marginBottom: 8 }} />
            <S w="80%" h={14} r={4} />
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ── 3. Events ──
const EventsSkeleton = () => (
  <div className="skel-page">
    <NavbarSkeleton />
    <div style={{ padding: '80px 20px', maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 48 }}>
        <S w={250} h={48} r={12} style={{ marginBottom: 16 }} />
        <S w="60%" h={16} r={6} style={{ maxWidth: 500 }} />
      </div>
      
      {/* Search & Filters */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <div style={{ display: 'flex', gap: 12 }}>
          <S w={100} h={40} r={20} />
          <S w={100} h={40} r={20} />
          <S w={100} h={40} r={20} />
        </div>
        <S w={250} h={40} r={20} />
      </div>

      <div className="skel-cards">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="skel-card">
            <S w="100%" h={200} r={12} />
            <div style={{ padding: 24 }}>
              <S w={80} h={24} r={12} style={{ marginBottom: 16 }} />
              <S w="90%" h={24} r={6} style={{ marginBottom: 12 }} />
              <S w="100%" h={14} r={4} style={{ marginBottom: 8 }} />
              <S w="75%" h={14} r={4} style={{ marginBottom: 24 }} />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <S w={120} h={16} r={4} />
                <S w={80} h={16} r={4} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ── 4. Event Detail ──
const EventDetailSkeleton = () => (
  <div className="skel-page">
    <NavbarSkeleton />
    <div style={{ padding: '40px 20px', maxWidth: 1000, margin: '0 auto' }}>
      <S w={100} h={16} r={4} style={{ marginBottom: 24 }} /> {/* Back link */}
      <S w="100%" h={400} r={24} style={{ marginBottom: 40 }} /> {/* Cover image */}
      
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 40 }}>
        {/* Main content */}
        <div>
          <S w="80%" h={48} r={12} style={{ marginBottom: 24 }} />
          <div style={{ display: 'flex', gap: 16, marginBottom: 40 }}>
            <S w={120} h={32} r={16} />
            <S w={120} h={32} r={16} />
          </div>
          <S w="100%" h={16} r={6} style={{ marginBottom: 12 }} />
          <S w="95%" h={16} r={6} style={{ marginBottom: 12 }} />
          <S w="100%" h={16} r={6} style={{ marginBottom: 12 }} />
          <S w="80%" h={16} r={6} style={{ marginBottom: 32 }} />
          
          <S w={200} h={32} r={8} style={{ marginBottom: 16 }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
            {[1, 2, 3, 4].map(i => <S key={i} w="100%" h={120} r={16} />)}
          </div>
        </div>
        {/* Sidebar */}
        <div>
          <div style={{ padding: 24, border: '1px solid var(--color-border)', borderRadius: 16, background: 'var(--color-bg-surface)' }}>
            <S w="100%" h={48} r={8} style={{ marginBottom: 24 }} />
            <S w="70%" h={16} r={4} style={{ marginBottom: 16 }} />
            <S w="60%" h={16} r={4} style={{ marginBottom: 16 }} />
            <S w="80%" h={16} r={4} />
          </div>
        </div>
      </div>
    </div>
  </div>
);

// ── 5. Team ──
const TeamSkeleton = () => (
  <div className="skel-page">
    <NavbarSkeleton />
    <div style={{ padding: '80px 20px', maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 48 }}>
        <S w={200} h={48} r={12} style={{ marginBottom: 16 }} />
        <S w="50%" h={16} r={6} style={{ maxWidth: 400 }} />
      </div>
      
      {/* Category Tabs */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 48, flexWrap: 'wrap' }}>
        {[1, 2, 3, 4].map(i => <S key={i} w={120} h={40} r={20} />)}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 32 }}>
        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <S w={160} h={160} r={999} style={{ marginBottom: 20 }} />
            <S w={140} h={20} r={6} style={{ marginBottom: 8 }} />
            <S w={100} h={14} r={4} style={{ marginBottom: 16 }} />
            <div style={{ display: 'flex', gap: 12 }}>
              <S w={32} h={32} r={999} />
              <S w={32} h={32} r={999} />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ── 6. Form Pages (Contact / Partnership) ──
const FormPageSkeleton = () => (
  <div className="skel-page">
    <NavbarSkeleton />
    <div style={{ padding: '80px 20px', maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 64 }}>
        <S w={300} h={48} r={12} style={{ marginBottom: 16 }} />
        <S w="60%" h={16} r={6} style={{ maxWidth: 500 }} />
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}>
        <div>
          {[1, 2, 3].map(i => (
            <div key={i} style={{ padding: 24, border: '1px solid var(--color-border)', borderRadius: 16, marginBottom: 16, background: 'var(--color-bg-surface)' }}>
              <S w={40} h={40} r={10} style={{ marginBottom: 16 }} />
              <S w={150} h={20} r={6} style={{ marginBottom: 8 }} />
              <S w="80%" h={16} r={4} />
            </div>
          ))}
        </div>
        <div style={{ padding: 40, border: '1px solid var(--color-border)', borderRadius: 24, background: 'var(--color-bg-surface)' }}>
          <S w={200} h={32} r={8} style={{ marginBottom: 32 }} />
          <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
            <S w="50%" h={48} r={8} />
            <S w="50%" h={48} r={8} />
          </div>
          <S w="100%" h={48} r={8} style={{ marginBottom: 20 }} />
          <S w="100%" h={120} r={8} style={{ marginBottom: 32 }} />
          <S w="100%" h={48} r={12} />
        </div>
      </div>
    </div>
  </div>
);

// ── 7. Login ──
const LoginSkeleton = () => (
  <div className="skel-page" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ width: '100%', maxWidth: 440, padding: 40, border: '1px solid var(--color-border)', borderRadius: 24, background: 'var(--color-bg-surface)' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
        <S w={48} h={48} r={12} />
      </div>
      <S w={200} h={32} r={8} style={{ margin: '0 auto 8px', display: 'block' }} />
      <S w={250} h={16} r={4} style={{ margin: '0 auto 40px', display: 'block' }} />
      
      <S w="100%" h={16} r={4} style={{ marginBottom: 8 }} />
      <S w="100%" h={48} r={8} style={{ marginBottom: 20 }} />
      
      <S w="100%" h={16} r={4} style={{ marginBottom: 8 }} />
      <S w="100%" h={48} r={8} style={{ marginBottom: 32 }} />
      
      <S w="100%" h={48} r={12} style={{ marginBottom: 24 }} />
      <S w={120} h={16} r={4} style={{ margin: '0 auto', display: 'block' }} />
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   DASHBOARD SKELETON
───────────────────────────────────────────── */
const DashboardSkeleton = () => (
  <div className="skel-dashboard">
    {/* ── Sidebar ── */}
    <div className="skel-sidebar">
      <div className="skel-sidebar-logo">
        <S w={36} h={36} r={10} />
        <div>
          <S w={90} h={14} r={4} style={{ marginBottom: 6 }} />
          <S w={64} h={10} r={3} />
        </div>
      </div>
      <div className="skel-sidebar-user">
        <S w={36} h={36} r={999} />
        <div style={{ flex: 1 }}>
          <S w="80%" h={12} r={4} style={{ marginBottom: 6 }} />
          <S w="50%" h={10} r={3} />
        </div>
        <S w={8} h={8} r={999} />
      </div>
      <div className="skel-sidebar-nav">
        <S w={70} h={8} r={3} style={{ marginBottom: 14, marginLeft: 14 }} />
        {[1, 2, 3, 4].map((i) => (
          <S key={i} w="100%" h={40} r={12} style={{ marginBottom: 6 }} />
        ))}
      </div>
      <div className="skel-sidebar-bottom">
        <S w="100%" h={40} r={12} style={{ marginBottom: 4 }} />
        <S w="100%" h={40} r={12} />
      </div>
    </div>

    {/* ── Main area ── */}
    <div className="skel-main">
      <div className="skel-topbar">
        <div className="skel-row" style={{ gap: 10 }}>
          <S w={28} h={28} r={8} />
          <div>
            <S w={120} h={16} r={4} style={{ marginBottom: 6 }} />
            <S w={180} h={10} r={3} className="skel-hide-mobile" />
          </div>
        </div>
        <div className="skel-row" style={{ gap: 12 }}>
          <S w={36} h={36} r={12} />
          <div className="skel-row skel-hide-mobile" style={{ gap: 10, paddingLeft: 12, borderLeft: '1px solid var(--color-border)' }}>
            <S w={32} h={32} r={999} />
            <div>
              <S w={80} h={12} r={4} style={{ marginBottom: 4 }} />
              <S w={56} h={9} r={3} />
            </div>
          </div>
        </div>
      </div>

      <div className="skel-content">
        <div className="skel-content-header">
          <S w={100} h={14} r={6} />
          <S w={110} h={36} r={10} />
        </div>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="skel-content-row">
            <div className="skel-row" style={{ gap: 16, flex: 1 }}>
              <S w={40} h={40} r={10} className="skel-hide-mobile" />
              <div style={{ flex: 1 }}>
                <S w="60%" h={14} r={4} style={{ marginBottom: 8, maxWidth: 260 }} />
                <S w="40%" h={10} r={3} style={{ maxWidth: 180 }} />
              </div>
            </div>
            <div className="skel-row skel-hide-mobile" style={{ gap: 6 }}>
              <S w={32} h={32} r={10} />
              <S w={32} h={32} r={10} />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   SKELETON LOADER WRAPPER
───────────────────────────────────────────── */
const SkeletonLoader = () => {
  const { isSkeleton } = useLoader();
  const location = useLocation();
  const path = location.pathname;

  // Render appropriate skeleton based on current route
  const renderSkeleton = () => {
    if (path.startsWith('/admin') || path.startsWith('/superadmin')) {
      return <DashboardSkeleton />;
    }
    if (path === '/') return <HomeSkeleton />;
    if (path === '/about') return <AboutSkeleton />;
    if (path === '/events') return <EventsSkeleton />;
    if (matchPath('/events/:id', path)) return <EventDetailSkeleton />;
    if (path === '/team' || path === '/contributors') return <TeamSkeleton />;
    if (path === '/contact' || path === '/partnership') return <FormPageSkeleton />;
    if (path === '/login') return <LoginSkeleton />;
    
    // Fallback
    return <HomeSkeleton />;
  };

  return (
    <AnimatePresence>
      {isSkeleton && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="skel-overlay"
        >
          {renderSkeleton()}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SkeletonLoader;
