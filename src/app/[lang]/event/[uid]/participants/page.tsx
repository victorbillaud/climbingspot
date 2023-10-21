import { Flex, Tag, Text } from '@/components/common';
import { UserPicture } from '@/components/user';
import { getEvent } from '@/features/events';
import { Locale } from '@/i18n';
import { getFirstItem } from '@/lib';
import { Database } from '@/lib/db_types';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

type Props = {
  params: {
    lang: Locale;
    uid: string;
  };
};

export default async function Page({ params }: Props) {
  const cookieStore = cookies();
  const supabase = createServerComponentClient<Database>({
    cookies: () => cookieStore,
  });

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
              <UserPicture
                user={participation.user}
                userId={participation.user_id}
                size={35}
              />
              <Text variant="caption">
                {participation.user?.username || participation.user?.full_name}
              </Text>
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
