import { Database } from '@/lib/db_types';
import { createClient } from '@/lib/supabase/browser';
import { getMessage } from './services';

export type TMessage = Database['public']['Tables']['messages']['Row'];

export type TListEventMessagesParams = {
  client: ReturnType<typeof createClient>;
  event_id: string;
};

export type TGetMessageParams = {
  client: ReturnType<typeof createClient>;
  message_id: string;
};

export type TUseChatParams = {
  client: ReturnType<typeof createClient>;
  event_id: string;
};

export type TSendMessageParams = {
  client: ReturnType<typeof createClient>;
  event_id: string;
  content: string;
  user_id: string;
};

type GetMessageReturn = Awaited<ReturnType<typeof getMessage>>;
export type TGetMessageReturn = GetMessageReturn['data'];
export type TGetMessageError = GetMessageReturn['error'];
