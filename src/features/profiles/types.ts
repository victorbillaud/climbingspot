import { Database } from '@/lib/db_types';
import { SupabaseClient } from '@supabase/supabase-js';

export type TProfile = Database['public']['Tables']['profiles']['Row'];

export type TGetProfileParams = {
  client: SupabaseClient<Database>;
  id: string;
};
