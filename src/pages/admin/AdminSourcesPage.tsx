import React from 'react';
import { EmptyState } from '@/components/states/EmptyState';
import { Database } from 'lucide-react';

export default function AdminSourcesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl text-[var(--color-text-primary)]">Legal Knowledge Sources</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
          Manage statutory enactments, High Court and Supreme Court case law databases, and index updates.
        </p>
      </div>
      <EmptyState
        icon={Database}
        title="Legal source repository"
        description="Configure legal knowledge indexing pipelines, statutory revisions, and Gazette updates."
      />
    </div>
  );
}
