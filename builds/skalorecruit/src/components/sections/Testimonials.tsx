import { useIntersection } from '@/hooks/useIntersection';
import { cn } from '@/lib/utils';
import { Quote } from 'lucide-react';

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
  initials: string;
}

interface TestimonialsProps {
  eyebrow?: string;
  heading: string;
  testimonials: Testimonial[];
}

export function Testimonials({ eyebrow, heading, testimonials }: TestimonialsProps) {
  const { ref, isVisible } = useIntersection();

  return (
    <section className="bg-[var(--color-brand-surface)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div
          ref={ref as React.RefObject<HTMLDivElement>}
          className={cn('text-center max-w-2xl mx-auto mb-16 transition-all duration-700', isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6')}
        >
          {eyebrow && <p className="text-sm font-semibold uppercase tracking-widest text-secondary-600 mb-3">{eyebrow}</p>}
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-[var(--color-brand-text)]">{heading}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className={cn(
                'bg-white p-8 rounded-xl shadow-[var(--shadow-card)] relative transition-all duration-700',
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6',
              )}
              style={{ transitionDelay: `${i * 150 + 200}ms` }}
            >
              <Quote className="text-secondary-200 mb-4" size={32} aria-hidden="true" />
              <p className="text-[var(--color-brand-text-muted)] leading-relaxed mb-6 italic">"{t.quote}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-secondary-600 to-primary-800 flex items-center justify-center text-white font-bold text-sm font-heading flex-shrink-0">
                  {t.initials}
                </div>
                <div>
                  <p className="font-semibold text-[var(--color-brand-text)] text-sm">{t.author}</p>
                  <p className="text-[var(--color-brand-text-muted)] text-xs">{t.role}, {t.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
