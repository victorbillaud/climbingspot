'use client';

import { isSearchingAtom } from '@/hooks/jotai/maps/atom';
import { Database } from '@/lib/db_types';
import { logger } from '@/lib/logger';
import { useAtom } from 'jotai';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { MouseEventHandler, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useSupabase } from '../auth/SupabaseProvider';
import { Button, Card, Flex, Icon, InputText, Text } from '../common';

export type ISpotSearch =
  Database['public']['Views']['spot_search_view']['Row'];

export type IEventSearch =
  Database['public']['Views']['event_search_view']['Row'];

type SearchBarProps = {
  showMapLink?: boolean;
};

export const SearchBar = ({ showMapLink = true }: SearchBarProps) => {
  const [isSearching, setIsSearching] = useAtom(isSearchingAtom);

  const { supabase } = useSupabase();
  const router = useRouter();
  const params = useSearchParams();
  const pathname = usePathname();

  const [search, setSearch] = React.useState('');
  const [spotsFound, setSpotsFound] = React.useState<ISpotSearch[] | null>(
    null,
  );
  const [eventsFound, setEventsFound] = React.useState<IEventSearch[] | null>(
    null,
  );
  const [focus, setFocus] = React.useState(true);
  const inputRef = React.useRef<HTMLInputElement>(null); // represents the input element
  const resultsRef = React.useRef<HTMLDivElement>(null); // represents the results element

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current) {
        if (
          inputRef.current.contains(event.target as Node) ||
          resultsRef?.current?.contains(event.target as Node)
        ) {
          setFocus(true);
          setIsSearching(true);
        } else {
          setFocus(false);
          setIsSearching(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = async (search: string) => {
    const { data: spots, error: spotsError } = await supabase.rpc(
      'search_spots',
      {
        keyword: search,
      },
    );

    const { data: events, error: eventsError } = await supabase.rpc(
      'search_events',
      {
        keyword: search,
      },
    );

    if (spotsError || eventsError) {
      toast.error('Error searching for spots');
      logger.error({ spotsError, eventsError });
    }

    if (spots) {
      setSpotsFound(spots);
    }

    if (events) {
      setEventsFound(events);
    }
  };

  useEffect(() => {
    if (search.length > 2) {
      handleSearch(search);
      setIsSearching(true);
    } else {
      setIsSearching(false);
      setSpotsFound(null);
      setEventsFound(null);
    }
  }, [search]);

  return (
    <Flex className="relative w-full">
      <InputText
        className="search-bar w-full"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        icon="loop"
        ref={inputRef}
      />
      {(spotsFound || eventsFound) && focus && (
        <>
          <Card
            className="search-bar-results absolute top-14 w-[97vw] md:w-auto md:-inset-x-20 z-50 divide-y divide-white-300 dark:divide-dark-300 max-h-96 overflow-y-auto"
            ref={resultsRef}
          >
            {spotsFound && (
              <Flex direction="column" horizontalAlign="left" gap={0}>
                <Flex
                  className="w-full"
                  direction="row"
                  verticalAlign="center"
                  horizontalAlign="left"
                >
                  <Text
                    variant="caption"
                    className="opacity-40 p-2"
                    weight={400}
                  >
                    Spots
                  </Text>
                </Flex>
                {spotsFound.length > 0 ? (
                  spotsFound.map((spot, index) => (
                    <SpotListItems
                      key={index}
                      spot={spot}
                      setFocus={setFocus}
                      onClickText={() => {
                        setFocus(false);
                        setIsSearching(false);
                        router.push(`${spot.slug}?${params?.toString()}`);
                      }}
                      onClickMaps={(e) => {
                        e.stopPropagation();
                        if (showMapLink) {
                          setFocus(false);
                          setIsSearching(false);
                          router.push(`/maps?spotId=${spot.id}`);
                        }
                      }}
                      showMapLink={showMapLink}
                    />
                  ))
                ) : (
                  <Flex
                    className="w-full"
                    direction="row"
                    verticalAlign="center"
                    horizontalAlign="left"
                  >
                    <Text
                      variant="caption"
                      className="opacity-30 p-2"
                      weight={300}
                    >
                      No spots found
                    </Text>
                  </Flex>
                )}
              </Flex>
            )}
            {eventsFound && (
              <Flex direction="column" horizontalAlign="left" gap={0}>
                <Flex
                  className="w-full"
                  direction="row"
                  verticalAlign="center"
                  horizontalAlign="left"
                >
                  <Text
                    variant="caption"
                    className="opacity-40 p-2"
                    weight={400}
                  >
                    Events
                  </Text>
                </Flex>
                {eventsFound.length > 0 ? (
                  eventsFound.map((event, index) => (
                    <EventListItems
                      key={index}
                      event={event}
                      setFocus={setFocus}
                      onClickText={() => {
                        setFocus(false);
                        setIsSearching(false);
                        router.push(`/event/${event.id}`);
                      }}
                    />
                  ))
                ) : (
                  <Flex
                    className="w-full"
                    direction="row"
                    verticalAlign="center"
                    horizontalAlign="left"
                  >
                    <Text
                      variant="caption"
                      className="opacity-30 p-2"
                      weight={300}
                    >
                      No events found
                    </Text>
                  </Flex>
                )}
              </Flex>
            )}
          </Card>
        </>
      )}
    </Flex>
  );
};

export const SpotListItems = ({
  spot,
  setFocus,
  showMapLink = true,
  onClickText,
  onClickMaps,
}: {
  spot: ISpotSearch;
  // eslint-disable-next-line no-unused-vars
  setFocus: (focus: boolean) => void;
  showMapLink?: boolean;
  // eslint-disable-next-line no-unused-vars
  onClickText: MouseEventHandler<HTMLDivElement>;
  // eslint-disable-next-line no-unused-vars
  onClickMaps: MouseEventHandler<HTMLButtonElement>;
}) => {
  return (
    <Flex
      fullSize
      direction="row"
      verticalAlign="center"
      horizontalAlign="stretch"
      className="p-2 cursor-pointer hover:bg-white-300/20 dark:hover:bg-dark-300/20 "
    >
      <Flex
        direction="row"
        verticalAlign="center"
        horizontalAlign="stretch"
        className="w-full"
        onClick={onClickText}
      >
        <Flex direction="row" className="w-full" horizontalAlign="left">
          <Text variant="body" className="">
            {spot.name}
          </Text>
          <Text
            variant="caption"
            className="opacity-30"
          >{`${spot.city}, ${spot.department}`}</Text>
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
      {showMapLink && (
        <Button
          variant="none"
          text="See on map"
          icon="map"
          className="text-brand-400"
          iconOnly={true}
          onClick={onClickMaps}
        />
      )}
    </Flex>
  );
};

export const EventListItems = ({
  event,
  setFocus,
  onClickText,
}: {
  event: IEventSearch;
  // eslint-disable-next-line no-unused-vars
  setFocus: (focus: boolean) => void;
  // eslint-disable-next-line no-unused-vars
  onClickText: MouseEventHandler<HTMLDivElement>;
}) => {
  const pathname = usePathname();
  return (
    <Flex
      fullSize
      direction="row"
      verticalAlign="center"
      horizontalAlign="stretch"
      className="p-2 cursor-pointer hover:bg-white-300/20 dark:hover:bg-dark-300/20"
    >
      <Flex
        direction="row"
        verticalAlign="center"
        horizontalAlign="stretch"
        className="w-full"
        onClick={onClickText}
      >
        <Flex
          direction="row"
          className="w-full"
          horizontalAlign="left"
          verticalAlign="center"
        >
          <Text variant="body" className="h-full">
            {event.name}
          </Text>
          <Text variant="caption" className="h-full truncate opacity-30">
            {new Date(event.start_at).toLocaleString(pathname?.split('/')[1], {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
            })}
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
};
