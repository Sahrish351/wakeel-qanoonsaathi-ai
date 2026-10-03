import React from 'react';
import { EmptyState } from '@/components/states/EmptyState';
import { User } from 'lucide-react';

export default function LawyerProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl text-[var(--color-text-primary)]">Lawyer Profile</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
          Advocate credentials, bar enrollment, practice areas, and consultation details.
        </p>
      </div>
      <EmptyState
        icon={User}
        title="Advocate profile details"
        description="Select a verified advocate from the directory to review credentials and book a consultation."
      />
    </div>
  );
}
