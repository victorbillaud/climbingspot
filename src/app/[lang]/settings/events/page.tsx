import { Flex, Icon, Text } from '@/components/common';
import { EventCreatePanel } from '@/components/event';
import { listEventsFromCreator } from '@/features/events';
import { listMapSpots } from '@/features/spots';
import { Database } from '@/lib/db_types';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { EventsTable } from './EventsTable';

export default async function Page() {
  const cookieStore = cookies();
  const supabase = createServerComponentClient<Database>({
    cookies: () => cookieStore,
  });

  const user = await supabase.auth.getUser();

  if (!user) {
    return (
      <Flex fullSize verticalAlign="center" horizontalAlign="center">
        <Text variant="caption">You must be logged in to view this page.</Text>
      </Flex>
    );
  }

  const { events } = await listEventsFromCreator({
    client: supabase,
    creatorId: user.data.user?.id as string,
  });

  const { spots } = await listMapSpots({
    client: supabase,
  });

  return (
    <>
      <Flex
        className="w-full p-3 pb-0"
        direction="row"
        verticalAlign="center"
        horizontalAlign="stretch"
      >
        <Text variant="subtitle">Manage my events</Text>
        <EventCreatePanel ssrSpots={spots} />
      </Flex>
      {events ? (
        events.length > 0 ? (
          <EventsTable events={events} ssrSpots={spots} />
        ) : (
          <Flex fullSize verticalAlign="center" horizontalAlign="center">
            <Text variant="caption">No events found.</Text>
          </Flex>
        )
      ) : (
        <Flex fullSize verticalAlign="center" horizontalAlign="center">
          <Text variant="caption">Searching for spots...</Text>
          <Icon name="spin" className="animate-spin" />
        </Flex>
      )}
    </>
  );
}
