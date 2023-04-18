'use client';

import {
    EventResponseSuccess,
    JoinEventResponseSuccess,
} from '@/features/events';
import { getFirstItem } from '@/lib';
import { formatDate } from '@/lib/tsUtils';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import {
    Button,
    Card,
    CustomImage,
    Flex,
    ImageHorizontalContainer,
    Text,
} from '../common';
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
    <Flex className="w-full p-1" direction="row">
      <Card className="w-full relative">
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
              className="h-full w-2/3 relative rounded-t-md"
            >
              <CustomImage
                src={event.spot.image[0]}
                alt="hiking"
                fullWidth
                height={150}
                className="rounded-l-md"
                style={{
                  objectFit: 'cover',
                }}
              />

              <Link
                className="absolute top-0 left-0"
                href={`/events/${event.id}`}
                target="_blank"
              >
                <Button text="see event" icon="eye" iconOnly />
              </Link>
            </Flex>
          )}
          <Flex fullSize direction="column" gap={0} horizontalAlign="stretch">
            <Flex
              fullSize
              direction="row"
              verticalAlign="center"
              horizontalAlign="stretch"
            >
              <Flex
                direction="column"
                verticalAlign="top"
                horizontalAlign="center"
                className="w-full p-2 border-b border-white-300 dark:border-dark-300"
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
                  color="text-brand-300 dark:text-brand-100"
                >
                  {event.name}
                </Text>
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
                      <ImageHorizontalContainer
                        images={participations.map((participation) => ({
                          src: getFirstItem(participation?.user)?.avatar_url,
                          alt: getFirstItem(participation?.user)?.username,
                        }))}
                      />
                    )}
                  </Flex>
                  <Text variant="caption" color="text-brand-300">
                    {getFirstItem(event.creator).username}
                  </Text>
                </div>
              )}
              <Text variant="caption" className="tracking-widest">
                <strong>{participations.length}</strong>
                <span className="opacity-70">/{event.places}</span>
              </Text>
            </Flex>
            <Flex
              className="w-full p-1"
              direction="row"
              verticalAlign="center"
              horizontalAlign="right"
            >
              <JoinEventButton
                event={event}
                onClick={handleEventParticipationButtonClick}
                className="block"
              />
            </Flex>
          </Flex>
        </Flex>
      </Card>
    </Flex>
  );
};
