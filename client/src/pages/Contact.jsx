import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker } from 'react-icons/hi';
import { useToast } from '../components/common/ToastNotification';
import api from '../services/api';

const Contact = () => {
  const [content, setContent] = useState({});
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  useEffect(() => {
    api.get('/content/bulk?keys=contact_email,contact_phone,contact_address')
      .then((res) => setContent(res.data.data || {}))
      .catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.warning('Please fill in all required fields.', { title: 'Missing Fields' });
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/contact', form);
      toast.success('Message sent successfully!', { title: 'Message Sent' });
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send message.', { title: 'Error' });
    } finally {
      setSubmitting(false);
    }
  };

  const contactInfo = [
    { icon: HiOutlineMail, label: 'Email', value: content.contact_email || 'contact@bug2build.in', href: `mailto:${content.contact_email || 'contact@bug2build.in'}`, color: '#5B5FEF' },
    { icon: HiOutlinePhone, label: 'Phone', value: content.contact_phone || '+91 9876543210', href: `tel:${content.contact_phone || '+919876543210'}`, color: '#00C2FF' },
    { icon: HiOutlineLocationMarker, label: 'Address', value: content.contact_address || 'Greater Noida, UP, India', href: null, color: '#8B5CF6' },
  ];

  return (
    <div className="min-h-screen pt-28 pb-24">
      <div className="section-container">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold font-heading mb-5"><span className="gradient-text">Get In Touch</span></h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">Have a question or want to collaborate? We'd love to hear from you.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 max-w-5xl mx-auto">
          {/* Contact Info */}
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="lg:col-span-2 space-y-5">
            {contactInfo.map((item, i) => (
              <div key={i} className="card-base card-glow p-6 flex items-start gap-4 relative overflow-hidden group">
                <div className="absolute top-0 left-0 bottom-0 w-1 rounded-l-xl" style={{ background: item.color }} />
                <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${item.color}12` }}>
                  <item.icon className="w-5 h-5" style={{ color: item.color }} />
                </div>
                <div>
                  <p className="text-text-muted text-xs font-medium uppercase tracking-widest mb-1.5">{item.label}</p>
                  {item.href ? (
                    <a href={item.href} className="text-text-primary text-sm font-medium hover:text-accent-primary transition-colors duration-300">{item.value}</a>
                  ) : (
                    <p className="text-text-primary text-sm font-medium">{item.value}</p>
                  )}
                </div>
              </div>
            ))}
          </motion.div>

          {/* Contact Form */}
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="lg:col-span-3">
            <div className="card-base p-8 md:p-10">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">Name *</label>
                    <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-premium" id="contact-name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">Email *</label>
                    <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-premium" id="contact-email" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Subject</label>
                  <input type="text" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="input-premium" id="contact-subject" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Message *</label>
                  <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows="5" className="input-premium resize-none" id="contact-message" />
                </div>
                <button type="submit" disabled={submitting} className="w-full gradient-btn text-white font-semibold py-3.5 rounded-xl disabled:opacity-50 text-base">
                  {submitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
