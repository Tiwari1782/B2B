import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeOff, HiOutlineArrowLeft, HiOutlineShieldCheck } from 'react-icons/hi';
import { useToast } from '../components/common/ToastNotification';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

/* ─────────────────────────────────────────────────────────────
   ANIMATED BACKGROUND (particles + floating shapes + grid)
───────────────────────────────────────────────────────────── */
const LoginBackground = () => {
  const [mouse, setMouse] = useState({ x: 50, y: 50 });

  const handleMove = useCallback((e) => {
    setMouse({
      x: (e.clientX / window.innerWidth) * 100,
      y: (e.clientY / window.innerHeight) * 100,
    });
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, [handleMove]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Mouse-following spotlight */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full transition-all duration-700 ease-out"
        style={{
          background: 'radial-gradient(circle, rgba(91,95,239,0.15) 0%, transparent 70%)',
          left: `${mouse.x}%`,
          top: `${mouse.y}%`,
          transform: 'translate(-50%, -50%)',
        }}
      />

      {/* Static ambient orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-accent-primary/8 blur-[120px]" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-accent-purple/6 blur-[100px]" />
      <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] rounded-full bg-accent-blue/5 blur-[80px]" />

      {/* Animated particles */}
      {Array.from({ length: 24 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: 2 + (i % 3),
            height: 2 + (i % 3),
            left: `${5 + (i * 4.1) % 90}%`,
            top: `${3 + (i * 5.7) % 94}%`,
            background: i % 3 === 0
              ? 'rgba(91,95,239,0.5)'
              : i % 3 === 1
                ? 'rgba(139,92,246,0.4)'
                : 'rgba(0,194,255,0.4)',
          }}
          animate={{
            y: [0, -30 - (i % 20), 0],
            x: [0, (i % 2 === 0 ? 1 : -1) * (10 + i % 15), 0],
            opacity: [0.15, 0.6, 0.15],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 3 + (i % 5),
            delay: i * 0.25,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Floating geometric shapes */}
      {[
        { size: 48, x: '10%', y: '20%', d: 7, color: 'rgba(91,95,239,0.08)', rotate: 45 },
        { size: 32, x: '82%', y: '15%', d: 9, color: 'rgba(0,194,255,0.07)', rotate: 15 },
        { size: 60, x: '75%', y: '65%', d: 11, color: 'rgba(139,92,246,0.06)', rotate: 30 },
        { size: 24, x: '20%', y: '75%', d: 6, color: 'rgba(255,107,138,0.06)', rotate: 60 },
        { size: 40, x: '90%', y: '40%', d: 8, color: 'rgba(91,95,239,0.06)', rotate: 20 },
        { size: 36, x: '5%', y: '50%', d: 10, color: 'rgba(0,194,255,0.08)', rotate: 75 },
      ].map((s, i) => (
        <motion.div
          key={`shape-${i}`}
          className="absolute rounded-2xl"
          style={{
            width: s.size,
            height: s.size,
            left: s.x,
            top: s.y,
            background: s.color,
            border: `1px solid ${s.color.replace(/[\d.]+\)$/, '0.2)')}`,
            rotate: s.rotate,
          }}
          animate={{
            y: [0, -20, 6, 0],
            rotate: [s.rotate, s.rotate + 90, s.rotate + 180, s.rotate + 270, s.rotate + 360],
            scale: [1, 1.06, 0.97, 1],
          }}
          transition={{ duration: s.d, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
        />
      ))}

      {/* Grid mesh overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(91,95,239,0.6) 1px, transparent 1px),
            linear-gradient(90deg, rgba(91,95,239,0.6) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-bg-primary to-transparent" />
      <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-bg-primary/50 to-transparent" />
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   3D TILT CARD WRAPPER
───────────────────────────────────────────────────────────── */
const TiltCard = ({ children }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 200, damping: 20 });
  const glareX = useSpring(useTransform(x, [-0.5, 0.5], [0, 100]), { stiffness: 200, damping: 20 });
  const glareY = useSpring(useTransform(y, [-0.5, 0.5], [0, 100]), { stiffness: 200, damping: 20 });

  const handleMouse = (e) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 800,
        transformStyle: 'preserve-3d',
      }}
      className="relative"
    >
      {children}
      {/* Glare overlay */}
      <motion.div
        className="absolute inset-0 rounded-3xl pointer-events-none z-10"
        style={{
          background: useTransform(
            [glareX, glareY],
            ([gx, gy]) =>
              `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.06) 0%, transparent 60%)`
          ),
        }}
      />
    </motion.div>
  );
};

/* ─────────────────────────────────────────────────────────────
   FLOATING CODE SNIPPETS (decoration)
───────────────────────────────────────────────────────────── */
const FloatingSnippets = () => {
  const { isDark } = useTheme();
  const snippets = [
    { code: 'const auth = await login();', x: '3%', y: '18%', delay: 0 },
    { code: '// Welcome to B2B ✦', x: '72%', y: '12%', delay: 0.5 },
    { code: 'if (admin) dashboard();', x: '6%', y: '72%', delay: 1 },
    { code: 'user.role === "admin"', x: '68%', y: '78%', delay: 1.5 },
  ];

  return (
    <>
      {snippets.map((s, i) => (
        <motion.div
          key={i}
          className="absolute hidden lg:block"
          style={{ left: s.x, top: s.y }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 + s.delay, duration: 0.6 }}
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut' }}
            className="px-4 py-2.5 rounded-xl text-[11px] font-mono"
            style={{
              background: isDark ? 'rgba(13,17,32,0.8)' : 'rgba(255,255,255,0.8)',
              backdropFilter: 'blur(12px)',
              border: isDark ? '1px solid rgba(91,95,239,0.15)' : '1px solid rgba(91,95,239,0.12)',
              color: isDark ? '#8B5CF6' : '#6D28D9',
              boxShadow: isDark
                ? '0 4px 24px rgba(0,0,0,0.3)'
                : '0 4px 24px rgba(0,0,0,0.06)',
            }}
          >
            {s.code}
          </motion.div>
        </motion.div>
      ))}
    </>
  );
};

/* ─────────────────────────────────────────────────────────────
   MAIN LOGIN PAGE
───────────────────────────────────────────────────────────── */
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const { login } = useAuth();
  const { isDark } = useTheme();
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.warning('Please fill in all fields.', { title: 'Missing Fields' });
      return;
    }
    setLoading(true);
    try {
      const user = await login(email, password);
      toast.success('Welcome back!', { title: 'Login Successful' });
      navigate(user.role === 'superadmin' ? '/superadmin' : '/admin');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials.', { title: 'Login Failed' });
    } finally {
      setLoading(false);
    }
  };

  const cardBg = isDark
    ? 'rgba(13, 17, 32, 0.65)'
    : 'rgba(255, 255, 255, 0.65)';
  const cardBorder = isDark
    ? '1px solid rgba(255,255,255,0.08)'
    : '1px solid rgba(0,0,0,0.08)';

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      <LoginBackground />
      <FloatingSnippets />

      <div className="relative z-10 w-full max-w-md">
        {/* Back to home */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-accent-primary transition-colors duration-200 group"
          >
            <motion.span
              className="w-8 h-8 rounded-full border border-border/60 flex items-center justify-center group-hover:border-accent-primary/40 group-hover:bg-accent-primary/5 transition-all duration-200"
              whileHover={{ x: -3 }}
            >
              <HiOutlineArrowLeft className="w-4 h-4" />
            </motion.span>
            Back to Home
          </Link>
        </motion.div>

        {/* 3D Tilt Login Card */}
        <TiltCard>
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative rounded-3xl overflow-hidden"
            style={{
              background: cardBg,
              backdropFilter: 'blur(32px) saturate(180%)',
              WebkitBackdropFilter: 'blur(32px) saturate(180%)',
              border: cardBorder,
              boxShadow: isDark
                ? '0 24px 80px -12px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.06)'
                : '0 24px 80px -12px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.8)',
            }}
          >
            {/* Top gradient accent line */}
            <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #FF6B8A, #8B5CF6, #5B5FEF, #00C2FF)' }} />

            {/* Animated border glow */}
            <motion.div
              className="absolute -inset-[1px] rounded-3xl pointer-events-none z-0"
              animate={{
                background: [
                  'conic-gradient(from 0deg, rgba(91,95,239,0.15), rgba(139,92,246,0.15), rgba(0,194,255,0.15), rgba(255,107,138,0.15), rgba(91,95,239,0.15))',
                  'conic-gradient(from 120deg, rgba(91,95,239,0.15), rgba(139,92,246,0.15), rgba(0,194,255,0.15), rgba(255,107,138,0.15), rgba(91,95,239,0.15))',
                  'conic-gradient(from 240deg, rgba(91,95,239,0.15), rgba(139,92,246,0.15), rgba(0,194,255,0.15), rgba(255,107,138,0.15), rgba(91,95,239,0.15))',
                  'conic-gradient(from 360deg, rgba(91,95,239,0.15), rgba(139,92,246,0.15), rgba(0,194,255,0.15), rgba(255,107,138,0.15), rgba(91,95,239,0.15))',
                ],
              }}
              transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
              style={{ filter: 'blur(8px)' }}
            />

            <div className="relative z-[1] p-8 md:p-10">
              {/* Logo + Header */}
              <div className="text-center mb-10">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.3 }}
                  className="relative inline-block mb-6"
                >
                  {/* Pulsing ring */}
                  <motion.div
                    className="absolute -inset-3 rounded-full"
                    animate={{
                      boxShadow: [
                        '0 0 0 0px rgba(91,95,239,0.3)',
                        '0 0 0 12px rgba(91,95,239,0)',
                      ],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center relative overflow-hidden"
                    style={{
                      background: isDark
                        ? 'rgba(91,95,239,0.12)'
                        : 'rgba(79,70,229,0.08)',
                      border: isDark
                        ? '1px solid rgba(91,95,239,0.25)'
                        : '1px solid rgba(79,70,229,0.15)',
                    }}
                  >
                    <img src="/logo.png" alt="Bug2Build" className="w-12 h-12 object-contain" />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 }}
                >
                  <h1 className="text-2xl font-black font-heading mb-1.5">
                    <span className="gradient-text">Admin Portal</span>
                  </h1>
                  <p className="text-text-secondary text-sm flex items-center justify-center gap-2">
                    <HiOutlineShieldCheck className="w-4 h-4 text-accent-primary" />
                    Secure access to the dashboard
                  </p>
                </motion.div>
              </div>

              {/* Form */}
              <motion.form
                onSubmit={handleSubmit}
                className="space-y-5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.55 }}
              >
                {/* Email */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <label className="block text-xs font-bold text-text-secondary mb-2 uppercase tracking-[0.1em]">
                    Email Address
                  </label>
                  <div className="relative group">
                    <div
                      className="absolute left-0 top-0 bottom-0 w-12 rounded-l-xl flex items-center justify-center transition-colors duration-300"
                      style={{
                        background: focusedField === 'email'
                          ? isDark ? 'rgba(91,95,239,0.15)' : 'rgba(79,70,229,0.08)'
                          : 'transparent',
                      }}
                    >
                      <HiOutlineMail
                        className="w-4 h-4 transition-colors duration-300"
                        style={{ color: focusedField === 'email' ? '#5B5FEF' : 'var(--color-text-muted)' }}
                      />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="admin@bug2build.in"
                      className="w-full border rounded-xl pl-12 pr-4 py-3.5 text-sm transition-all duration-300 focus:outline-none"
                      style={{
                        backgroundColor: isDark ? 'rgba(8,11,20,0.6)' : 'rgba(241,245,249,0.6)',
                        borderColor: focusedField === 'email'
                          ? 'var(--color-accent-primary)'
                          : 'var(--color-border)',
                        color: 'var(--color-text-primary)',
                        boxShadow: focusedField === 'email'
                          ? '0 0 0 3px rgba(91,95,239,0.12), 0 4px 12px rgba(91,95,239,0.08)'
                          : 'none',
                      }}
                      id="login-email"
                      autoComplete="email"
                    />
                  </div>
                </motion.div>

                {/* Password */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <label className="block text-xs font-bold text-text-secondary mb-2 uppercase tracking-[0.1em]">
                    Password
                  </label>
                  <div className="relative group">
                    <div
                      className="absolute left-0 top-0 bottom-0 w-12 rounded-l-xl flex items-center justify-center transition-colors duration-300"
                      style={{
                        background: focusedField === 'password'
                          ? isDark ? 'rgba(91,95,239,0.15)' : 'rgba(79,70,229,0.08)'
                          : 'transparent',
                      }}
                    >
                      <HiOutlineLockClosed
                        className="w-4 h-4 transition-colors duration-300"
                        style={{ color: focusedField === 'password' ? '#5B5FEF' : 'var(--color-text-muted)' }}
                      />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Enter your password"
                      className="w-full border rounded-xl pl-12 pr-12 py-3.5 text-sm transition-all duration-300 focus:outline-none"
                      style={{
                        backgroundColor: isDark ? 'rgba(8,11,20,0.6)' : 'rgba(241,245,249,0.6)',
                        borderColor: focusedField === 'password'
                          ? 'var(--color-accent-primary)'
                          : 'var(--color-border)',
                        color: 'var(--color-text-primary)',
                        boxShadow: focusedField === 'password'
                          ? '0 0 0 3px rgba(91,95,239,0.12), 0 4px 12px rgba(91,95,239,0.08)'
                          : 'none',
                      }}
                      id="login-password"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-accent-primary transition-colors duration-200"
                    >
                      {showPassword
                        ? <HiOutlineEyeOff className="w-4 h-4" />
                        : <HiOutlineEye className="w-4 h-4" />
                      }
                    </button>
                  </div>
                </motion.div>

                {/* Submit Button */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.01, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full relative overflow-hidden font-bold py-4 rounded-xl disabled:opacity-50 text-white text-base mt-2 transition-all duration-300"
                    style={{
                      background: 'linear-gradient(135deg, #FF6B8A, #8B5CF6, #5B5FEF)',
                      backgroundSize: '200% 200%',
                      boxShadow: '0 8px 32px rgba(91,95,239,0.35), 0 2px 8px rgba(139,92,246,0.25)',
                    }}
                  >
                    {/* Shimmer effect */}
                    <motion.div
                      className="absolute inset-0"
                      animate={{
                        background: [
                          'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
                        ],
                        x: ['-100%', '100%'],
                      }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    />

                    <span className="relative z-10 flex items-center justify-center gap-2.5">
                      {loading ? (
                        <>
                          <motion.div
                            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                          />
                          Authenticating...
                        </>
                      ) : (
                        <>
                          <HiOutlineShieldCheck className="w-5 h-5" />
                          Sign In to Dashboard
                        </>
                      )}
                    </span>
                  </motion.button>
                </motion.div>
              </motion.form>

              {/* Security badge */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-8 flex items-center justify-center gap-2 text-[11px] text-text-muted"
              >
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: '#22C55E', boxShadow: '0 0 6px rgba(34,197,94,0.5)' }}
                />
                Protected by 256-bit encryption
              </motion.div>
            </div>
          </motion.div>
        </TiltCard>

        {/* Bottom decoration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="mt-8 text-center"
        >
          <p className="text-text-muted text-xs">
            Not an admin?{' '}
            <Link to="/" className="text-accent-primary font-semibold hover:underline">
              Visit Bug2Build
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
