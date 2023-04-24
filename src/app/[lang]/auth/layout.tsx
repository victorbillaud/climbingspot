import { Flex } from '@/components/common';
import Image from 'next/image';
import React from 'react';

type Props = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: Props) {
  return (
    <div className="w-full h-full flex flex-col md:flex-row relative divide-x divide-white-300 dark:divide-dark-300">
      <Flex className="w-full md:w-2/5 h-full px-6 py-6 md:py-0 md:px-20">
        {children}
      </Flex>
      <Flex className="w-full md:w-3/5 h-full bg-brand-600 relative">
        <Image
          src="/login.svg"
          alt="climber"
          fill
          className="object-contain p-10"
        />
      </Flex>
    </div>
  );
}
