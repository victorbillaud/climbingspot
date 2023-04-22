import { Flex, Icon, Text } from '@/components/common';
import { Navigation } from '@/components/event';
import { JoinEventButton } from '@/components/event/JoinEventButton';
import { ChatContainer } from '@/components/messages';
import { SpotCardSmall } from '@/components/spot';
import { getEvent } from '@/features/events';
import { Locale } from '@/i18n';
import { formatDate, getFirstItem } from '@/lib';
import { createClient } from '@/lib/supabase/server';
import React from 'react';

type Props = {
  children: React.ReactNode;
  params: {
    lang: Locale;
    uid: string;
  };
};

export default async function RootLayout({ params, children }: Props) {
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

  const participants = Array.isArray(event.participations)
    ? event.participations.map((participation) => ({
        ...participation,
        user: getFirstItem(participation.user),
      }))
    : [];

  let userIsParticipant = participants.find(
    (participation) => participation?.user_id === session?.user?.id,
  );

  const [startDay, startHours] = formatDate(new Date(event.start_at)).split(
    '#',
  );

  return (
    <Flex
      direction="row"
      horizontalAlign="stretch"
      gap={0}
      className="h-full w-full mx-auto md:w-11/12 lg:w-5/6 p-3 relative"
    >
      <Flex
        fullSize
        verticalAlign="center"
        horizontalAlign="left"
        className="p-0 md:p-3"
      >
        <div className="w-full flex flex-col md:flex-row items-top justify-center gap-3">
          <Flex
            className="w-full py-3"
            direction="column"
            verticalAlign="top"
            horizontalAlign="center"
          >
            <Text variant="h1">{event.name}</Text>
            <Flex direction="row" gap={3} className="opacity-80">
              <Text variant="body">
                <strong>{startDay.toUpperCase()}</strong>
              </Text>
              <Text variant="body" color="text-brand-300">
                {startHours}
              </Text>
            </Flex>
            <Flex direction="row" gap={3}>
              <Text variant="caption" className="tracking-widest">
                <strong>{participants.length}</strong>
                <span className="opacity-70">/{event.places}</span>
              </Text>
              <JoinEventButton
                event={event}
                className="flex items-center justify-center"
              />
            </Flex>
          </Flex>
          <Flex className="hidden md:flex w-full">
            <Icon name="arrow-right" className="opacity-40" scale={2} />
          </Flex>
          <SpotCardSmall spot={event.spot} imageHeight={100} />
        </div>

        <Navigation lang={params.lang} uid={params.uid} />
        {children}
      </Flex>
      {session && userIsParticipant && <ChatContainer eventId={event.id} />}
    </Flex>
  );
}
