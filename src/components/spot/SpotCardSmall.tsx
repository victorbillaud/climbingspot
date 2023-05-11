'use client';

import { CustomImage, Flex, Icon, Text } from '@/components/common';
import { GetSpotResponseSuccess } from '@/features/spots';
import { actualSpotAtom } from '@/hooks/jotai/maps/atom';
import { getFirstItem } from '@/lib';
import { useAtom } from 'jotai';
import Link from 'next/link';
import React from 'react';
import { Button, Card, Tag } from '../common';

export type TSpotCardSmallProps = {
  spot: NonNullable<GetSpotResponseSuccess>;
  orientation?: 'horizontal' | 'vertical';
  imageHeight?: number;
  openFloatingPanel?: boolean;
};

export const SpotCardSmall: React.FC<TSpotCardSmallProps> = ({
  spot,
  orientation = 'vertical',
  openFloatingPanel = false,
  imageHeight = 200,
}) => {
  const [actualSpot, setActualSpot] = useAtom(actualSpotAtom);

  return (
    <Card className="relative h-full w-full dark:bg-dark-300">
      <Flex
        fullSize
        direction={orientation === 'vertical' ? 'column' : 'row'}
        verticalAlign="center"
        horizontalAlign="stretch"
        gap={0}
      >
        <Flex
          direction="row"
          verticalAlign="top"
          horizontalAlign="left"
          className="w-full h-full relative rounded-t-md"
        >
          {spot.image && spot.image.length > 0 ? (
            <CustomImage
              src={getFirstItem(spot.image) || ''}
              alt={spot.name || 'spot'}
              fullWidth
              height={imageHeight}
              className={`${
                orientation === 'vertical' ? 'rounded-t-md' : 'rounded-l-md'
              }`}
              style={{
                objectFit: 'cover',
              }}
            />
          ) : (
            <Flex
              fullSize
              direction="column"
              verticalAlign="center"
              horizontalAlign="center"
              style={{
                minHeight: 100,
                height: '100%',
              }}
              className={'bg-white-300 dark:bg-dark-200 rounded-[5px]'}
            >
              <Text variant="caption" className="opacity-40">
                No image
              </Text>
            </Flex>
          )}
          <Link
            href={spot.slug as string}
            target="_blank"
            className="absolute top-1 left-1"
          >
            <Button variant="primary" text="Open spot page" icon="eye" />
          </Link>
          {openFloatingPanel && (
            <Button
              variant="primary"
              text="Open spot panel"
              icon="eye"
              className="absolute bottom-1 right-1"
              iconOnly
              onClick={() => {
                setActualSpot(spot);
              }}
            />
          )}
        </Flex>
        <Flex
          direction={'column'}
          verticalAlign="center"
          horizontalAlign="stretch"
          gap={0}
          className={`w-full h-full ${
            orientation === 'vertical' ? 'divide-y' : 'divide-x'
          }  divide-white-300 dark:divide-gray-600 w-full rounded-t-md`}
        >
          <Flex
            fullSize
            direction="column"
            verticalAlign="top"
            horizontalAlign="center"
            className="p-2"
            gap={0}
          >
            <Text variant="title" color="text-brand-300 dark:text-brand-100">
              {spot.name}
            </Text>
            <Flex direction="row" horizontalAlign="left">
              <Text variant="caption" className="opacity-80">
                {spot.location.city}
              </Text>
              <Text variant="caption" className="opacity-50">
                {spot.location.department}
              </Text>
            </Flex>
          </Flex>
          <Flex
            direction="row"
            verticalAlign="center"
            horizontalAlign="stretch"
            className="w-full px-2 py-2"
          >
            {spot.type && (
              <Tag
                text={spot.type}
                color={spot.type === 'Outdoor' ? 'green' : 'blue'}
              />
            )}
            <Flex
              direction="row"
              verticalAlign="center"
              horizontalAlign="center"
              className="h-full ml-auto"
              gap={0}
            >
              {spot.note ? (
                <>
                  <Text variant="caption" className="tracking-widest">
                    {spot.note?.toFixed(1)}
                    <span className="opacity-70">/5</span>
                  </Text>
                  <Icon name="star" color="text-yellow-500" fill scale={0.8} />
                </>
              ) : (
                <Text variant="caption" className="opacity-60">
                  {'No rating'}
                </Text>
              )}
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Card>
  );
};
