'use client';

import { Flex, Table } from '@/components/common';
import { EventUpdatePanel, TEventInsert } from '@/components/event';
import { ListEventsFromCreatorResponseSuccess } from '@/features/events';
import { GetSpotResponseSuccess, ISpotExtended } from '@/features/spots';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export type TEventsTableProps = {
  events: NonNullable<ListEventsFromCreatorResponseSuccess>;
  ssrSpots?: ISpotExtended[];
};

export const EventsTable = ({ events, ssrSpots }: TEventsTableProps) => {
  const queryParams = useSearchParams();
  const [eventToUpdate, setEventToUpdate] = useState<TEventInsert | null>(null);
  const [spotAssociated, setSpotAssociated] =
    useState<GetSpotResponseSuccess | null>(null);

  const handleUpdateEvent = (event: TEventInsert) => {
    console.log(event);
    const spot = ssrSpots?.find((spot) => spot.id === event.spot_id);
    if (spot) {
      console.log(spot);
      setSpotAssociated(spot);
    }

    setEventToUpdate(event);
  };

  useEffect(() => {
    if (queryParams?.get('event_id')) {
      const event = events.find(
        (event) => event.id === queryParams.get('event_id'),
      );
      if (event) {
        handleUpdateEvent(event);
      }
    }
  }, [queryParams]);

  return (
    <Flex
      fullSize={true}
      verticalAlign="center"
      horizontalAlign="center"
      className="p-3 pt-0"
    >
      <Table rows={events} onRowClick={handleUpdateEvent} />
      {eventToUpdate && (
        <EventUpdatePanel
          showButton={false}
          initialPanelState={true}
          ssrSpots={ssrSpots}
          initialEvent={{
            ...eventToUpdate,
            start_at: new Date(eventToUpdate?.start_at)
              .toISOString()
              .replace('Z', ''),
            end_at: eventToUpdate?.end_at
              ? new Date(eventToUpdate?.end_at || '')
                  .toISOString()
                  .replace('Z', '')
              : '',
          }}
          spot={spotAssociated}
          onClose={() => setEventToUpdate(null)}
          onConfirm={() => setEventToUpdate(null)}
        />
      )}
    </Flex>
  );
};
