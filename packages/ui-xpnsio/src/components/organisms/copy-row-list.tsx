import { CopyRow } from './copy-row';

interface PaymentAccount {
  id: string;
  bankName: string;
  accountNumber: string;
}

interface CopyRowListProps {
  label?: string;
  accounts: PaymentAccount[];
}

export function CopyRowList({ label = 'Payment accounts', accounts }: CopyRowListProps) {
  return (
    <div>
      <p className="text-sm font-medium text-muted-foreground mb-2">{label}</p>
      <div className="rounded-2xl bg-muted/50 ring-1 ring-border divide-y divide-border overflow-hidden">
        {accounts.map((acc) => (
          <CopyRow
            key={acc.id}
            id={acc.id}
            bankName={acc.bankName}
            accountNumber={acc.accountNumber}
          />
        ))}
      </div>
    </div>
  );
}
