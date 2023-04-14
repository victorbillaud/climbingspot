import { Flex, Icon, Text } from '@/components/common';
import { SpotCreationPanel } from '@/components/spot/';
import { listCreatorSpots } from '@/features/spots';
import { createClient } from '@/lib/supabase/server';
import { SpotsTable } from './SpotsTable';

export default async function Page() {
  const supabase = createClient();
  const user = await supabase.auth.getUser();

  if (!user) {
    return (
      <Flex fullSize verticalAlign="center" horizontalAlign="center">
        <Text variant="caption">You must be logged in to view this page.</Text>
      </Flex>
    );
  }

  const { spots, error } = await listCreatorSpots({
    client: supabase,
    creatorId: user.data.user?.id as string,
  });

  return (
    <>
      <Flex
        className="w-full p-3 pb-0"
        verticalAlign="bottom"
        horizontalAlign="center"
      >
        <SpotCreationPanel />
      </Flex>
      {spots ? (
        spots.length > 0 ? (
          <SpotsTable spots={spots} />
        ) : (
          <Flex fullSize verticalAlign="center" horizontalAlign="center">
            <Text variant="caption">No spots found.</Text>
          </Flex>
        )
      ) : (
        <Flex fullSize verticalAlign="center" horizontalAlign="center">
          <Text variant="caption">Searching for spots...</Text>
          <Icon name="spin" className="animate-spin" />
        </Flex>
      )}
    </>
  );
}
