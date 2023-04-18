import { EventResponseSuccess, leaveEvent } from '@/features/events';
import { useToggle } from '@/hooks';
import { getFirstItem } from '@/lib';
import { logger } from '@/lib/logger';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useSupabase } from '../auth/SupabaseProvider';
import { Button, CustomImage, Flex, Modal, Tag, Text } from '../common';

export type TEventParticipationsProps = {
  event: NonNullable<EventResponseSuccess>;
};

export const EventParticipations = ({ event }: TEventParticipationsProps) => {
  const { user, supabase } = useSupabase();
  const [confirmModalOpen, openConfirmModal, closeConfirmModal] =
    useToggle(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  const [participations, setParticipations] = useState(() => {
    if (Array.isArray(event.participations)) {
      return event.participations.map((participation) => ({
        ...participation,
        user: getFirstItem(participation.user),
      }));
    }
    return [];
  });

  const handleLeaveEvent = async () => {
    if (!user) {
      toast.error('You must be logged in to leave an event');
      return;
    }

    if (!userToDelete) {
      toast.error("Couldn't find user to delete");
      return;
    }

    logger.debug({
      eventId: event.id,
      userId: userToDelete,
    });

    const { status, error } = await leaveEvent({
      client: supabase,
      eventId: event.id,
      userId: userToDelete,
    });

    if (error) {
      toast.error(error.message);
      closeConfirmModal();
    }

    if (status === 204) {
      toast.success('User deleted from event');
      setParticipations((prevParticipations) =>
        prevParticipations.filter(
          (participation) => participation.user_id !== userToDelete,
        ),
      );
      setUserToDelete(null);
      closeConfirmModal();
    }
  };

  return (
    <>
      <Flex fullSize={true} verticalAlign="center" horizontalAlign="center">
        {participations.map((participation) => (
          <Flex
            key={participation.id}
            className="w-full"
            direction="row"
            verticalAlign="center"
            horizontalAlign="stretch"
          >
            <Flex direction="row" verticalAlign="center" horizontalAlign="left">
              <CustomImage
                key={participation.id}
                src={participation.user?.avatar_url}
                alt={participation.user?.full_name}
                width={40}
                height={40}
                rounded="full"
                style={{
                  objectFit: 'cover',
                }}
                className="border border-white-300 dark:border-dark-300"
              />
              <Text variant="caption">{participation.user?.full_name}</Text>
            </Flex>
            <Flex
              direction="row"
              verticalAlign="center"
              horizontalAlign="right"
            >
              <Tag
                color={participation.status == 'Accepted' ? 'green' : 'orange'}
                icon={participation.status == 'Accepted' ? 'check' : 'warning'}
                text={participation.status as string}
              />
              {user?.id != participation.user_id && (
                <Button
                  text="Remove"
                  icon="cross"
                  iconOnly
                  size="small"
                  className="ml-2"
                  onClick={() => {
                    setUserToDelete(participation.user_id);
                    openConfirmModal();
                  }}
                />
              )}
            </Flex>
          </Flex>
        ))}
      </Flex>
      <Modal
        isOpen={confirmModalOpen}
        title="Are you sure?"
        size="large"
        onClose={() => {
          closeConfirmModal();
        }}
        onConfirm={handleLeaveEvent}
      >
        <Flex fullSize className="p-3">
          <Text variant="body">Are you sure you want delete this user?</Text>
        </Flex>
      </Modal>
    </>
  );
};
