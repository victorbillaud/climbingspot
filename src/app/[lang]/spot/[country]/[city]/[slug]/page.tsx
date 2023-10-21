import {
  CustomImage,
  Flex,
  ImageCarouselController,
  Text,
} from '@/components/common';
import { EventCreatePanel } from '@/components/event';
import { EventContainer } from '@/components/event/EventContainer';
import { ReviewContainer, ReviewCreateModal } from '@/components/review';
import { SpotCard, SpotCardSmall } from '@/components/spot';
import { getSpotEvents } from '@/features/events/service';
import { getSpotReviews } from '@/features/reviews';
import { getSpotFromSlug, searchSpots } from '@/features/spots';
import { Locale } from '@/i18n';
import { getFirstItem } from '@/lib';
import { Database } from '@/lib/db_types';
import { getDictionary } from '@/lib/get-dictionary';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { Metadata } from 'next';
import { cookies } from 'next/headers';
import Link from 'next/link';

type Props = {
  params: {
    lang: Locale;
    country: string;
    city: string;
    slug: string;
  };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = params.lang;
  const slugFormatted = `/spot/${params.country}/${params.city}/${params.slug}`;
  const cookieStore = cookies();
  const supabase = createServerComponentClient<Database>({
    cookies: () => cookieStore,
  });

  const { spot } = await getSpotFromSlug({
    client: supabase,
    slug: slugFormatted,
  });

  let description = `Unlock the thrill of climbing at ${spot?.name} in ${spot?.location.city}! Our comprehensive spot page offers essential route information, local events, and connections with fellow climbers. Experience the best of ${spot?.location.city}'s climbing scene and boost your adventure at ${spot?.name} today!`;

  if (locale === 'fr') {
    description = `Débloquez le frisson de l'escalade à ${spot?.name} à ${spot?.location.city}! Notre page de spot complète offre des informations essentielles sur les itinéraires, les événements locaux et les liens avec les autres grimpeurs. Découvrez le meilleur de la scène de l'escalade à ${spot?.location.city} et boostez votre aventure à ${spot?.name} dès aujourd'hui!`;
  }

  return {
    title: `${spot?.name} - ClimbingSpot`,
    description: description,
    openGraph: {
      images: spot?.image?.map((image) => {
        return {
          url: image,
          alt: spot.name || '',
        };
      }),
    },
    robots: {
      index: false,
      follow: true,
      nocache: true,
      googleBot: {
        index: true,
        follow: false,
        noimageindex: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    category: 'climbing',
  };
}

export default async function Page({ params }: Props) {
  const slugFormatted = `/spot/${params.country}/${params.city}/${params.slug}`;
  const cookieStore = cookies();
  const supabase = createServerComponentClient<Database>({
    cookies: () => cookieStore,
  });
  const dictionary = await getDictionary(params.lang);

  const { spot } = await getSpotFromSlug({
    client: supabase,
    slug: slugFormatted,
  });

  const { spots: relatedSpots } = await searchSpots({
    client: supabase,
    spotName: '',
    location: '',
    ordering: 'note',
    limit: 10,
    difficulty: [spot?.difficulty],
    ascending: true,
  });

  const { reviews } = await getSpotReviews({
    client: supabase,
    spotId: spot?.id as string,
  });
  const { events } = await getSpotEvents({
    client: supabase,
    spotId: spot?.id as string,
  });

  const {
    data: { session: session },
  } = await supabase.auth.getSession();

  if (!spot) {
    return <Text variant="body">No Spot</Text>;
  }

  return (
    <Flex className="w-full">
      <div className="w-full md:w-11/12 lg:w-5/6">
        <Flex
          fullSize
          verticalAlign="top"
          horizontalAlign="left"
          className="h-full overflow-y-auto p-3 pt-0"
          gap={8}
        >
          <Flex className="h-full w-full">
            {spot.image && spot.image.length > 1 ? (
              <ImageCarouselController
                images={spot?.image?.map((image) => {
                  return {
                    src: image,
                    alt: spot.name || '',
                    width: 400,
                  };
                })}
                height={500}
              />
            ) : spot.image && spot.image.length == 1 ? (
              <CustomImage
                src={getFirstItem(spot.image) || ''}
                alt={spot.name || ''}
                loader={true}
                width={400}
                height={400}
                fullWidth={true}
                style={{
                  objectFit: 'cover',
                  objectPosition: 'bottom',
                }}
                rounded="md"
                className="z-10"
              />
            ) : (
              <Flex
                className="bg-gray-200 dark:bg-dark-200 w-full h-full rounded-md p-2"
                fullSize
                verticalAlign="center"
                horizontalAlign="center"
              >
                <Text variant="body">{dictionary.common.no_image}</Text>
              </Flex>
            )}
          </Flex>
          <SpotCard spot={spot} />
          <Flex verticalAlign="top" className="w-full">
            <Flex direction="row" horizontalAlign="stretch" className="w-full">
              <Text variant="title">
                {dictionary.events.title}
                <span className="ml-1 opacity-70">({events?.length})</span>{' '}
              </Text>
              {session ? (
                <EventCreatePanel spot={spot} />
              ) : (
                <Text variant="body" className="opacity-60">
                  {dictionary.events.login_to_create}
                </Text>
              )}
            </Flex>
            {events && events.length > 0 ? (
              <EventContainer events={events} />
            ) : (
              <Text variant="body">{dictionary.events.no_events}</Text>
            )}
          </Flex>
          <Flex verticalAlign="top" className="w-full">
            <Flex direction="row" horizontalAlign="stretch" className="w-full">
              <Text variant="title">
                {dictionary.reviews.title}
                <span className="ml-1 opacity-70">
                  ({reviews?.length})
                </span>{' '}
              </Text>
              {session ? (
                <ReviewCreateModal spotId={spot.id || ''} />
              ) : (
                <Text variant="body" className="opacity-60">
                  {dictionary.reviews.login_to_review}
                </Text>
              )}
            </Flex>
            {reviews && reviews.length > 0 ? (
              <ReviewContainer reviews={reviews} />
            ) : (
              <Text variant="body">{dictionary.reviews.no_reviews}</Text>
            )}
          </Flex>
        </Flex>
      </div>
      <Flex verticalAlign="center" className="w-full">
        <Flex direction="row" horizontalAlign="center" className="w-2/3">
          <div className="w-1/4 border-2 rounded-md border-white-200 dark:border-dark-200" />
          <Text variant="title" className="opacity-80">
            {dictionary.spots.related_spots}
          </Text>
          <div className="w-1/4 border-2 rounded-md border-white-200 dark:border-dark-200" />
        </Flex>
        {relatedSpots && relatedSpots.length > 0 && (
          <div className="w-full h-full relative">
            <Flex
              direction="row"
              horizontalAlign="left"
              className="h-full w-full overflow-x-auto scrollbar-hide p-3 py-6"
            >
              {relatedSpots.map((spot) => (
                <div className="h-full min-w-[300px]" key={spot.id}>
                  <SpotCardSmall spot={spot} />
                </div>
              ))}
            </Flex>
          </div>
        )}
        <Link href="/spot">
          <Text variant="body" className="opacity-60">
            {dictionary.spots.see_all_spots}
          </Text>
        </Link>
      </Flex>
    </Flex>
  );
}
