import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiLinkedin, FiGithub } from 'react-icons/fi';
import api from '../services/api';

const categoryLabels = {
  executive: 'Executive Council',
  tech: 'Tech Team',
  event: 'Events Team',
  sponsors: 'Sponsors Team',
  digital_media: 'Digital Media',
  marketing: 'Marketing',
  research: 'Research',
};

const fadeChild = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const Team = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/team')
      .then((res) => setMembers(res.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const grouped = members.reduce((acc, m) => {
    const cat = m.category || 'other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(m);
    return acc;
  }, {});

  const categoryOrder = ['executive', 'tech', 'event', 'sponsors', 'digital_media', 'marketing', 'research'];

  return (
    <div className="min-h-screen pt-28 pb-24">
      <div className="section-container">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-20">
          <h1 className="text-4xl md:text-6xl font-bold font-heading mb-5"><span className="gradient-text">Our Team</span></h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">The passionate minds behind Bug2Build.</p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-24"><div className="w-10 h-10 border-2 border-accent-primary border-t-transparent rounded-full animate-spin" /></div>
        ) : (
          categoryOrder.map((cat) => {
            const catMembers = grouped[cat];
            if (!catMembers?.length) return null;
            return (
              <section key={cat} className="mb-24 last:mb-0">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center mb-12">
                  <h2 className="text-2xl md:text-4xl font-bold font-heading">
                    <span className="gradient-text">{categoryLabels[cat] || cat}</span>
                  </h2>
                  <div className="w-16 h-1 rounded-full bg-accent-primary/30 mx-auto mt-4" />
                </motion.div>

                <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                  {catMembers.map((member) => (
                    <motion.div key={member._id} variants={fadeChild} className="card-base card-glow p-6 text-center group">
                      <div className="w-24 h-24 mx-auto mb-5 rounded-full overflow-hidden border-2 border-border group-hover:border-accent-primary transition-all duration-300 group-hover:shadow-[0_0_25px_rgba(91,95,239,0.2)]">
                        {member.photo ? (
                          <img src={member.photo} alt={member.name} className="w-full h-full object-cover" loading="lazy" />
                        ) : (
                          <div className="w-full h-full bg-accent-primary/10 flex items-center justify-center text-2xl font-bold text-accent-primary">{member.name[0]}</div>
                        )}
                      </div>
                      <h3 className="font-heading font-semibold text-sm text-text-primary mb-1">{member.name}</h3>
                      <p className="text-text-secondary text-xs mb-4">{member.role}</p>
                      <div className="flex items-center justify-center gap-2">
                        {member.linkedin && (
                          <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg border border-border hover:border-accent-primary hover:bg-accent-primary/10 transition-all duration-300">
                            <FiLinkedin className="w-3.5 h-3.5 text-text-secondary" />
                          </a>
                        )}
                        {member.github && (
                          <a href={member.github} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg border border-border hover:border-accent-primary hover:bg-accent-primary/10 transition-all duration-300">
                            <FiGithub className="w-3.5 h-3.5 text-text-secondary" />
                          </a>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </section>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Team;
