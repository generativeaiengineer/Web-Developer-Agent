import { cn } from '@/lib/utils';

interface CardProps {
  variant?: 'default' | 'bordered' | 'flat' | 'interactive';
  image?: { src: string; alt: string };
  eyebrow?: string;
  title: string;
  description?: string;
  cta?: { text: string; href: string };
  children?: React.ReactNode;
  className?: string;
}

const variantClasses = {
  default:     'bg-white shadow-[var(--shadow-card)] rounded-xl',
  bordered:    'bg-white border border-[var(--color-brand-border)] rounded-xl',
  flat:        'bg-[var(--color-brand-surface)] rounded-xl',
  interactive: 'bg-white shadow-[var(--shadow-card)] rounded-xl hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)] transition-all duration-300 cursor-pointer',
};

export function Card({ variant = 'default', image, eyebrow, title, description, cta, children, className }: CardProps) {
  return (
    <div className={cn('overflow-hidden', variantClasses[variant], className)}>
      {image && (
        <div className="aspect-video overflow-hidden">
          <img
            src={image.src}
            alt={image.alt}
            loading="lazy"
            width={800}
            height={450}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>
      )}
      <div className="p-6">
        {eyebrow && (
          <p className="text-sm font-semibold uppercase tracking-widest text-secondary-600 mb-2">{eyebrow}</p>
        )}
        <h3 className="font-heading text-xl font-semibold text-[var(--color-brand-text)] mb-2">{title}</h3>
        {description && <p className="text-[var(--color-brand-text-muted)] leading-relaxed">{description}</p>}
        {children}
        {cta && (
          <a href={cta.href} className="inline-flex items-center mt-4 text-secondary-600 font-medium hover:text-secondary-700 transition-colors">
            {cta.text}
            <span className="ml-1" aria-hidden="true">→</span>
          </a>
        )}
      </div>
    </div>
  );
}
