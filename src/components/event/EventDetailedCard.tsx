'use client';

import {
  EventResponseSuccess,
  JoinEventResponseSuccess
} from '@/features/events';
import { formatDate, getFirstItem } from '@/lib/tsUtils';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { Button, Card, CustomImage, Flex, Text } from '../common';
import { UserHorizontalAvatars } from '../user';
import { JoinEventButton } from './JoinEventButton';

export type TEventDetailedCardProps = {
  event: NonNullable<EventResponseSuccess>;
  showImage?: boolean;
};

export const EventDetailedCard: React.FC<TEventDetailedCardProps> = ({
  event,
  showImage = true,
}) => {
  const router = useRouter();
  const [startDay, startHours] = formatDate(new Date(event.start_at)).split(
    '#',
  );

  const [participations, setParticipations] = React.useState<
    JoinEventResponseSuccess[]
  >(event.participations);

  const handleEventParticipationButtonClick = () => {
    router.refresh();
  };

  useEffect(() => {
    setParticipations(event.participations);
  }, [event.participations]);

  return (
    <Flex className="w-full" direction="row">
      <Card className="w-full h-full relative">
        <Flex
          fullSize
          direction="row"
          verticalAlign="center"
          gap={0}
          className="divide-x divide-white-300 dark:divide-dark-300"
        >
          {showImage && (
            <Flex
              direction="row"
              verticalAlign="center"
              horizontalAlign="left"
              className="h-full w-1/3 relative rounded-t-md"
            >
              {event?.spot?.image && event.spot.image.length > 0 ? (
                <CustomImage
                  src={getFirstItem(event.spot.image)}
                  alt="hiking"
                  fullWidth
                  height={130}
                  className="rounded-l-md"
                  style={{
                    objectFit: 'cover',
                  }}
                />
              ) : (
                <CustomImage
                  src="/hiking.png"
                  alt="hiking"
                  fullWidth
                  height={130}
                  className="rounded-l-md"
                  style={{
                    objectFit: 'cover',
                  }}
                />
              )}

              <Link
                className="absolute top-0 left-0"
                href={`/event/${event.id}`}
                target="_blank"
              >
                <Button text="see event" icon="eye" iconOnly />
              </Link>
            </Flex>
          )}
          <Flex
            className="h-full w-9/12"
            direction="column"
            gap={0}
            horizontalAlign="stretch"
          >
            <Flex
              fullSize
              direction="row"
              verticalAlign="top"
              horizontalAlign="stretch"
              gap={0}
            >
              <Flex
                direction="row"
                verticalAlign="center"
                horizontalAlign="stretch"
                className="w-full p-2 relative border-b border-white-300 dark:border-dark-300"
                gap={0}
              >
                <Flex
                  className="w-full"
                  direction="column"
                  verticalAlign="top"
                  horizontalAlign="center"
                  gap={0}
                >
                  <Flex direction="row" gap={3} className="opacity-80">
                    <Text variant="overline">
                      <strong>{startDay.toUpperCase()}</strong>
                    </Text>
                    <Text variant="overline" color="text-brand-300">
                      {startHours}
                    </Text>
                  </Flex>
                  <Text
                    variant="subtitle"
                    className="truncate"
                    color="text-brand-300 dark:text-brand-100"
                  >
                    {event.name}
                  </Text>
                </Flex>
                <JoinEventButton
                  event={event}
                  onClick={handleEventParticipationButtonClick}
                  className="block"
                />
              </Flex>
              {!showImage && (
                <Link
                  href={`/events/${event.id}`}
                  target="_blank"
                  className="p-2"
                >
                  <Button text="see event" icon="eye" iconOnly />
                </Link>
              )}
            </Flex>
            <Flex
              fullSize
              direction="row"
              verticalAlign="bottom"
              horizontalAlign="stretch"
              className="p-2"
            >
              {event.creator && (
                <div>
                  <Flex direction="row" gap={1}>
                    {participations && (
                      <UserHorizontalAvatars
                        users={participations.map((p) => ({
                          id: p?.user_id,
                          ...p?.user,
                        }))}
                      />
                    )}
                  </Flex>
                </div>
              )}
              <Text variant="caption" className="tracking-widest">
                <strong>{participations.length}</strong>
                <span className="opacity-70">/{event.places}</span>
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </Card>
    </Flex>
  );
};
