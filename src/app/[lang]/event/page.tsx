import { Flex, Text } from '@/components/common';
import { EventCard } from '@/components/event';
import { listEvents } from '@/features/events';
import { logger } from '@/lib/logger';
import { createClient } from '@/lib/supabase/server';

export default async function Page() {
  const supabase = createClient();
  const { events, count } = await listEvents({
    client: supabase,
  });

  logger.info(events);

  if (!events || count === 0) {
    return (
      <Flex fullSize>
        <Text variant="caption">There are no events</Text>
      </Flex>
    );
  }

  return (
    <Flex className="w-4/6 p-2" direction="row">
      <div className="h-full w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {events.map((event) => (
          <EventCard event={event} key={event.id} />
        ))}
      </div>
    </Flex>
  );
}
