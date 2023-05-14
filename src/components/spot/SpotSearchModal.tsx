'use client';

import { ISpotExtended } from '@/features/spots';
import { useState } from 'react';
import { Flex, Icon, InputText, Modal, Text } from '../common';

export type TSpotSearchModalProps = {
  isOpen: boolean;
  ssrSpots?: ISpotExtended[];
  onClose: () => void;
  onConfirm: (spot: ISpotExtended) => void;
};

export const SpotSearchModal = ({
  isOpen,
  ssrSpots,
  onClose,
  onConfirm,
}: TSpotSearchModalProps) => {
  const [search, setSearch] = useState('');
  return (
    <Modal
      title="Change spot"
      size="large"
      fullHeight
      isOpen={isOpen}
      onClose={() => onClose()}
      onConfirm={() => {
        onClose();
      }}
    >
      <Flex className="p-3">
        <InputText
          labelText="Search for a spot"
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full"
        />
        <Flex className="w-full">
          {ssrSpots &&
            ssrSpots
              ?.filter((spot) => {
                if (search === '') {
                  return true;
                }
                return spot.name.toLowerCase().includes(search.toLowerCase());
              })
              .map((spot) => (
                <Flex
                  key={spot.id}
                  fullSize
                  direction="row"
                  verticalAlign="center"
                  horizontalAlign="stretch"
                  className="p-2 cursor-pointer"
                >
                  <Flex
                    direction="row"
                    verticalAlign="center"
                    horizontalAlign="stretch"
                    className="w-full"
                    onClick={() => onConfirm(spot)}
                  >
                    <Flex
                      direction="row"
                      className="w-full"
                      horizontalAlign="left"
                    >
                      <Text variant="body" className="">
                        {spot.name}
                      </Text>
                      <Text
                        variant="caption"
                        className="opacity-30"
                      >{`${spot.location.city}, ${spot.location.department}`}</Text>
                    </Flex>
                    <Flex
                      direction="row"
                      horizontalAlign="center"
                      verticalAlign="center"
                      gap={0}
                    >
                      {spot.note ? (
                        <>
                          <Text variant="body" className="opacity-80">
                            {spot.note.toFixed(1)}
                          </Text>
                          <Icon name="star" color="text-yellow-400" fill />
                        </>
                      ) : null}
                    </Flex>
                  </Flex>
                </Flex>
              ))}
        </Flex>
      </Flex>
    </Modal>
  );
};
