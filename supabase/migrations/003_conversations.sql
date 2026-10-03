-- =============================================================================
-- Migration: 003_conversations.sql
-- Description: Creates public.conversations and public.messages tables with
--              owner-only RLS. Messages are only accessible via conversation
--              ownership.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- public.conversations
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.conversations (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id    UUID        REFERENCES public.cases(id) ON DELETE SET NULL,
  user_id    UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.conversations IS 'A conversation session between the user and the Wakeel AI agent, optionally linked to a case.';

-- ---------------------------------------------------------------------------
-- public.messages
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.messages (
  id                 UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id    UUID        NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_type        TEXT        NOT NULL CHECK (sender_type IN ('user','agent','system')),
  content            TEXT        NOT NULL,
  structured_payload JSONB,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.messages IS 'Individual messages within a conversation. structured_payload holds agent tool outputs, citations, actions, etc.';
COMMENT ON COLUMN public.messages.sender_type IS 'user | agent | system';

-- ---------------------------------------------------------------------------
-- ROW LEVEL SECURITY — conversations
-- ---------------------------------------------------------------------------
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "conversations_select_owner" ON public.conversations;
CREATE POLICY "conversations_select_owner"
  ON public.conversations FOR SELECT
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "conversations_insert_owner" ON public.conversations;
CREATE POLICY "conversations_insert_owner"
  ON public.conversations FOR INSERT
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "conversations_update_owner" ON public.conversations;
CREATE POLICY "conversations_update_owner"
  ON public.conversations FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "conversations_delete_owner" ON public.conversations;
CREATE POLICY "conversations_delete_owner"
  ON public.conversations FOR DELETE
  USING (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- ROW LEVEL SECURITY — messages (via conversation ownership)
-- ---------------------------------------------------------------------------
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "messages_select_owner" ON public.messages;
CREATE POLICY "messages_select_owner"
  ON public.messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.conversations cv
      WHERE cv.id = conversation_id AND cv.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "messages_insert_owner" ON public.messages;
CREATE POLICY "messages_insert_owner"
  ON public.messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.conversations cv
      WHERE cv.id = conversation_id AND cv.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "messages_update_owner" ON public.messages;
CREATE POLICY "messages_update_owner"
  ON public.messages FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.conversations cv
      WHERE cv.id = conversation_id AND cv.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "messages_delete_owner" ON public.messages;
CREATE POLICY "messages_delete_owner"
  ON public.messages FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.conversations cv
      WHERE cv.id = conversation_id AND cv.user_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- INDEXES
-- ---------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS conversations_user_idx      ON public.conversations (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS conversations_case_idx      ON public.conversations (case_id);
CREATE INDEX IF NOT EXISTS messages_conversation_at_idx ON public.messages (conversation_id, created_at ASC);
