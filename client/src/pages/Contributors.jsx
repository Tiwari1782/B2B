import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiGithub } from 'react-icons/fi';
import api from '../services/api';

const fadeChild = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const Contributors = () => {
  const [contributors, setContributors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/contributors')
      .then((res) => setContributors(res.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen pt-28 pb-24">
      <div className="section-container">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold font-heading mb-5"><span className="gradient-text">Our Contributors</span></h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">The brilliant developers who make Bug2Build possible.</p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-24"><div className="w-10 h-10 border-2 border-accent-primary border-t-transparent rounded-full animate-spin" /></div>
        ) : contributors.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-text-secondary text-lg">No contributors found.</p>
          </div>
        ) : (
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {contributors.map((c) => (
              <motion.div key={c._id} variants={fadeChild} className="card-base card-glow p-6 group relative overflow-hidden">
                {/* Subtle accent line */}
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-accent-primary/0 via-accent-primary/40 to-accent-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-border group-hover:border-accent-primary transition-all duration-300 flex-shrink-0">
                    {c.avatar ? (
                      <img src={c.avatar} alt={c.name} className="w-full h-full object-cover" loading="lazy" />
                    ) : (
                      <div className="w-full h-full bg-accent-secondary/10 flex items-center justify-center text-lg font-bold text-accent-secondary">{c.name[0]}</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading font-semibold text-text-primary truncate">{c.name}</h3>
                    {c.role && <p className="text-accent-primary text-xs font-medium mt-0.5">{c.role}</p>}
                    {c.bio && <p className="text-text-secondary text-sm mt-2 line-clamp-2">{c.bio}</p>}
                  </div>
                </div>
                {c.github && (
                  <a href={c.github} target="_blank" rel="noopener noreferrer" className="mt-4 flex items-center gap-2 text-sm text-text-secondary hover:text-accent-primary transition-colors duration-300">
                    <FiGithub className="w-4 h-4" />
                    <span className="truncate">{c.github.replace('https://github.com/', '@')}</span>
                  </a>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Contributors;
