import React from 'react';
import { EmptyState } from '@/components/states/EmptyState';
import { CalendarCheck } from 'lucide-react';

export default function LawyerConsultationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl text-[var(--color-text-primary)]">Consultation Schedule</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
          Manage client appointment requests, video consultation sessions, and consultation notes.
        </p>
      </div>
      <EmptyState
        icon={CalendarCheck}
        title="No scheduled consultations"
        description="Accepted client consultations and pending requests will appear in this calendar."
      />
    </div>
  );
}
