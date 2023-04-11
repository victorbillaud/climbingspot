import React, { useMemo } from 'react';
import { Icon } from '../icon';
import { InputText } from '../input';
import { Flex } from '../layout';
import { Text } from '../text';

interface TableProps {
  rows: Array<{ [key: string]: any }>;
}

export const Table: React.FC<TableProps> = (params) => {
  const headers = params.rows.length > 0 ? Object.keys(params.rows[0]) : [];

  const [search, setSearch] = React.useState('');
  const [sort, setSort] = React.useState<string | null>(null);

  const sortRows = (rows: Array<{ [key: string]: any }>) => {
    if (sort === null) {
      return rows;
    }

    const [column, direction] = sort.split(':');

    return rows.sort((a, b) => {
      if (a[column] < b[column]) {
        return direction === 'asc' ? -1 : 1;
      }
      if (a[column] > b[column]) {
        return direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

  const filterRows = (rows: Array<{ [key: string]: any }>, search: string) => {
    return rows.filter((row) => {
      return Object.values(row).some((value) => {
        return (
          value !== null &&
          value.toString().toLowerCase().includes(search.toLowerCase())
        );
      });
    });
  };

  const filteredAndSortedRows = useMemo(() => {
    let filteredRows = params.rows;

    if (search.length > 0) {
      filteredRows = filterRows(params.rows, search);
    }
    filteredRows = sortRows(filteredRows);

    return filteredRows;
  }, [params.rows, search, sort]);

  return (
    <Flex fullSize={true} verticalAlign="center" horizontalAlign="center">
      <Flex
        className="w-full"
        direction="row"
        verticalAlign="center"
        horizontalAlign="stretch"
      >
        <InputText
          className="w-full"
          placeholder="Search..."
          icon="loop"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Flex>
      <div className="relative w-full h-full mx-auto px-4 md:px-8">
        <div className="absolute w-full inset-0 shadow-sm rounded-lg overflow-x-auto overflow-y-auto border border-white-300 dark:border-dark-300">
          <table className="relative w-full table-auto text-sm text-left">
            <thead className="sticky top-0 bg-white-300 dark:bg-dark-200 text-gray-600 dark:text-white-200 font-medium">
              <tr>
                {headers.map((header, index) => (
                  <th
                    key={index}
                    className="px-6 py-3 whitespace-nowrap capitalize cursor-pointer border-b border-white-300 dark:border-dark-300"
                    onClick={() => {
                      if (sort === null) {
                        setSort(`${header}:asc`);
                      } else {
                        const [column, direction] = sort.split(':');
                        if (column === header) {
                          setSort(
                            `${header}:${direction === 'asc' ? 'desc' : 'asc'}`,
                          );
                        } else {
                          setSort(`${header}:asc`);
                        }
                      }
                    }}
                  >
                    <Flex
                      direction="row"
                      verticalAlign="center"
                      horizontalAlign="left"
                    >
                      <Text variant="caption" weight={500}>
                        {header.split('_').join(' ')}
                      </Text>
                      <Flex
                        direction="column"
                        horizontalAlign="center"
                        verticalAlign="center"
                        gap={0}
                      >
                        <Icon
                          name="chevron-up"
                          padding={false}
                          scale={0.5}
                          className={`${
                            sort === `${header}:asc`
                              ? 'opacity-100'
                              : 'opacity-20'
                          }`}
                        />
                        <Icon
                          name="chevron-down"
                          padding={false}
                          scale={0.5}
                          className={`${
                            sort === `${header}:desc`
                              ? 'opacity-100'
                              : 'opacity-20'
                          }`}
                        />
                      </Flex>
                    </Flex>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-gray-600 dark:text-white-200">
              {filteredAndSortedRows.map((row, index) => (
                <tr
                  key={index}
                  className="cursor-pointer border-y border-white-300/10 dark:divide-dark-300 hover:bg-white-300/30 dark:hover:bg-dark-300/50 transition-colors duration-200"
                  onClick={() => {
                    console.log(row);
                  }}
                >
                  {headers.map((header, cellIndex) => (
                    <td key={cellIndex} className="px-6 py-4 whitespace-nowrap">
                      {row[header]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Flex
          className="absolute bottom-0 left-0 right-0 backdrop-blur-sm bg-white-300 dark:bg-dark-200/80 rounded-b-lg border border-white-300 dark:border-dark-300"
          verticalAlign="center"
          horizontalAlign="center"
        >
          <Text variant="caption" className="w-full text-center p-2">
            {filteredAndSortedRows.length} of {params.rows.length} rows
          </Text>
        </Flex>
      </div>
    </Flex>
  );
};
