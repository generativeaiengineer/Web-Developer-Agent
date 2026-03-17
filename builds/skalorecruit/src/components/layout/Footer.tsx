import { Link } from 'react-router-dom';
import { Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { SITE } from '@/lib/constants';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer role="contentinfo" className="bg-[var(--color-brand-text)] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-secondary-600 to-secondary-400 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm font-heading">SR</span>
              </div>
              <span className="text-xl font-bold font-heading">{SITE.name}</span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              Premium recruitment connecting exceptional talent with leading employers across finance, technology, and professional services.
            </p>
            {SITE.social.linkedin && (
              <a
                href={SITE.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="SkaloRecruit on LinkedIn (opens in new tab)"
                className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors"
              >
                <Linkedin size={20} />
                <span className="text-sm">LinkedIn</span>
              </a>
            )}
          </div>

          {/* Services */}
          <div>
            <h3 className="font-heading font-semibold text-sm uppercase tracking-widest text-white/40 mb-4">Services</h3>
            <ul className="space-y-3">
              {[
                { label: 'For Employers', href: '/services' },
                { label: 'For Candidates', href: '/candidates' },
                { label: 'Executive Search', href: '/services' },
                { label: 'Contract Staffing', href: '/services' },
                { label: 'Browse Jobs', href: '/jobs' },
              ].map((item) => (
                <li key={item.href + item.label}>
                  <Link to={item.href} className="text-white/60 hover:text-white transition-colors text-sm">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-heading font-semibold text-sm uppercase tracking-widest text-white/40 mb-4">Company</h3>
            <ul className="space-y-3">
              {[
                { label: 'About Us', href: '/about' },
                { label: 'Industries', href: '/industries' },
                { label: 'Blog & Resources', href: '/blog' },
                { label: 'Contact', href: '/contact' },
              ].map((item) => (
                <li key={item.href}>
                  <Link to={item.href} className="text-white/60 hover:text-white transition-colors text-sm">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading font-semibold text-sm uppercase tracking-widest text-white/40 mb-4">Contact</h3>
            <ul className="space-y-3">
              <li>
                <a href={`tel:${SITE.phone}`} className="flex items-start gap-2 text-white/60 hover:text-white transition-colors text-sm">
                  <Phone size={16} className="mt-0.5 flex-shrink-0" />
                  {SITE.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${SITE.email}`} className="flex items-start gap-2 text-white/60 hover:text-white transition-colors text-sm">
                  <Mail size={16} className="mt-0.5 flex-shrink-0" />
                  {SITE.email}
                </a>
              </li>
              <li>
                <address className="flex items-start gap-2 text-white/60 text-sm not-italic">
                  <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                  {SITE.address}
                </address>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-sm">
            © {year} {SITE.name}. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to="/privacy-policy" className="text-white/40 hover:text-white/60 text-sm transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-white/40 hover:text-white/60 text-sm transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
