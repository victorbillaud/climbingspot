import { addFriend, checkFriendship } from '@/features/friendship';
import { getProfile } from '@/features/profiles/services';
import { TProfile } from '@/features/profiles/types';
import { getFirstItem } from '@/lib';
import { logger } from '@/lib/logger';
import { useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { useSupabase } from '../auth/SupabaseProvider';
import { Button, CustomImage, Flex, Icon, Text, Tooltip } from '../common';

type TUserPictureProps = {
  userId: TProfile['id'];
  user: TProfile;
  size?: number;
  tooltip?: boolean;
};

export const UserPicture = ({
  userId: paramsUserId,
  user: paramsUser,
  size = 25,
  tooltip = true,
}: TUserPictureProps) => {
  const { supabase, user: connectedUser } = useSupabase();
  const [user, setUser] = useState<TProfile | null>(null);
  const [isFriend, setIsFriend] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const fetchUser = async () => {
    const response = await getProfile({
      client: supabase,
      id: paramsUserId,
    });

    const { friendship } = await checkFriendship({
      client: supabase,
      connectedUserId: connectedUser?.id || '',
      requestedUserId: paramsUserId,
    });

    logger.debug('friendship', getFirstItem(friendship));

    setIsFriend(getFirstItem(friendship)?.status === 'Accepted');
    setIsPending(getFirstItem(friendship)?.status === 'Pending');

    response && setUser(response.profile);
  };

  const sendFriendRequest = async () => {
    const { friendship, error } = await addFriend({
      client: supabase,
      friendship: {
        receiver_id: paramsUserId,
      },
    });

    if (error) {
      toast.error(error.message);
      console.error(error);
    }

    if (friendship) {
      setIsPending(true);
    }
  };

  const buttonRender = useMemo(() => {
    if (isPending) {
      return (
        <Button
          className="w-full"
          disabled={true}
          variant={'secondary'}
          text={'Invitation sent'}
          icon={'envelop'}
        />
      );
    } else if (isFriend) {
      return (
        <Button
          className="w-full"
          disabled={true}
          variant={'default'}
          text={'Friend'}
          icon={'check'}
        />
      );
    } else {
      return (
        <Button
          className="w-full"
          disabled={false}
          variant={'primary'}
          text={'Add friend'}
          icon={'plus'}
          onClick={sendFriendRequest}
        />
      );
    }
  }, [isFriend, isPending]);

  return tooltip ? (
    <Tooltip
      interactive
      delay={100}
      content={
        user ? (
          <Flex fullSize direction="column">
            <Flex className="w-full" direction="row">
              <CustomImage
                width={size}
                height={size}
                src={user.avatar_url}
                alt={user.username}
                rounded="full"
                className="cursor-pointer rounded-full border border-white-300 dark:border-dark-200"
              />
              <Text variant="body">{user.username || user.full_name}</Text>
            </Flex>
            {connectedUser?.id !== user.id && buttonRender}
          </Flex>
        ) : (
          <Flex fullSize>
            <Icon name="spin" className="animate-spin" />
          </Flex>
        )
      }
      onShow={() => {
        fetchUser();
      }}
    >
      <div>
        <CustomImage
          width={size}
          height={size}
          src={paramsUser.avatar_url}
          alt={paramsUser.username}
          rounded="full"
          className="cursor-pointer border border-white-300 dark:border-dark-300"
        />
      </div>
    </Tooltip>
  ) : (
    <CustomImage
      width={size}
      height={size}
      src={paramsUser.avatar_url}
      alt={paramsUser.username}
      rounded="full"
      className="cursor-pointer border border-white-300 dark:border-dark-300"
    />
  );
};
