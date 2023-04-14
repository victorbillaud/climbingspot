import { Flex } from '@/components/common';
import { SpotCardSmall } from '@/components/spot';
import { listSpotsFromLocation } from '@/features/spots';
import { createClient } from '@/lib/supabase/server';

export default async function Page({
  params,
}: {
  params: {
    slug: string[];
  };
}) {
  const supabase = createClient();
  const { slug } = params;

  const { spots } = await listSpotsFromLocation({
    client: supabase,
    country: slug[0],
    city: slug[1],
    limit: 100,
    page: 0,
  });

  return (
    <div className="w-full sm md:w-11/12 lg:w-5/6">
      <Flex
        fullSize
        verticalAlign="center"
        horizontalAlign="center"
        className="h-full overflow-y-auto p-3 pt-0"
        gap={8}
      >
        <div className="w-full h-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {spots.map((spot) => (
            <SpotCardSmall key={spot.id} spot={spot} />
          ))}
        </div>
      </Flex>
    </div>
  );
}
