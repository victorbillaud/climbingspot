import { SpotEventsResponseSuccess } from '@/features/events';
import React from 'react';
import { EventCard } from './EventCard';

export const EventContainer: React.FC<{
  events: NonNullable<SpotEventsResponseSuccess>;
}> = ({ events }) => {
  return (
    <div className="w-full grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {events.map((event) => (
        <EventCard showImage={false} key={event.id} event={event} />
      ))}
    </div>
  );
};
