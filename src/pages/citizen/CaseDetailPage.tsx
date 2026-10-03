import React from 'react';
import { EmptyState } from '@/components/states/EmptyState';
import { FileText } from 'lucide-react';

export default function CaseDetailPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl text-[var(--color-text-primary)]">Case Details</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
          View case overview, associated legal acts, documents, and status.
        </p>
      </div>
      <EmptyState
        icon={FileText}
        title="No case selected"
        description="Select a case from your cases list or create a new one to view detailed case information."
      />
    </div>
  );
}
