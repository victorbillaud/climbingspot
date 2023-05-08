'use client';

import { useSupabase } from '@/components/auth/SupabaseProvider';
import { Button, Flex, Text } from '@/components/common';
import { UserPicture } from '@/components/user';
import {
    TFriendShipExtended,
    answerFriendRequest,
} from '@/features/friendship';
import { getFirstItem } from '@/lib';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

type UserInviteProps = {
  friendship: TFriendShipExtended;
  showActions?: boolean;
};

export const UserInvite = ({ friendship, showActions }: UserInviteProps) => {
  const { supabase } = useSupabase();
  const router = useRouter();

  const acceptFriendRequest = async () => {
    const { error } = await answerFriendRequest({
      client: supabase,
      friendshipId: friendship.id,
      status: 'Accepted',
    });

    if (error) {
      toast.error(error.message);
      console.error(error);
    } else {
      toast.success('Friend request accepted');
      router.refresh();
    }
  };

  const declineFriendRequest = async () => {
    const { error } = await answerFriendRequest({
      client: supabase,
      friendshipId: friendship.id,
      status: 'Declined',
    });

    if (error) {
      toast.error(error.message);
      console.error(error);
    } else {
      toast.success('Friend request declined');
      router.refresh();
    }
  };

  return (
    <Flex
      key={friendship.id}
      className="w-full"
      fullSize
      direction="row"
      verticalAlign="center"
      horizontalAlign="stretch"
    >
      <Flex className="w-full" direction="row" horizontalAlign="left">
        <UserPicture user={getFirstItem(friendship.creator)} tooltip={false} />
        <Text variant="h4">{getFirstItem(friendship.creator).full_name}</Text>
      </Flex>
      {showActions && (
        <Flex className="h-full" direction="row" horizontalAlign="right">
          <Button
            text="Decline"
            onClick={declineFriendRequest}
            variant="secondary"
          />
          <Button
            text="Accept"
            onClick={acceptFriendRequest}
            variant="default"
          />
        </Flex>
      )}
    </Flex>
  );
};
