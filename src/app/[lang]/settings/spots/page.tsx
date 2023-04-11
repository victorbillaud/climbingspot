'use client';

import { useSupabase } from '@/components/auth/SupabaseProvider';
import { Flex, Icon, Text, VirtualizedTable } from '@/components/common';
import { SpotCreationPanel } from '@/components/spot/';
import {
  CreatorsSpotsResponseSuccess,
  listCreatorSpots,
} from '@/features/spots';
import { logger } from '@supabase/auth-helpers-nextjs';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';

export default function Page() {
  const { supabase, user } = useSupabase();

  const [spots, setSpots] = useState<CreatorsSpotsResponseSuccess>(null);
  const spotsLoaded = useRef(false);

  const fetchSpots = async () => {
    if (!user) {
      toast.error('You must be logged in to create a spot');
      return;
    }

    const { spots, error } = await listCreatorSpots({
      client: supabase,
      creatorId: user.id,
    });

    if (error) {
      logger.error(error);
      return;
    }
    setSpots(spots);
  };

  useEffect(() => {
    if (!spotsLoaded.current) {
      spotsLoaded.current = true;
      fetchSpots();
    }
  }, []);

  return (
    <>
      <Flex
        className="w-full p-3 pb-0"
        verticalAlign="bottom"
        horizontalAlign="center"
      >
        <SpotCreationPanel
          onSpotCreated={(spot) => {
            toast.success(`Spot ${spot.name} created!`);
            fetchSpots();
          }}
        />
      </Flex>
      {spots ? (
        spots.length > 0 ? (
          <VirtualizedTable
            rows={spots}
            headers={[
              { title: 'name', width: 300 },
              { title: 'created_at', width: 300 },
              { title: 'description' },
              { title: 'difficulty', width: 100 },
              { title: 'rock_type', width: 100 },
              {
                title: 'cliff_height',
                width: 150,
              },
            ]}
          />
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
