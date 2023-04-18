'use client';

import { EventResponseSuccess, joinEvent, leaveEvent } from '@/features/events';
import { useToggle } from '@/hooks';
import { useRouter } from 'next/navigation';
import React, { useMemo } from 'react';
import { toast } from 'react-toastify';
import { useSupabase } from '../auth/SupabaseProvider';
import { Button, Flex, Modal, Text } from '../common';

export const JoinEventButton: React.FC<{
  event: NonNullable<EventResponseSuccess>;
  // eslint-disable-next-line no-unused-vars
  onClick?: () => void;
  className?: string;
}> = ({
  event,
  onClick,
  className = 'absolute bottom-[-20px] right-0 m-2',
}) => {
  const { supabase, user } = useSupabase();
  const router = useRouter();
  const [confirmModalOpen, openConfirmModal, closeConfirmModal] =
    useToggle(false);

  const handleJoinEvent = async () => {
    if (!user) {
      toast.error('You must be logged in to join an event');
      return;
    }

    const { participation, error } = await joinEvent({
      client: supabase,
      eventId: event.id,
      userId: user.id,
    });

    if (error) {
      toast.error(error.message);
    }

    if (participation) {
      onClick && onClick();
      toast.success('You have joined the event');
    }
  };

  const handleLeaveEvent = async () => {
    console.log('handleLeaveEvent');
    if (!user) {
      toast.error('You must be logged in to leave an event');
      return;
    }

    const { status, error } = await leaveEvent({
      client: supabase,
      eventId: event.id,
      userId: user.id,
    });

    if (error) {
      toast.error(error.message);
    }

    if (status === 204) {
      toast.success('You have left the event');
      closeConfirmModal();
      onClick && onClick();
    } else toast.error(status);
  };

  const userIsParticipating = useMemo(() => {
    if (!user) {
      return false;
    }

    if (Array.isArray(event.participations)) {
      return event.participations.some(
        (participation) => participation.user_id === user.id,
      );
    } else {
      return event.participations.user_id === user.id;
    }
  }, [event, user]);

  const userIsHost = useMemo(() => {
    if (!user) {
      return false;
    }

    return event.creator_id === user.id;
  }, [event, user]);

  return (
    <>
      {userIsHost ? (
        <Button
          text="Manage"
          className={className}
          variant="primary"
          size="small"
          icon="cog"
          onClick={() => {
            router.push(`/settings/events?event_id=${event.id}`);
          }}
        />
      ) : (
        <Button
          text={userIsParticipating ? 'Joined' : 'Join'}
          className={className}
          variant={userIsParticipating ? 'default' : 'secondary'}
          size="small"
          icon={userIsParticipating ? 'check' : 'plus'}
          onClick={userIsParticipating ? openConfirmModal : handleJoinEvent}
        />
      )}
      <Modal
        isOpen={confirmModalOpen}
        title="Are you sure?"
        onClose={() => {
          closeConfirmModal();
        }}
        onConfirm={handleLeaveEvent}
      >
        <Flex fullSize className="p-3">
          <Text variant="body">Are you sure you want to leave this event?</Text>
        </Flex>
      </Modal>
    </>
  );
};
