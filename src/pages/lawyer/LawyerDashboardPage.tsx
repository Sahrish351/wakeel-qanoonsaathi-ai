import React from 'react';
import { EmptyState } from '@/components/states/EmptyState';
import { Scale } from 'lucide-react';

export default function LawyerDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl text-[var(--color-text-primary)]">Advocate Workspace</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
          Manage client inquiries, upcoming court hearings, and consultation sessions.
        </p>
      </div>
      <EmptyState
        icon={Scale}
        title="Welcome to your legal practice portal"
        description="Client consultation requests, case briefs, and hearing alerts will appear here."
      />
    </div>
  );
}
