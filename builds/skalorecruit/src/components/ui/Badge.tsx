import { cn } from '@/lib/utils';

interface BadgeProps {
  variant?: 'primary' | 'secondary' | 'accent' | 'neutral' | 'success';
  children: React.ReactNode;
  className?: string;
}

const variantClasses = {
  primary:   'bg-secondary-100 text-secondary-700',
  secondary: 'bg-primary-100 text-primary-700',
  accent:    'bg-accent-100 text-accent-700',
  neutral:   'bg-gray-100 text-gray-700',
  success:   'bg-green-100 text-green-700',
};

export function Badge({ variant = 'primary', children, className }: BadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold',
      variantClasses[variant],
      className,
    )}>
      {children}
    </span>
  );
}
