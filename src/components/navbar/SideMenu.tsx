import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { Icon, IconNames } from '../common';
import { Flex } from '../common/layout';
import { Text } from '../common/text';

export interface IMenuItemsProps {
  icon: IconNames;
  label: string;
  to: string;
}

interface ISideMenuProps {
  menuItems: IMenuItemsProps[];
}

export const SideMenu: React.FC<ISideMenuProps> = ({ menuItems }) => {
  const pathname = usePathname();

  const isActive = (to: string) => {
    // check if the end of the pathname matches the to prop
    return pathname?.endsWith(to);
  };

  return (
    <div className="w-full md:w-40 flex flex-row md:flex-col gap-3">
      {menuItems.map((item) => (
        <Link
          href={item.to}
          key={item.label}
          className="w-full cursor-pointer dark:border-dark-300"
        >
          <Flex
            direction="row"
            gap={1}
            fullSize
            horizontalAlign="left"
            className={`${
              isActive(item.to)
                ? 'border border-white-300 dark:border-dark-300 dark:bg-dark-200 bg-white-200'
                : 'border dark:border-dark-200 border-white-200'
            }w-full outline-none py-1 px-1 text-s lg:text-sm xl:text-base text-black-100 dark:text-white-100
            rounded-md`}
          >
            <Icon
              name={item.icon}
              // color={`${
              //   isActive(item.to) ? 'text-brand-600' : 'text-gray-400'
              // }`}
            />
            <Text
              key={item.label}
              variant="caption"
              // color={`${
              //   isActive(item.to) ? 'text-brand-600' : 'text-gray-400'
              // }`}
            >
              {item.label}
            </Text>
          </Flex>
        </Link>
      ))}
    </div>
  );
};
