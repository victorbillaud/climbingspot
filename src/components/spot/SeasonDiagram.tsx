import { Database } from '@/lib/db_types';
import React from 'react';
import { Flex, Text } from '../common';

type Month = Database['public']['Enums']['month'];

interface SeasonDiagramProps {
  months: Month[];
}

const SeasonDiagram: React.FC<SeasonDiagramProps> = ({ months }) => {
  const monthValues: Month[] = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const monthIsActive: boolean[] = monthValues.map((month) =>
    months.includes(month),
  );

  return (
    <>
      <Flex
        className="w-full bg-gray-300 dark:bg-dark-300 rounded-xs"
        direction="row"
        horizontalAlign="left"
        gap={0}
      >
        {monthValues.map((month, index) => (
          <Flex
            key={month}
            className={`flex-1 h-6 ${
              index === 0
                ? ''
                : 'border-l-1 border-gray-300 dark:border-dark-300 '
            } ${
              index === months.length - 1
                ? ''
                : 'border-r-1 border-gray-300 dark:border-dark-300'
            } ${
              monthIsActive[index] && !monthIsActive[index - 1]
                ? 'border rounded-l-xs'
                : ''
            } ${
              monthIsActive[index] && !monthIsActive[index + 1]
                ? 'border rounded-r-xs'
                : ''
            } ${monthIsActive[index] ? 'bg-brand-300 dark:bg-brand-700' : ''} ${
              monthIsActive[index]
                ? 'border border-brand-400'
                : 'border border-transparent'
            } first:rounded-l-xs last:rounded-r-xs`}
          >
            <Text variant="overline">{month.slice(0, 3)}</Text>
          </Flex>
        ))}
      </Flex>
    </>
  );
};

export default SeasonDiagram;
