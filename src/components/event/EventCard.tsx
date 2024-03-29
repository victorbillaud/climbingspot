'use client';

import {
  EventResponseSuccess,
  JoinEventResponseSuccess,
} from '@/features/events';
import { formatDate } from '@/lib/tsUtils';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import {
  Button,
  Card,
  CustomImage,
  Flex,
  Text
} from '../common';
import { UserHorizontalAvatars } from '../user';
import { JoinEventButton } from './JoinEventButton';

export type TEventCardProps = {
  event: NonNullable<EventResponseSuccess>;
  showImage?: boolean;
};

export const EventCard: React.FC<TEventCardProps> = ({
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
    <Card className="w-full">
      <Flex
        fullSize
        direction="column"
        verticalAlign="center"
        gap={0}
        className="divide-y divide-white-300 dark:divide-dark-300"
      >
        {showImage && (
          <Flex
            fullSize
            direction="row"
            verticalAlign="center"
            horizontalAlign="left"
            className="relative rounded-t-md"
          >
            <CustomImage
              src="/hiking.png"
              alt="hiking"
              fullWidth
              height={100}
              rounded="md"
              style={{
                objectFit: 'cover',
                objectPosition: 'top -20px left 50%',
              }}
            />
            <JoinEventButton
              event={event}
              onClick={handleEventParticipationButtonClick}
            />
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
          fullSize
          direction="row"
          verticalAlign="center"
          horizontalAlign="stretch"
        >
          <Flex
            fullSize
            direction="column"
            verticalAlign="top"
            horizontalAlign="left"
            className="p-2"
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
              className="w-full"
              color="text-brand-300 dark:text-brand-100 truncate"
            >
              {event.name}
            </Text>
          </Flex>
          {!showImage && (
            <Link href={`/event/${event.id}`} target="_blank" className="p-2">
              <Button text="see event" icon="eye" iconOnly />
            </Link>
          )}
        </Flex>
        <Flex
          fullSize
          direction="row"
          verticalAlign="center"
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
    </Card>
  );
};
