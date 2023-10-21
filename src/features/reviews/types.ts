import { Database } from '@/lib/db_types';
import { SupabaseClient } from '@supabase/supabase-js';
import { getReview, getSpotReviews } from './service';

export type getReviewParams = {
  client: SupabaseClient<Database>;
  reviewId: string;
};

type ReviewResponse = Awaited<ReturnType<typeof getReview>>;
export type ReviewResponseSuccess = ReviewResponse['review'];
export type ReviewResponseError = ReviewResponse['error'];

export type getSpotReviewsParams = {
  client: SupabaseClient<Database>;
  spotId: string;
};

type ReviewsResponse = Awaited<ReturnType<typeof getSpotReviews>>;
export type ReviewsResponseSuccess = ReviewsResponse['reviews'];
export type ReviewsResponseError = ReviewsResponse['error'];
