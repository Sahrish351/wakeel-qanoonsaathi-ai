import React, { useState } from 'react';
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Building2,
  Calendar,
  Scale,
  Sparkles,
  FileCheck,
  Shield,
  ArrowRight,
  FileSearch
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { analyzeDocumentFile, type DocumentAnalysisResult } from '@/lib/api/ai';

export default function DocumentAnalyzerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<DocumentAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;

    setAnalyzing(true);
    setError(null);

    try {
      // Convert to base64
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64Data = (reader.result as string).split(',')[1];
          const analysis = await analyzeDocumentFile({
            fileBase64: base64Data,
            mimeType: file.type || 'application/pdf',
            fileName: file.name,
          });
          setResult(analysis);
        } catch (err: any) {
          setError(err.message || 'Analysis failed. Please try a clearer scan or PDF.');
        } finally {
          setAnalyzing(false);
        }
      };
      reader.onerror = () => {
        setError('Failed to read document file.');
        setAnalyzing(false);
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      setError(err.message || 'Unexpected upload error.');
      setAnalyzing(false);
    }
  };

  const loadSampleNotice = async () => {
    setAnalyzing(true);
    setError(null);
    try {
      const mockResult = await analyzeDocumentFile({
        fileBase64: 'mock-sample-notice-fbr',
        mimeType: 'application/pdf',
        fileName: 'FBR_ShowCause_Sec111_Sample.pdf'
      });
      setResult(mockResult);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E7E5E4]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-3xl font-bold text-[#1C1917]">Legal Document Analyzer</h1>
            <Badge variant="accent">OCR & Entity Extraction</Badge>
          </div>
          <p className="text-sm text-[#57534E] mt-1">
            Extract statutory deadlines, issuing courts, reference numbers, and plain-language summaries.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-[#57534E] bg-white px-3 py-1.5 rounded-lg border border-[#E7E5E4]">
          <Shield className="w-4 h-4 text-[#7C3AED]" />
          <span>Prompt Injection Defense Active</span>
        </div>
      </div>

      {/* Upload Zone */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-4">
          <div className="p-8 border-2 border-dashed border-[#D6D3D1] hover:border-[#7C3AED] rounded-2xl bg-white text-center transition-all">
            <UploadCloud className="w-10 h-10 text-[#7C3AED] mx-auto mb-3" />
            <h3 className="font-heading text-lg font-bold text-[#1C1917]">Upload Legal Notice / Document</h3>
            <p className="text-xs text-[#57534E] mt-1 mb-4">
              PDF, JPG, PNG up to 20MB. Encrypted in private storage.
            </p>

            <label className="cursor-pointer">
              <span className="px-4 py-2 bg-[#FAF8F5] border border-[#E7E5E4] hover:bg-[#EDE9FE] text-[#7C3AED] text-xs font-semibold rounded-lg transition-all inline-block">
                Choose Document File
              </span>
              <input
                type="file"
                accept=".pdf,image/png,image/jpeg,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            {file && (
              <div className="mt-4 p-2.5 rounded-lg bg-[#FAF8F5] border border-[#E7E5E4] text-xs text-left flex items-center justify-between">
                <div className="truncate max-w-[200px] font-medium text-[#1C1917]">{file.name}</div>
                <span className="text-[#A8A29E]">{(file.size / 1024).toFixed(0)} KB</span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Button
              variant="primary"
              onClick={handleAnalyze}
              disabled={!file || analyzing}
              isLoading={analyzing}
              className="w-full"
            >
              Analyze Uploaded Notice
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={loadSampleNotice}
              disabled={analyzing}
              className="w-full bg-white text-xs"
            >
              Test with Sample Pakistani Court Notice
            </Button>
          </div>

          {error && (
            <div className="p-3 bg-[#DC2626]/10 border border-[#DC2626]/20 rounded-xl text-xs text-[#DC2626]">
              {error}
            </div>
          )}

          <div className="p-4 bg-white rounded-xl border border-[#E7E5E4] text-xs space-y-2 text-[#57534E]">
            <p className="font-semibold text-[#1C1917]">Supported Document Formats:</p>
            <p>• Police Summons & Roznamcha Reports (CrPC 160)</p>
            <p>• Court Show-Cause Notices & Subpoenas</p>
            <p>• FBR / PRA Tax Assessment Notices</p>
            <p>• Employment Termination & Warning Letters</p>
          </div>
        </div>

        {/* Results Pane */}
        <div className="lg:col-span-7">
          {result ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-[#E7E5E4]">
                <div className="flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-[#059669]" />
                  <div>
                    <h3 className="font-bold text-sm text-[#1C1917]">Extracted Parameters</h3>
                    <p className="text-xs text-[#57534E]">Confidence: {result.confidence.toUpperCase()}</p>
                  </div>
                </div>
                <Badge variant={result.confidence === 'high' ? 'success' : 'caution'}>
                  Analysis Complete
                </Badge>
              </div>

              {/* Authority & Ref Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card variant="bordered" className="bg-white">
                  <CardHeader className="pb-2">
                    <div className="text-xs text-[#A8A29E] flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5" /> Issuing Authority
                    </div>
                    <p className="font-semibold text-sm text-[#1C1917] mt-1">{result.authority}</p>
                  </CardHeader>
                </Card>

                <Card variant="bordered" className="bg-white">
                  <CardHeader className="pb-2">
                    <div className="text-xs text-[#A8A29E] flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5" /> Reference / Case Code
                    </div>
                    <p className="font-semibold text-sm text-[#7C3AED] mt-1">{result.reference_number}</p>
                  </CardHeader>
                </Card>
              </div>

              {/* Deadlines Alert */}
              {result.deadlines && result.deadlines.length > 0 && (
                <div className="p-4 rounded-xl bg-[#DC2626]/5 border border-[#DC2626]/20 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#DC2626]">
                    <Clock className="w-4 h-4" />
                    <span>Statutory Deadline Identified:</span>
                  </div>
                  {result.deadlines.map((dl, i) => (
                    <div key={i} className="text-xs text-[#57534E]">
                      <p className="font-semibold text-[#1C1917]">{dl.label}: <span className="text-[#DC2626]">{dl.due_date}</span></p>
                      <p className="mt-0.5">{dl.description}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Plain Language Summary */}
              <Card variant="bordered" className="bg-white">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#1C1917]">
                    <Sparkles className="w-3.5 h-3.5 text-[#7C3AED]" />
                    <span>Plain Language Explanation:</span>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 text-xs text-[#57534E] leading-relaxed">
                  {result.plain_summary}
                </CardContent>
              </Card>

              {/* Governing Laws */}
              {result.referenced_laws && result.referenced_laws.length > 0 && (
                <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E7E5E4] text-xs">
                  <span className="font-semibold text-[#1C1917]">Referenced Laws in Document: </span>
                  <span className="text-[#7C3AED] font-medium">{result.referenced_laws.join(' • ')}</span>
                </div>
              )}

              {/* Recommended Next Action */}
              <div className="p-4 rounded-xl bg-[#059669]/5 border border-[#059669]/20 text-xs space-y-1">
                <p className="font-bold text-[#059669]">Recommended Legal Step:</p>
                <p className="text-[#57534E]">{result.recommended_action}</p>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[350px] flex flex-col items-center justify-center p-8 border border-[#E7E5E4] rounded-2xl bg-[#FAF8F5] text-center">
              <FileSearch className="w-12 h-12 text-[#A8A29E] mb-3" />
              <h4 className="font-heading text-lg font-bold text-[#1C1917]">No Document Analyzed Yet</h4>
              <p className="text-xs text-[#57534E] max-w-sm mt-1">
                Upload a document on the left or click "Test with Sample Pakistani Court Notice" to see how Wakeel extracts authorities and critical deadlines.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
