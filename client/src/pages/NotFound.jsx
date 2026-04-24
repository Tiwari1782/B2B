import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineHome } from 'react-icons/hi';

const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center px-4 relative">
    <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/5 via-transparent to-accent-purple/5" />
    <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-accent-primary/5 rounded-full blur-[180px]" />

    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative text-center max-w-lg"
    >
      <img src="/logo.png" alt="Bug2Build" className="h-20 mx-auto mb-10 animate-float" />
      <h1 className="text-9xl font-bold font-heading gradient-text mb-4">404</h1>
      <p className="text-xl text-text-secondary mb-10">Oops! This page doesn't exist.</p>
      <Link to="/" className="inline-flex items-center gap-2 gradient-btn text-white font-semibold px-8 py-3.5 rounded-xl text-base">
        <HiOutlineHome className="w-5 h-5" />
        Back to Home
      </Link>
    </motion.div>
  </div>
);

export default NotFound;
