import { CustomImage, Flex, Tag, Text } from '@/components/common';
import { getEvent } from '@/features/events';
import { Locale } from '@/i18n';
import { getFirstItem } from '@/lib';
import { createClient } from '@/lib/supabase/server';

type Props = {
  params: {
    lang: Locale;
    uid: string;
  };
};

export default async function Page({ params }: Props) {
  const supabase = createClient();

  const { event } = await getEvent({
    client: supabase,
    eventId: params.uid,
  });

  if (!event) {
    return null;
  }

  const participants = Array.isArray(event.participations)
    ? event.participations.map((participation) => ({
        ...participation,
        user: getFirstItem(participation.user),
      }))
    : [];

  return (
    <Flex fullSize gap={1} verticalAlign="top" className="mt-2">
      <Text variant="caption">
        {participants.length}{' '}
        {participants.length > 1 ? 'participants' : 'participant'}
      </Text>
      <Flex fullSize gap={2} horizontalAlign="left" className="mt-2">
        {participants.map((participation) => (
          <Flex
            key={participation.id}
            className="w-full"
            direction="row"
            verticalAlign="center"
            horizontalAlign="stretch"
          >
            <Flex direction="row" verticalAlign="center" horizontalAlign="left">
              <CustomImage
                key={participation.id}
                src={participation.user?.avatar_url}
                alt={participation.user?.full_name}
                width={35}
                height={35}
                rounded="full"
                style={{
                  objectFit: 'cover',
                }}
                className="border border-white-300 dark:border-dark-300"
              />
              <Text variant="caption">{participation.user?.full_name}</Text>
            </Flex>
            <Flex
              direction="row"
              verticalAlign="center"
              horizontalAlign="right"
            >
              <Tag
                color={participation.status == 'Accepted' ? 'green' : 'blue'}
                icon={participation.status == 'Accepted' ? 'check' : 'warning'}
                text={participation.status as string}
              />
            </Flex>
          </Flex>
        ))}
      </Flex>
    </Flex>
  );
}
