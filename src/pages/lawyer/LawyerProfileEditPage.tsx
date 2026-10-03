import React from 'react';
import { EmptyState } from '@/components/states/EmptyState';
import { Award } from 'lucide-react';

export default function LawyerProfileEditPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl text-[var(--color-text-primary)]">Advocate Profile & Credentials</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
          Update your Pakistan Bar Council enrollment, practice areas, and consultation fee schedules.
        </p>
      </div>
      <EmptyState
        icon={Award}
        title="Profile & verification settings"
        description="Bar council verification details, bios, and consultation fee settings can be managed here."
      />
    </div>
  );
}
