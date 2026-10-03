import React from 'react';
import { EmptyState } from '@/components/states/EmptyState';
import { BookOpen } from 'lucide-react';

export default function ResourcesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl text-[var(--color-text-primary)]">Legal Resources & Guides</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
          Plain-language guides to Pakistani law, court procedures, and statutory rights.
        </p>
      </div>
      <EmptyState
        icon={BookOpen}
        title="Knowledge base & legal guides"
        description="Explore legal guides, statutory references (PPC, CrPC, CPC), and procedural checklists."
      />
    </div>
  );
}
