import React from 'react';
import { EmptyState } from '@/components/states/EmptyState';
import { FolderPlus } from 'lucide-react';

export default function NewCasePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl text-[var(--color-text-primary)]">Open New Case</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
          Initialize a new legal case file with AI-guided facts intake.
        </p>
      </div>
      <EmptyState
        icon={FolderPlus}
        title="Case intake preparation"
        description="The interactive step-by-step case intake flow is being prepared."
      />
    </div>
  );
}
