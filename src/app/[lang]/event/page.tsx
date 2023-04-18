import { Flex, Text } from '@/components/common';
import { EventDetailedCard } from '@/components/event';
import { listEvents } from '@/features/events';
import { createClient } from '@/lib/supabase/server';

export default async function Page() {
  const supabase = createClient();
  const { events, count } = await listEvents({
    client: supabase,
  });

  if (!events || count === 0) {
    return (
      <Flex fullSize>
        <Text variant="caption">There are no events</Text>
      </Flex>
    );
  }

  return (
    <Flex
      className="h-full w-full p-3 pr-0"
      direction="column"
      horizontalAlign="left"
    >
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-3">
        {events.map((event) => (
          <EventDetailedCard event={event} key={event.id} />
        ))}
      </div>
    </Flex>
  );
}

//md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
