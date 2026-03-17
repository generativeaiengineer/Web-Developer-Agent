import { cn } from '@/lib/utils';

type Background = 'white' | 'surface' | 'primary' | 'dark' | 'gradient' | 'none';
type PaddingY   = 'sm' | 'md' | 'lg' | 'xl';
type MaxWidth   = 'sm' | 'md' | 'lg' | 'xl' | 'full';

interface SectionWrapperProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
  background?: Background;
  paddingY?: PaddingY;
  maxWidth?: MaxWidth;
}

const bgClasses: Record<Background, string> = {
  white:    'bg-white',
  surface:  'bg-[var(--color-brand-surface)]',
  primary:  'bg-[var(--color-primary-800)] text-white',
  dark:     'bg-[var(--color-brand-text)] text-white',
  gradient: 'bg-gradient-to-br from-[var(--color-primary-800)] to-[var(--color-secondary-700)] text-white',
  none:     '',
};

const pyClasses: Record<PaddingY, string> = {
  sm: 'py-8 md:py-12',
  md: 'py-12 md:py-16',
  lg: 'py-16 md:py-24',
  xl: 'py-24 md:py-32',
};

const mwClasses: Record<MaxWidth, string> = {
  sm:   'max-w-xl',
  md:   'max-w-3xl',
  lg:   'max-w-5xl',
  xl:   'max-w-7xl',
  full: 'max-w-full',
};

export function SectionWrapper({ children, id, className, background = 'white', paddingY = 'lg', maxWidth = 'xl' }: SectionWrapperProps) {
  return (
    <section id={id} className={cn(bgClasses[background], className)}>
      <div className={cn('mx-auto px-4 sm:px-6 lg:px-8', mwClasses[maxWidth], pyClasses[paddingY])}>
        {children}
      </div>
    </section>
  );
}
