import React from 'react';
import { EmptyState } from '@/components/states/EmptyState';
import { UserCircle } from 'lucide-react';

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl text-[var(--color-text-primary)]">My Profile</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
          Manage your personal details, language preferences, and contact information.
        </p>
      </div>
      <EmptyState
        icon={UserCircle}
        title="Citizen profile details"
        description="Your personal information, verified identity, and notification preferences will appear here."
      />
    </div>
  );
}
