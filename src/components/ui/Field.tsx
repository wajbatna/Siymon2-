import { forwardRef, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

interface WrapProps {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
  htmlFor?: string;
}

export function Field({ label, error, hint, required, children, htmlFor }: WrapProps) {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={htmlFor} className="block mb-1.5 text-sm font-semibold text-brand-ink">
          {label}
          {required && <span className="text-danger ml-0.5">*</span>}
        </label>
      )}
      {children}
      {error ? (
        <p className="mt-1.5 text-xs font-medium text-danger" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-brand-muted">{hint}</p>
      ) : null}
    </div>
  );
}

const baseControl =
  'w-full rounded-2xl border-2 bg-white px-4 text-sm text-brand-ink placeholder:text-brand-muted/70 transition-colors focus:outline-none focus:border-brand-purple disabled:opacity-60 disabled:bg-brand-ink/5';

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }>(
  function Input({ className, invalid, ...rest }, ref) {
    return (
      <input
        ref={ref}
        aria-invalid={invalid || undefined}
        className={cn(baseControl, 'h-11', invalid ? 'border-danger/70' : 'border-brand-ink/10', className)}
        {...rest}
      />
    );
  },
);

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean }>(
  function Textarea({ className, invalid, rows = 3, ...rest }, ref) {
    return (
      <textarea
        ref={ref}
        rows={rows}
        aria-invalid={invalid || undefined}
        className={cn(baseControl, 'py-3 resize-y', invalid ? 'border-danger/70' : 'border-brand-ink/10', className)}
        {...rest}
      />
    );
  },
);

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement> & { invalid?: boolean }>(
  function Select({ className, invalid, children, ...rest }, ref) {
    return (
      <select
        ref={ref}
        aria-invalid={invalid || undefined}
        className={cn(baseControl, 'h-11 pr-8 appearance-none bg-[url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2716%27 height=%2716%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%23777389%27 stroke-width=%272%27%3E%3Cpath d=%27m6 9 6 6 6-6%27/%3E%3C/svg%3E")] bg-[position:right_0.75rem_center] bg-no-repeat', invalid ? 'border-danger/70' : 'border-brand-ink/10', className)}
        {...rest}
      >
        {children}
      </select>
    );
  },
);

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple/60',
        checked ? 'bg-brand-purple' : 'bg-brand-ink/20',
      )}
    >
      <span
        className={cn(
          'inline-block transform rounded-full bg-white shadow transition-transform',
          checked ? 'translate-x-[1.4rem]' : 'translate-x-1',
        )}
        style={{ height: '1.125rem', width: '1.125rem' }}
      />
    </button>
  );
}
