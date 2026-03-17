import { useIntersection } from '@/hooks/useIntersection';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ServiceCard {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
  href: string;
  accent?: boolean;
}

interface ServiceCardsProps {
  eyebrow?: string;
  heading: string;
  subheading?: string;
  services: ServiceCard[];
}

export function ServiceCards({ eyebrow, heading, subheading, services }: ServiceCardsProps) {
  const { ref, isVisible } = useIntersection();

  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div
          ref={ref as React.RefObject<HTMLDivElement>}
          className={cn('text-center max-w-3xl mx-auto mb-16 transition-all duration-700', isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6')}
        >
          {eyebrow && <p className="text-sm font-semibold uppercase tracking-widest text-secondary-600 mb-3">{eyebrow}</p>}
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-[var(--color-brand-text)] mb-4">{heading}</h2>
          {subheading && <p className="text-[var(--color-brand-text-muted)] text-lg leading-relaxed">{subheading}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, i) => (
            <div
              key={i}
              className={cn(
                'relative p-8 rounded-2xl border transition-all duration-300 group',
                service.accent
                  ? 'bg-gradient-to-br from-[var(--color-primary-800)] to-[var(--color-secondary-700)] text-white border-transparent'
                  : 'bg-white border-[var(--color-brand-border)] hover:border-secondary-300 hover:shadow-[var(--shadow-card-hover)]',
                'transition-all duration-700',
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6',
              )}
              style={{ transitionDelay: `${i * 100 + 200}ms` }}
            >
              <div
                className={cn(
                  'w-14 h-14 rounded-xl flex items-center justify-center mb-6',
                  service.accent ? 'bg-white/20' : 'bg-secondary-50 text-secondary-600',
                )}
                aria-hidden="true"
              >
                {service.icon}
              </div>
              <h3 className={cn('font-heading text-xl font-semibold mb-3', service.accent ? 'text-white' : 'text-[var(--color-brand-text)]')}>{service.title}</h3>
              <p className={cn('text-sm leading-relaxed mb-6', service.accent ? 'text-white/70' : 'text-[var(--color-brand-text-muted)]')}>{service.description}</p>
              <ul className="space-y-2 mb-8">
                {service.features.map((f, fi) => (
                  <li key={fi} className={cn('flex items-center gap-2 text-sm', service.accent ? 'text-white/80' : 'text-[var(--color-brand-text-muted)]')}>
                    <span className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', service.accent ? 'bg-accent-400' : 'bg-secondary-600')} aria-hidden="true" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                to={service.href}
                className={cn(
                  'inline-flex items-center gap-2 text-sm font-semibold transition-all group-hover:gap-3',
                  service.accent ? 'text-accent-300 hover:text-accent-200' : 'text-secondary-600 hover:text-secondary-700',
                )}
              >
                Learn more <ArrowRight size={16} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
