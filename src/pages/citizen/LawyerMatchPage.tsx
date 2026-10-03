import React from 'react';
import { EmptyState } from '@/components/states/EmptyState';
import { UserCheck } from 'lucide-react';

export default function LawyerMatchPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl text-[var(--color-text-primary)]">Find a Lawyer</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
          Connect with verified advocates licensed by Pakistan Bar Councils.
        </p>
      </div>
      <EmptyState
        icon={UserCheck}
        title="Discover verified legal counsel"
        description="Search and filter advocates by city, high court enrollment, practice area, and language."
      />
    </div>
  );
}
