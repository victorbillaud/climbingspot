import { Flex, Icon, Text } from '@/components/common';
import Link from 'next/link';
import { useSelectedLayoutSegment } from 'next/navigation';

type TNavigationProps = {
  lang: string;
  uid: string;
};

export function Navigation({ lang, uid }: TNavigationProps) {
  const segment = useSelectedLayoutSegment();
  return (
    <Flex
      direction="row"
      verticalAlign="center"
      horizontalAlign="left"
      className="w-full py-2 border-b border-white-300 dark:border-dark-300"
      gap={3}
    >
      <Link href={`/${lang}/event/${uid}`}>
        <Flex direction="row" gap={1} verticalAlign="center">
          <Icon
            name="hamburger"
            className={segment === null ? 'opacity-100' : 'opacity-40'}
            scale={1}
          />
          <Text
            variant="subtitle"
            weight={300}
            className={segment === null ? 'opacity-100' : 'opacity-40'}
          >
            Details
          </Text>
        </Flex>
      </Link>

      <Link href={`/${lang}/event/${uid}/participants`}>
        <Flex direction="row" gap={1} verticalAlign="center">
          <Icon
            name="user-group"
            className={
              segment === 'participants' ? 'opacity-100' : 'opacity-40'
            }
            scale={1}
          />
          <Text
            variant="subtitle"
            weight={300}
            className={
              segment === 'participants' ? 'opacity-100' : 'opacity-40'
            }
          >
            Participants
          </Text>
        </Flex>
      </Link>

      <Link href={`/${lang}/event/${uid}/location`}>
        <Flex direction="row" gap={1} verticalAlign="center">
          <Icon
            name="globe-alt"
            className={segment === 'location' ? 'opacity-100' : 'opacity-40'}
            scale={1}
          />
          <Text
            variant="subtitle"
            weight={300}
            className={segment === 'location' ? 'opacity-100' : 'opacity-40'}
          >
            Location
          </Text>
        </Flex>
      </Link>
    </Flex>
  );
}
