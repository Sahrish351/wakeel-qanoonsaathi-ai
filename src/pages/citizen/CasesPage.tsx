import React from 'react';
import { EmptyState } from '@/components/states/EmptyState';
import { Briefcase } from 'lucide-react';

export default function CasesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl text-[var(--color-text-primary)]">My Cases</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
          Track and manage all your active legal queries and timelines.
        </p>
      </div>
      <EmptyState
        icon={Briefcase}
        title="No active cases yet"
        description="Start by describing your legal query to Wakeel AI or upload a document."
      />
    </div>
  );
}
