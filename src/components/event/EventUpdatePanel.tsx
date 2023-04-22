import { Button, Flex, FloatingPanel, Text } from '@/components/common';
import { updateEvent } from '@/features/events';
import { GetSpotResponseSuccess } from '@/features/spots';
import useCustomForm from '@/features/spots/hooks';
import { useToggle } from '@/hooks';
import { logger } from '@/lib/logger';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useSupabase } from '../auth/SupabaseProvider';
import { EventForm } from './EventForm';
import { EventParticipations } from './EventParticipations';
import { TEventUpdate, TEventUpdateModalProps } from './types';

export const EventUpdatePanel = ({
  initialEvent,
  initialPanelState = false,
  showButton = true,
  spot,
  ssrSpots,
  onClose,
  onConfirm,
}: TEventUpdateModalProps) => {
  const { supabase, user } = useSupabase();
  const router = useRouter();
  const [spotSelected, setSpotSelected] =
    useState<GetSpotResponseSuccess | null>(spot || null);

  const [panelOpen, openPanel, closePanel] = useToggle(initialPanelState);

  const [formEvent, setFormEvent] = useCustomForm<TEventUpdate>(
    initialEvent as TEventUpdate,
  );

  const handleUpdateEvent = async (event: TEventUpdate) => {
    const { event: eventUpdated, error } = await updateEvent({
      client: supabase,
      event,
    });

    if (error) {
      toast.error("Couldn't update event");
      logger.error(error);
      logger.debug(event);
      logger.debug(initialEvent);
      return;
    }

    if (eventUpdated) {
      logger.debug(eventUpdated);
      return eventUpdated;
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error('You must be logged in to update an event');
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

    const eventUpdated = await handleUpdateEvent({
      id: formEvent.id,
      description: formEvent.description,
      spot_id: spotSelected?.id || formEvent.spot_id,
      name: formEvent.name,
      start_at: new Date(formEvent.start_at).toISOString(),
      end_at: formEvent.end_at
        ? new Date(formEvent.end_at).toISOString()
        : null,
      places: formEvent.places,
    });

    if (eventUpdated) {
      onConfirm && onConfirm(eventUpdated);
      return eventUpdated;
    }
  };

  return (
    <>
      {showButton && (
        <Button
          text="Update event"
          variant="default"
          onClick={() => openPanel()}
        />
      )}
      {panelOpen && (
        <FloatingPanel
          isOpen={panelOpen}
          title="Update event"
          onClose={() => {
            logger.info('Closing panel');
            closePanel();
            onClose && onClose();
          }}
          size="medium"
          onConfirm={async () => {
            const eventUpdated = await handleSubmit();
            if (eventUpdated) {
              toast.success('Event updated');
              router.refresh();
              closePanel();
            }
          }}
          forceValidation
          forceValidationMessage="If you close the panel, you will lose all the data you have entered. Are you sure you want to close the panel?"
        >
          <Flex
            className="w-full h-full overflow-y-auto divide-y divide-white-300 dark:divide-dark-300"
            gap={0}
          >
            <EventForm
              form={formEvent}
              setForm={setFormEvent}
              spotSelected={spotSelected}
              setSpotSelected={setSpotSelected}
              ssrSpots={ssrSpots}
              initialSpot={spot}
            />
            {initialEvent && (
              <Flex
                className="w-full p-3"
                direction="column"
                verticalAlign="top"
              >
                <Text variant="body" className="p-3" color="text-brand-500">
                  Participations
                </Text>
                <Flex
                  className="w-full p-3"
                  direction="column"
                  verticalAlign="top"
                >
                  <EventParticipations event={initialEvent} />
                </Flex>
              </Flex>
            )}
          </Flex>
        </FloatingPanel>
      )}
    </>
  );
};
