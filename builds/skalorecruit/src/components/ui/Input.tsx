import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, id, className, required, ...props }, ref) => {
    const inputId = id ?? `input-${label?.toLowerCase().replace(/\s+/g, '-')}`;
    const errorId = error ? `${inputId}-error` : undefined;
    const hintId  = hint  ? `${inputId}-hint`  : undefined;
    const describedBy = [errorId, hintId].filter(Boolean).join(' ') || undefined;
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-[var(--color-brand-text)]">
            {label}{required && <span className="text-red-500 ml-1" aria-hidden="true">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          required={required}
          aria-required={required}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          className={cn(
            'h-10 w-full rounded-lg border border-[var(--color-brand-border)] bg-white px-3 text-[var(--color-brand-text)]',
            'placeholder:text-[var(--color-brand-text-muted)]',
            'focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent',
            'disabled:bg-[var(--color-brand-surface)] disabled:cursor-not-allowed disabled:opacity-60',
            error && 'border-red-500 focus:ring-red-500',
            className,
          )}
          {...props}
        />
        {hint  && <p id={hintId}  className="text-xs text-[var(--color-brand-text-muted)]">{hint}</p>}
        {error && <p id={errorId} className="text-xs text-red-600" role="alert">{error}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';
