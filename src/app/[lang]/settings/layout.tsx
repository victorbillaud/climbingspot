import { Flex } from '@/components/common/layout';
import { SideMenu } from '@/components/navbar';
import { ReactNode } from 'react';

interface IProps {
  children: ReactNode;
}

export const revalidate = 0;

export default function RootLayout({ children }: IProps) {
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
