// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { Bot } from 'https://deno.land/x/grammy@v1.8.3/mod.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import { Database, Tables } from '../_shared/db_types.ts';

interface WebhookPayload {
  type: 'INSERT' | 'UPDATE' | 'DELETE';
  table: string;
  record: Tables<'spots'>;
  schema: 'public';
  old_record: null | Event;
}

const supabase = createClient<Database>(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

const USER_ID = '6007957930';

console.log(
  `Bot "telegram-bot" up and running!`,
  Deno.env.get('TELEGRAM_BOT_TOKEN'),
);

const bot = new Bot(Deno.env.get('TELEGRAM_BOT_TOKEN') || '');

Deno.serve(async (req) => {
  try {
    const payload: WebhookPayload = await req.json();

    if (payload.type !== 'INSERT' || payload.table !== 'spots') {
      return new Response('Not a spot creation', { status: 200 });
    }

    const { data: location, error } = await supabase
      .from('locations')
      .select('*')
      .eq('id', payload.record.location)
      .single();

    const { data: user, error: userError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', payload.record.creator)
      .single();

    const htmlDetailsMessage = `
<b>New spot created:</b>
- <b>ID</b>: ${payload.record.id}
- <b>Name</b>: ${payload.record.name}
- <b>Description</b>: ${payload.record.description}
- <b>Difficulty</b>: ${payload.record.difficulty}
- <b>Approach</b>: ${payload.record.approach}
- <b>Type</b>: ${payload.record.type}
- <b>Image</b>: ${payload.record.image}
- <b>Created at</b>: ${new Date(payload.record.created_at).toLocaleString()}


<b>Creator:</b>
- <b>ID</b>: ${user?.id}
- <b>Name</b>: ${user?.full_name}
- <b>Username</b>: ${user?.username}
    `;

    // Create callback query

    // Send detailed message
    await bot.api.sendMessage(USER_ID, htmlDetailsMessage, {
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'Approve',
              callback_data: `approve_spot:${payload.record.id}`,
            },
            {
              text: 'Reject',
              callback_data: `reject_spot:${payload.record.id}`,
            },
          ],
        ],
      },
    });

    await bot.api.sendLocation(
      USER_ID,
      location!.latitude,
      location!.longitude,
    );

    if (payload.record.image && payload.record.image.length > 0) {
      await Promise.all(
        payload.record.image.map((image) => bot.api.sendPhoto(USER_ID, image)),
      );
    }

    return new Response('ok', { status: 200 });
  } catch (err) {
    return new Response(err.message, { status: 500 });
  }
});

// https://pbtxcelbykjcjukklxqk.supabase.co/functions/v1/trigger-spot-creation
