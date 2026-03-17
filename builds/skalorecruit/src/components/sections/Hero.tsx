import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface HeroProps {
  eyebrow?: string;
  heading: string;
  headingAccent?: string;
  subheading?: string;
  primaryCTA: { text: string; href: string };
  secondaryCTA?: { text: string; href: string };
  showScrollIndicator?: boolean;
}

export function Hero({ eyebrow, heading, headingAccent, subheading, primaryCTA, secondaryCTA, showScrollIndicator }: HeroProps) {
  return (
    <section
      role="banner"
      className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-[var(--color-primary-800)] via-[var(--color-primary-700)] to-[var(--color-secondary-700)]"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-72 h-72 rounded-full bg-secondary-400 blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-accent-500 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-secondary-300 blur-2xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 lg:py-32">
        <div className="max-w-4xl mx-auto text-center">
          {eyebrow && (
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white/80 text-sm font-medium mb-8"
              style={{ animation: 'fadeIn 0.6s ease-out forwards' }}
            >
              <span className="w-2 h-2 rounded-full bg-accent-500 animate-pulse" />
              {eyebrow}
            </div>
          )}

          <h1
            className="font-heading text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight tracking-tight mb-6"
            style={{ animation: 'fadeUp 0.6s ease-out forwards' }}
          >
            {heading}
            {headingAccent && (
              <>
                {' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-400 to-accent-500">
                  {headingAccent}
                </span>
              </>
            )}
          </h1>

          {subheading && (
            <p
              className="text-lg sm:text-xl text-white/70 leading-relaxed max-w-2xl mx-auto mb-10"
              style={{ animation: 'fadeUp 0.6s ease-out 150ms forwards', opacity: 0 }}
            >
              {subheading}
            </p>
          )}

          <div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            style={{ animation: 'fadeUp 0.6s ease-out 300ms forwards', opacity: 0 }}
          >
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
                  className="border-white/40 text-white hover:bg-white/10 hover:border-white/60 w-full sm:w-auto"
                >
                  {secondaryCTA.text}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {showScrollIndicator && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40 flex flex-col items-center gap-2">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <ChevronDown size={20} className="animate-bounce" />
        </div>
      )}
    </section>
  );
}
