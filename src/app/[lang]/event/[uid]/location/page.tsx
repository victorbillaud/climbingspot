import { Flex } from '@/components/common';
import { getEvent } from '@/features/events';
import { getSpotFromId } from '@/features/spots';
import { Locale } from '@/i18n';
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
  const { spot } = await getSpotFromId({
    client: supabase,
    id: event.spot_id,
  });

  return <Flex fullSize gap={1} className="mt-2"></Flex>;
}
