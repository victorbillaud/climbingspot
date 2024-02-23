import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../../lib/db_types';
import { checkFriendship, getFriends } from './services';

export type TFriendship = Database['public']['Tables']['friendship']['Row'];
export type TInsertFriendship =
  Database['public']['Tables']['friendship']['Insert'];

export type addFriendProps = {
  client: SupabaseClient<Database>;
  friendship: TInsertFriendship;
};

export type getFriendsProps = {
  client: SupabaseClient<Database>;
  userId: string;
  status?: TFriendship['status'];
};

type TFriendShip = Awaited<ReturnType<typeof getFriends>>;
export type TFriendShipResponseSuccess = TFriendShip['friendships'];
export type TFriendShipResponseError = TFriendShip['error'];

export type checkFriendshipProps = {
  client: SupabaseClient<Database>;
  connectedUserId: string;
  requestedUserId: string;
};

export type answerFriendRequestProps = {
  client: SupabaseClient<Database>;
  friendshipId: string;
  status: TFriendship['status'];
};

export type TFriendShipExtended = NonNullable<
  Awaited<ReturnType<typeof checkFriendship>>['friendship']
>;
