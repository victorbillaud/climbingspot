import { Card, Flex, Text } from '@/components/common';
import { EventDetailedCard } from '@/components/event';
import Footer from '@/components/footer/Footer';
import {
  listEvents,
  listFriendsEvents,
  listUserEvents
} from '@/features/events';
import { Database } from '@/lib/db_types';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export default async function Page() {
  const cookieStore = cookies();
  const supabase = createServerComponentClient<Database>({
    cookies: () => cookieStore,
  });
  const user = await supabase.auth.getUser();

  const { events: userEvents } = user
    ? await listUserEvents({
        client: supabase,
        userId: user.data.user?.id || '',
      })
    : { events: [] };

  const { events: friendEvents } = user
    ? await listFriendsEvents({
        client: supabase,
        userId: user.data.user?.id as string,
      })
    : { events: [] };

  const { events: allEvents, count } = await listEvents({
    client: supabase,
  });

  const events = allEvents?.filter(
    (event) =>
      !friendEvents?.find((e) => e.id === event.id) &&
      !userEvents?.find((e) => e.id === event.id),
  );

  if (!events || count === 0) {
    return (
      <Flex fullSize>
        <Text variant="caption">There is no events</Text>
      </Flex>
    );
  }

  return (
    <Flex
      direction="column"
      horizontalAlign="stretch"
      gap={3}
      className="h-full w-full relative"
    >
      <div className="flex flex-col-reverse md:flex-row items-stretch justify-start gap-0 w-full mx-auto md:w-11/12 lg:w-5/6">
        <Flex
          className="w-full p-3 md:pr-0"
          direction="column"
          horizontalAlign="left"
          verticalAlign="stretch"
        >
          {userEvents && userEvents.length > 0 && (
            <>
              <Text variant="h4" weight={400} className="opacity-75">
                My events
              </Text>
              <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-3">
                {userEvents.map((event) => (
                  <EventDetailedCard event={event} key={event.id} />
                ))}
              </div>
            </>
          )}

          {friendEvents && friendEvents.length > 0 && (
            <>
              <Text variant="h4" weight={400} className="opacity-75">
                My friends participates to
              </Text>
              <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-3">
                {friendEvents.map((event) => (
                  <EventDetailedCard event={event} key={event.id} />
                ))}
              </div>
            </>
          )}
          <Text variant="h3" weight={400} className="opacity-75">
            All events
          </Text>
          {events && events.length > 0 ? (
            <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-3">
              {events.map((event) => (
                <EventDetailedCard event={event} key={event.id} />
              ))}
            </div>
          ) : (
            <Flex className="w-full" horizontalAlign="center">
              <Text variant="caption">There is no events</Text>
            </Flex>
          )}
        </Flex>
        <Flex
          className="sticky top-0 w-full md:w-1/4 p-3 pb-0 md:pb-3"
          horizontalAlign="left"
          verticalAlign="stretch"
        >
          <Text variant="h4" weight={400} className="opacity-75">
            Filters
          </Text>
          <Card className=" top-3 w-full p-3 shadow-lg">
            <Text variant="caption">This is a card</Text>
          </Card>
        </Flex>
      </div>
      <Footer />
    </Flex>
  );
}
