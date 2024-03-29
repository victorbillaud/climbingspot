import { Flex } from '@/components/common';
import React, { Suspense } from 'react';
import Loading from './loading';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<Loading />}>
      <Flex
        fullSize
        direction="column"
        verticalAlign="center"
        horizontalAlign="stretch"
        className="overflow-x-hidden overflow-y-auto"
        gap={0}
      >
        {children}
      </Flex>
    </Suspense>
  );
}
