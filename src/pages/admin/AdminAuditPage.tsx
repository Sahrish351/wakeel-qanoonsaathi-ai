import React from 'react';
import { EmptyState } from '@/components/states/EmptyState';
import { FileCheck } from 'lucide-react';

export default function AdminAuditPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl text-[var(--color-text-primary)]">Audit Logs & Security</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
          Review security event trails, access logs, and compliance records.
        </p>
      </div>
      <EmptyState
        icon={FileCheck}
        title="Audit log trail"
        description="System compliance events and authentication logs are captured here."
      />
    </div>
  );
}
