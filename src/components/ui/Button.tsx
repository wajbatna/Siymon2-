import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger' | 'dark' | 'soft';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  block?: boolean;
}

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-brand-gradient text-white shadow-glow hover:shadow-lift hover:brightness-110 active:scale-[0.98]',
  secondary:
    'bg-brand-yellow text-brand-ink hover:brightness-105 shadow-soft active:scale-[0.98]',
  ghost: 'text-brand-ink hover:bg-brand-ink/5',
  outline: 'border-2 border-brand-ink/10 text-brand-ink hover:border-brand-purple hover:text-brand-purple bg-white/60',
  danger: 'bg-danger text-white hover:brightness-110 shadow-soft',
  dark: 'bg-brand-navy text-white hover:bg-brand-deep shadow-soft',
  soft: 'bg-brand-purple/10 text-brand-purple hover:bg-brand-purple/20',
};

const sizes: Record<ButtonSize, string> = {
  sm: 'h-9 px-3.5 text-sm gap-1.5 rounded-xl',
  md: 'h-11 px-5 text-sm gap-2 rounded-2xl',
  lg: 'h-12 px-7 text-base gap-2.5 rounded-2xl',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', loading = false, block = false, className, children, disabled, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center font-semibold transition-all duration-200 select-none',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple/60 focus-visible:ring-offset-2',
        'disabled:opacity-55 disabled:pointer-events-none',
        variants[variant],
        sizes[size],
        block && 'w-full',
        className,
      )}
      {...rest}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" aria-hidden />}
      {children}
    </button>
  );
});
