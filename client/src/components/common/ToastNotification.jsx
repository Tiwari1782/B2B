import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
  HiOutlineInformationCircle,
  HiOutlineExclamation,
  HiOutlineX,
} from 'react-icons/hi';

/* ─────────────────────────────────────────────────────────────
   TOAST CONTEXT
───────────────────────────────────────────────────────────── */
const ToastContext = createContext(null);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};

/* ─────────────────────────────────────────────────────────────
   TOAST CONFIG
───────────────────────────────────────────────────────────── */
const TOAST_VARIANTS = {
  success: {
    icon: HiOutlineCheckCircle,
    gradient: 'linear-gradient(135deg, #22C55E, #16A34A)',
    glow: 'rgba(34, 197, 94, 0.25)',
    accent: '#22C55E',
    bg: 'rgba(34, 197, 94, 0.08)',
    border: 'rgba(34, 197, 94, 0.2)',
  },
  error: {
    icon: HiOutlineExclamationCircle,
    gradient: 'linear-gradient(135deg, #EF4444, #DC2626)',
    glow: 'rgba(239, 68, 68, 0.25)',
    accent: '#EF4444',
    bg: 'rgba(239, 68, 68, 0.08)',
    border: 'rgba(239, 68, 68, 0.2)',
  },
  warning: {
    icon: HiOutlineExclamation,
    gradient: 'linear-gradient(135deg, #F59E0B, #D97706)',
    glow: 'rgba(245, 158, 11, 0.25)',
    accent: '#F59E0B',
    bg: 'rgba(245, 158, 11, 0.08)',
    border: 'rgba(245, 158, 11, 0.2)',
  },
  info: {
    icon: HiOutlineInformationCircle,
    gradient: 'linear-gradient(135deg, #3B5FCC, #5B7FE6)',
    glow: 'rgba(91, 95, 239, 0.25)',
    accent: '#3B5FCC',
    bg: 'rgba(91, 95, 239, 0.08)',
    border: 'rgba(91, 95, 239, 0.2)',
  },
};

/* ─────────────────────────────────────────────────────────────
   SINGLE TOAST ITEM
───────────────────────────────────────────────────────────── */
const ToastItem = ({ toast, onDismiss }) => {
  const config = TOAST_VARIANTS[toast.type] || TOAST_VARIANTS.info;
  const Icon = config.icon;
  const progressRef = useRef(null);
  const [paused, setPaused] = useState(false);
  const remainingRef = useRef(toast.duration || 4000);
  const startRef = useRef(Date.now());

  useEffect(() => {
    if (paused) return;
    startRef.current = Date.now();
    const timer = setTimeout(() => onDismiss(toast.id), remainingRef.current);
    return () => clearTimeout(timer);
  }, [paused, toast.id, onDismiss]);

  const handlePause = () => {
    remainingRef.current -= Date.now() - startRef.current;
    setPaused(true);
  };

  const handleResume = () => {
    setPaused(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20, x: 40, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 60, scale: 0.88, filter: 'blur(4px)' }}
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      onMouseEnter={handlePause}
      onMouseLeave={handleResume}
      style={{
        background: 'var(--color-bg-surface)',
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        border: `1px solid ${config.border}`,
        borderRadius: '16px',
        boxShadow: `
          0 16px 48px -12px rgba(0, 0, 0, 0.25),
          0 0 0 1px ${config.border},
          0 0 32px ${config.glow}
        `,
        overflow: 'hidden',
        minWidth: '340px',
        maxWidth: '420px',
        cursor: 'default',
      }}
    >
      {/* Top gradient accent line */}
      <div
        style={{
          height: '3px',
          background: config.gradient,
          borderRadius: '16px 16px 0 0',
        }}
      />

      <div style={{ padding: '14px 16px 12px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
        {/* Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 20, delay: 0.1 }}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: config.bg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Icon style={{ width: '20px', height: '20px', color: config.accent }} />
        </motion.div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {toast.title && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 700,
                fontSize: '14px',
                color: 'var(--color-text-primary)',
                margin: '0 0 2px',
                lineHeight: 1.3,
              }}
            >
              {toast.title}
            </motion.p>
          )}
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            style={{
              fontSize: '13px',
              color: 'var(--color-text-secondary)',
              margin: 0,
              lineHeight: 1.5,
              wordBreak: 'break-word',
            }}
          >
            {toast.message}
          </motion.p>
        </div>

        {/* Close button */}
        <motion.button
          whileHover={{ scale: 1.15, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onDismiss(toast.id)}
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '8px',
            border: '1px solid var(--color-border)',
            background: 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--color-text-muted)',
            flexShrink: 0,
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = config.accent;
            e.currentTarget.style.color = config.accent;
            e.currentTarget.style.background = config.bg;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-border)';
            e.currentTarget.style.color = 'var(--color-text-muted)';
            e.currentTarget.style.background = 'transparent';
          }}
        >
          <HiOutlineX style={{ width: '14px', height: '14px' }} />
        </motion.button>
      </div>

      {/* Progress bar */}
      <div style={{ padding: '0 16px 10px' }}>
        <div
          style={{
            height: '3px',
            borderRadius: '3px',
            background: 'var(--color-border)',
            overflow: 'hidden',
          }}
        >
          <motion.div
            ref={progressRef}
            initial={{ scaleX: 1 }}
            animate={{ scaleX: paused ? undefined : 0 }}
            transition={{
              duration: (remainingRef.current || 4000) / 1000,
              ease: 'linear',
            }}
            style={{
              height: '100%',
              background: config.gradient,
              transformOrigin: 'left',
              borderRadius: '3px',
            }}
          />
        </div>
      </div>
    </motion.div>
  );
};

