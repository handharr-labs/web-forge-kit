'use client';

import type { ParticipantStatus } from './manage-participant-card';

interface PublicParticipantCardProps {
  name: string;
  formattedAmount: string;
  isCreator: boolean;
  creatorBadgeLabel: string;
  status: ParticipantStatus;
  statusText?: Partial<Record<ParticipantStatus, string>>;
  selectSelfLabel?: string;
  email?: string;
  onSelectSelf?: () => void;
  children?: React.ReactNode;
}

const DEFAULT_STATUS_TEXT: Record<ParticipantStatus, string> = {
  pending: '',
  proof_uploaded: 'Proof submitted — awaiting approval',
  approved: 'Paid',
  rejected: 'Proof rejected — contact the creator',
};

export function PublicParticipantCard({
  name,
  formattedAmount,
  isCreator,
  creatorBadgeLabel,
  status,
  statusText,
  selectSelfLabel,
  email,
  onSelectSelf,
  children,
}: PublicParticipantCardProps) {
  const texts = { ...DEFAULT_STATUS_TEXT, ...statusText };

  if (isCreator) {
    return (
      <div className="rounded-xl ring-1 ring-green-500/20 bg-green-500/10 p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-semibold flex items-center gap-2 text-green-500 dark:text-green-400">
              {name}
              <span className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-medium">
                {creatorBadgeLabel}
              </span>
            </p>
            {email && <p className="text-xs text-muted-foreground">{email}</p>}
            <p className="text-sm font-medium text-green-500 dark:text-green-400">
              {formattedAmount}
            </p>
          </div>
          <span className="text-xs font-medium text-green-500 dark:text-green-400">{texts.approved}</span>
        </div>
        {children && <div>{children}</div>}
      </div>
    );
  }

  if (status === 'pending') {
    return (
      <div className="rounded-xl ring-1 ring-border p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-semibold capitalize">{name}</p>
            {email && <p className="text-xs text-muted-foreground">{email}</p>}
            <p className="text-sm font-medium">{formattedAmount}</p>
          </div>
          {onSelectSelf && (
            <button
              onClick={onSelectSelf}
              className="text-sm font-medium px-3 py-1.5 rounded-lg border border-border hover:bg-accent transition-colors min-h-[44px] flex items-center"
            >
              {selectSelfLabel ?? `I'm ${name}`}
            </button>
          )}
        </div>
        {children && <div>{children}</div>}
      </div>
    );
  }

  if (status === 'proof_uploaded') {
    return (
      <div className="rounded-xl ring-1 ring-yellow-500/20 bg-yellow-500/10 p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-semibold capitalize">{name}</p>
            {email && <p className="text-xs text-muted-foreground">{email}</p>}
            <p className="text-sm font-medium">{formattedAmount}</p>
          </div>
          <span className="text-xs font-medium text-yellow-700 dark:text-yellow-400">
            {texts.proof_uploaded}
          </span>
        </div>
        {children && <div>{children}</div>}
      </div>
    );
  }

  if (status === 'approved') {
    return (
      <div className="rounded-xl ring-1 ring-green-500/20 bg-green-500/10 p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-semibold capitalize">{name}</p>
            {email && <p className="text-xs text-muted-foreground">{email}</p>}
            <p className="text-sm font-medium">{formattedAmount}</p>
          </div>
          <span className="text-xs font-medium text-green-700 dark:text-green-400">{texts.approved}</span>
        </div>
        {children && <div>{children}</div>}
      </div>
    );
  }

  return (
    <div className="rounded-xl ring-1 ring-red-500/20 bg-red-500/10 p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold capitalize">{name}</p>
          {email && <p className="text-xs text-muted-foreground">{email}</p>}
          <p className="text-sm font-medium">{formattedAmount}</p>
        </div>
        <span className="text-xs font-medium text-red-700 dark:text-red-400">
          {texts.rejected}
        </span>
      </div>
      {children && <div>{children}</div>}
    </div>
  );
}
