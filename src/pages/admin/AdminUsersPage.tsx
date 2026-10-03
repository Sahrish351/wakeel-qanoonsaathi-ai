import React from 'react';
import { EmptyState } from '@/components/states/EmptyState';
import { Users } from 'lucide-react';

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl text-[var(--color-text-primary)]">User Management</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
          Manage registered citizen accounts, permissions, and platform status.
        </p>
      </div>
      <EmptyState
        icon={Users}
        title="User directory"
        description="Search, view, and manage citizen and professional accounts across the platform."
      />
    </div>
  );
}
