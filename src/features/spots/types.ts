import { Database } from '@/lib/db_types';
import { SupabaseClient } from '@supabase/auth-helpers-nextjs';
import {
  getSpotFromSlug,
  listCreatorSpots,
  searchSpotsWithBounds,
} from './service';

export type getSpotFromSlugParams = {
  client: SupabaseClient<Database>;
  slug: string;
};

export type getSpotFromIdParams = {
  client: SupabaseClient<Database>;
  id: string;
};

export type listSpotsParams = {
  client: SupabaseClient<Database>;
  limit?: number;
};

export type listSpotsSlugsParams = {
  client: SupabaseClient<Database>;
};

export type listSpotsFromLocationParams = {
  client: SupabaseClient<Database>;
  country?: string;
  city?: string;
  limit?: number;
  page?: number;
};

export type searchSpotsParams = {
  client: SupabaseClient<Database>;
  spotName?: string;
  location?: string;
  difficulty?: SpotExtended['difficulty'][];
  limit?: number;
  ordering?: 'image' | 'note';
  ascending?: boolean;
  page?: number;
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
  client: SupabaseClient<Database>;
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
export type TSpotUpdate = Database['public']['Tables']['spots']['Update'];

export type insertSpotParams = {
  client: SupabaseClient<Database>;
  spot: TSpotInsert;
};

export type updateSpotParams = {
  client: SupabaseClient<Database>;
  spot: TSpotUpdate;
};
