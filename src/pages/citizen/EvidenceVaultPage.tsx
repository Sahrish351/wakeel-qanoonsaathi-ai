import React from 'react';
import { EmptyState } from '@/components/states/EmptyState';
import { ShieldCheck } from 'lucide-react';

export default function EvidenceVaultPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl text-[var(--color-text-primary)]">Evidence Vault</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
          Secure, encrypted storage for your legal documents, receipts, and exhibits.
        </p>
      </div>
      <EmptyState
        icon={ShieldCheck}
        title="Evidence vault is empty"
        description="Store and organize court summons, deeds, agreements, and photographic evidence securely."
      />
    </div>
  );
}
