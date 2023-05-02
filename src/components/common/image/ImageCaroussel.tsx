import React, { useRef } from 'react';
import { Button } from '../button';
import { IconNames } from '../icon';
import { CustomImage } from './CustomImage';

interface ImageCarouselControllerProps {
  images: {
    src: string;
    alt: string;
    width?: number;
  }[];
  height?: number;
  imageWidth?: 'small' | 'medium' | 'large';
  topRightButton?: true;
  topRightButtonIcon?: IconNames;
  topRightButtonOnClick?: (index: number, image: string) => void;
}

export const ImageCarouselController: React.FC<
  ImageCarouselControllerProps
> = ({
  images,
  height,
  imageWidth = 'large',
  topRightButton,
  topRightButtonIcon,
  topRightButtonOnClick,
}) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = React.useState(false);
  const [showRightArrow, setShowRightArrow] = React.useState(true);

  const widthConfig = {
    small: {
      size: 200,
      className: 'w-1/3',
    },
    medium: {
      size: 300,
      className: 'w-7/12',
    },
    large: {
      size: 400,
      className: 'w-2/3',
    },
  };

  React.useEffect(() => {
    if (carouselRef.current) {
      const handleScroll = () => {
        const { scrollLeft, scrollWidth, clientWidth } =
          carouselRef.current as HTMLDivElement;
        setShowLeftArrow(scrollLeft > 0);
        setShowRightArrow(scrollWidth > clientWidth + scrollLeft);
      };
      carouselRef.current.addEventListener('scroll', handleScroll);
      return () => {
        carouselRef.current?.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  const handlePrev = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: -widthConfig[imageWidth].size,
        behavior: 'smooth',
      });
    }
  };

  const handleNext = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: widthConfig[imageWidth].size,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="relative overflow-hidden w-full h-full">
      <div
        className="h-full flex flex-row gap-3 overflow-hidden rounded-md [&>div]:flex-shrink-0"
        style={{ scrollSnapType: 'x mandatory' }}
        ref={carouselRef}
      >
        {images.length > 1
          ? images.map((image, index) => (
              <div
                key={index}
                className={`relative ${widthConfig[imageWidth].className}`}
              >
                <CustomImage
                  src={image.src}
                  alt={image.alt}
                  loader={true}
                  width={image.width || 400}
                  height={height || 300}
                  fullWidth={true}
                  style={{
                    objectFit: 'cover',
                  }}
                  rounded="md"
                  className="z-10"
                />
                {topRightButton && (
                  <Button
                    text=""
                    variant="secondary"
                    className="absolute top-0 right-0 z-20"
                    icon={topRightButtonIcon || 'cross'}
                    iconOnly
                    onClick={() => {
                      if (topRightButtonOnClick) {
                        topRightButtonOnClick(index, image.src);
                      }
                    }}
                  />
                )}
              </div>
            ))
          : images.length > 0 && (
              <div className="flex items-center justify-center w-full h-full">
                <CustomImage
                  src={images[0].src}
                  alt={images[0].alt}
                  loader={true}
                  width={images[0].width || 400}
                  height={height || 300}
                  fullWidth={true}
                  style={{
                    objectFit: 'cover',
                  }}
                  rounded="md"
                  className="z-10"
                />
                {topRightButton && (
                  <Button
                    text=""
                    variant="secondary"
                    className="absolute top-0 right-0 z-20"
                    icon={topRightButtonIcon || 'cross'}
                    iconOnly
                    onClick={() => {
                      if (topRightButtonOnClick) {
                        topRightButtonOnClick(0, images[0].src);
                      }
                    }}
                  />
                )}
              </div>
            )}
      </div>
      {images.length > 1 && (
        <>
          <Button
            variant="primary"
            icon="chevron-left"
            iconOnly
            text="Previous"
            onClick={handlePrev}
            style={{
              opacity: showLeftArrow ? 1 : 0,
            }}
            size={height && height > 200 ? 'medium' : 'small'}
            className="absolute z-20 rounded-full left-0 top-1/2 transform -translate-y-1/2 transition-opacity duration-300"
          />
          <Button
            variant="primary"
            icon="chevron-right"
            iconOnly
            text="Previous"
            onClick={handleNext}
            style={{
              opacity: showRightArrow ? 1 : 0,
            }}
            size={height && height > 200 ? 'medium' : 'small'}
            className="absolute z-20 rounded-full right-0 top-1/2 transform -translate-y-1/2 transition-opacity duration-300"
          />
        </>
      )}
    </div>
  );
};
