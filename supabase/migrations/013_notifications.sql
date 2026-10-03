-- =============================================================================
-- Migration: 013_notifications.sql
-- Description: Creates public.notifications table with Row Level Security
--              for real user notifications (tasks, deadlines, consultations,
--              action plan updates, and case follow-ups).
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.notifications (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title      TEXT        NOT NULL,
  message    TEXT        NOT NULL,
  type       TEXT        NOT NULL CHECK (type IN ('task', 'deadline', 'consultation', 'action_plan', 'system', 'case_update')),
  link       TEXT,
  is_read    BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.notifications IS 'User-specific notifications for procedural deadlines, consultation updates, and case guidance.';

CREATE INDEX IF NOT EXISTS notifications_user_id_idx ON public.notifications (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS notifications_unread_idx ON public.notifications (user_id, is_read) WHERE is_read = FALSE;

-- ---------------------------------------------------------------------------
-- ROW LEVEL SECURITY — public.notifications
-- ---------------------------------------------------------------------------
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "notifications_select_owner" ON public.notifications;
CREATE POLICY "notifications_select_owner"
  ON public.notifications FOR SELECT
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "notifications_insert_owner_or_system" ON public.notifications;
CREATE POLICY "notifications_insert_owner_or_system"
  ON public.notifications FOR INSERT
  WITH CHECK (
    user_id = auth.uid()
    OR public.is_admin()
  );

DROP POLICY IF EXISTS "notifications_update_owner" ON public.notifications;
CREATE POLICY "notifications_update_owner"
  ON public.notifications FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "notifications_delete_owner" ON public.notifications;
CREATE POLICY "notifications_delete_owner"
  ON public.notifications FOR DELETE
  USING (user_id = auth.uid());
