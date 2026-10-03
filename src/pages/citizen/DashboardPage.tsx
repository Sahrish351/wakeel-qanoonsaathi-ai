import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Briefcase,
  Clock,
  ShieldAlert,
  Users,
  FileText,
  CheckSquare,
  ArrowRight,
  AlertTriangle,
  Lock,
  PhoneCall,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/contexts/AuthContext';

export default function DashboardPage() {
  const { profile } = useAuth();

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Welcome Hero */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-[#FAF8F5] via-[#EDE9FE]/50 to-[#FAF8F5] border border-[#E7E5E4] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <Badge variant="accent">Citizen Guidance Portal</Badge>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-[#1C1917]">
            Khush Amdeed, {profile?.full_name || 'Citizen'}
          </h1>
          <p className="text-sm text-[#57534E] max-w-xl">
            When you don't know your rights, know your next step. Track active cases, verify notices, and consult licensed counsel.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link to="/ai">
            <Button variant="primary" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Ask Wakeel AI
            </Button>
          </Link>
          <Link to="/cases/new">
            <Button variant="outline" size="md" className="bg-white">
              Open New Case
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Action Hub */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link to="/ai" className="p-5 rounded-2xl bg-white border border-[#E7E5E4] hover:border-[#7C3AED]/40 shadow-sm transition-all group">
          <div className="w-10 h-10 rounded-xl bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="font-heading text-lg font-bold text-[#1C1917]">Ask Wakeel</h3>
          <p className="text-xs text-[#57534E] mt-1">Get immediate legal triage and safe step-by-step guidance.</p>
        </Link>

        <Link to="/cases" className="p-5 rounded-2xl bg-white border border-[#E7E5E4] hover:border-[#7C3AED]/40 shadow-sm transition-all group">
          <div className="w-10 h-10 rounded-xl bg-[#059669]/10 text-[#059669] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Briefcase className="w-5 h-5" />
          </div>
          <h3 className="font-heading text-lg font-bold text-[#1C1917]">Active Matters</h3>
          <p className="text-xs text-[#57534E] mt-1">Manage ongoing disputes, timelines, and action plans.</p>
        </Link>

        <Link to="/cases/documents" className="p-5 rounded-2xl bg-white border border-[#E7E5E4] hover:border-[#7C3AED]/40 shadow-sm transition-all group">
          <div className="w-10 h-10 rounded-xl bg-[#D97706]/10 text-[#D97706] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <FileText className="w-5 h-5" />
          </div>
          <h3 className="font-heading text-lg font-bold text-[#1C1917]">Analyze Notice</h3>
          <p className="text-xs text-[#57534E] mt-1">Extract statutory deadlines and legal issues from documents.</p>
        </Link>

        <Link to="/lawyers" className="p-5 rounded-2xl bg-white border border-[#E7E5E4] hover:border-[#7C3AED]/40 shadow-sm transition-all group">
          <div className="w-10 h-10 rounded-xl bg-[#1C1917]/10 text-[#1C1917] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="font-heading text-lg font-bold text-[#1C1917]">Find Counsel</h3>
          <p className="text-xs text-[#57534E] mt-1">Connect with verified advocates licensed across Pakistan.</p>
        </Link>
      </div>

      {/* Main Dashboard Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Active Matters & Deadlines */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-2xl font-bold text-[#1C1917]">Active Cases & Triage</h2>
            <Link to="/cases" className="text-xs font-semibold text-[#7C3AED] hover:underline">
              View All Matters
            </Link>
          </div>

          <div className="space-y-4">
            {/* Cyber Blackmail Case Card */}
            <div className="p-6 bg-white border border-[#E7E5E4] rounded-2xl shadow-sm space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading text-lg font-bold text-[#1C1917]">Cyber Blackmail Threat Response</h3>
                    <Badge variant="danger">High Risk</Badge>
                  </div>
                  <p className="text-xs text-[#7C3AED] font-semibold mt-0.5">Category: PECA Cybercrime</p>
                </div>
                <Badge variant="outline">In Progress</Badge>
              </div>

              <p className="text-xs text-[#57534E] leading-relaxed">
                Extortion threats received via digital messaging. Evidence preserved in vault and NCCIA 1799 complaint pending verification.
              </p>

              <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-[#E7E5E4] text-xs">
                <span className="text-[#059669] font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 2 Evidence items vaulted
                </span>
                <Link to="/cases/timeline" className="text-[#7C3AED] font-semibold hover:underline">
                  View Timeline & Plan
                </Link>
              </div>
            </div>

            {/* Police Summons Card */}
            <div className="p-6 bg-white border border-[#E7E5E4] rounded-2xl shadow-sm space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading text-lg font-bold text-[#1C1917]">Police Station Call Inquiry</h3>
                    <Badge variant="caution">Moderate Urgency</Badge>
                  </div>
                  <p className="text-xs text-[#D97706] font-semibold mt-0.5">Category: Criminal Procedure (CrPC)</p>
                </div>
                <Badge variant="outline">Pending Detail</Badge>
              </div>

              <p className="text-xs text-[#57534E] leading-relaxed">
                Caller verification protocol active. Recommended requesting written notice under Section 160 CrPC before in-person attendance.
              </p>

              <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-[#E7E5E4] text-xs">
                <span className="text-[#A8A29E]">Awaiting written notice confirmation</span>
                <Link to="/ai" className="text-[#7C3AED] font-semibold hover:underline">
                  Continue Triage
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Emergency & Upcoming Tasks */}
        <div className="lg:col-span-4 space-y-6">
          {/* Emergency Dispatch Widget */}
          <div className="p-6 rounded-2xl bg-[#DC2626]/5 border border-[#DC2626]/20 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#DC2626]">
              <PhoneCall className="w-4 h-4" />
              <span>Verified Pakistan Helplines</span>
            </div>
            <p className="text-xs text-[#57534E]">
              If you are facing immediate physical harm, contact official services:
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center p-2 rounded-lg bg-white border border-[#E7E5E4]">
                <span className="font-medium text-[#1C1917]">Police Emergency</span>
                <strong className="text-[#DC2626]">15</strong>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg bg-white border border-[#E7E5E4]">
                <span className="font-medium text-[#1C1917]">Rescue / Medical</span>
                <strong className="text-[#D97706]">1122</strong>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg bg-white border border-[#E7E5E4]">
                <span className="font-medium text-[#1C1917]">Cybercrime NCCIA</span>
                <strong className="text-[#7C3AED]">1799</strong>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg bg-white border border-[#E7E5E4]">
                <span className="font-medium text-[#1C1917]">Human Rights Ministry</span>
                <strong className="text-[#059669]">1099</strong>
              </div>
            </div>
          </div>

          {/* Critical Next Actions */}
          <Card variant="bordered" className="bg-white">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-[#7C3AED]" />
                <h3 className="font-heading text-lg font-bold text-[#1C1917]">Priority Tasks</h3>
              </div>
            </CardHeader>
            <CardContent className="pt-0 space-y-3 text-xs">
              <div className="p-2.5 rounded-lg bg-[#FAF8F5] border border-[#E7E5E4] space-y-1">
                <p className="font-semibold text-[#1C1917]">1. Verify Officer Name & Belt Number</p>
                <p className="text-[#57534E]">Call 15 helpline to verify if the summoning officer is stationed at Lahore Civil Lines.</p>
              </div>
              <div className="p-2.5 rounded-lg bg-[#FAF8F5] border border-[#E7E5E4] space-y-1">
                <p className="font-semibold text-[#1C1917]">2. Export Uncropped WhatsApp Chat Archive</p>
                <p className="text-[#57534E]">Save screenshot metadata with full sender phone number for NCCIA file.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
