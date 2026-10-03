import React from 'react';
import { EmptyState } from '@/components/states/EmptyState';
import { CheckSquare } from 'lucide-react';

export default function TasksPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl text-[var(--color-text-primary)]">Tasks & To-Dos</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
          Actionable steps, document collections, and deadlines for your legal cases.
        </p>
      </div>
      <EmptyState
        icon={CheckSquare}
        title="No pending tasks"
        description="You have completed all pending action items. New tasks will appear when legal milestones are set."
      />
    </div>
  );
}
