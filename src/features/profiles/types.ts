import { Database } from '@/lib/db_types';
import { createClient } from '@/lib/supabase/server';

export type TProfile = Database['public']['Tables']['profiles']['Row'];

export type TGetProfileParams = {
  client: ReturnType<typeof createClient>;
  id: string;
};
