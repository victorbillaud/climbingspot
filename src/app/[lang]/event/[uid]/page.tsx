import { Flex, Text } from '@/components/common';
import { ShareButton } from '@/components/event';
import { getEvent } from '@/features/events';
import { getSpotFromId } from '@/features/spots';
import { Locale } from '@/i18n';
import { getFirstItem } from '@/lib';
import { Database } from '@/lib/db_types';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

type Props = {
  params: {
    lang: Locale;
    uid: string;
  };
};

export default async function Page({ params }: Props) {
  const cookieStore = cookies();
  const supabase = createServerComponentClient<Database>({
    cookies: () => cookieStore,
  });

  const { event } = await getEvent({
    client: supabase,
    eventId: params.uid,
  });

  if (!event) {
    return null;
  }

  const { spot } = await getSpotFromId({
    client: supabase,
    id: event.spot_id,
  });

  return (
    <Flex
      fullSize
      gap={1}
      verticalAlign="top"
      horizontalAlign="stretch"
      className="mt-2"
    >
      <Flex
        fullSize
        direction="column"
        verticalAlign="top"
        horizontalAlign="left"
        gap={6}
      >
        <Flex verticalAlign="top" gap={0}>
          <Text variant="caption" className="opacity-70">
            Name
          </Text>
          <Text variant="body">{event.name}</Text>
        </Flex>
        <Flex verticalAlign="top" gap={0}>
          <Text variant="caption" className="opacity-70">
            Description
          </Text>
          <Text variant="body">{event.description}</Text>
        </Flex>
        <Flex
          className="w-full"
          direction="row"
          verticalAlign="center"
          horizontalAlign="left"
          gap={8}
        >
          <Flex verticalAlign="top" gap={0}>
            <Text variant="caption" className="opacity-70">
              Start date
            </Text>
            <Text variant="body">
              {new Date(event.start_at).toLocaleString(params.lang, {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
              })}
            </Text>
          </Flex>

          {event.end_at && (
            <Flex verticalAlign="top" gap={0}>
              <Text variant="caption" className="opacity-70">
                End date
              </Text>
              <Text variant="body">
                {new Date(event.end_at).toLocaleString(params.lang, {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                })}
              </Text>
            </Flex>
          )}
        </Flex>
        <Flex verticalAlign="top" gap={0}>
          <Text variant="caption" className="opacity-70">
            Place left
          </Text>
          <Text variant="body">
            {event.places - event.participations.length}
          </Text>
        </Flex>
        {spot && (
          <Flex
            verticalAlign="top"
            gap={3}
            className="w-full py-3 border-t border-white-200 dark:border-dark-300"
          >
            <Text variant="caption" className="opacity-70">
              Spot Details
            </Text>
            <div className="w-full flex flex-col md:flex-row md:justify-between md:pr-10 gap-3 md:gap-16">
              <Flex verticalAlign="top" gap={0}>
                <Text variant="caption" className="opacity-70">
                  Name
                </Text>
                <Text variant="body">{spot?.name}</Text>
              </Flex>
              <Flex verticalAlign="top" gap={0}>
                <Text variant="caption" className="opacity-70">
                  Type
                </Text>
                <Text variant="body">{spot?.type}</Text>
              </Flex>
              <Flex verticalAlign="top" gap={0}>
                <Text variant="caption" className="opacity-70">
                  Difficulty
                </Text>
                <Text variant="body">{spot?.difficulty}</Text>
              </Flex>
              <Flex verticalAlign="top" gap={0}>
                <Text variant="caption" className="opacity-70">
                  City
                </Text>
                <Text variant="body">{spot?.location.city}</Text>
              </Flex>
            </div>
          </Flex>
        )}
      </Flex>
      <Flex
        fullSize
        direction="row"
        verticalAlign="bottom"
        horizontalAlign="stretch"
        gap={1}
      >
        <Flex>
          <ShareButton event={event} />
        </Flex>
        {event.creator && (
          <Flex horizontalAlign="right" verticalAlign="bottom" gap={0}>
            <Text variant="caption">Created by</Text>
            <Text variant="body">
              {getFirstItem(event.creator).username ||
                getFirstItem(event.creator).full_name}
            </Text>
          </Flex>
        )}
      </Flex>
    </Flex>
  );
}
