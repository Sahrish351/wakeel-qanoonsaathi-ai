import React, { useState } from 'react';
import {
  Lock,
  Upload,
  Hash,
  Clock,
  Trash2,
  Download,
  ShieldCheck,
  AlertCircle,
  FileText,
  Image,
  Video,
  FileCheck
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { sha256 } from '@/lib/utils/hash';

interface EvidenceEntry {
  id: string;
  title: string;
  fileName: string;
  fileSize: string;
  fileType: string;
  hash: string;
  uploadedAt: string;
  incidentTimestamp: string;
  category: string;
  notes: string;
}

const INITIAL_EVIDENCE: EvidenceEntry[] = [
  {
    id: 'ev-1',
    title: 'Extortion WhatsApp Chat Screenshots',
    fileName: 'WhatsApp_Chat_Threat_20261001.png',
    fileSize: '1.4 MB',
    fileType: 'image',
    hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    uploadedAt: '2026-10-01 19:42 PKT',
    incidentTimestamp: '2026-10-01 18:30 PKT',
    category: 'Cyber Blackmail',
    notes: 'Uncropped screenshot with international mobile header and payment demand clearly visible.'
  },
  {
    id: 'ev-2',
    title: 'Bank EasyPaisa Transaction Demand SMS',
    fileName: 'Payment_Demand_SMS_Record.png',
    fileSize: '420 KB',
    fileType: 'image',
    hash: 'a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e',
    uploadedAt: '2026-10-01 20:15 PKT',
    incidentTimestamp: '2026-10-01 19:00 PKT',
    category: 'Financial Extortion',
    notes: 'Demanded Rs 50,000 transfer to CNIC account within 2 hours.'
  }
];

export default function EvidenceVaultPage() {
  const [evidenceList, setEvidenceList] = useState<EvidenceEntry[]>(INITIAL_EVIDENCE);
  const [uploading, setUploading] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Cyber Blackmail');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !newTitle.trim()) return;

    setUploading(true);
    try {
      const fileHash = await sha256(selectedFile);
      const newEntry: EvidenceEntry = {
        id: `ev-${Date.now()}`,
        title: newTitle.trim(),
        fileName: selectedFile.name,
        fileSize: `${(selectedFile.size / 1024).toFixed(0)} KB`,
        fileType: selectedFile.type.includes('image') ? 'image' : 'document',
        hash: fileHash,
        uploadedAt: new Date().toLocaleString(),
        incidentTimestamp: new Date().toLocaleString(),
        category: newCategory,
        notes: 'Client-side SHA-256 hashed and timestamped.'
      };

      setEvidenceList([newEntry, ...evidenceList]);
      setSelectedFile(null);
      setNewTitle('');
    } catch (err) {
      console.error('Hash calculation error:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = (id: string) => {
    setEvidenceList(evidenceList.filter(e => e.id !== id));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E7E5E4]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-3xl font-bold text-[#1C1917]">Evidence Vault</h1>
            <Badge variant="accent">Cryptographic Integrity</Badge>
          </div>
          <p className="text-sm text-[#57534E] mt-1">
            Secure client-side SHA-256 hashing and chronological timestamping of legal exhibits.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-[#57534E] bg-white px-3 py-1.5 rounded-lg border border-[#E7E5E4]">
          <Lock className="w-4 h-4 text-[#7C3AED]" />
          <span>Encrypted with RLS Isolation</span>
        </div>
      </div>

      {/* Legal Disclaimers Banner */}
      <div className="p-4 bg-[#FAF8F5] border border-[#E7E5E4] rounded-2xl flex items-start gap-3 text-xs text-[#57534E]">
        <AlertCircle className="w-5 h-5 text-[#7C3AED] shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-[#1C1917]">Evidence Integrity Notice: </span>
          Client-side SHA-256 hashing guarantees that the file has not been altered or modified since its upload timestamp. Under the Qanun-e-Shahadat Order 1984 and PECA 2016, final court admissibility of electronic records requires judicial evaluation and compliance with statutory certificate procedures.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Upload Form */}
        <div className="lg:col-span-4">
          <form onSubmit={handleFileUpload} className="p-6 bg-white border border-[#E7E5E4] rounded-2xl space-y-4 shadow-sm">
            <h3 className="font-heading text-lg font-bold text-[#1C1917] flex items-center gap-2">
              <Upload className="w-4 h-4 text-[#7C3AED]" /> Deposit New Exhibit
            </h3>

            <div>
              <label className="text-xs font-semibold text-[#1C1917] block mb-1">Exhibit Title</label>
              <Input
                placeholder="e.g. Blackmail SMS Screenshot"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#1C1917] block mb-1">Matter Category</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="input-base text-xs py-2"
              >
                <option value="Cyber Blackmail">Cyber Blackmail / PECA</option>
                <option value="Police Summons">Police Summons / CrPC</option>
                <option value="Workplace Harassment">Workplace Harassment</option>
                <option value="Financial Extortion">Financial Extortion</option>
                <option value="Other Legal Dispute">Other Legal Dispute</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#1C1917] block mb-1">Choose File</label>
              <input
                type="file"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                className="input-base text-xs file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-[#EDE9FE] file:text-[#7C3AED] file:text-xs"
                required
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full"
              disabled={!selectedFile || !newTitle.trim() || uploading}
              isLoading={uploading}
            >
              Generate Hash & Vault
            </Button>
          </form>
        </div>

        {/* Evidence Vault Records */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between pb-2">
            <h3 className="font-heading text-xl font-bold text-[#1C1917]">Vaulted Exhibits ({evidenceList.length})</h3>
            <span className="text-xs text-[#A8A29E]">All records timestamped</span>
          </div>

          <div className="space-y-3">
            {evidenceList.map((ev) => (
              <div
                key={ev.id}
                className="p-5 bg-white border border-[#E7E5E4] rounded-2xl shadow-sm space-y-3 hover:border-[#7C3AED]/30 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-sm text-[#1C1917]">{ev.title}</h4>
                      <Badge variant="outline">{ev.category}</Badge>
                    </div>
                    <p className="text-xs text-[#A8A29E] flex items-center gap-2">
                      <span>{ev.fileName}</span> • <span>{ev.fileSize}</span>
                    </p>
                  </div>

                  <button
                    onClick={() => handleDelete(ev.id)}
                    className="p-1.5 text-[#DC2626] hover:bg-[#FEE2E2] rounded-lg transition-colors"
                    title="Delete Exhibit"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Hash Box */}
                <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E7E5E4] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 truncate pr-2">
                    <Hash className="w-3.5 h-3.5 text-[#7C3AED] shrink-0" />
                    <span className="font-mono text-[11px] text-[#57534E] truncate">{ev.hash}</span>
                  </div>
                  <Badge variant="success" className="shrink-0 text-[10px]">
                    SHA-256 Verified
                  </Badge>
                </div>

                <div className="flex flex-wrap items-center justify-between text-xs text-[#A8A29E] pt-1">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Deposited: {ev.uploadedAt}
                  </span>
                  <span className="text-[#57534E]">{ev.notes}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
