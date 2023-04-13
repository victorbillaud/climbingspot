import { Database } from '@/lib/db_types';
import { createClient } from '@/lib/supabase/server';
import {
  getSpotFromSlug,
  listCreatorSpots,
  searchSpotsWithBounds,
} from './service';

export type getSpotFromSlugParams = {
  client: ReturnType<typeof createClient>;
  slug: string;
};

export type getSpotFromIdParams = {
  client: ReturnType<typeof createClient>;
  id: string;
};

export type listSpotsParams = {
  client: ReturnType<typeof createClient>;
  limit?: number;
};

export type listSpotsSlugsParams = {
  client: ReturnType<typeof createClient>;
};

export type TSpot = Database['public']['Tables']['spots']['Row'];

type GetSpotResponse = Awaited<ReturnType<typeof getSpotFromSlug>>;
export type GetSpotResponseError = GetSpotResponse['error'];
type GetSpotResponseSuccessTemp = GetSpotResponse['spot'];

type GetSpotResponseSuccessLocation = {
  location: Location;
};

export type GetSpotResponseSuccess = Omit<
  NonNullable<GetSpotResponseSuccessTemp>,
  'location'
> &
  GetSpotResponseSuccessLocation;

export type Location = Database['public']['Tables']['locations']['Row'];
export type SpotExtended =
  Database['public']['Views']['spot_extended_view']['Row'];
export interface ISpotExtended extends Omit<SpotExtended, 'location'> {
  location: Location;
}

export type CreatorsSpotsResponse = Awaited<
  ReturnType<typeof listCreatorSpots>
>;

export type CreatorsSpotsResponseError = CreatorsSpotsResponse['error'];
export type CreatorsSpotsResponseSuccess = CreatorsSpotsResponse['spots'];

export type spotsSearchWithBoundsParams = {
  client: ReturnType<typeof createClient>;
  bounds: {
    latitude_lte: number;
    latitude_gte: number;
    longitude_lte: number;
    longitude_gte: number;
  };
};

export type spotsSearchWithBoundsResponse = Awaited<
  ReturnType<typeof searchSpotsWithBounds>
>;

export type spotsSearchWithBoundsResponseError =
  spotsSearchWithBoundsResponse['error'];
export type spotsSearchWithBoundsResponseSuccess =
  spotsSearchWithBoundsResponse['spots'];

export type TSpotInsert = Database['public']['Tables']['spots']['Insert'];

export type insertSpotParams = {
  client: ReturnType<typeof createClient>;
  spot: TSpotInsert;
};
