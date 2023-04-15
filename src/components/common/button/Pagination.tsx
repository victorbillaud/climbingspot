'use client';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import React, { useMemo } from 'react';
import { Flex } from '../layout';
import { Text } from '../text';

interface PaginationProps {
  count: number;
  batchSize: number;
}

const Pagination: React.FC<PaginationProps> = ({ count, batchSize }) => {
  const queryParams = useSearchParams();
  const pathname = usePathname();

  const currentPage = parseInt(queryParams?.get('page') || '1');
  const totalPages = Math.ceil(count / batchSize);

  const updateQueryParam = (key: string, value: string) => {
    const newQueryParams = new URLSearchParams(queryParams?.toString());
    newQueryParams.set(key, value);
    return `${pathname}?${newQueryParams.toString()}`;
  };

  const pageNumbers = useMemo(() => {
    const numbers = [];
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);

    // Handle cases with less than 5 pages
    if (totalPages <= 5) {
      startPage = 1;
      endPage = totalPages;
    } else {
      // Adjust for cases where the first few or last few pages are shown
      if (currentPage <= 3) {
        endPage = 5;
      } else if (currentPage >= totalPages - 2) {
        startPage = totalPages - 4;
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      numbers.push(
        <Link key={i} href={updateQueryParam('page', i.toString())}>
          <Text
            variant="caption"
            className={`cursor-pointer ${
              currentPage === i ? 'opacity-100 text-brand-500' : 'opacity-20'
            }`}
            weight={currentPage === i ? 500 : 400}
          >
            {i}
          </Text>
        </Link>,
      );
    }
    return numbers;
  }, [currentPage, totalPages, updateQueryParam]);

  return (
    <Flex
      className="w-full h-16"
      direction="row"
      verticalAlign="center"
      horizontalAlign="stretch"
      gap={4}
    >
      <Flex className="w-1/3" verticalAlign="top">
        <Link
          href={updateQueryParam(
            'page',
            (currentPage > 1 ? currentPage - 1 : 1).toString(),
          )}
        >
          <Text
            variant="caption"
            className={`cursor-pointer ${
              currentPage === 1 ? 'opacity-50' : ''
            }`}
          >
            Previous
          </Text>
        </Link>
      </Flex>

      <Flex
        direction="row"
        verticalAlign="center"
        horizontalAlign="center"
        gap={4}
      >
        {pageNumbers}
      </Flex>

      <Flex className="w-1/3" verticalAlign="bottom">
        {currentPage < totalPages ? (
          <Link href={updateQueryParam('page', (currentPage + 1).toString())}>
            <Text variant="caption" className={`cursor-pointer`}>
              Next
            </Text>
          </Link>
        ) : (
          <Text variant="caption" className={`opacity-50`}>
            Next
          </Text>
        )}
      </Flex>
    </Flex>
  );
};

export default Pagination;
