import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useIntersection } from '@/hooks/useIntersection';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

interface CTABlockProps {
  heading: string;
  subheading?: string;
  primaryCTA: { text: string; href: string };
  secondaryCTA?: { text: string; href: string };
  background?: 'primary' | 'gradient' | 'dark' | 'accent';
}

export function CTABlock({ heading, subheading, primaryCTA, secondaryCTA, background = 'gradient' }: CTABlockProps) {
  const { ref, isVisible } = useIntersection();

  const bgClasses: Record<string, string> = {
    primary:  'bg-[var(--color-primary-800)] text-white',
    gradient: 'bg-gradient-to-br from-[var(--color-primary-800)] to-[var(--color-secondary-700)] text-white',
    dark:     'bg-gray-900 text-white',
    accent:   'bg-accent-500 text-white',
  };

  return (
    <section className={bgClasses[background]}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-center">
        <div
          ref={ref as React.RefObject<HTMLDivElement>}
          className={cn('transition-all duration-700', isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6')}
        >
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">{heading}</h2>
          {subheading && (
            <p className="text-white/70 text-lg leading-relaxed max-w-2xl mx-auto mb-10">{subheading}</p>
          )}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={primaryCTA.href}>
              <Button
                variant="accent"
                size="lg"
                rightIcon={<ArrowRight size={20} />}
                className="w-full sm:w-auto"
              >
                {primaryCTA.text}
              </Button>
            </Link>
            {secondaryCTA && (
              <Link to={secondaryCTA.href}>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white/40 text-white hover:bg-white/10 w-full sm:w-auto"
                >
                  {secondaryCTA.text}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
