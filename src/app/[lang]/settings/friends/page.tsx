import { Badge, Card, Flex, Text } from '@/components/common';
import { getFriends } from '@/features/friendship';
import { Database } from '@/lib/db_types';
import { logger } from '@/lib/logger';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { UserInvite } from './UserInvite';

export default async function Page() {
  const cookieStore = cookies();
  const supabase = createServerComponentClient<Database>({
    cookies: () => cookieStore,
  });
  const {
    data: { user: connectedUser },
  } = await supabase.auth.getUser();

  const { friendships, error } = await getFriends({
    client: supabase,
    userId: connectedUser?.id as string,
  });

  const incomingFriendRequest = friendships?.filter(
    (friendship) =>
      friendship.status == 'Pending' &&
      friendship.receiver_id == connectedUser?.id,
  );

  const outgoingFriendRequest = friendships?.filter(
    (friendship) =>
      friendship.status == 'Pending' &&
      friendship.sender_id == connectedUser?.id,
  );
  const acceptedFriendships = friendships?.filter(
    (friendship) => friendship.status == 'Accepted',
  );

  logger.debug(friendships);

  return (
    <Flex fullSize direction="column" horizontalAlign="left" className="p-4">
      <Flex
        className="w-full"
        direction="column"
        horizontalAlign="left"
        verticalAlign="top"
      >
        <Flex direction="row" gap={3}>
          <Text variant="h4">Friends requests</Text>
          {incomingFriendRequest && incomingFriendRequest.length > 0 && (
            <Badge
              color="red"
              textVariant="caption"
              text={incomingFriendRequest.length.toString()}
            />
          )}
        </Flex>
        <Card className="w-full p-3">
          {incomingFriendRequest && incomingFriendRequest.length > 0 ? (
            <Flex>
              {incomingFriendRequest.map((friendship) => (
                <UserInvite
                  key={friendship.id}
                  friendship={friendship}
                  showCreator={true}
                  showActions={true}
                />
              ))}
            </Flex>
          ) : (
            <Flex fullSize>
              <Text variant="caption">No pending requests</Text>
            </Flex>
          )}
        </Card>
      </Flex>
      <Flex
        className="w-full"
        direction="column"
        horizontalAlign="left"
        verticalAlign="top"
      >
        <Flex direction="row" gap={3}>
          <Text variant="h4">Friends requests (sent)</Text>
          {outgoingFriendRequest && outgoingFriendRequest.length > 0 && (
            <Badge
              color="red"
              textVariant="caption"
              text={outgoingFriendRequest.length.toString()}
            />
          )}
        </Flex>
        <Card className="w-full p-3">
          {outgoingFriendRequest && outgoingFriendRequest.length > 0 ? (
            <Flex>
              {outgoingFriendRequest.map((friendship) => (
                <UserInvite
                  key={friendship.id}
                  friendship={friendship}
                  showCreator={true}
                />
              ))}
            </Flex>
          ) : (
            <Flex fullSize>
              <Text variant="caption">No pending requests</Text>
            </Flex>
          )}
        </Card>
      </Flex>
      <Flex
        className="w-full"
        direction="column"
        horizontalAlign="left"
        verticalAlign="top"
      >
        <Text variant="h3">Friends</Text>
        <Card className="w-full p-3">
          {acceptedFriendships && acceptedFriendships.length > 0 ? (
            <Flex>
              {acceptedFriendships.map((friendship) => (
                <UserInvite key={friendship.id} friendship={friendship} />
              ))}
            </Flex>
          ) : (
            <Flex fullSize direction="column" horizontalAlign="center">
              <Text variant="caption">You have no friends yet</Text>
            </Flex>
          )}
        </Card>
      </Flex>
    </Flex>
  );
}
