import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { HiOutlineMenu, HiOutlineX, HiOutlineShieldCheck } from 'react-icons/hi';
import { FiSun, FiMoon } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About' },
  { path: '/events', label: 'Events' },
  { path: '/team', label: 'Team' },
  { path: '/contributors', label: 'Contributors' },
  { path: '/partnership', label: 'Partnership' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const { user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50"
      style={{ padding: scrolled ? '8px 16px' : '14px 16px', transition: 'padding 0.5s cubic-bezier(0.22,1,0.36,1)' }}
    >
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
        style={{
          maxWidth: '1360px',
          margin: '0 auto',
          borderRadius: '80px',
          height: scrolled ? '62px' : '68px',
          padding: '0 12px 0 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          /* ── Glassmorphism ─────────────────────────────────────────────────
             Dark:  was rgba(8,11,20,...) — nearly black, ate the logo.
                    Now rgba(18,28,46,...) — blue-slate base matches new
                    bg-primary (#101828) so the navy logo piece has contrast.
             ──────────────────────────────────────────────────────────────── */
          background: isDark
            ? 'rgba(18, 28, 46, 0.52)'   /* was rgba(8,11,20,0.55) */
            : 'rgba(255, 255, 255, 0.45)',
          backdropFilter: 'blur(28px) saturate(190%)',
          WebkitBackdropFilter: 'blur(28px) saturate(190%)',
          border: isDark
            ? '1px solid rgba(255, 255, 255, 0.09)'   /* slightly more visible */
            : '1px solid rgba(0, 0, 0, 0.08)',
          boxShadow: scrolled
            ? isDark
              ? '0 8px 48px rgba(0,0,0,0.45), inset 0 0.5px 0 rgba(255,255,255,0.07)'
              : '0 8px 48px rgba(0,0,0,0.08), inset 0 0.5px 0 rgba(255,255,255,0.7)'
            : isDark
              ? '0 4px 24px rgba(0,0,0,0.28), inset 0 0.5px 0 rgba(255,255,255,0.05)'
              : '0 4px 24px rgba(0,0,0,0.04), inset 0 0.5px 0 rgba(255,255,255,0.6)',
          transition: 'all 0.5s cubic-bezier(0.22,1,0.36,1)',
        }}
      >
        {/* ═══════ Logo ═══════ */}
        <Link to="/" className="flex items-center gap-3 shrink-0 group">
          <img
            src="/logo.png"
            alt="Bug2Build"
            className="h-9 md:h-10 transition-transform duration-300 group-hover:scale-110"
          />
          <span className="font-heading text-lg font-bold gradient-text hidden sm:inline">
            Bug2Build
          </span>
        </Link>

        {/* ═══════ Center Nav Links (Desktop) ═══════ */}
        <div className="hidden lg:flex items-center gap-1 mx-auto">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `relative px-4 py-2 rounded-full text-[13.5px] font-medium transition-all duration-300 ${
                  isActive
                    ? 'text-accent-primary'
                    : isDark
                      ? 'text-[#94A3B8] hover:text-[#F1F5F9]'
                      : 'text-[#64748B] hover:text-[#0F172A]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="floating-pill-indicator"
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: isDark
                          ? 'rgba(91, 95, 239, 0.12)'
                          : 'rgba(79, 70, 229, 0.08)',
                        border: isDark
                          ? '1px solid rgba(91, 95, 239, 0.2)'
                          : '1px solid rgba(79, 70, 229, 0.15)',
                      }}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* ═══════ Right Actions ═══════ */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105"
            style={{
              border: isDark
                ? '1px solid rgba(255,255,255,0.1)'
                : '1px solid rgba(0,0,0,0.1)',
              background: isDark
                ? 'rgba(255,255,255,0.04)'
                : 'rgba(0,0,0,0.03)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-accent-primary)';
              e.currentTarget.style.background = isDark
                ? 'rgba(59,95,204,0.12)' : 'rgba(79,70,229,0.08)';
              e.currentTarget.style.boxShadow = '0 0 16px rgba(59,95,204,0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = isDark
                ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
              e.currentTarget.style.background = isDark
                ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            aria-label="Toggle theme"
            id="theme-toggle"
          >
            {isDark
              ? <FiSun className="w-4 h-4" style={{ color: '#94A3B8' }} />
              : <FiMoon className="w-4 h-4" style={{ color: '#64748B' }} />
            }
          </button>

          {/* Admin Login (icon button — only when NOT logged in) */}
          {!user && (
            <Link
              to="/login"
              className="hidden md:inline-flex w-10 h-10 rounded-full items-center justify-center transition-all duration-300 hover:scale-105 group relative"
              style={{
                border: isDark
                  ? '1px solid rgba(255,255,255,0.1)'
                  : '1px solid rgba(0,0,0,0.1)',
                background: isDark
                  ? 'rgba(255,255,255,0.04)'
                  : 'rgba(0,0,0,0.03)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#5B7FE6';
                e.currentTarget.style.background = isDark
                  ? 'rgba(91,127,230,0.12)' : 'rgba(91,127,230,0.08)';
                e.currentTarget.style.boxShadow = '0 0 16px rgba(91,127,230,0.25)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = isDark
                  ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
                e.currentTarget.style.background = isDark
                  ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              aria-label="Admin Login"
              id="admin-login-btn"
            >
              <HiOutlineShieldCheck className="w-[18px] h-[18px]" style={{ color: isDark ? '#94A3B8' : '#64748B' }} />
              {/* Tooltip */}
              <span
                className="absolute -bottom-9 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none scale-90 group-hover:scale-100"
                style={{
                  background: isDark ? '#1E293B' : '#0F172A',
                  color: '#F1F5F9',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                }}
              >
                Admin Login
              </span>
            </Link>
          )}

          {/* Contact (outlined pill) */}
          <Link
            to="/contact"
            className="hidden md:inline-flex items-center justify-center text-[13.5px] font-semibold rounded-full px-5 py-2 transition-all duration-300 hover:scale-[1.03]"
            style={{
              border: isDark
                ? '1px solid rgba(255,255,255,0.14)'
                : '1px solid rgba(0,0,0,0.12)',
              color: isDark ? '#E2E8F0' : '#1E293B',
              background: isDark
                ? 'rgba(255,255,255,0.04)'
                : 'rgba(0,0,0,0.03)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-accent-primary)';
              e.currentTarget.style.background = isDark
                ? 'rgba(59,95,204,0.1)' : 'rgba(79,70,229,0.06)';
              e.currentTarget.style.color = 'var(--color-accent-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = isDark
                ? 'rgba(255,255,255,0.14)' : 'rgba(0,0,0,0.12)';
              e.currentTarget.style.background = isDark
                ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)';
              e.currentTarget.style.color = isDark ? '#E2E8F0' : '#1E293B';
            }}
          >
            Contact
          </Link>

          {/* Join Now / Dashboard (gradient filled pill) */}
          {user ? (
            <Link
              to={user.role === 'superadmin' ? '/superadmin' : '/admin'}
              className="hidden md:inline-flex items-center justify-center text-[13.5px] font-bold text-white rounded-full px-6 py-2 transition-all duration-300 hover:scale-[1.03]"
              style={{
                background: 'linear-gradient(135deg, #4E8AE6, #5B7FE6)',
                boxShadow: '0 4px 18px rgba(91,127,230,0.35)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 6px 28px rgba(91,127,230,0.5)';
                e.currentTarget.style.transform = 'translateY(-1px) scale(1.03)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 18px rgba(91,127,230,0.35)';
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
              }}
            >
              Dashboard
            </Link>
          ) : (
            <a
              href="https://chat.whatsapp.com/Gb99SIv2tnG2LhACFkzREc"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center justify-center text-[13.5px] font-bold text-white rounded-full px-6 py-2 transition-all duration-300 hover:scale-[1.03]"
              style={{
                background: 'linear-gradient(135deg, #4E8AE6, #5B7FE6)',
                boxShadow: '0 4px 18px rgba(91,127,230,0.35)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 6px 28px rgba(91,127,230,0.5)';
                e.currentTarget.style.transform = 'translateY(-1px) scale(1.03)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 18px rgba(91,127,230,0.35)';
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
              }}
            >
              Join Now
            </a>
          )}

          {/* Mobile Hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
            style={{
              border: isDark
                ? '1px solid rgba(255,255,255,0.1)'
                : '1px solid rgba(0,0,0,0.1)',
              background: isDark
                ? 'rgba(255,255,255,0.04)'
                : 'rgba(0,0,0,0.03)',
            }}
            aria-label="Toggle menu"
            id="mobile-menu-toggle"
          >
            {isOpen
              ? <HiOutlineX className="w-5 h-5" />
              : <HiOutlineMenu className="w-5 h-5" />
            }
          </button>
        </div>
      </motion.div>

      {/* ═══════ Mobile Drawer ═══════ */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.96 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="lg:hidden"
            style={{
              maxWidth: '1360px',
              margin: '10px auto 0',
              borderRadius: '28px',
              overflow: 'hidden',
              /* Mobile drawer — same base shift as navbar pill */
              background: isDark
                ? 'rgba(18, 28, 46, 0.92)'   /* was rgba(8,11,20,0.92) */
                : 'rgba(255, 255, 255, 0.92)',
              backdropFilter: 'blur(28px) saturate(190%)',
              WebkitBackdropFilter: 'blur(28px) saturate(190%)',
              border: isDark
                ? '1px solid rgba(255,255,255,0.08)'
                : '1px solid rgba(0,0,0,0.06)',
              boxShadow: isDark
                ? '0 16px 48px rgba(0,0,0,0.45)'
                : '0 16px 48px rgba(0,0,0,0.1)',
            }}
          >
            <div className="p-5 space-y-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `block px-5 py-3.5 rounded-2xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'text-accent-primary'
                        : isDark
                          ? 'text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-white/5'
                          : 'text-[#64748B] hover:text-[#0F172A] hover:bg-black/5'
                    }`
                  }
                  style={({ isActive }) => isActive ? {
                    background: isDark
                      ? 'rgba(59,95,204,0.1)'
                      : 'rgba(79,70,229,0.06)',
                  } : {}}
                >
                  {link.label}
                </NavLink>
              ))}

              {/* Mobile bottom buttons */}
              <div
                className="pt-4 mt-3 flex flex-col gap-3"
                style={{
                  borderTop: isDark
                    ? '1px solid rgba(255,255,255,0.06)'
                    : '1px solid rgba(0,0,0,0.06)',
                }}
              >
                <div className="flex gap-3">
                  <Link
                    to="/contact"
                    className="flex-1 text-center text-sm font-semibold rounded-2xl py-3.5 transition-all duration-200"
                    style={{
                      border: isDark
                        ? '1px solid rgba(255,255,255,0.12)'
                        : '1px solid rgba(0,0,0,0.1)',
                      color: isDark ? '#E2E8F0' : '#1E293B',
                    }}
                  >
                    Contact
                  </Link>
                  {user ? (
                    <Link
                      to={user.role === 'superadmin' ? '/superadmin' : '/admin'}
                      className="flex-1 text-center text-sm font-bold text-white rounded-2xl py-3.5"
                      style={{
                        background: 'linear-gradient(135deg, #4E8AE6, #5B7FE6)',
                        boxShadow: '0 4px 16px rgba(91,127,230,0.3)',
                      }}
                    >
                      Dashboard
                    </Link>
                  ) : (
                    <a
                      href="https://chat.whatsapp.com/Gb99SIv2tnG2LhACFkzREc"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center text-sm font-bold text-white rounded-2xl py-3.5"
                      style={{
                        background: 'linear-gradient(135deg, #4E8AE6, #5B7FE6)',
                        boxShadow: '0 4px 16px rgba(91,127,230,0.3)',
                      }}
                    >
                      Join Now
                    </a>
                  )}
                </div>
                {!user && (
                  <Link
                    to="/login"
                    className="flex items-center justify-center gap-2.5 text-sm font-semibold rounded-2xl py-3.5 transition-all duration-200"
                    style={{
                      border: isDark
                        ? '1px solid rgba(91,127,230,0.25)'
                        : '1px solid rgba(91,127,230,0.2)',
                      color: '#5B7FE6',
                      background: isDark
                        ? 'rgba(91,127,230,0.08)'
                        : 'rgba(91,127,230,0.05)',
                    }}
                  >
                    <HiOutlineShieldCheck className="w-4 h-4" />
                    Admin Login
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;