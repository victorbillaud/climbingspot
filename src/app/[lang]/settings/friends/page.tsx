import { Badge, Card, Flex, Text } from '@/components/common';
import { getFriends } from '@/features/friendship';
import { logger } from '@/lib/logger';
import { createClient } from '@/lib/supabase/server';
import { UserInvite } from './UserInvite';

export default async function Page() {
  const supabase = createClient();
  const {
    data: { user: connectedUser },
  } = await supabase.auth.getUser();

  const { friendships, error } = await getFriends({
    client: supabase,
    userId: connectedUser?.id as string,
  });

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
          {friendships &&
            friendships?.filter((friendship) => friendship.status === 'Pending')
              .length > 0 && (
              <Badge
                color="red"
                textVariant="caption"
                text={friendships
                  ?.filter((friendship) => friendship.status === 'Pending')
                  .length.toString()}
              />
            )}
        </Flex>
        <Card className="w-full p-3">
          {friendships &&
          friendships?.filter((friendship) => friendship.status === 'Pending')
            .length > 0 ? (
            <Flex>
              {friendships
                ?.filter((friendship) => friendship.status === 'Pending')
                .map((friendship) => (
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
        <Text variant="h3">Friends</Text>
        <Card className="w-full p-3">
          {friendships &&
          friendships.filter((friendship) => friendship.status === 'Accepted')
            .length > 0 ? (
            <Flex>
              {friendships
                ?.filter((friendship) => friendship.status === 'Accepted')
                .map((friendship) => (
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
