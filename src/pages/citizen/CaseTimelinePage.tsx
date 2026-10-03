import React from 'react';
import { EmptyState } from '@/components/states/EmptyState';
import { CalendarClock } from 'lucide-react';

export default function CaseTimelinePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl text-[var(--color-text-primary)]">Case Timeline</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
          Chronological sequence of hearings, filings, and procedural milestones.
        </p>
      </div>
      <EmptyState
        icon={CalendarClock}
        title="No timeline events recorded"
        description="Chronological milestones and court hearing schedules will appear here as your case progresses."
      />
    </div>
  );
}
