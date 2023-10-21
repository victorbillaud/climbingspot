import { Flex } from '@/components/common/layout';
import { SideMenu } from '@/components/navbar';
import { getFriends } from '@/features/friendship';
import { Database } from '@/lib/db_types';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { ReactNode } from 'react';

interface IProps {
  children: ReactNode;
}

export const revalidate = 0;

export default async function RootLayout({ children }: IProps) {
  const cookieStore = cookies();
  const supabase = createServerComponentClient<Database>({
    cookies: () => cookieStore,
  });

  const {
    data: { user: connectedUser },
  } = await supabase.auth.getUser();

  const { friendships, error } = await getFriends({
    client: supabase,
    userId: connectedUser?.id as string,
    status: 'Pending',
  });

  return (
    <Flex fullSize direction="column" verticalAlign="stretch">
      <div className="w-full h-full gap-0 flex flex-col md:flex-row items-middle justify-start">
        <Flex
          className="h-auto md:h-full p-4 pb-0"
          horizontalAlign="stretch"
          verticalAlign="stretch"
        >
          <SideMenu
            menuItems={[
              {
                label: 'User',
                icon: 'user-circle',
                to: '/settings/user',
              },
              {
                label: 'Spots',
                icon: 'models',
                to: '/settings/spots',
              },
              {
                label: 'Events',
                icon: 'calendar',
                to: '/settings/events',
              },
              {
                label: 'Friends',
                icon: 'user-group',
                to: '/settings/friends',
                pins: friendships?.length > 0 ? friendships?.length : undefined,
              },
            ]}
          />
        </Flex>
        <Flex fullSize direction="column" horizontalAlign="stretch" gap={0}>
          <Flex fullSize horizontalAlign="left">
            {children}
          </Flex>
        </Flex>
      </div>
    </Flex>
  );
}
