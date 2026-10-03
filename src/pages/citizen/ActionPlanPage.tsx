import React from 'react';
import { EmptyState } from '@/components/states/EmptyState';
import { ListChecks } from 'lucide-react';

export default function ActionPlanPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl text-[var(--color-text-primary)]">Legal Action Plan</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
          Step-by-step roadmap and legal remedies recommended for your situation.
        </p>
      </div>
      <EmptyState
        icon={ListChecks}
        title="No active action plan"
        description="Generate an action plan by completing a case assessment with Wakeel AI."
      />
    </div>
  );
}
