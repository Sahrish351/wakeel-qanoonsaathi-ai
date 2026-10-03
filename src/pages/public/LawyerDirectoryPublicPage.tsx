import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Scale,
  Search,
  MapPin,
  Award,
  Video,
  PhoneCall,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Filter,
  ArrowRight,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { getVerifiedLawyers } from '@/lib/api/database';

const PROVINCES = [
  'All',
  'Punjab',
  'Sindh',
  'Khyber Pakhtunkhwa',
  'Balochistan',
  'Islamabad Capital Territory'
];

export default function LawyerDirectoryPublicPage() {
  const [lawyers, setLawyers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('All');

  const loadLawyers = async () => {
    setLoading(true);
    try {
      const data = await getVerifiedLawyers(selectedProvince);
      setLawyers(data);
    } catch (err) {
      console.error('[LawyerDirectoryPublicPage] Error loading advocates:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLawyers();
  }, [selectedProvince]);

  const filtered = lawyers.filter((l) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    const name = l.name?.toLowerCase() || '';
    const spec = l.specialization?.toLowerCase() || '';
    const city = l.city?.toLowerCase() || '';
    return name.includes(q) || spec.includes(q) || city.includes(q);
  });

  return (
    <div className="space-y-8 pb-20 max-w-6xl mx-auto px-4 sm:px-6 pt-6">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <Badge variant="accent" className="px-3 py-1 text-xs">
          Verified Bar Directory
        </Badge>
        <h1 className="font-heading text-4xl font-bold text-stone-900">
          Find a Licensed Bar Advocate
        </h1>
        <p className="text-sm text-stone-600 leading-relaxed">
          Search advocates across provincial High Court jurisdictions for confidential consultation and courtroom representation.
        </p>
      </div>

      {/* Synthetic Demo Disclaimer Banner */}
      <div className="p-4 bg-purple-50/70 border border-purple-200 rounded-xl text-xs text-purple-950 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-[var(--color-accent)] flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Synthetic Advocates Demo Roster:</span>
          <p className="mt-0.5 leading-relaxed">
            Profiles in this hackathon directory represent synthetic practitioners distributed across the provinces with simulated Bar enrollments. When actual consultations are booked, confidential client-consented case briefs are exchanged.
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <Card className="border-[var(--color-border)] bg-white shadow-xs">
        <CardContent className="p-4 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search by advocate name, legal specialty (Cybercrime, Criminal, Family), or city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-stone-500 font-medium whitespace-nowrap">Province:</span>
            <select
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
              className="px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg text-stone-700 w-full sm:w-auto font-medium focus:ring-2 focus:ring-[var(--color-accent)]"
            >
              {PROVINCES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Loading Skeleton */}
      {loading && (
        <Card className="p-12 text-center bg-white border-[var(--color-border)]">
          <Clock className="w-6 h-6 text-stone-400 animate-spin mx-auto mb-2" />
          <p className="text-xs text-stone-500">Querying verified advocate roster...</p>
        </Card>
      )}

      {/* Advocate Cards Grid */}
      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((lawyer) => (
            <Card
              key={lawyer.id}
              className="border-[var(--color-border)] bg-white shadow-xs hover:border-purple-200 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <CardContent className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="w-12 h-12 rounded-full bg-purple-100 text-[var(--color-accent)] flex items-center justify-center font-bold font-heading text-lg">
                      {lawyer.name ? lawyer.name[0] : 'A'}
                    </div>
                    <Badge variant="success" className="text-[10px]">
                      Verified Bar Advocate
                    </Badge>
                  </div>

                  <div>
                    <h3 className="font-heading text-lg font-bold text-stone-900 line-clamp-1">{lawyer.name}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-stone-500 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-stone-400" />
                      <span>{lawyer.city}, {lawyer.province}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Specialization</span>
                    <p className="text-xs font-semibold text-purple-700 capitalize line-clamp-1">
                      {lawyer.specialization?.replace(/_/g, ' ') || 'General Litigation'}
                    </p>
                  </div>

                  {lawyer.bio && (
                    <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed bg-stone-50 p-2.5 rounded-lg border border-stone-100">
                      {lawyer.bio}
                    </p>
                  )}
                </div>

                <div className="pt-4 border-t border-stone-100 space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-stone-500">
                    <span className="flex items-center gap-1">
                      <Globe className="w-3 h-3" />
                      {lawyer.languages?.join(', ') || 'English, Urdu'}
                    </span>
                    <Badge variant="outline" className="capitalize text-[10px]">
                      {lawyer.availability_status || 'available'}
                    </Badge>
                  </div>

                  <Link to="/register">
                    <Button variant="primary" size="sm" className="w-full bg-[var(--color-accent)] text-white text-xs">
                      Consult Advocate <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filtered.length === 0 && (
        <Card className="p-12 text-center bg-white border-[var(--color-border)]">
          <Scale className="w-10 h-10 text-stone-300 mx-auto mb-3" />
          <h3 className="font-heading text-lg text-stone-800">No Advocates Match Your Search</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1 mb-4">
            Try resetting your search query or selecting "All" provinces to view the complete roster.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearch('');
              setSelectedProvince('All');
            }}
          >
            Reset Filters
          </Button>
        </Card>
      )}
    </div>
  );
}
