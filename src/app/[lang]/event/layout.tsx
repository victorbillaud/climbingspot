import { Card, Flex, Text } from '@/components/common';
import Footer from '@/components/footer/Footer';
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
        <Flex fullSize direction="row" horizontalAlign="stretch" gap={0}>
          {children}
          <Flex className="h-full w-1/4 p-3">
            <Card className="h-full w-full p-3">
              <Text variant="caption">This is a card</Text>
            </Card>
          </Flex>
        </Flex>
        <Footer />
      </Flex>
    </Suspense>
  );
}
