'use client';

import { ImageIcon } from 'lucide-react';
import { Button } from '../atoms/button';

export type StatusVariant = 'default' | 'success' | 'warning' | 'danger';

const VARIANT_STYLES: Record<StatusVariant, { card: string; text: string }> = {
  default: { card: 'ring-border', text: '' },
  success: { card: 'ring-green-500/20 bg-green-500/10', text: 'text-green-700 dark:text-green-400' },
  warning: { card: 'ring-yellow-500/20 bg-yellow-500/10', text: 'text-yellow-700 dark:text-yellow-400' },
  danger: { card: 'ring-red-500/20 bg-red-500/10', text: 'text-red-700 dark:text-red-400' },
};

const STATUS_BADGE_STYLES: Record<StatusVariant, string> = {
  default: 'bg-muted text-muted-foreground',
  success: 'bg-green-500/10 text-green-700 dark:text-green-400',
  warning: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400',
  danger: 'bg-red-500/10 text-red-700 dark:text-red-400',
};

interface StatusCardProps {
  name: string;
  formattedAmount: string;
  variant?: StatusVariant;
  statusLabel?: string;
  badge?: string;
  email?: string;
  imageUrl?: string | null;
  onViewImage?: () => void;
  viewImageLabel?: string;
  approveLabel?: string;
  rejectLabel?: string;
  isUpdating?: boolean;
  onApprove?: () => void;
  onReject?: () => void;
  actionButton?: { label: string; onClick: () => void };
  children?: React.ReactNode;
}

export function StatusCard({
  name,
  formattedAmount,
  variant = 'default',
  statusLabel,
  badge,
  email,
  imageUrl,
  onViewImage,
  viewImageLabel = 'View proof',
  approveLabel = 'Approve',
  rejectLabel = 'Reject',
  isUpdating = false,
  onApprove,
  onReject,
  actionButton,
  children,
}: StatusCardProps) {
  const styles = VARIANT_STYLES[variant];

  return (
    <div className={`rounded-xl ring-1 p-4 space-y-3 ${styles.card}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className={`font-semibold flex items-center gap-2 capitalize ${variant === 'success' ? styles.text : ''}`}>
            {name}
            {badge && (
              <span className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-medium">
                {badge}
              </span>
            )}
          </p>
          {email && <p className="text-xs text-muted-foreground">{email}</p>}
          <p className={`text-sm font-medium ${variant === 'default' ? 'text-primary' : styles.text}`}>
            {formattedAmount}
          </p>
        </div>
        {statusLabel && (
          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_BADGE_STYLES[variant]}`}>
            {statusLabel}
          </span>
        )}
        {actionButton && (
          <button
            onClick={actionButton.onClick}
            className="text-sm font-medium px-3 py-1.5 rounded-lg border border-border hover:bg-accent transition-colors min-h-[44px] flex items-center"
          >
            {actionButton.label}
          </button>
        )}
      </div>

      {imageUrl && onViewImage && (
        <button
          onClick={onViewImage}
          className="flex items-center gap-2 text-sm text-primary hover:underline"
        >
          <ImageIcon className="w-4 h-4" /> {viewImageLabel}
        </button>
      )}

      {onApprove && onReject && (
        <div className="flex gap-2">
          <Button
            size="sm"
            className="flex-1 rounded-xl bg-green-500/15 text-green-700 dark:text-green-400 hover:bg-green-500/25"
            disabled={isUpdating}
            onClick={onApprove}
          >
            {approveLabel}
          </Button>
          <Button
            size="sm"
            className="flex-1 rounded-xl bg-red-500/15 text-red-700 dark:text-red-400 hover:bg-red-500/25"
            disabled={isUpdating}
            onClick={onReject}
          >
            {rejectLabel}
          </Button>
        </div>
      )}

      {children && <div>{children}</div>}
    </div>
  );
}
