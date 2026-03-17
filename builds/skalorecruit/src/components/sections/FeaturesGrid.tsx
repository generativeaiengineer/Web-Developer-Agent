import { useIntersection } from '@/hooks/useIntersection';
import { cn } from '@/lib/utils';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface FeaturesGridProps {
  eyebrow?: string;
  heading: string;
  subheading?: string;
  features: Feature[];
  columns?: 2 | 3 | 4;
  background?: 'white' | 'surface';
}

export function FeaturesGrid({ eyebrow, heading, subheading, features, columns = 3, background = 'white' }: FeaturesGridProps) {
  const { ref, isVisible } = useIntersection();

  const colClasses: Record<2 | 3 | 4, string> = {
    2: 'sm:grid-cols-2',
    3: 'sm:grid-cols-2 lg:grid-cols-3',
    4: 'sm:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <section className={background === 'surface' ? 'bg-[var(--color-brand-surface)]' : 'bg-white'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div
          ref={ref as React.RefObject<HTMLDivElement>}
          className={cn('text-center max-w-3xl mx-auto mb-16 transition-all duration-700', isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6')}
        >
          {eyebrow && (
            <p className="text-sm font-semibold uppercase tracking-widest text-secondary-600 mb-3">{eyebrow}</p>
          )}
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-[var(--color-brand-text)] mb-4">{heading}</h2>
          {subheading && <p className="text-[var(--color-brand-text-muted)] text-lg leading-relaxed">{subheading}</p>}
        </div>

        <ul className={cn('grid grid-cols-1 gap-8', colClasses[columns])}>
          {features.map((feature, i) => (
            <li
              key={i}
              className={cn(
                'p-6 rounded-xl border border-[var(--color-brand-border)] bg-white hover:shadow-[var(--shadow-card)] transition-all duration-300',
                'transition-all duration-700',
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6',
              )}
              style={{ transitionDelay: `${i * 100 + 200}ms` }}
            >
              <div className="w-12 h-12 rounded-xl bg-secondary-50 flex items-center justify-center mb-4 text-secondary-600" aria-hidden="true">
                {feature.icon}
              </div>
              <h3 className="font-heading text-lg font-semibold text-[var(--color-brand-text)] mb-2">{feature.title}</h3>
              <p className="text-[var(--color-brand-text-muted)] leading-relaxed text-sm">{feature.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
