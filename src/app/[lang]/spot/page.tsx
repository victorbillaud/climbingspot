import { CustomImage, Flex, Text } from '@/components/common';
import Pagination from '@/components/common/button/Pagination';
import { SpotCardSmall } from '@/components/spot';
import { listSpotsFromLocation } from '@/features/spots';
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';

export const metadata = {
  title: 'Spots - ClimbingSpot',
  description:
    'Discover climbing spots near you with our interactive map page. Browse routes, access detailed spot information, and plan your next climbing adventure. Explore the world of climbing at your fingertips!',
};

export default async function Page({
  params,
  searchParams,
}: {
  params: any;
  searchParams: {
    page: number;
    [key: string]: string | number | undefined;
  };
}) {
  const supabase = createClient();

  const { spots, count } = await listSpotsFromLocation({
    client: supabase,
    country: undefined,
    city: undefined,
    limit: 12,
    page: searchParams.page || 1,
  });

  if (!spots) {
    return notFound();
  }

  return (
    <Flex
      direction="column"
      horizontalAlign="left"
      gap={3}
      className="w-full relative"
    >
      <Flex verticalAlign="center" className="w-full absolute top-0 left-0">
        <CustomImage
          src="/boulder-bloc-2.png"
          alt="Hero"
          height={700}
          width={400}
          loader
          priority
          fullWidth
          style={{
            objectFit: 'cover',
          }}
        />
        <Flex
          className="absolute inset-0 bg-gradient-to-t to-30% from-white-200 dark:from-dark-100 via-transparent to-transparent py-16"
          horizontalAlign="center"
        >
          <Text variant="h1" className="text-white-200" weight={500}>
            Search for climbing spots
          </Text>
          <Text variant="h4" className="text-white-200" weight={500}>
            <span className="text-brand-300">{count}</span> spots found
          </Text>
        </Flex>
      </Flex>
      <Flex className="w-full pt-[700px] z-50 p-6" direction="column" gap={0}>
        {spots && spots.length > 0 ? (
          <div className="h-full w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {spots.map((spot) => (
              <SpotCardSmall key={spot.id} spot={spot} />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500">No spots found</div>
        )}
      </Flex>
      <Flex className="w-full z-50 p-6">
        <Pagination count={count} batchSize={12} />
      </Flex>
    </Flex>
  );
}
