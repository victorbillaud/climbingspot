import { Flex, Text } from '@/components/common';
import Pagination from '@/components/common/button/Pagination';
import { SpotCardSmall } from '@/components/spot';
import { listSpotsFromSlug } from '@/features/spots';
import { createClient } from '@/lib/supabase/server';

export default async function Page({
  params,
  searchParams,
}: {
  params: {
    slug: string[];
  };
  searchParams: {
    page: number;
    [key: string]: string | number | undefined;
  };
}) {
  const supabase = createClient();
  const { slug } = params;

  const { spots, count } = await listSpotsFromSlug({
    client: supabase,
    country: slug[0],
    city: slug[1],
    limit: 8,
    page: searchParams.page || 1,
  });

  return (
    <Flex
      fullSize
      verticalAlign="center"
      horizontalAlign="stretch"
      className="sm md:w-11/12 lg:w-5/6 py-4 px-3 md:px-3"
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
