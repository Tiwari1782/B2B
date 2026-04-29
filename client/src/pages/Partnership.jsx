import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineGlobe, HiOutlineUsers, HiOutlineLightningBolt, HiOutlineAcademicCap } from 'react-icons/hi';
import { useToast } from '../components/common/ToastNotification';
import api from '../services/api';

const Partnership = () => {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', company: '', optingFor: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.email || !form.optingFor || !form.message) {
      toast.warning('Please fill in all required fields.', { title: 'Missing Fields' });
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/partnership', form);
      toast.success('Partnership inquiry sent successfully!', { title: 'Inquiry Sent' });
      setForm({ firstName: '', lastName: '', email: '', company: '', optingFor: '', message: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send inquiry.', { title: 'Error' });
    } finally {
      setSubmitting(false);
    }
  };

  const benefits = [
    { icon: HiOutlineGlobe, title: 'Brand Visibility', desc: 'Reach 500+ active developers across our platforms.', color: '#3B5FCC' },
    { icon: HiOutlineUsers, title: 'Talent Access', desc: 'Connect directly with top student developers.', color: '#1A8FBC' },
    { icon: HiOutlineLightningBolt, title: 'Event Co-hosting', desc: 'Sponsor and co-organize hackathons and workshops.', color: '#5B7FE6' },
    { icon: HiOutlineAcademicCap, title: 'Community Impact', desc: 'Support open-source and education initiatives.', color: '#4E8AE6' },
  ];

  return (
    <div className="min-h-screen pt-28 pb-24">
      <div className="section-container">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold font-heading mb-5"><span className="gradient-text">Partner With Us</span></h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">Join forces with Bug2Build and empower the next generation of builders.</p>
        </motion.div>

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {benefits.map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="card-base card-glow p-7 group relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 rounded-t-xl" style={{ background: `linear-gradient(90deg, ${item.color}, ${item.color}66)` }} />
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5" style={{ backgroundColor: `${item.color}12` }}>
                <item.icon className="w-6 h-6" style={{ color: item.color }} />
              </div>
              <h3 className="font-heading font-bold text-text-primary mb-2">{item.title}</h3>
              <p className="text-text-secondary text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Form */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-2xl mx-auto">
          <div className="card-base p-8 md:p-10">
            <h2 className="text-2xl font-bold font-heading mb-8 text-center"><span className="gradient-text">Send Us a Proposal</span></h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">First Name *</label>
                  <input type="text" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className="input-premium" id="partner-firstname" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Last Name *</label>
                  <input type="text" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className="input-premium" id="partner-lastname" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Email *</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-premium" id="partner-email" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Company</label>
                <input type="text" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="input-premium" id="partner-company" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Opting For *</label>
                <div className="flex gap-4">
                  {['Sponsorship', 'Collaborator'].map((opt) => (
                    <button key={opt} type="button" onClick={() => setForm({ ...form, optingFor: opt })} className={`flex-1 py-3 rounded-xl text-sm font-medium border transition-all duration-300 ${form.optingFor === opt ? 'border-accent-primary bg-accent-primary/10 text-accent-primary' : 'border-border text-text-secondary hover:border-accent-primary/50'}`}>{opt}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Message *</label>
                <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows="4" className="input-premium resize-none" id="partner-message" />
              </div>
              <button type="submit" disabled={submitting} className="w-full gradient-btn text-white font-semibold py-3.5 rounded-xl disabled:opacity-50 text-base">
                {submitting ? 'Sending...' : 'Submit Proposal'}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Partnership;
