// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from 'https://deno.land/std@0.198.0/http/server.ts';

console.log(`Function "telegram-bot" up and running!`);

import { Bot, webhookCallback } from 'https://deno.land/x/grammy@v1.8.3/mod.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import { Database } from '../_shared/db_types.ts';

const bot = new Bot(Deno.env.get('TELEGRAM_BOT_TOKEN') || '');

const supabase = createClient<Database>(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

bot.command('start', (ctx) => {
  console.log(ctx);
  ctx.reply('Welcome! Up and running.');
});

bot.command('ping', (ctx) => ctx.reply(`Pong! ${new Date()} ${Date.now()}`));

bot.on('callback_query', async function onCallbackQuery(callbackQuery) {
  const [type, spotId] = callbackQuery.update.callback_query.data.split(':');

  const { data: spot, error } = await supabase
    .from('spots')
    .select('*')
    .eq('id', spotId)
    .single();

  if (error || !spot) {
    callbackQuery.reply('Error occurred while fetching spot');
    return;
  }

  try {
    if (type === 'approve_spot') {
      if (spot.status === 'Accepted') {
        await callbackQuery.reply(`Spot already ${spot.name} approved`);
        return;
      } else if (spot.status === 'Pending') {
        await supabase
          .from('spots')
          .update({ status: 'Accepted' })
          .eq('id', spot.id);

        await supabase.from('notification').insert({
          user_id: spot.creator,
          title: `Spot ${spot.name} approved`,
          body: 'Your spot has been approved',
          data: {
            link: 'spot',
            spot_id: spot.id,
          },
        });

        await callbackQuery.reply(`Spot ${spot.name} approved`);
        return;
      }
    }

    if (type === 'reject_spot') {
      await supabase
        .from('spots')
        .update({ status: 'Pending' })
        .eq('id', spot.id);

      await supabase.from('notification').insert({
        user_id: spot.creator,
        title: `Spot ${spot.name} rejected`,
        body: `Contact admin for more details`,
      });

      await callbackQuery.reply(`Spot ${spot.name} rejected`);

      return;
    }
  } catch (error) {
    await callbackQuery.reply(error.message);
    return;
  }

  return;
});

const handleUpdate = webhookCallback(bot, 'std/http');

serve(async (req) => {
  try {
    const url = new URL(req.url);
    if (url.searchParams.get('secret') !== Deno.env.get('FUNCTION_SECRET')) {
      return new Response('not allowed', { status: 405 });
    }

    return await handleUpdate(req);
  } catch (err) {
    console.error(err);
  }
});
