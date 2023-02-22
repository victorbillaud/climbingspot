import { Icon } from '@/components/common/icon';
import Link from 'next/link';
import { INavIconProps } from './types';

export const NavIcon = (props: INavIconProps) => {
  return (
    <Link
      href={props.to}
      className="flex h-min p-1 hover:bg-dark-200 rounded-[8px] cursor-pointer"
    >
      <Icon
        name={props.icon}
        color={'text-dark-100 dark:text-white-100'}
        scale={1.2}
      />
    </Link>
  );
};
