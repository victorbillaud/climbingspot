import {
  Button,
  Card,
  CustomImage,
  Flex,
  Icon,
  Text,
} from '@/components/common';
import { ReviewResponseSuccess } from '@/features/reviews';
import { formatDateString, getFirstItem } from '@/lib';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useSupabase } from '../auth/SupabaseProvider';

export type TReviewProps = {
  review: NonNullable<ReviewResponseSuccess>;
};

export const Review = ({ review }: TReviewProps) => {
  const { supabase, user } = useSupabase();

  const [likesCount, setLikesCount] = useState<unknown | number>(
    review.like_count,
  );

  const handleLike = async () => {
    if (!user) {
      toast.error('You need to be logged in to like a review');
      return;
    }

    const { data, error } = await supabase
      .from('reviews_likes')
      .insert({
        review_id: review.id,
        profile_id: user.id,
      })
      .select()
      .single();

    if (error) {
      console.error(error);
      toast.error(error.message);
    }

    if (data) {
      toast.success('Review liked');
      setLikesCount(likesCount ? likesCount + 1 : 1);
    }
  };

  return (
    <Card className="w-full">
      <Flex
        direction="row"
        horizontalAlign="stretch"
        fullSize
        className="divide-x divide-white-300 dark:divide-dark-300"
        gap={0}
      >
        <Flex
          direction="column"
          verticalAlign="center"
          horizontalAlign="left"
          className="w-full h-full"
          gap={0}
        >
          <Flex
            direction="row"
            horizontalAlign="stretch"
            className="relative w-full px-2 border-b border-white-300 dark:border-dark-300"
          >
            <Flex
              direction="row"
              horizontalAlign="center"
              verticalAlign="center"
              gap={2}
              className="py-1"
            >
              <CustomImage
                src={getFirstItem(review.creator)?.avatar_url || ''}
                alt={'Avatar'}
                width={30}
                height={30}
                rounded="full"
                style={{
                  objectFit: 'cover',
                }}
              />
              <Flex
                direction="row"
                horizontalAlign="center"
                verticalAlign="center"
                gap={0}
                className="py-2"
              >
                <Text variant="body" className="px-1">
                  <strong>{review.title}</strong>
                </Text>
              </Flex>
            </Flex>
            <Flex
              direction="row"
              horizontalAlign="center"
              verticalAlign="center"
              gap={0}
            >
              <Button
                text={'Like'}
                className="text-red-500"
                variant="none"
                size="medium"
                icon="hearth"
                iconOnly
                iconFill={likesCount > 0 ? true : false}
                onClick={handleLike}
              />
              <Text variant="body" className="opacity-80">
                {likesCount}
              </Text>
            </Flex>
          </Flex>
          <Flex
            direction="column"
            horizontalAlign="stretch"
            verticalAlign="stretch"
            className="h-full w-full px-2 py-2"
          >
            <Text variant="body" className="w-full px-1">
              {review.content}
            </Text>
            <Flex className="w-full" direction="row" horizontalAlign="stretch">
              <Flex direction="row" horizontalAlign="left" gap={0}>
                {Array.from({ length: 5 }, (_, i) => (
                  <Icon
                    key={i}
                    name="star"
                    color="text-yellow-500"
                    className={`${
                      review.note && review.note > i
                        ? 'opacity-80'
                        : 'opacity-40'
                    }`}
                    padding={false}
                    scale={0.6}
                    fill={review.note && review.note > i ? true : false}
                  />
                ))}
              </Flex>
              <Text variant="overline" className="text-right px-2 py-1">
                {formatDateString(review.created_at as string)}
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Card>
  );
};
