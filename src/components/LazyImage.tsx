import React, { useState, useRef, useEffect, useCallback, memo } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  fallback?: string;
  onLoad?: () => void;
  onError?: () => void;
  threshold?: number;
  rootMargin?: string;
}

export const LazyImage = memo<LazyImageProps>(
  ({
    src,
    alt,
    className = '',
    placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iIGZpbGw9IiM5Y2EzYWYiIGZvbnQtc2l6ZT0iMTIiPkxvYWRpbmcuLi48L3RleHQ+PC9zdmc+',
    fallback = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2ZlZGVkZWQiLz48dGV4dCB4PSI1MCIgeT0iNTAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjZGMyNjI2IiBmb250LXNpemU9IjEyIj5FcnJvcjwvdGV4dD48L3N2Zz4=',
    onLoad,
    onError,
    threshold = 0.1,
    rootMargin = '50px',
  }) => {
    const [imageSrc, setImageSrc] = useState<string>(placeholder);
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [isInView, setIsInView] = useState(false);

    const imgRef = useRef<HTMLImageElement>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);

    const handleLoad = useCallback(() => {
      setIsLoaded(true);
      setHasError(false);
      onLoad?.();
    }, [onLoad]);

    const handleError = useCallback(() => {
      setHasError(true);
      setImageSrc(fallback);
      onError?.();
    }, [fallback, onError]);

    const startLoading = useCallback(() => {
      if (isInView && !isLoaded && !hasError) {
        setImageSrc(src);
      }
    }, [isInView, isLoaded, hasError, src]);

    useEffect(() => {
      const imgElement = imgRef.current;
      if (!imgElement) return;

      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsInView(true);
              observerRef.current?.unobserve(imgElement);
            }
          });
        },
        {
          threshold,
          rootMargin,
        }
      );

      observerRef.current.observe(imgElement);

      return () => {
        if (observerRef.current) {
          observerRef.current.disconnect();
        }
      };
    }, [threshold, rootMargin]);

    useEffect(() => {
      startLoading();
    }, [startLoading]);

    return (
      <img
        ref={imgRef}
        src={imageSrc}
        alt={alt}
        className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
        onLoad={handleLoad}
        onError={handleError}
        loading="lazy"
      />
    );
  }
);

LazyImage.displayName = 'LazyImage';
