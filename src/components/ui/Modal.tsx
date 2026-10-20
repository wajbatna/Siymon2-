import { useEffect, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/utils/cn';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizes = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };

export function Modal({ open, onClose, title, children, footer, size = 'md' }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-0 sm:p-6" role="dialog" aria-modal="true">
      <button
        aria-label="Close dialog"
        className="absolute inset-0 bg-brand-navy/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div
        className={cn(
          'relative w-full bg-white rounded-t-3xl sm:rounded-3xl shadow-lift animate-slide-up sm:animate-scale-in max-h-[92vh] flex flex-col',
          sizes[size],
        )}
      >
        <div className="flex items-center justify-between gap-4 px-6 pt-5 pb-4 border-b border-brand-ink/8">
          <h2 className="font-display text-lg font-bold text-brand-ink">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-2 rounded-xl text-brand-muted hover:bg-brand-ink/5 hover:text-brand-ink transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="px-6 py-5 overflow-y-auto">{children}</div>
        {footer && <div className="px-6 py-4 border-t border-brand-ink/8 flex justify-end gap-3">{footer}</div>}
      </div>
    </div>
  );
}

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: ReactNode;
  confirmLabel?: string;
  danger?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  danger = false,
  loading = false,
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <div className="text-sm text-brand-muted leading-relaxed">{message}</div>
      <div className="mt-6 flex gap-3 justify-end">
        <button
          onClick={onClose}
          className="h-10 px-4 rounded-xl text-sm font-semibold text-brand-ink hover:bg-brand-ink/5 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className={cn(
            'h-10 px-5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-60',
            danger ? 'bg-danger hover:brightness-110' : 'bg-brand-gradient shadow-glow',
          )}
        >
          {loading ? 'Working…' : confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
