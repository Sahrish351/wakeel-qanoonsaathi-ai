import React from 'react';
import { EmptyState } from '@/components/states/EmptyState';
import { ShieldAlert } from 'lucide-react';

export default function PrivacySettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl text-[var(--color-text-primary)]">Privacy & Security</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
          Manage local data storage, encryption keys, and account security.
        </p>
      </div>
      <EmptyState
        icon={ShieldAlert}
        title="Privacy controls"
        description="Configure client-side encryption, local data retention, and security safeguards."
      />
    </div>
  );
}
