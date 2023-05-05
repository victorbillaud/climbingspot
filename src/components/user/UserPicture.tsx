import { getProfile } from '@/features/profiles/services';
import { TProfile } from '@/features/profiles/types';
import { useState } from 'react';
import { useSupabase } from '../auth/SupabaseProvider';
import { CustomImage, Flex, Icon, Text, Tooltip } from '../common';

type TUserPictureProps = {
  userId: TProfile['id'];
  user: TProfile;
  size?: number;
};

export const UserPicture = ({
  userId: paramsUserId,
  user: paramsUser,
  size = 25,
}: TUserPictureProps) => {
  const { supabase } = useSupabase();
  const [user, setUser] = useState<TProfile | null>(null);

  const fetchUser = async () => {
    const response = await getProfile({
      client: supabase,
      id: paramsUserId,
    });

    response && setUser(response.profile);
  };

  return (
    <Tooltip
      content={
        user ? (
          <Flex fullSize direction="row">
            <CustomImage
              width={size}
              height={size}
              src={user.avatar_url}
              alt={user.username}
              rounded="full"
              className="cursor-pointer border border-white-300 dark:border-dark-300"
            />

            <Text variant="body">{user.username || user.full_name}</Text>
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
  );
};
