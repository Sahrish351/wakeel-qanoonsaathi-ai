import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Filter,
  RefreshCw,
  Clock,
  ShieldCheck,
  MapPin,
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { getAdminUsers } from '@/lib/api/database';
import type { Profile } from '@/types';
import { formatDate, formatRelative } from '@/lib/utils/date';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await getAdminUsers();
      setUsers(data);
    } catch (err) {
      console.error('[AdminUsersPage] Error loading users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filtered = users.filter((u) => {
    if (roleFilter !== 'all' && u.role !== roleFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const name = u.full_name?.toLowerCase() || '';
      const city = u.city?.toLowerCase() || '';
      const prov = u.province?.toLowerCase() || '';
      return name.includes(q) || city.includes(q) || prov.includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-16 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-[var(--color-accent)] font-medium mb-1">
            <Users className="w-4 h-4" />
            <span>Account Moderation & User Registry</span>
          </div>
          <h1 className="font-heading text-3xl text-[var(--color-text-primary)]">User Accounts</h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            Registered citizens, Bar advocates, and platform administrators under Row Level Security.
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={loadUsers} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Users
        </Button>
      </div>

      {/* Filter and Search */}
      <Card className="border-[var(--color-border)] bg-white shadow-xs">
        <CardContent className="p-4 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search users by name, city, or province..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg text-stone-700 w-full sm:w-auto"
          >
            <option value="all">All Roles</option>
            <option value="citizen">Citizens</option>
            <option value="lawyer">Advocates</option>
            <option value="admin">Administrators</option>
          </select>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="border-[var(--color-border)] bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-700">
            <thead className="bg-stone-50 border-b border-stone-200 uppercase font-semibold text-stone-500 tracking-wider">
              <tr>
                <th className="p-4">Full Name</th>
                <th className="p-4">Assigned Role</th>
                <th className="p-4">Region / Jurisdiction</th>
                <th className="p-4">Preferred Language</th>
                <th className="p-4 text-right">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-stone-400">
                    Loading account directory...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-stone-400">
                    No user accounts match current criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((user) => (
                  <tr key={user.id} className="hover:bg-stone-50 transition-colors">
                    <td className="p-4 font-bold text-stone-900">
                      {user.full_name || 'Anonymous User'}
                    </td>
                    <td className="p-4">
                      <Badge
                        variant={
                          user.role === 'admin'
                            ? 'danger'
                            : user.role === 'lawyer'
                            ? 'accent'
                            : 'outline'
                        }
                      >
                        {user.role.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="p-4 text-stone-600">
                      {user.city ? `${user.city}, ${user.province || 'Pakistan'}` : user.province || 'Pakistan'}
                    </td>
                    <td className="p-4 uppercase text-stone-500 font-semibold">
                      {user.preferred_language || 'EN'}
                    </td>
                    <td className="p-4 text-right text-stone-500 whitespace-nowrap">
                      {formatDate(user.created_at)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
