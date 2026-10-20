import { AlertCircle, CheckCircle2, Info, X, XCircle } from 'lucide-react';
import { useToastStore, type ToastKind } from '@/store/useToastStore';
import { cn } from '@/utils/cn';

const icons: Record<ToastKind, typeof Info> = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
  warning: AlertCircle,
};

const colors: Record<ToastKind, string> = {
  success: 'text-success',
  error: 'text-danger',
  info: 'text-info',
  warning: 'text-warning',
};

export function ToastHost() {
  const { toasts, dismiss } = useToastStore();
  return (
    <div className="fixed z-[95] bottom-24 md:bottom-6 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:right-6 flex flex-col gap-2 w-[calc(100%-2rem)] max-w-sm pointer-events-none">
      {toasts.map((t) => {
        const Icon = icons[t.kind];
        return (
          <div
            key={t.id}
            role="status"
            className="pointer-events-auto flex items-start gap-3 bg-brand-navy text-white rounded-2xl px-4 py-3 shadow-lift animate-slide-up"
          >
            <Icon className={cn('w-5 h-5 shrink-0 mt-0.5', colors[t.kind])} aria-hidden />
            <p className="text-sm font-medium flex-1 leading-snug">{t.message}</p>
            <button
              onClick={() => dismiss(t.id)}
              aria-label="Dismiss notification"
              className="text-white/60 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
