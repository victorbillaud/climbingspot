'use client';

import { EventResponseSuccess, joinEvent } from '@/features/events';
import React from 'react';
import { toast } from 'react-toastify';
import { useSupabase } from '../auth/SupabaseProvider';
import { Button } from '../common';

export const JoinEventButton: React.FC<{
  event: NonNullable<EventResponseSuccess>;
  // eslint-disable-next-line no-unused-vars
  onJoinEvent?: (participation: any) => void;
}> = ({ event, onJoinEvent }) => {
  const { supabase } = useSupabase();

  const handleJoinEvent = async () => {
    const session = await supabase.auth.getSession();

    if (!session) {
      toast.error('You must be logged in to join an event');
      return;
    }

    const { participation, error } = await joinEvent({
      client: supabase,
      eventId: event.id,
      userId: session?.data.session?.user.id as string,
    });

    if (error) {
      toast.error(error.message);
    }

    if (participation) {
      onJoinEvent && onJoinEvent(participation);
      toast.success('You have joined the event');
    }
  };

  return (
    <Button
      text="Join"
      className="absolute bottom-[-20px] right-0 m-2"
      variant="secondary"
      size="small"
      onClick={handleJoinEvent}
    />
  );
};
