import { logger } from '@/lib/logger';
import { TGetProfileParams } from './types';

export const getProfile = async ({ client, id }: TGetProfileParams) => {
  const { data: profile, error } = await client
    .from('profiles')
    .select()
    .eq('id', id)
    .single();

  if (error) {
    logger.error(error);
  }

  return { profile, error };
};
