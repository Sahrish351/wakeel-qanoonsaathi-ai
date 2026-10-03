import React from 'react';
import { EmptyState } from '@/components/states/EmptyState';
import { FileSearch } from 'lucide-react';

export default function DocumentAnalyzerPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl text-[var(--color-text-primary)]">Document Analyzer</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
          AI analysis of contracts, FIRs, court notices, and legal instruments under Pakistani law.
        </p>
      </div>
      <EmptyState
        icon={FileSearch}
        title="Upload a legal document to analyze"
        description="Upload PDFs or images of agreements, notices, or FIRs to receive summaries, risk flags, and clause breakdowns."
      />
    </div>
  );
}
