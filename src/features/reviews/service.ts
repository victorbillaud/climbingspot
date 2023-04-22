import { logger } from '@/lib/logger';
import { getReviewParams, getSpotReviewsParams } from './types';

export const getReview = async ({ reviewId, client }: getReviewParams) => {
  const { data: review, error } = await client
    .from('reviews_with_like_count')
    .select(
      `
      *,
      creator:profiles(avatar_url, username)
    `,
    )
    .eq('id', reviewId)
    .single();

  if (error) {
    logger.error(error);
  }

  return { review, error };
};

export const getSpotReviews = async ({
  spotId,
  client,
}: getSpotReviewsParams) => {
  const { data: reviews, error } = await client
    .from('reviews_with_like_count')
    .select(
      `
        *,
        creator:profiles(avatar_url, username)
      `,
    )
    .limit(10)
    .order('like_count', { ascending: false })
    .order('created_at', { ascending: false })
    .eq('spot_id', spotId);

  if (error) {
    logger.error(error);
  }

  return { reviews, error };
};
