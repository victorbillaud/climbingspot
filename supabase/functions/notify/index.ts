// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

export async function sendPushNotification({
  expoPushToken: expoPushTokens,
  title,
  subtitle,
  body,
  data,
}: {
  expoPushToken: string[];
  title: string;
  subtitle: string;
  body: string;
  data: object;
}) {
  const message = {
    to: expoPushTokens,
    sound: 'default',
    subtitle: subtitle,
    title,
    body,
    data,
  };

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  }).then(async (response) => {
    console.log(await response.json());
  });
}

serve(async (req) => {
  try {
    const message = await req.json();
    console.log(message);
    await sendPushNotification({
      expoPushToken: message.expo_push_ids.filter(
        (item: string | null) => item !== null,
      ),
      title: message.event_detail.name,
      body: message.message_content,
      subtitle: message.user_detail.username || message.user_detail.full_name,
      data: message,
    });
    return new Response(JSON.stringify({ message: 'Success', ...message }));
  } catch (error) {
    console.error(error);
    return new Response('Error', { status: 500 });
  }
});
