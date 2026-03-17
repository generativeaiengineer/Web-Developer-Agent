import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint: _hint, id, className, required, rows = 4, ...props }, ref) => {
    const inputId = id ?? `textarea-${label?.toLowerCase().replace(/\s+/g, '-')}`;
    const errorId = error ? `${inputId}-error` : undefined;
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-[var(--color-brand-text)]">
            {label}{required && <span className="text-red-500 ml-1" aria-hidden="true">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          rows={rows}
          required={required}
          aria-required={required}
          aria-invalid={!!error}
          aria-describedby={errorId}
          className={cn(
            'w-full rounded-lg border border-[var(--color-brand-border)] bg-white px-3 py-2 text-[var(--color-brand-text)] resize-none',
            'placeholder:text-[var(--color-brand-text-muted)]',
            'focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent',
            error && 'border-red-500 focus:ring-red-500',
            className,
          )}
          {...props}
        />
        {error && <p id={errorId} className="text-xs text-red-600" role="alert">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';
