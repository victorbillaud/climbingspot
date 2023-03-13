'use client';

import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { useSupabase } from '../auth/SupabaseProvider';
import { Flex } from '../common';
import { NavIcon } from './NavIcons';

interface ISidebarProps {}

export const Sidebar: React.FC<ISidebarProps> = () => {
  const { session } = useSupabase();

  return (
    <Flex
      direction="row"
      verticalAlign="center"
      horizontalAlign="stretch"
      className="w-full h-16 bg-white-100 dark:bg-dark-200 border-b border-white-300 dark:border-dark-300 "
    >
      <Flex
        direction="row"
        className="w-full h-full divide-x divide-white-300 dark:divide-dark-300"
        horizontalAlign="left"
        gap={0}
      >
        <Link
          href={'/dashboard'}
          className="w-auto p-3 gap-2 flex justify-center items-center "
        >
          <Image src="/logo_little.png" alt="Logo" width={40} height={40} />
        </Link>
        <Flex className="h-full px-3">
          <NavIcon icon="map" label="map" to="/dashboard/maps" />
        </Flex>
        <Flex className="h-full px-3">
          <NavIcon icon="swatch" label="models" to="/dashboard/model" />
        </Flex>
        <Flex className="h-full px-3" />
      </Flex>
      <Flex
        direction="row"
        className="w-full h-full divide-x divide-white-300 dark:divide-dark-300"
        horizontalAlign="right"
      >
        <Flex className="h-full px-3" />
        <Flex className="h-full px-3">
          <NavIcon
            icon="cog"
            label="settings"
            to="/dashboard/settings/user"
            userImage={
              session ? session.user.user_metadata?.avatar_url : undefined
            }
          />
        </Flex>
      </Flex>
    </Flex>
  );
};
