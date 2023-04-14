'use client';

import { useMountTransition } from '@/hooks';
import { isSearchingAtom } from '@/hooks/jotai/maps/atom';
import { useAtom } from 'jotai';

export const SearchBackground = () => {
  const [isSearching, setIsSearching] = useAtom(isSearchingAtom);
  const hasTransitionedIn = useMountTransition(isSearching, 2000);

  const className = `search-background ${hasTransitionedIn && 'in'} ${
    isSearching && 'visible'
  }`;

  return hasTransitionedIn || isSearching ? (
    <div
      className={`fixed top-0 bottom-0 left-0 right-0 z-10 bg-dark-300 dark:bg-dark-200 bg-opacity-20 dark:bg-opacity-50 ${className}`}
      id="background-overlay"
    />
  ) : null;
};
