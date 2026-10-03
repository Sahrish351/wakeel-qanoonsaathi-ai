import React from 'react';
import { EmptyState } from '@/components/states/EmptyState';
import { Sparkles } from 'lucide-react';

export default function AIPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl text-[var(--color-text-primary)]">Wakeel AI Assistant</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
          Ask questions regarding Pakistan legal codes, constitutional rights, and procedural guides.
        </p>
      </div>
      <EmptyState
        icon={Sparkles}
        title="Start a conversation with Wakeel AI"
        description="Ask questions in English or Urdu regarding civil, criminal, family, or property law in Pakistan."
      />
    </div>
  );
}
