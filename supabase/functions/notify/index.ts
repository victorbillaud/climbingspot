import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

console.log('Hello from Functions!');

interface Notification {
  id: string;
  user_id: string;
  title: string;
  subtitle: string;
  body: string;
  data: string;
}

interface WebhookPayload {
  type: 'INSERT' | 'UPDATE' | 'DELETE';
  table: string;
  record: Notification;
  schema: 'public';
  old_record: null | Notification;
}

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

Deno.serve(async (req) => {
  const payload: WebhookPayload = await req.json();

  const { data } = await supabase
    .from('profiles')
    .select('expo_push_id')
    .eq('id', payload.record.user_id)
    .single();

  const notification: any = {
    to: data?.expo_push_id,
    sound: 'default',
    title: payload.record.title,
    body: payload.record.body,
  };

  if (payload.record.data) {
    notification.data = payload.record.data;
  }

  if (payload.record.subtitle) {
    notification.subtitle = payload.record.subtitle;
  }

  const res = await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${Deno.env.get('EXPO_ACCESS_TOKEN')}`,
    },
    body: JSON.stringify(notification),
  }).then((res) => res.json());

  if (res.errors) {
    console.error(res.errors);
  }

  return new Response(JSON.stringify(res), {
    headers: { 'Content-Type': 'application/json' },
  });
});
