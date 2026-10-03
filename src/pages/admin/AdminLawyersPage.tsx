import React from 'react';
import { EmptyState } from '@/components/states/EmptyState';
import { UserCheck } from 'lucide-react';

export default function AdminLawyersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl text-[var(--color-text-primary)]">Advocate Verifications</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
          Review Pakistan Bar Council credentials, high court enrollment documents, and advocate approvals.
        </p>
      </div>
      <EmptyState
        icon={UserCheck}
        title="Verification queue clear"
        description="No pending advocate verification applications at this time."
      />
    </div>
  );
}
