import { logger } from '@/lib/logger';
import { PostgrestError } from '@supabase/supabase-js';
import { findCountryIdFromName } from '../locations';
import {
  ISpotExtended,
  getSpotFromIdParams,
  getSpotFromSlugParams,
  insertSpotParams,
  listSpotsFromLocationParams,
  listSpotsParams,
  spotsSearchWithBoundsParams,
} from './types';

export const getSpotFromSlug = async ({
  slug,
  client,
}: getSpotFromSlugParams): Promise<{
  spot: ISpotExtended | null;
  error: PostgrestError | null;
}> => {
  const { data: spot, error } = await client
    .from('spot_extended_view')
    .select(
      `
        *,
        location(*)
      `,
    )
    .eq('slug', slug)
    .single();

  if (error) {
    logger.error(error);
  }

  return { spot: spot as unknown as ISpotExtended, error };
};

export const getSpotFromId = async ({
  id,
  client,
}: getSpotFromIdParams): Promise<{
  spot: ISpotExtended | null;
  error: PostgrestError | null;
}> => {
  const { data: spot, error } = await client
    .from('spot_extended_view')
    .select(
      `
        *,
        location(*)
      `,
    )
    .eq('id', id)
    .single();

  if (error) {
    logger.error(error);
  }

  return { spot: spot as unknown as ISpotExtended, error };
};

export const listMapSpots = async ({
  client,
  limit,
}: listSpotsParams): Promise<{
  spots: ISpotExtended[];
  error: PostgrestError | null;
}> => {
  let allSpots: ISpotExtended[] | null = [];
  let error: PostgrestError | null = null;

  if (limit) {
    const { data: spots, error: currentError } = await client
      .from('spot_extended_view')
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

    allSpots = spots as unknown as ISpotExtended[];
  } else {
    let hasNextPage = true;
    let pageIndex = 0;
    const paginationLimit = 1000;

    while (hasNextPage) {
      const { data: spots, error: currentError } = await client
        .from('spot_extended_view')
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
    spots: allSpots as unknown as ISpotExtended[],
    error,
  };
};

export const listCreatorSpots = async ({
  client,
  creatorId,
  limit = 100,
  page = 0,
}: listSpotsParams & { creatorId: string; page?: number }) => {
  let error: PostgrestError | null = null;

  const { data: spots, error: currentError } = await client
    .from('spots')
    .select(
      `
      id,
      name,
      created_at,
      description,
      difficulty,
      rock_type,
      cliff_height
      `,
    )
    .eq('creator', creatorId)
    .order('created_at', { ascending: false })
    .range(page * limit, (page + 1) * limit - 1);

  if (currentError) {
    logger.error(currentError);
    error = currentError;
  }

  return {
    spots,
    error,
  };
};

export const searchSpotsWithBounds = async ({
  client,
  bounds,
}: spotsSearchWithBoundsParams) => {
  let error: PostgrestError | null = null;

  const { data: spots, error: currentError } = await client
    .from('spots')
    .select(
      `
      id,
      slug,
      name,
      description,
      created_at,
      location!inner(latitude, longitude)
      `,
    )
    .gte('location.latitude', bounds.latitude_gte)
    .lte('location.latitude', bounds.latitude_lte)
    .gte('location.longitude', bounds.longitude_gte)
    .lte('location.longitude', bounds.longitude_lte);

  if (currentError) {
    logger.error(currentError);
    error = currentError;
  }

  return {
    spots,
    error,
  };
};

export const insertSpot = async ({ client, spot }: insertSpotParams) => {
  const { data, error } = await client.from('spots').insert(spot).select();

  if (error) {
    logger.error(error);
  }

  return { spot: data, error };
};

export const listSpotsSlugs = async ({ client }: listSpotsParams) => {
  const allSlugs = [];
  let error: PostgrestError | null = null;

  let hasNextPage = true;
  let pageIndex = 0;

  while (hasNextPage) {
    const { data: spots, error: currentError } = await client
      .from('spots')
      .select('slug')
      .range(pageIndex * 1000, (pageIndex + 1) * 1000 - 1);

    if (currentError) {
      logger.error(currentError);
      error = currentError;
      break;
    }

    allSlugs.push(...spots.map((spot) => spot.slug));

    if (spots.length < 1000) {
      hasNextPage = false;
    } else {
      pageIndex += 1;
    }
  }

  return {
    slugs: allSlugs,
    error,
  };
};

export const listSpotsFromLocation = async ({
  client,
  country,
  city,
  limit = 100,
  page = 0,
}: listSpotsFromLocationParams) => {
  logger.error(findCountryIdFromName(country || ''));
  const { data: spots, error } = await client
    .from('spot_extended_view')
    .select(
      `
      *,
      location(*)
      `,
    )
    .eq('location.country', findCountryIdFromName(country))
    .order('created_at', { ascending: false })
    .range(page * limit, (page + 1) * limit - 1);

  if (error) {
    logger.error(error);
  }

  return {
    spots: spots as unknown as ISpotExtended[],
    error,
  };
};
