import { TProfile } from '@/features/profiles';
import { Flex, Text } from '../common';
import { UserPicture } from './UserPicture';

export type UserHorizontalAvatarsProps = {
  users: TProfile[];
};

export function UserHorizontalAvatars({ users }: UserHorizontalAvatarsProps) {
  return (
    <Flex direction="row" gap={1} className="opacity-90">
      {users.slice(0, 5).map((user, index) => (
        <div
          key={user.id}
          style={{
            marginLeft: index !== 0 ? `-${index * 10}px` : '0px',
            zIndex: users.length - index,
          }}
        >
          <UserPicture userId={user.id} user={user} size={30} />
        </div>
      ))}
      {users.length > 5 && (
        <div
          style={{
            marginLeft: `-35px`,
            zIndex: 6,
          }}
        >
          <Text variant="overline">+{users.length - 5}</Text>
        </div>
      )}
    </Flex>
  );
}
