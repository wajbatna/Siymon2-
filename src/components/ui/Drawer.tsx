import { useEffect, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/utils/cn';

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  side?: 'right' | 'left';
  width?: string;
}

export function Drawer({ open, onClose, title, children, footer, side = 'right', width = 'max-w-md' }: DrawerProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <div className={cn('fixed inset-0 z-[70]', !open && 'pointer-events-none')} aria-hidden={!open}>
      <div
        className={cn('absolute inset-0 bg-brand-navy/55 backdrop-blur-sm transition-opacity duration-300', open ? 'opacity-100' : 'opacity-0')}
        onClick={onClose}
      />
      <aside
        role="dialog"
        aria-modal="true"
        className={cn(
          'absolute top-0 bottom-0 w-full bg-white shadow-lift flex flex-col transition-transform duration-300 ease-out',
          width,
          side === 'right' ? 'right-0' : 'left-0',
          open ? 'translate-x-0' : side === 'right' ? 'translate-x-full' : '-translate-x-full',
        )}
      >
        <div className="flex items-center justify-between px-5 h-16 border-b border-brand-ink/8 shrink-0">
          <h2 className="font-display text-lg font-bold text-brand-ink">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close panel"
            className="p-2 rounded-xl text-brand-muted hover:bg-brand-ink/5 hover:text-brand-ink transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">{children}</div>
        {footer && <div className="border-t border-brand-ink/8 p-5 shrink-0 bg-brand-cream/60">{footer}</div>}
      </aside>
    </div>
  );
}
