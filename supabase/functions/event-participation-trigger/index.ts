import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import { Database, Tables } from '../_shared/db_types.ts';

interface WebhookPayload {
  type: 'INSERT' | 'UPDATE' | 'DELETE';
  table: string;
  record: Tables<'events_participations'>;
  schema: 'public';
  old_record: null | Event;
}

const supabase = createClient<Database>(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

Deno.serve(async (req) => {
  const payload: WebhookPayload = await req.json();

  if (payload.type !== 'INSERT') {
    return new Response(null, { status: 200 });
  }

  const { data: sender } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', payload.record.user_id)
    .single();

  const { data: event } = await supabase
    .from('events')
    .select('*')
    .eq('id', payload.record.event_id)
    .single();

  if (!event) {
    return new Response(null, { status: 404 });
  }

  const { data, error } = await supabase.from('notification').insert([
    {
      user_id: event.creator_id,
      title: event?.name,
      body: `${sender?.full_name} joined your event`,
      data: {
        link: 'event',
        event_id: payload.record.event_id,
      },
    },
  ]);

  if (error) {
    console.error(error.message);
  }

  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
  });
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://host.docker.internal:54321/functions/v1/event-participation-trigger' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
