import { Phone, Mail, MapPin, Clock, Linkedin } from 'lucide-react';
import { SEOHead } from '@/components/seo/SEOHead';
import { ContactForm } from '@/components/sections/ContactForm';
import { buildWebPageSchema } from '@/components/seo/schemas';
import { SEO_DATA } from '@/data/seo';
import { SITE } from '@/lib/constants';

const PAGE = SEO_DATA.contact;

const contactInfo = [
  { icon: <Phone size={20} />, label: 'Phone', value: SITE.phone, href: `tel:${SITE.phone}` },
  { icon: <Mail size={20} />, label: 'Email', value: SITE.email, href: `mailto:${SITE.email}` },
  { icon: <MapPin size={20} />, label: 'Address', value: SITE.address, href: undefined as string | undefined },
  { icon: <Clock size={20} />, label: 'Hours', value: 'Mon–Fri, 08:00–18:00 GMT', href: undefined as string | undefined },
];

export default function Contact() {
  return (
    <>
      <SEOHead
        title={PAGE.title}
        description={PAGE.description}
        canonical={PAGE.canonical}
        schema={buildWebPageSchema({ name: PAGE.title, description: PAGE.description, url: PAGE.canonical })}
      />

      {/* Page Header */}
      <section className="bg-gradient-to-br from-[var(--color-primary-800)] to-[var(--color-secondary-700)] text-white pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent-400 mb-4">Let's Talk</p>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-6">{PAGE.h1}</h1>
          <p className="text-white/70 text-xl leading-relaxed max-w-2xl mx-auto">
            Whether you're looking to hire or find your next role, our consultants are ready to help.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
            {/* Contact Info */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="font-heading text-2xl font-bold text-[var(--color-brand-text)] mb-2">Contact Details</h2>
                <p className="text-[var(--color-brand-text-muted)]">Reach our consultants directly or fill in the form and we'll be in touch within one business day.</p>
              </div>

              <ul className="space-y-5">
                {contactInfo.map((item) => (
                  <li key={item.label} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-secondary-50 flex items-center justify-center text-secondary-600 flex-shrink-0" aria-hidden="true">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-brand-text-muted)] mb-0.5">{item.label}</p>
                      {item.href ? (
                        <a href={item.href} className="text-[var(--color-brand-text)] font-medium hover:text-secondary-600 transition-colors">
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-[var(--color-brand-text)] font-medium">{item.value}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>

              <div className="pt-6 border-t border-[var(--color-brand-border)]">
                <p className="text-sm font-semibold text-[var(--color-brand-text)] mb-3">Connect with us</p>
                <a
                  href={SITE.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="SkaloRecruit on LinkedIn (opens in new tab)"
                  className="inline-flex items-center gap-2 text-[var(--color-brand-text-muted)] hover:text-secondary-600 transition-colors"
                >
                  <Linkedin size={20} />
                  <span className="text-sm">Follow us on LinkedIn</span>
                </a>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-3">
              <div className="bg-[var(--color-brand-surface)] p-8 rounded-2xl border border-[var(--color-brand-border)]">
                <h2 className="font-heading text-xl font-bold text-[var(--color-brand-text)] mb-6">Send Us a Message</h2>
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
