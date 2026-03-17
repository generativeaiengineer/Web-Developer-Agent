import { useIntersection } from '@/hooks/useIntersection';
import { useCountUp } from '@/hooks/useCountUp';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';

interface Stat {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
}

interface StatsBarProps {
  stats: Stat[];
  background?: 'white' | 'surface' | 'primary';
}

function StatItem({ stat, triggerCount }: { stat: Stat; triggerCount: boolean }) {
  const { count, start } = useCountUp(stat.value, 2000);

  useEffect(() => {
    if (triggerCount) start();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerCount]);

  return (
    <div className="text-center">
      <div className="font-heading text-4xl lg:text-5xl font-bold text-secondary-600 mb-1">
        {stat.prefix}{count}{stat.suffix}
      </div>
      <div className="text-sm text-[var(--color-brand-text-muted)] font-medium">{stat.label}</div>
    </div>
  );
}

export function StatsBar({ stats, background = 'white' }: StatsBarProps) {
  const { ref, isVisible } = useIntersection();

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className={cn(
        'py-12 md:py-16 border-y border-[var(--color-brand-border)]',
        background === 'white' ? 'bg-white' : background === 'surface' ? 'bg-[var(--color-brand-surface)]' : 'bg-[var(--color-primary-800)] text-white',
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat, i) => (
            <StatItem key={i} stat={stat} triggerCount={isVisible} />
          ))}
        </div>
      </div>
    </section>
  );
}
