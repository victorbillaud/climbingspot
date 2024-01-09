import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import { Database } from '../_shared/db_types.ts';

interface Message {
  content: string;
  created_at: string | null;
  event_id: string;
  id: string;
  user_id: string;
}

interface WebhookPayload {
  type: 'INSERT' | 'UPDATE' | 'DELETE';
  table: string;
  record: Message;
  schema: 'public';
  old_record: null | Message;
}

const supabase = createClient<Database>(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

Deno.serve(async (req) => {
  const payload: WebhookPayload = await req.json();

  const { data: sender } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', payload.record.user_id)
    .single();

  const { data: participants } = await supabase
    .from('events_participations')
    .select(
      `
        user_id,
        profile:profiles(expo_push_id)
        `,
    )
    .neq('user_id', payload.record.user_id)
    .eq('event_id', payload.record.event_id);

  const { data: event } = await supabase
    .from('events')
    .select('*')
    .eq('id', payload.record.event_id)
    .single();

  const notifications = participants
    ?.filter((p) => p.profile?.expo_push_id)
    .map((p) => ({
      user_id: p.user_id,
      title: event?.name,
      subtitle: sender?.full_name,
      body: payload.record.content,
      data: {
        link: 'chat',
        event_id: payload.record.event_id,
      },
    }));

  const { data, error } = await supabase
    .from('notification')
    .insert(notifications ?? []);

  if (error) {
    console.error(error.message);
  }

  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
  });
});
