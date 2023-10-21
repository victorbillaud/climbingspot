import { Flex, Text } from '@/components/common';
import Pagination from '@/components/common/button/Pagination';
import { SpotCardSmall } from '@/components/spot';
import { listSpotsFromSlug } from '@/features/spots';
import { Database } from '@/lib/db_types';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { Metadata } from 'next';
import { cookies } from 'next/headers';

type Props = {
  params: {
    slug: string[];
  };
  searchParams: {
    page: number;
    [key: string]: string | number | undefined;
  };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  let country = params.slug[0];
  let city = params.slug[1];

  const title = city ? `Spots in ${city} - ${country}` : `Spots in ${country}`;
  const description = city
    ? `Unlock the thrill of climbing at ${city} in ${country}! Our comprehensive spot page offers essential route information, local events, and connections with fellow climbers. Experience the best of ${city}'s climbing scene and boost your adventure at ${city} today!`
    : `Unlock the thrill of climbing in ${country}! Our comprehensive spot page offers essential route information, local events, and connections with fellow climbers. Experience the best of ${country}'s climbing scene and boost your adventure today!`;

  return {
    title: title,
    description: description,
    openGraph: {
      images: [
        {
          url: `/climber.png`,
        },
      ],
    },
    robots: {
      index: true,
      follow: true,
      nocache: true,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    category: 'climbing',
  };
}

export default async function Page({ params, searchParams }: Props) {
  const cookieStore = cookies();
  const supabase = createServerComponentClient<Database>({
    cookies: () => cookieStore,
  });
  const { slug } = params;

  const { spots, count } = await listSpotsFromSlug({
    client: supabase,
    country: slug[0],
    city: slug[1],
    limit: 20,
    page: searchParams.page || 1,
  });

  return (
    <Flex
      verticalAlign="center"
      horizontalAlign="stretch"
      className="w-full md:w-11/12 lg:w-5/6 mx-auto pb-4 px-3 md:px-3"
      gap={0}
    >
      <Flex verticalAlign="top" className="w-full py-3">
        <Text variant="subtitle" className="font-bold">
          Spots in {slug[1] || slug[0]}
        </Text>
        <Text variant="body" className="text-gray-500">
          {count} spots found
        </Text>
      </Flex>
      <Flex
        verticalAlign="center"
        horizontalAlign="center"
        className="w-full py-3 pt-0"
        gap={8}
      >
        {spots && spots.length > 0 ? (
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {spots.map((spot) => (
              <SpotCardSmall key={spot.id} spot={spot} />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500">No spots found</div>
        )}
      </Flex>
      <Pagination count={count} batchSize={8} />
    </Flex>
  );
}
