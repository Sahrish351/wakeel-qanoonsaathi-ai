-- =============================================================================
-- Migration: 007_tasks.sql
-- Description: Creates public.tasks and public.reminders tables for
--              deadline tracking and notifications.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- public.tasks
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.tasks (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id    UUID        REFERENCES public.cases(id) ON DELETE SET NULL,
  user_id    UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title      TEXT        NOT NULL,
  due_at     TIMESTAMPTZ,
  priority   TEXT        DEFAULT 'medium' CHECK (priority IN ('urgent','high','medium','low')),
  status     TEXT        DEFAULT 'pending' CHECK (status IN ('pending','in_progress','done','cancelled')),
  source     TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.tasks IS 'Actionable tasks for the user — may be AI-generated from action plans or manually created.';
COMMENT ON COLUMN public.tasks.source IS 'Where this task originated: ''manual'' | ''action_plan'' | ''ai_suggestion'' etc.';

-- ---------------------------------------------------------------------------
-- public.reminders
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.reminders (
  id        UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id   UUID        NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  user_id   UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  remind_at TIMESTAMPTZ NOT NULL,
  channel   TEXT        DEFAULT 'in_app' CHECK (channel IN ('in_app','email')),
  status    TEXT        DEFAULT 'pending' CHECK (status IN ('pending','sent','dismissed'))
);

COMMENT ON TABLE public.reminders IS 'Scheduled reminders for tasks. Processed by a server-side Edge Function.';

-- ---------------------------------------------------------------------------
-- ROW LEVEL SECURITY — tasks
-- ---------------------------------------------------------------------------
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "tasks_select_owner" ON public.tasks;
CREATE POLICY "tasks_select_owner"
  ON public.tasks FOR SELECT
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "tasks_insert_owner" ON public.tasks;
CREATE POLICY "tasks_insert_owner"
  ON public.tasks FOR INSERT
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "tasks_update_owner" ON public.tasks;
CREATE POLICY "tasks_update_owner"
  ON public.tasks FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "tasks_delete_owner" ON public.tasks;
CREATE POLICY "tasks_delete_owner"
  ON public.tasks FOR DELETE
  USING (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- ROW LEVEL SECURITY — reminders (owner only)
-- ---------------------------------------------------------------------------
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "reminders_select_owner" ON public.reminders;
CREATE POLICY "reminders_select_owner"
  ON public.reminders FOR SELECT
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "reminders_insert_owner" ON public.reminders;
CREATE POLICY "reminders_insert_owner"
  ON public.reminders FOR INSERT
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "reminders_update_owner" ON public.reminders;
CREATE POLICY "reminders_update_owner"
  ON public.reminders FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "reminders_delete_owner" ON public.reminders;
CREATE POLICY "reminders_delete_owner"
  ON public.reminders FOR DELETE
  USING (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- INDEXES
-- ---------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS tasks_user_due_idx    ON public.tasks (user_id, due_at ASC);
CREATE INDEX IF NOT EXISTS tasks_user_status_idx ON public.tasks (user_id, status);
CREATE INDEX IF NOT EXISTS tasks_case_idx        ON public.tasks (case_id);
CREATE INDEX IF NOT EXISTS reminders_task_idx    ON public.reminders (task_id);
CREATE INDEX IF NOT EXISTS reminders_remind_idx  ON public.reminders (remind_at) WHERE status = 'pending';
