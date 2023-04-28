import { CustomImage, Flex, Text } from '@/components/common';
import Pagination from '@/components/common/button/Pagination';
import Footer from '@/components/footer/Footer';
import { SearchBar, SpotCardSmall } from '@/components/spot';
import { searchSpots } from '@/features/spots';
import { createClient } from '@/lib/supabase/server';

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
    name: string;
    location: string;
    difficulty: string;
  };
}) {
  const supabase = createClient();

  const { spots, count } = await searchSpots({
    client: supabase,
    spotName: searchParams.name || '',
    location: searchParams.location || '',
    difficulty: searchParams.difficulty?.split(',') || ['All'],
    limit: 12,
    page: searchParams.page || 1,
  });

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
          <Flex className="w-3/4" direction="column" gap={3}>
            <Text variant="h1" className="text-white-200" weight={500}>
              Search for climbing spots
            </Text>
            <Text variant="title" className="text-white-200" weight={500}>
              Search in more than{' '}
              <span className="text-brand-300">{count}</span> spots
            </Text>
            <SearchBar />
          </Flex>
        </Flex>
      </Flex>

      <Flex className="w-full mt-[700px] p-6" direction="column" gap={0}>
        {spots && spots.length > 0 ? (
          <>
            <div className="h-full w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {spots.map((spot) => (
                <SpotCardSmall key={spot.id} spot={spot} />
              ))}
            </div>
            <Flex className="w-full z-50 p-6">
              <Pagination count={count} batchSize={12} />
            </Flex>
          </>
        ) : (
          <div className="text-center text-gray-500">No spots found</div>
        )}
      </Flex>
      <Footer />
    </Flex>
  );
}
