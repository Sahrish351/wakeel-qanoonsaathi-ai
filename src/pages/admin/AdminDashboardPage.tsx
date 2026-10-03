import React from 'react';
import { EmptyState } from '@/components/states/EmptyState';
import { BarChart3 } from 'lucide-react';

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl text-[var(--color-text-primary)]">System Administration</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
          Platform telemetry, legal database health, user activity, and verification queue.
        </p>
      </div>
      <EmptyState
        icon={BarChart3}
        title="Admin overview"
        description="System telemetry, operational alerts, and platform metrics will be displayed here."
      />
    </div>
  );
}
