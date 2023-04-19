import { formatMessageDate } from '@/lib';
import { Database } from '@/lib/db_types';
import React from 'react';
import { CustomImage, Flex, Text } from '../common';

export type TMessageProps = {
  content: string;
  created_at: string;
  user: Pick<
    Database['public']['Tables']['profiles']['Row'],
    'avatar_url' | 'full_name' | 'id'
  >;
  isOwnMessage?: boolean;
};

export const Message: React.FC<TMessageProps> = ({
  content,
  user,
  created_at,
  isOwnMessage,
}) => {
  return (
    <div
      className={`flex ${
        isOwnMessage ? 'flex-col items-start' : 'flex-col items-end'
      } justify-center gap-1 w-full opacity-90 py-2`}
    >
      <Flex
        className="group w-full"
        direction={isOwnMessage ? 'row-reverse' : 'row'}
        horizontalAlign={'right'}
        verticalAlign="center"
      >
        <Text
          variant="overline"
          className="opacity-0 group-hover:opacity-50 transition-opacity duration-300"
        >
          {formatMessageDate(new Date(created_at))}
        </Text>
        <div
          className={` rounded-md shadow-sm dark:shadow  p-2 max-w-[70%] ${
            isOwnMessage
              ? 'bg-brand-500 text-white-200 border border-brand-400'
              : 'bg-white-200 dark:bg-dark-200 border border-white-300 dark:border-dark-300'
          }`}
        >
          <Text variant="caption" className="w-full overflow">
            {content}
          </Text>
        </div>
      </Flex>

      <div
        className={`group w-full flex gap-2 items-center ${
          isOwnMessage ? 'flex-row' : 'flex-row-reverse'
        }`}
      >
        <CustomImage
          key={user.id}
          src={user.avatar_url as string}
          alt={`${user.full_name} avatar`}
          width={20}
          height={20}
          rounded="full"
          style={{
            objectFit: 'cover',
          }}
          className="border border-white-300 dark:border-dark-300"
        />
        <Text
          variant="overline"
          className="opacity-0 group-hover:opacity-50 transition-opacity duration-300"
        >
          {user.full_name}
        </Text>
      </div>
    </div>
  );
};
