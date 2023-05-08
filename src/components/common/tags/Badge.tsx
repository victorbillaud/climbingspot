import { Flex } from '../layout';
import { TTextStyles, Text } from '../text';
import { IBadge, TTagColor } from './types';

export const Badge = ({
  children,
  className,
  color,
  textVariant = 'caption',
  ...rest
}: IBadge) => {
  const colorConfig: Record<TTagColor, string> = {
    red: 'bg-red-500',
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    yellow: 'bg-yellow-500',
    purple: 'bg-purple-500',
    pink: 'bg-pink-500',
    orange: 'bg-orange-500',
    brand: 'bg-brand-500',
    warning: 'bg-warning-500',
  };

  const sizeConfig: Record<TTextStyles, string> = {
    caption: 'h-5 w-5',
    body: 'h-6 w-6',
    h4: 'h-6 w-6',
    h3: 'h-7 w-7',
    h2: 'h-8 w-8',
    h1: 'h-9 w-9',
    title: 'h-8 w-8',
    subtitle: 'h-7 w-7',
    overline: 'h-4 w-4',
  };

  return (
    <Flex
      className={`rounded-full ${sizeConfig[textVariant]} ${colorConfig[color]} ${className}`}
      {...rest}
    >
      <Text variant={textVariant} className="text-white-100">
        {rest.text}
      </Text>
    </Flex>
  );
};
