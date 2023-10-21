import { Database } from '@/lib/db_types';
import { SupabaseClient } from '@supabase/supabase-js';

export type uploadFileParams = {
  client: SupabaseClient<Database>;
  path: string;
  file: File;
};

export type uploadFilesParams = {
  client: SupabaseClient<Database>;
  path: string;
  files: File[];
};

export type deleteFilesParams = {
  client: SupabaseClient<Database>;
  files: string[];
};
