import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  Check,
  CheckCircle2,
  Clock,
  Calendar,
  UserCheck,
  Briefcase,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import {
  getUserNotifications,
  markNotificationRead,
  markAllNotificationsRead
} from '@/lib/api/database';
import type { AppNotification } from '@/types';
import { formatRelative } from '@/lib/utils/date';

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const loadNotifications = async () => {
    try {
      const data = await getUserNotifications();
      setNotifications(data);
    } catch (err) {
      console.warn('[NotificationCenter] Load error:', err);
    }
  };

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 30000); // Polling every 30s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkRead = async (id: string) => {
    await markNotificationRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
  };

  const handleMarkAllRead = async () => {
    await markAllNotificationsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'task':
      case 'deadline':
        return <Clock className="w-3.5 h-3.5 text-amber-600" />;
      case 'consultation':
        return <UserCheck className="w-3.5 h-3.5 text-emerald-600" />;
      case 'action_plan':
        return <Sparkles className="w-3.5 h-3.5 text-purple-600" />;
      case 'case_update':
        return <Briefcase className="w-3.5 h-3.5 text-blue-600" />;
      default:
        return <Bell className="w-3.5 h-3.5 text-stone-500" />;
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-label={`Notifications, ${unreadCount} unread`}
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className="relative p-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-accent)] text-[9px] font-bold text-white ring-2 ring-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white border border-[var(--color-border)] rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="p-3.5 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-stone-900">Notifications</span>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold">
                  {unreadCount} unread
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-[11px] text-[var(--color-accent)] hover:underline font-semibold"
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-stone-100">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-stone-400 text-xs">
                <Bell className="w-6 h-6 mx-auto mb-2 text-stone-300" />
                No notifications yet.
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleMarkRead(n.id)}
                  className={`p-3 text-xs transition-colors cursor-pointer hover:bg-stone-50 flex items-start gap-3 ${
                    !n.is_read ? 'bg-purple-50/30' : ''
                  }`}
                >
                  <div className="w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    {getIcon(n.type)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className={`font-semibold ${!n.is_read ? 'text-stone-900 font-bold' : 'text-stone-700'}`}>
                        {n.title}
                      </span>
                      <span className="text-[10px] text-stone-400">
                        {formatRelative(n.created_at)}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-600 leading-relaxed">{n.message}</p>
                    {n.link && (
                      <Link
                        to={n.link}
                        onClick={() => setOpen(false)}
                        className="inline-flex items-center gap-1 text-[11px] text-[var(--color-accent)] font-semibold hover:underline pt-0.5"
                      >
                        <span>View details</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                  {!n.is_read && (
                    <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] mt-1.5 flex-shrink-0" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
