import React from 'react';
import { EmptyState } from '@/components/states/EmptyState';
import { LayoutDashboard } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl text-[var(--color-text-primary)]">Citizen Dashboard</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
          Overview of your legal matters, active consultations, and recommended actions.
        </p>
      </div>
      <EmptyState
        icon={LayoutDashboard}
        title="Welcome to your legal dashboard"
        description="Get started by asking Wakeel AI a legal question, uploading a document, or exploring verified lawyers."
      />
    </div>
  );
}
