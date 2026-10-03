import React from 'react';
import { EmptyState } from '@/components/states/EmptyState';
import { Calendar } from 'lucide-react';

export default function ConsultationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl text-[var(--color-text-primary)]">Consultations</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
          Schedule and manage video or in-person consultations with your lawyers.
        </p>
      </div>
      <EmptyState
        icon={Calendar}
        title="No scheduled consultations"
        description="Book a consultation with a verified advocate to discuss your case strategy."
      />
    </div>
  );
}
