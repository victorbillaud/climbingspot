import { Button, FloatingPanel } from '@/components/common';
import { createEvent } from '@/features/events';
import { GetSpotResponseSuccess } from '@/features/spots';
import useCustomForm from '@/features/spots/hooks';
import { useToggle } from '@/hooks';
import { logger } from '@/lib/logger';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useSupabase } from '../auth/SupabaseProvider';
import { EventForm } from './EventForm';
import { TEventCreateModalProps, TEventInsert } from './types';

export const EventCreatePanel = ({
  initialPanelState = false,
  showButton = true,
  spot,
  ssrSpots,
  onClose,
  onConfirm,
}: TEventCreateModalProps) => {
  const { supabase, user } = useSupabase();
  const router = useRouter();
  const [spotSelected, setSpotSelected] =
    useState<GetSpotResponseSuccess | null>(spot || null);

  const [panelOpen, openPanel, closePanel] = useToggle(initialPanelState);

  const initialValues = {
    name: '',
    start_at: new Date().toISOString().replace('Z', ''),
    end_at: '',
    places: 5,
    spot_id: spotSelected?.id || '',
    creator_id: user?.id || '',
  };

  const [formEvent, setFormEvent] = useCustomForm<TEventInsert>(initialValues);

  const handleCreateEvent = async (event: TEventInsert) => {
    logger.debug(event);
    const { event: eventCreated, error } = await createEvent({
      client: supabase,
      event,
    });

    if (error) {
      toast.error("Couldn't create event");
      logger.error(error);
      return;
    }

    if (eventCreated) {
      return eventCreated;
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error('You must be logged in to create an event');
      return;
    }

    if (!spotSelected) {
      toast.error('Spot is required');
      return;
    }

    if (formEvent.name === '') {
      toast.error('Event name is required');
      return;
    }

    if (formEvent.start_at === '') {
      toast.error('Start date is required');
      return;
    }

    if (
      formEvent.start_at &&
      formEvent.end_at &&
      new Date(formEvent.start_at) > new Date(formEvent.end_at)
    ) {
      toast.error('Start date must be before end date');
      return;
    }

    if (formEvent.end_at && new Date(formEvent.end_at) < new Date()) {
      toast.error('Start date must be in the future');
      return;
    }

    const eventCreated = await handleCreateEvent({
      spot_id: spotSelected.id,
      creator_id: user.id,
      name: formEvent.name,
      start_at: new Date(formEvent.start_at).toISOString(),
      end_at: formEvent.end_at
        ? new Date(formEvent.end_at).toISOString()
        : null,
      places: formEvent.places,
    });

    if (eventCreated) {
      onConfirm && onConfirm(eventCreated);
      return eventCreated;
    }
  };

  return (
    <>
      {showButton && (
        <Button
          text="Create a new event"
          variant="default"
          onClick={() => openPanel()}
        />
      )}
      {panelOpen && (
        <FloatingPanel
          isOpen={panelOpen}
          title="Create a new event"
          onClose={() => {
            logger.info('Closing panel');
            closePanel();
            onClose && onClose();
          }}
          size="medium"
          onConfirm={async () => {
            const eventCreated = await handleSubmit();
            if (eventCreated) {
              toast.success('Event created');
              router.refresh();
              closePanel();
            }
          }}
          forceValidation
          forceValidationMessage="If you close the panel, you will lose all the data you have entered. Are you sure you want to close the panel?"
        >
          <EventForm
            form={formEvent}
            setForm={setFormEvent}
            spotSelected={spotSelected}
            setSpotSelected={setSpotSelected}
            ssrSpots={ssrSpots}
            initialSpot={spot}
          />
        </FloatingPanel>
      )}
    </>
  );
};
