import { Flex, Icon, Text } from '@/components/common';
import { SpotCreationPanel } from '@/components/spot/SpotCreationPanel';
import { listCreatorSpots } from '@/features/spots';
import { Database } from '@/lib/db_types';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { SpotsTable } from './SpotsTable';

export default async function Page() {
  const cookieStore = cookies();
  const supabase = createServerComponentClient<Database>({
    cookies: () => cookieStore,
  });

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
        direction="row"
        verticalAlign="center"
        horizontalAlign="stretch"
      >
        <Text variant="subtitle">Manage my spots</Text>
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
