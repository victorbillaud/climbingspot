import { Card, Flex, Text } from '@/components/common';
import { EventDetailedCard } from '@/components/event';
import Footer from '@/components/footer/Footer';
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
      <Flex
        direction="row"
        horizontalAlign="stretch"
        gap={0}
        verticalAlign="top"
        className="w-full mx-auto md:w-11/12 lg:w-5/6"
      >
        <Flex
          className="w-full p-3 pr-0"
          direction="column"
          horizontalAlign="left"
        >
          <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-3">
            {events.map((event) => (
              <EventDetailedCard event={event} key={event.id} />
            ))}
          </div>
        </Flex>
        <Flex className="sticky top-0 w-1/4 p-3" horizontalAlign="left">
          <Card className=" top-3 w-full p-3 shadow-lg">
            <Text variant="caption">This is a card</Text>
          </Card>
        </Flex>
      </Flex>
      <Footer />
    </Flex>
  );
}
