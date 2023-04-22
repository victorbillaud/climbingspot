import { Flex } from '@/components/common';
import Footer from '@/components/footer/Footer';
import React, { Suspense } from 'react';
import Loading from './loading';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Flex
        fullSize
        direction="column"
        verticalAlign="center"
        horizontalAlign="left"
        className="overflow-x-hidden"
        gap={0}
      >
        <Suspense fallback={<Loading />}>{children}</Suspense>
      </Flex>
      <Footer />
    </>
  );
}
