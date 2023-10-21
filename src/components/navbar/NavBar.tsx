'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useSupabase } from '../auth/SupabaseProvider';
import {
  Button,
  Card,
  Flex,
  FloatingPanel,
  Icon,
  IconNames,
  Text,
} from '../common';
import LocaleSwitcher from '../footer/LocaleSwitcher';
import { NavIcon } from './NavIcons';
import { SearchBar } from './SearchBar';

const MobileNavItem: React.FC<{
  icon: IconNames;
  title: string;
  text: string;
  onClick?: () => void;
}> = ({ icon, title, text, onClick }) => {
  return (
    <Card className="w-full">
      <Flex className="w-full p-2" direction="row">
        <Icon
          name={icon}
          scale={1.8}
          className="opacity-70"
          color="text-brand-600 dark:text-brand-100"
        />

        <Button text="" variant="none" className="w-full" onClick={onClick}>
          <Flex fullSize verticalAlign="top" horizontalAlign="center" gap={0}>
            <Text
              variant="h4"
              className="px-2"
              color="text-brand-600 dark:text-brand-100"
            >
              {title}
            </Text>
            <Text
              variant="body"
              className="px-2"
              color="text-brand-600 dark:text-brand-100"
            >
              {text}
            </Text>
          </Flex>
        </Button>
      </Flex>
    </Card>
  );
};

interface INavBarProps {}

export const NavBar: React.FC<INavBarProps> = () => {
  let { user: initialUser } = useSupabase();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <Flex
      direction="row"
      verticalAlign="center"
      horizontalAlign="stretch"
      className="relative w-full h-16 bg-white-100 dark:bg-dark-200 border-y border-white-300 dark:border-dark-300 "
    >
      <Flex
        direction="row"
        className="flex h-full divide-x divide-white-300 dark:divide-dark-300"
        horizontalAlign="left"
        gap={0}
      >
        <Link
          href={'/'}
          className="w-auto pl-3 gap-2 flex justify-center items-center "
        >
          <Image src="/logo_clear.png" alt="Logo" width={40} height={40} />
        </Link>
      </Flex>
      <Flex className="absolute w-8/12 md:w-1/2 lg:w-1/3 h-full left-1/2 z-30 transform -translate-x-1/2">
        <SearchBar />
      </Flex>
      <Flex
        direction="row"
        className="flex-none md:hidden divide-x divide-white-300 dark:divide-dark-300"
        horizontalAlign="right"
        gap={0}
      >
        {/* Hamburger button */}
        <Button
          variant="primary"
          text="Menu"
          icon="hamburger"
          iconOnly
          className="mr-3 flex-none"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        />
        <FloatingPanel
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          title={'Settings'}
          onConfirm={function (): void | Promise<void> {
            throw new Error('Function not implemented.');
          }}
          customHeader={
            <Flex
              direction="row"
              verticalAlign="center"
              horizontalAlign="left"
              className="w-full h-16 px-3"
            >
              <Button
                variant="secondary"
                text="Go back"
                icon="chevron-left"
                onClick={() => setMobileMenuOpen(false)}
              />
            </Flex>
          }
          customFooter={
            <Flex className="w-full p-3">
              <LocaleSwitcher />
            </Flex>
          }
        >
          <Flex className="p-2">
            <MobileNavItem
              icon="flex"
              title="Spots"
              text="Find and share spots"
              onClick={() => {
                setMobileMenuOpen(false);
                router.push('/spot');
              }}
            />
            <MobileNavItem
              icon="calendar"
              title="Events"
              text="Find and share events"
              onClick={() => {
                setMobileMenuOpen(false);
                router.push('/event');
              }}
            />
            <MobileNavItem
              text="Explore map and find spots"
              icon="map"
              title="Maps"
              onClick={() => {
                setMobileMenuOpen(false);
                router.push('/maps');
              }}
            />
            <MobileNavItem
              text="Manage your account"
              icon="cog"
              title="Settings"
              onClick={() => {
                setMobileMenuOpen(false);
                router.push('/settings/user');
              }}
            />
          </Flex>
        </FloatingPanel>
      </Flex>
      <Flex
        direction="row"
        className="hidden md:flex divide-x divide-white-300 dark:divide-dark-300"
        horizontalAlign="right"
        gap={0}
      >
        <Flex className="h-full px-3">
          <NavIcon icon="map" label="map" to="/maps" />
        </Flex>
        <Flex className="h-full px-3">
          <NavIcon icon="flex" label="spots" to="/spot" />
        </Flex>
        <Flex className="h-full px-3">
          <NavIcon icon="calendar" label="calendar" to="/event" />
        </Flex>
        <Flex className="h-full px-3">
          {initialUser ? (
            <NavIcon
              icon="cog"
              label="settings"
              to="/settings/user"
              userImage={initialUser?.user_metadata?.avatar_url}
            />
          ) : (
            <>
              <Flex
                direction="row"
                verticalAlign="center"
                horizontalAlign="center"
                className="h-full px-0"
                gap={0}
              >
                <Button
                  variant="primary"
                  text="Signup"
                  onClick={() => router.push('/auth/register')}
                />
                <Button
                  variant="default"
                  text="Login"
                  onClick={() => router.push('/auth/login')}
                />
              </Flex>
            </>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};
