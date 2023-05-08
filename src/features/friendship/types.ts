import { Database } from '@/lib/db_types';
import { createClient } from '@/lib/supabase/server';
import { checkFriendship } from './services';

export type TFriendship = Database['public']['Tables']['friendships']['Row'];
export type TInsertFriendship =
  Database['public']['Tables']['friendships']['Insert'];

export type addFriendProps = {
  client: ReturnType<typeof createClient>;
  friendship: TInsertFriendship;
};

export type getFriendsProps = {
  client: ReturnType<typeof createClient>;
  userId: string;
  status?: TFriendship['status'];
};

export type checkFriendshipProps = {
  client: ReturnType<typeof createClient>;
  firstUserId: string;
  secondUserId: string;
};

export type answerFriendRequestProps = {
  client: ReturnType<typeof createClient>;
  friendshipId: string;
  status: TFriendship['status'];
};

export type TFriendShipExtended = NonNullable<
  Awaited<ReturnType<typeof checkFriendship>>['friendship']
>;
