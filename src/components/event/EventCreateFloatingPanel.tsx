import {
  Button,
  Flex,
  FloatingPanel,
  InputDate,
  InputText,
  Text,
} from '@/components/common';
import { createEvent } from '@/features/events';
import { GetSpotResponseSuccess } from '@/features/spots';
import useCustomForm from '@/features/spots/hooks';
import { useToggle } from '@/hooks';
import { logger } from '@/lib/logger';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useSupabase } from '../auth/SupabaseProvider';
import { SpotCardSmall, SpotSearchModal } from '../spot';
import { TEventCreateModalProps, TEventInsert } from './types';

export const EventCreateFloatingPanel = ({
  initialEvent,
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
  const [searchModalOpen, openSearchModal, closeSearchModal] = useToggle(false);

  const initialValues = initialEvent || {
    name: '',
    start_at: '',
    end_at: '',
    places: 5,
    spot_id: spotSelected?.id || '',
    creator_id: user?.id || '',
  };

  logger.info(initialValues);

  const [formEvent, setFormEvent] = useCustomForm<TEventInsert>(initialValues);

  const handleCreateEvent = async (event: TEventInsert) => {
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
      spot_id: formEvent.spot_id,
      creator_id: formEvent.creator_id,
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
          <Flex
            fullSize
            direction="column"
            horizontalAlign="left"
            gap={0}
            className="divide-y overflow-y-auto divide-white-300 dark:divide-dark-300"
          >
            <Flex
              className="w-full p-3"
              direction="column"
              horizontalAlign="left"
              verticalAlign="top"
            >
              <Flex
                fullSize
                direction="row"
                horizontalAlign="stretch"
                verticalAlign="center"
              >
                <Text variant="body" className="py-0 px-3">
                  Event details
                </Text>
                <Flex
                  direction="row"
                  horizontalAlign="right"
                  verticalAlign="center"
                >
                  <Button
                    text="Reset spot"
                    variant="primary"
                    onClick={() => setSpotSelected(spot || null)}
                  />
                  <Button
                    text="Change spot"
                    variant="default"
                    icon="loop"
                    onClick={() => openSearchModal()}
                  />
                </Flex>
                {searchModalOpen && (
                  <SpotSearchModal
                    ssrSpots={ssrSpots}
                    isOpen={searchModalOpen}
                    onClose={() => closeSearchModal()}
                    onConfirm={(spot) => {
                      setSpotSelected(spot);
                      closeSearchModal();
                    }}
                  />
                )}
              </Flex>
              {spotSelected ? (
                <SpotCardSmall spot={spotSelected} />
              ) : (
                <Flex className="w-full">
                  <Text variant="body" className="py-0 px-3 opacity-80">
                    You must select a spot
                  </Text>
                </Flex>
              )}
            </Flex>
            <Flex
              className="w-full p-3"
              direction="column"
              horizontalAlign="left"
              gap={6}
            >
              <InputText
                labelText="Event name"
                type="text"
                value={formEvent.name}
                onChange={(e) => setFormEvent.name(e.target.value)}
                className="w-full"
              />
              <InputText
                labelText="Number of participants"
                type="number"
                value={formEvent.places}
                onChange={(e) =>
                  setFormEvent.places &&
                  setFormEvent.places(Number(e.target.value))
                }
                className="w-full"
              />
              <InputDate
                labelText="Start date"
                type="datetime-local"
                value={formEvent.start_at}
                onChange={(e) => setFormEvent.start_at(e.target.value)}
                className="w-full"
              />
            </Flex>
            <Flex
              fullSize
              className="p-3"
              direction="column"
              horizontalAlign="left"
              verticalAlign="top"
              gap={6}
            >
              <Text variant="body" className="py-0 px-3">
                Optional fields
              </Text>
              <InputDate
                labelText="End date"
                type="datetime-local"
                value={formEvent.end_at}
                onChange={(e) =>
                  setFormEvent.end_at && setFormEvent.end_at(e.target.value)
                }
                className="w-full"
              />
            </Flex>
          </Flex>
        </FloatingPanel>
      )}
    </>
  );
};
