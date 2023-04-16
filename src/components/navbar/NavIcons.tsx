import { Icon } from '@/components/common/icon';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { INavIconProps } from './types';

export const NavIcon = (props: INavIconProps) => {
  const pathname = usePathname();

  return (
    <Link href={props.to} className={`relative flex h-min p-1`}>
      {props.userImage ? (
        <Image
          src={props.userImage}
          alt="Avatar"
          width={30}
          height={30}
          className="rounded-full"
        />
      ) : (
        <Icon
          name={props.icon}
          color={
            `/${pathname?.split('/')[2]}` === props.to
              ? 'text-brand-500'
              : 'text-dark-400 dark:text-white-300 hover:text-brand-500 transition-colors duration-200'
          }
          scale={1.2}
        />
      )}
      {`/${pathname?.split('/')[2]}` === props.to && (
        <div
          className={`absolute w-[5px] h-[5px] rounded-full bg-brand-500 bottom-0 right-1/2 transform translate-x-1/2`}
        />
      )}
    </Link>
  );
};
