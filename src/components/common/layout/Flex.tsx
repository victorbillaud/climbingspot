import { FunctionComponent } from 'react';
import { IFlexProps } from './types';

export const Flex: FunctionComponent<IFlexProps> = ({
  children,
  className,
  fullSize = false,
  direction = 'column',
  verticalAlign = 'center',
  horizontalAlign = 'center',
  gap = 3,
  ...props
}) => {
  const directionClass = {
    row: 'flex-row',
    column: 'flex-col',
    'row-reverse': 'flex-row-reverse',
    'column-reverse': 'flex-col-reverse',
  };

  const verticalAlignClass = {
    top: 'items-start',
    center: 'items-center',
    bottom: 'items-end',
    stretch: 'items-between',
  };

  const horizontalAlignClass = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
    stretch: 'justify-between',
  };

  const gapClass: Record<number, string> = {
    0: '',
    1: 'gap-1',
    2: 'gap-2',
    3: 'gap-3',
    4: 'gap-4',
    5: 'gap-5',
    6: 'gap-6',
    7: 'gap-7',
    8: 'gap-8',
    12: 'gap-12',
    16: 'gap-16',
    20: 'gap-20',
    24: 'gap-24',
  };

  return (
    <div
      className={`${fullSize ? 'h-full w-full' : ''} flex ${
        directionClass[direction]
      } ${verticalAlignClass[verticalAlign]} ${
        horizontalAlignClass[horizontalAlign]
      } ${gapClass[gap]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
