// components/Tooltip.tsx

import Tippy, { TippyProps } from '@tippyjs/react';
import React from 'react';
import { Card } from '../layout';

interface TooltipProps extends Omit<TippyProps, 'children'> {
  children: React.ReactElement;
}

export const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  ...tippyProps
}) => {
  return (
    <Tippy {...tippyProps} content={<Card className="p-2">{content}</Card>}>
      {children}
    </Tippy>
  );
};
