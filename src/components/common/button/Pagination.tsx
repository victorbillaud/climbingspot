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
    for (let i = 1; i <= totalPages; i++) {
      numbers.push(
        <Link key={i} href={updateQueryParam('page', i.toString())}>
          <Text
            variant="caption"
            className={`cursor-pointer ${
              currentPage === i ? 'font-bold text-brand-300' : ''
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
      <Link
        href={updateQueryParam(
          'page',
          (currentPage > 1 ? currentPage - 1 : 1).toString(),
        )}
      >
        <Text
          variant="caption"
          className={`cursor-pointer ${currentPage === 1 ? 'opacity-50' : ''}`}
        >
          Previous
        </Text>
      </Link>

      <Flex
        direction="row"
        verticalAlign="center"
        horizontalAlign="center"
        gap={4}
      >
        {pageNumbers}
      </Flex>

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
  );
};

export default Pagination;
