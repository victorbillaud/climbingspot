import { useTheme } from 'next-themes';
import Image from 'next/image';
import React from 'react';

type ImageProps = {
  src: string;
  srcDark?: string;
  alt: string;
  loader?: boolean;
  fullWidth?: boolean;
  width: number;
  height: number;
  priority?: boolean;
  shadow?: 'sm' | 'md' | 'lg';
  border?: boolean;
  rounded?: 'sm' | 'md' | 'lg' | 'full';
};

type ICustomImageProps = ImageProps & React.ImgHTMLAttributes<HTMLImageElement>;

export function CustomImage({
  src,
  srcDark,
  alt = src,
  loader = true,
  fullWidth = false,
  width,
  height,
  priority = false,
  // eslint-disable-next-line no-unused-vars
  placeholder,
  className,
  ...props
}: ICustomImageProps) {
  const roundedClass: Record<string, string> = {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  };

  const shadowClass: Record<string, string> = {
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
  };

  const theme = useTheme();

  return (
    <div
      className={`relative overflow-hidden ${shadowClass[props.shadow || '']} ${
        props.border ? 'border border-white-300 dark:border-dark-300' : ''
      } ${roundedClass[props.rounded || '']} `}
      style={{
        height: `${height}px`,
        width: fullWidth ? '100%' : `${width}px`,
      }}
    >
      {src || srcDark ? (
        <Image
          src={theme.resolvedTheme === 'light' ? src : srcDark || src}
          alt={alt}
          fill={true}
          priority={priority}
          placeholder={loader ? 'blur' : 'empty'}
          blurDataURL={`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=`}
          className={`w-full h-full absolute top-0 left-0 ${className} ${
            roundedClass[props.rounded || '']
          } `}
          {...props}
        />
      ) : (
        <div
          className={`w-full h-full bg-gray-300 dark:bg-dark-300 ${
            roundedClass[props.rounded || '']
          } `}
        />
      )}
    </div>
  );
}
