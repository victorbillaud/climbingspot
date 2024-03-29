import React from 'react';
import { IconNames } from '../icon';
import { TTextStyles } from '../text';

export type TTagColor =
  | 'red'
  | 'green'
  | 'blue'
  | 'yellow'
  | 'orange'
  | 'purple'
  | 'pink'
  | 'brand'
  | 'warning';

export type TTagSize = 'small' | 'medium' | 'large';

export interface ITag extends React.HTMLAttributes<HTMLDivElement> {
  text: string;
  color: TTagColor;
  size?: TTagSize;
  icon?: IconNames;
}

export interface IBadge extends React.HTMLAttributes<HTMLDivElement> {
  text: string;
  textVariant?: TTextStyles;
  color: TTagColor;
}
