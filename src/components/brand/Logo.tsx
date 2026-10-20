import { cn } from '@/utils/cn';

/** Distinct SIYMON brand mark (original design — not copied from any reference). */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={cn('w-9 h-9', className)} aria-hidden>
      <defs>
        <linearGradient id="siymon-logo-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8F6BFF" />
          <stop offset="60%" stopColor="#7650E8" />
          <stop offset="100%" stopColor="#5B3AC4" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="44" height="44" rx="14" fill="url(#siymon-logo-g)" />
      <path
        d="M31 15c-4.5-3.4-13-2.6-13 3.2 0 6.6 13.5 4.6 13.5 11.4 0 6-8.6 7.4-13.5 3.6"
        fill="none"
        stroke="#FFF9ED"
        strokeWidth="4.2"
        strokeLinecap="round"
      />
      <circle cx="35.5" cy="12.5" r="3.4" fill="#FFD889" />
    </svg>
  );
}

export function Logo({ dark = false, className }: { dark?: boolean; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <LogoMark />
      <span className={cn('font-display text-xl font-extrabold tracking-tight', dark ? 'text-white' : 'text-brand-ink')}>
        SIY<span className="text-brand-purple">MON</span>
      </span>
    </span>
  );
}
