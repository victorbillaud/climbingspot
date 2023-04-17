import { SPOT_DIFFICULTIES, SpotExtended } from '@/features/spots';
import useCustomForm from '@/features/spots/hooks';
import { logger } from '@/lib/logger';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';
import { useDictionary } from '../DictionaryProvider';
import { Button, Flex, InputText, Select } from '../common';

type TSearchBarProps = {
  name?: string;
  location?: string;
  difficulty?: SpotExtended['difficulty'][];
};

export const SearchBar: React.FC<TSearchBarProps> = () => {
  const dictionary = useDictionary();
  const router = useRouter();

  const queryParams = useSearchParams();
  const pathname = usePathname();

  const currentSpotName = queryParams?.get('name');
  const currentLocation = queryParams?.get('location');
  const currentDifficulty = queryParams?.get('difficulty');

  const [spotForm, setSpotForm] = useCustomForm<TSearchBarProps>({
    name: currentSpotName || '',
    location: currentLocation || '',
    difficulty: [currentDifficulty as SpotExtended['difficulty']],
  });

  useEffect(() => {
    logger.debug('SearchBar', 'useEffect', { spotForm });
  }, [spotForm]);

  const handleSearch = () => {
    const { name, location, difficulty } = spotForm;
    logger.debug('SearchBar', 'handleSearch', { name, location, difficulty });
    const newQueryParams = new URLSearchParams();
    if (name) newQueryParams.set('name', name);
    if (location) newQueryParams.set('location', location);
    if (difficulty) newQueryParams.set('difficulty', difficulty.join(','));

    router.push(`${pathname}?${newQueryParams.toString()}`);
  };

  return (
    <Flex className="w-full py-3" direction="column">
      <div className="flex flex-col md:flex-row w-full items-center justify-center gap-3 py-3">
        <InputText
          icon="loop"
          placeholder="Spot name"
          className="w-full md:w-1/3"
          value={spotForm.name}
          onChange={(e) => setSpotForm.name(e.target.value)}
        />
        <InputText
          icon="loop"
          placeholder="Location"
          className="w-full md:w-1/3"
          value={spotForm.location}
          onChange={(e) => setSpotForm.location(e.target.value)}
        />
        <Select
          className="h-full w-full md:w-1/6"
          icon="chart"
          value={spotForm.difficulty}
          onChange={(e) => {
            setSpotForm.difficulty &&
              setSpotForm.difficulty([
                e.target.value as SpotExtended['difficulty'],
              ]);
          }}
        >
          {[...Object.values(SPOT_DIFFICULTIES), ...['All']].map(
            (difficulty) => (
              <option value={difficulty} key={difficulty}>
                {dictionary.spots.difficulty[difficulty]}
              </option>
            ),
          )}
        </Select>
      </div>
      <Button
        variant="default"
        className="h-full"
        text="Search"
        onClick={handleSearch}
      />
    </Flex>
  );
};
