'use client';

import { useSupabase } from '@/components/auth/SupabaseProvider';
import { Flex, Table } from '@/components/common';
import { SpotUpdatePanel } from '@/components/spot/SpotUpdatePanel';
import {
  CreatorsSpotsResponseSuccess,
  ISpotExtended,
  getSpotFromId,
} from '@/features/spots';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export type TSpotsTableProps = {
  spots: NonNullable<CreatorsSpotsResponseSuccess>;
};

export const SpotsTable = ({ spots }: TSpotsTableProps) => {
  const { supabase } = useSupabase();
  const [spotToUpdateId, setSpotToUpdateId] = useState<undefined | string>(
    undefined,
  );
  const [spotToUpdate, setSpotToUpdate] = useState<undefined | ISpotExtended>(
    undefined,
  );

  useEffect(() => {
    const fetchSpot = async () => {
      if (spotToUpdateId) {
        const { spot, error } = await getSpotFromId({
          client: supabase,
          id: spotToUpdateId,
        });
        error && toast.error(error.message);
        spot && setSpotToUpdate(spot);
      } else {
        setSpotToUpdate(undefined);
      }
    };

    fetchSpot();
  }, [spotToUpdateId]);

  return (
    <Flex
      fullSize={true}
      verticalAlign="center"
      horizontalAlign="center"
      className="p-3 pt-0"
    >
      <Table
        rows={spots}
        onRowClick={(spot) => {
          if (spot.id !== spotToUpdateId) {
            setSpotToUpdateId(spot.id);
          }
        }}
      />
      {spotToUpdate && (
        <SpotUpdatePanel
          initialPanelState={true}
          initialSpot={spotToUpdate}
          showButton={false}
          onClose={() => {
            setSpotToUpdateId(undefined);
          }}
        />
      )}
    </Flex>
  );
};
