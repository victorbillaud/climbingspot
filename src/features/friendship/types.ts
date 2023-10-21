import { Database } from '@/lib/db_types';
import { SupabaseClient } from '@supabase/supabase-js';
import { checkFriendship } from './services';

export type TFriendship = Database['public']['Tables']['friendships']['Row'];
export type TInsertFriendship =
  Database['public']['Tables']['friendships']['Insert'];

export type addFriendProps = {
  client: SupabaseClient<Database>;
  friendship: TInsertFriendship;
};

export type getFriendsProps = {
  client: SupabaseClient<Database>;
  userId: string;
  status?: TFriendship['status'];
};

export type checkFriendshipProps = {
  client: SupabaseClient<Database>;
  firstUserId: string;
  secondUserId: string;
};

export type answerFriendRequestProps = {
  client: SupabaseClient<Database>;
  friendshipId: string;
  status: TFriendship['status'];
};

export type TFriendShipExtended = NonNullable<
  Awaited<ReturnType<typeof checkFriendship>>['friendship']
>;
