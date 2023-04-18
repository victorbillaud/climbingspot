import { FunctionComponent } from 'react';
import { Icon } from '../icon';
import { ITag, tagsConfig } from './index';

export const Tag: FunctionComponent<ITag> = ({
  text,
  color,
  size = 'small',
  className,
  icon,
  ...props
}: ITag) => {
  const sizeConfig = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base',
  };

  const iconConfig = {
    small: 0.8,
    medium: 1,
    large: 1.2,
  };

  return (
    <span
      className={`flex flex-row gap-1 items-center ${tagsConfig[color].textColor} bg-opacity-10 ${tagsConfig[color].bgColor} border ${tagsConfig[color].borderColor} rounded-full px-2 py-1 m-0 w-fit ${sizeConfig[size]} ${className}`}
      {...props}
    >
      {icon && (
        <Icon
          padding={false}
          scale={iconConfig[size]}
          name={icon}
          className="mr-1"
        />
      )}
      {text}
    </span>
  );
};
