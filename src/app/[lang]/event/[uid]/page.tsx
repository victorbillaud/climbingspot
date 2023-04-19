import { Flex } from '@/components/common';
import { EventDetailedCard } from '@/components/event';
import { ChatContainer } from '@/components/messages';
import { getEvent } from '@/features/events';
import { Locale } from '@/i18n';
import { createClient } from '@/lib/supabase/server';

type Props = {
  params: {
    lang: Locale;
    uid: string;
  };
};

export default async function Page({ params }: Props) {
  const supabase = createClient();
  const {
    data: { session: session },
  } = await supabase.auth.getSession();

  const { event } = await getEvent({
    client: supabase,
    eventId: params.uid,
  });

  if (!event) {
    return null;
  }

  return (
    <Flex
      fullSize
      direction="row"
      horizontalAlign="stretch"
      gap={0}
      className="relative"
    >
      <Flex className="w-full p-3">
        <EventDetailedCard event={event} />
      </Flex>
      {session && <ChatContainer eventId={event.id} />}
    </Flex>
  );
}
