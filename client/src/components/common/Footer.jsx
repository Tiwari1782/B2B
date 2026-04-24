import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiGithub, FiLinkedin, FiTwitter, FiInstagram, FiYoutube, FiArrowUp } from 'react-icons/fi';
import api from '../../services/api';

const socialIcons = {
  social_github: FiGithub,
  social_linkedin: FiLinkedin,
  social_twitter: FiTwitter,
  social_instagram: FiInstagram,
  social_youtube: FiYoutube,
};

const Footer = () => {
  const [socials, setSocials] = useState({});

  useEffect(() => {
    api.get('/content/bulk?keys=social_github,social_linkedin,social_twitter,social_instagram,social_youtube')
      .then((res) => setSocials(res.data.data || {}))
      .catch(() => {});
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="border-t border-border/50 bg-bg-surface/30">
      <div className="section-container py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-3 mb-5 group">
              <img src="/logo.png" alt="Bug2Build" className="h-9 transition-transform duration-300 group-hover:scale-105" />
              <span className="font-heading text-lg font-bold gradient-text">Bug2Build</span>
            </Link>
            <p className="text-text-secondary text-sm leading-relaxed max-w-xs">
              Transforming bugs into builds, one project at a time. A vibrant tech community for developers, creators, and innovators.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold text-text-primary mb-5 text-sm tracking-wide uppercase">Quick Links</h4>
            <div className="space-y-3">
              {[
                { path: '/events', label: 'Events & Happenings' },
                { path: '/team', label: 'Our Team' },
                { path: '/contributors', label: 'Contributors' },
                { path: '/partnership', label: 'Partner With Us' },
                { path: '/contact', label: 'Contact' },
              ].map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="block text-sm text-text-secondary hover:text-accent-primary hover:translate-x-1 transition-all duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-heading font-semibold text-text-primary mb-5 text-sm tracking-wide uppercase">Connect With Us</h4>
            <div className="flex gap-3 flex-wrap">
              {Object.entries(socialIcons).map(([key, Icon]) => (
                socials[key] && (
                  <a
                    key={key}
                    href={socials[key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl border border-border hover:border-accent-primary hover:bg-accent-primary/10 hover:scale-110 transition-all duration-300"
                    aria-label={key.replace('social_', '')}
                  >
                    <Icon className="w-4 h-4 text-text-secondary" />
                  </a>
                )
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between mt-14 pt-8 border-t border-border/50">
          <p className="text-text-muted text-xs tracking-wide">&copy; {new Date().getFullYear()} Bug2Build. All rights reserved.</p>
          <button
            onClick={scrollToTop}
            className="mt-4 md:mt-0 p-2.5 rounded-full border border-border hover:border-accent-primary hover:bg-accent-primary/5 hover:-translate-y-1 transition-all duration-300"
            aria-label="Scroll to top"
          >
            <FiArrowUp className="w-4 h-4 text-text-secondary" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