/* ─────────────────────────────────────────────────────────────
   TOAST PROVIDER + STANDALONE API
───────────────────────────────────────────────────────────── */
let toastIdCounter = 0;
let globalAddToast = null;
let globalDismiss = null;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((type, message, options = {}) => {
    const id = ++toastIdCounter;
    const t = {
      id,
      type,
      message,
      title: options.title || null,
      duration: options.duration || 4000,
    };
    setToasts((prev) => [...prev.slice(-4), t]); // max 5 toasts
    return id;
  }, []);

  // Register globally so standalone toast API works
  useEffect(() => {
    globalAddToast = addToast;
    globalDismiss = dismiss;
    return () => { globalAddToast = null; globalDismiss = null; };
  }, [addToast, dismiss]);

  const toastApi = useCallback((message, opts) => addToast('info', message, opts), [addToast]);
  toastApi.success = (message, opts) => addToast('success', message, opts);
  toastApi.error = (message, opts) => addToast('error', message, opts);
  toastApi.warning = (message, opts) => addToast('warning', message, opts);
  toastApi.info = (message, opts) => addToast('info', message, opts);
  toastApi.dismiss = dismiss;

  return (
    <ToastContext.Provider value={toastApi}>
      {children}

      {/* Toast Container */}
      <div
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 99999,
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          pointerEvents: 'none',
        }}
      >
        <AnimatePresence mode="popLayout">
          {toasts.map((t) => (
            <div key={t.id} style={{ pointerEvents: 'auto' }}>
              <ToastItem toast={t} onDismiss={dismiss} />
            </div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

/* ─────────────────────────────────────────────────────────────
   STANDALONE TOAST (drop-in replacement for react-hot-toast)
   Usage: import toast from './ToastNotification';
          toast.success('Done!');
───────────────────────────────────────────────────────────── */
const toast = (message, opts) => globalAddToast?.('info', message, opts);
toast.success = (message, opts) => globalAddToast?.('success', message, opts);
toast.error = (message, opts) => globalAddToast?.('error', message, opts);
toast.warning = (message, opts) => globalAddToast?.('warning', message, opts);
toast.info = (message, opts) => globalAddToast?.('info', message, opts);
toast.dismiss = (id) => globalDismiss?.(id);

export default toast;
