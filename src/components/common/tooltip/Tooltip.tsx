// components/Tooltip.tsx

import Tippy, { TippyProps } from '@tippyjs/react';
import React from 'react';
import { Card, Flex } from '../layout';

interface TooltipProps extends Omit<TippyProps, 'children'> {
  children: React.ReactElement;
}

export const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  ...tippyProps
}) => {
  return (
    <Tippy
      {...tippyProps}
      appendTo={() => document.body}
      content={
        <Flex fullSize className="relative">
          <Card className="p-2">{content}</Card>
          <div className="absolute w-[8px] h-[8px] bg-white-200 dark:bg-dark-200 border-b border-r border-white-300 dark:border-dark-300 transform rotate-45 -bottom-[4px] left-1/2 -translate-x-1/2"></div>
        </Flex>
      }
    >
      {children}
    </Tippy>
  );
};
