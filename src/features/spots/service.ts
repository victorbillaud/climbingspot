import { logger } from '@/lib/logger';
import { PostgrestError } from '@supabase/supabase-js';
import { getSpotParams, ISpotExtanded, listSpotsParams } from './types';

export const getSpot = async ({
  spotId,
  client,
}: getSpotParams): Promise<{
  spot: ISpotExtanded | null;
  error: PostgrestError | null;
}> => {
  const { data: spot, error } = await client
    .from('spot_extanded_view')
    .select(
      `
        *,
        location(*)
      `,
    )
    .eq('id', spotId)
    .single();

  if (error) {
    logger.error(error);
  }

  return { spot: spot as unknown as ISpotExtanded, error };
};

export const listSpots = async ({
  client,
  limit,
}: listSpotsParams): Promise<{
  spots: ISpotExtanded[];
  error: PostgrestError | null;
}> => {
  let allSpots: ISpotExtanded[] | null = [];
  let error: PostgrestError | null = null;

  if (limit) {
    const { data: spots, error: currentError } = await client
      .from('spot_extanded_view')
      .select(
        `
          *,
          location(*)
        `,
      )
      .limit(limit);

    if (currentError) {
      logger.error(currentError);
      error = currentError;
    }

    allSpots = spots as unknown as ISpotExtanded[];
  } else {
    let hasNextPage = true;
    let pageIndex = 0;
    const paginationLimit = 1000;

    while (hasNextPage) {
      const { data: spots, error: currentError } = await client
        .from('spot_extanded_view')
        .select(
          `
            *,
            location(*)
          `,
        )
        .range(
          pageIndex * paginationLimit,
          (pageIndex + 1) * paginationLimit - 1,
        );

      if (currentError) {
        logger.error(currentError);
        error = currentError;
        break;
      }

      allSpots = [...allSpots, ...spots];

      if (spots.length < paginationLimit) {
        hasNextPage = false;
      } else {
        pageIndex += 1;
      }
    }
  }

  return {
    spots: allSpots as unknown as ISpotExtanded[],
    error,
  };
};
