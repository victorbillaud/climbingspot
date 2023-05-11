import { Card, CustomImage, Flex, Icon, Text } from '@/components/common';
import Footer from '@/components/footer/Footer';
import { SpotCardSmall } from '@/components/spot';
import { searchSpots } from '@/features/spots';
import { getDictionary } from '@/lib/get-dictionary';
import { logger } from '@/lib/logger';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Locale } from '../../i18n';

export default async function Page({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const dictionary = await getDictionary(lang);
  const supabase = createClient();

  const { spots, error } = await searchSpots({
    client: supabase,
    spotName: '',
    location: '',
    ordering: 'note',
    limit: 10,
    difficulty: ['All'],
    ascending: true,
  });

  if (error) {
    logger.error(error);
  }

  logger.debug(spots);

  return (
    <>
      <Flex fullSize verticalAlign="center" horizontalAlign="stretch">
        <Flex className="w-full relative" gap={0}>
          <Flex verticalAlign="center" className="w-full h-full relative">
            <CustomImage
              src="/climber.png"
              alt="Hero"
              height={450}
              width={400}
              loader
              fullWidth
              style={{
                objectFit: 'cover',
              }}
            />
          </Flex>
          <Flex
            verticalAlign="top"
            className="absolute px-4 md:bottom-[20%] md:left-[10%]"
          >
            <CustomImage
              src="/logo.png"
              alt="Hero"
              height={150}
              width={150}
              loader
              style={{
                objectFit: 'contain',
              }}
              className="shadow-xl"
            />
            <Text variant="h1" className="text-white-100">
              {dictionary.home.title}
            </Text>
          </Flex>
        </Flex>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:mx-[10%] px-4 py-10">
          {Object.entries(dictionary.home.part).map(([key, value]) => (
            <Card key={key} className="p-6">
              <Flex>
                <Flex
                  gap={2}
                  className="w-full"
                  horizontalAlign="left"
                  direction="row"
                >
                  <Icon
                    name={value.icon}
                    className="rounded-xs text-white-100 bg-brand-600"
                  />
                  <Text variant="h4" className="text-[18px]">
                    {value.title}
                  </Text>
                </Flex>
                <Text variant="body">{value.text}</Text>
              </Flex>
            </Card>
          ))}
        </div>
        <div className="w-1/4 border-2 rounded-md border-white-200 dark:border-dark-200"></div>

        {spots && spots.length > 0 && (
          <>
            <div className="w-full h-full relative">
              <Flex
                direction="row"
                horizontalAlign="left"
                className="h-full w-full overflow-x-auto scrollbar-hide p-3 py-10"
              >
                {spots.map((spot) => (
                  <div className="h-full min-w-[300px]" key={spot.id}>
                    <SpotCardSmall spot={spot} />
                  </div>
                ))}
              </Flex>
            </div>
          </>
        )}
        <div className="w-1/4 border-2 rounded-md border-white-200 dark:border-dark-200"></div>
        <Flex className="w-full md:mx-[10%] px-4 py-6">
          <Text variant="h2" className="text-center py-8">
            {dictionary.home.part.first.title}
          </Text>
          <Flex
            className="w-full md:w-3/4 lg:w-2/3"
            direction="row"
            horizontalAlign="left"
            gap={0}
          >
            <Link href={`/${lang}/maps`} className="w-full">
              <Flex
                verticalAlign="center"
                horizontalAlign="center"
                direction="row"
                className="w-full h-full relative"
                gap={6}
              >
                <Flex className="h-full">
                  <Text
                    variant="h3"
                    weight={300}
                    className="text-center py-4 opacity-60"
                  >
                    Search in more than 1000 spots and events in France
                  </Text>
                </Flex>
                <CustomImage
                  src="/search_w.png"
                  srcDark="/search_d.png"
                  alt="Hero"
                  height={300}
                  width={400}
                  loader
                  fullWidth={true}
                  style={{
                    objectFit: 'contain',
                  }}
                  rounded="sm"
                />
              </Flex>
            </Link>
          </Flex>
        </Flex>
        <Flex className="w-full md:mx-[10%] px-4 py-10">
          <Text variant="h2" className="text-center py-4">
            {dictionary.home.part.second.title}
          </Text>
          <Flex
            className="w-full md:w-3/4 lg:w-2/3"
            direction="row"
            horizontalAlign="left"
            gap={0}
          >
            <Link href={`/${lang}/event`} className="w-full">
              <Flex
                verticalAlign="center"
                horizontalAlign="center"
                direction="row"
                className="w-full h-full relative"
                gap={6}
              >
                <CustomImage
                  src="/event_w.png"
                  srcDark="/event_d.png"
                  alt="Hero"
                  height={300}
                  width={400}
                  loader
                  fullWidth={true}
                  style={{
                    objectFit: 'contain',
                  }}
                  rounded="sm"
                />
                <Flex className="h-full">
                  <Text
                    variant="h3"
                    weight={300}
                    className="text-center py-4 opacity-60"
                  >
                    Find events near you and add new friends to your climbing
                  </Text>
                </Flex>
              </Flex>
            </Link>
          </Flex>
        </Flex>
        <Footer />
      </Flex>
    </>
  );
}
