import { Database } from '@/lib/db_types';
import { SupabaseClient } from '@supabase/supabase-js';
import { getMessage } from './services';

export type TMessage = Database['public']['Tables']['messages']['Row'];

export type TListEventMessagesParams = {
  client: SupabaseClient<Database>;
  event_id: string;
};

export type TGetMessageParams = {
  client: SupabaseClient<Database>;
  message_id: string;
};

export type TUseChatParams = {
  client: SupabaseClient<Database>;
  event_id: string;
};

export type TSendMessageParams = {
  client: SupabaseClient<Database>;
  event_id: string;
  content: string;
  user_id: string;
};

type GetMessageReturn = Awaited<ReturnType<typeof getMessage>>;
export type TGetMessageReturn = GetMessageReturn['data'];
export type TGetMessageError = GetMessageReturn['error'];
