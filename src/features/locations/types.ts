import { Database } from '@/lib/db_types';
import { SupabaseClient } from '@supabase/supabase-js';
import { insertLocation } from './service';

export type TLocationInsert =
  Database['public']['Tables']['locations']['Insert'];

export type insertLocationParams = {
  client: SupabaseClient<Database>;
  location: TLocationInsert;
};

type InsertLocation = Awaited<ReturnType<typeof insertLocation>>;
export type InsertLocationResponseSuccess = InsertLocation['location'];
export type InsertLocationResponseError = InsertLocation['error'];
