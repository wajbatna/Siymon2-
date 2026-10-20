import type { ReactNode } from 'react';
import type { OrderStatus, PaymentStatus } from '@/types';
import { cn } from '@/utils/cn';

type Tone = 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'neutral';

const tones: Record<Tone, string> = {
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/15 text-[#B26A00]',
  danger: 'bg-danger/10 text-danger',
  info: 'bg-info/10 text-info',
  purple: 'bg-brand-purple/10 text-brand-purple',
  neutral: 'bg-brand-ink/8 text-brand-muted',
};

export function Badge({ tone = 'neutral', children, className }: { tone?: Tone; children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export const ORDER_STATUS_META: Record<OrderStatus, { label: string; tone: Tone }> = {
  pending: { label: 'Pending', tone: 'warning' },
  confirmed: { label: 'Confirmed', tone: 'info' },
  preparing: { label: 'Preparing', tone: 'purple' },
  out_for_delivery: { label: 'Out for delivery', tone: 'info' },
  delivered: { label: 'Delivered', tone: 'success' },
  cancelled: { label: 'Cancelled', tone: 'danger' },
};

export const PAYMENT_STATUS_META: Record<PaymentStatus, { label: string; tone: Tone }> = {
  pending: { label: 'Payment pending', tone: 'warning' },
  paid: { label: 'Paid', tone: 'success' },
  refunded: { label: 'Refunded', tone: 'neutral' },
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  const meta = ORDER_STATUS_META[status];
  return <Badge tone={meta.tone}>{meta.label}</Badge>;
}

export function PaymentBadge({ status }: { status: PaymentStatus }) {
  const meta = PAYMENT_STATUS_META[status];
  return <Badge tone={meta.tone}>{meta.label}</Badge>;
}
