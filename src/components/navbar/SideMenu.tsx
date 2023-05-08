import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { Badge, Icon, IconNames } from '../common';
import { Flex } from '../common/layout';
import { Text } from '../common/text';

export interface IMenuItemsProps {
  icon: IconNames;
  label: string;
  to: string;
  pins?: number;
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
            horizontalAlign="stretch"
            className={`${
              isActive(item.to)
                ? 'border border-white-300 dark:border-dark-300 dark:bg-dark-200 bg-white-200'
                : 'border dark:border-dark-200 border-white-200'
            }w-full outline-none py-1 px-1 text-s lg:text-sm xl:text-base text-black-100 dark:text-white-100
            rounded-md`}
          >
            <Flex
              className="w-full"
              direction="row"
              horizontalAlign="left"
              gap={1}
            >
              <Icon name={item.icon} />
              <Text key={item.label} variant="caption">
                {item.label}
              </Text>
            </Flex>
            {item.pins && (
              <Flex
                className="w-full"
                direction="row"
                horizontalAlign="right"
                verticalAlign="center"
                gap={1}
              >
                <Badge color="red" text={item.pins.toString()} />
              </Flex>
            )}
          </Flex>
        </Link>
      ))}
    </div>
  );
};
