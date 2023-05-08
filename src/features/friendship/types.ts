import { Database } from '@/lib/db_types';
import { createClient } from '@/lib/supabase/server';

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
  status: TFriendship['status'];
};

export type checkFriendshipProps = {
  client: ReturnType<typeof createClient>;
  firstUserId: string;
  secondUserId: string;
};
