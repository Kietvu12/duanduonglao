import { useState, useEffect, useRef } from 'react';

const OptimizedImage = ({ 
  src, 
  alt, 
  className = '', 
  width, 
  height,
  loading = 'lazy',
  onLoad,
  onError,
  fallbackSrc,
  ...props 
}) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    if (!src) {
      setIsLoading(false);
      return;
    }

    // Reset states when src changes
    setIsLoading(true);
    setHasError(false);

    // Preload image
    const img = new Image();
    
    img.onload = () => {
      setImageSrc(src);
      setIsLoading(false);
      if (onLoad) onLoad();
    };

    img.onerror = () => {
      setHasError(true);
      setIsLoading(false);
      if (fallbackSrc) {
        setImageSrc(fallbackSrc);
      }
      if (onError) onError();
    };

    img.src = src;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, fallbackSrc, onLoad, onError]);

  // Determine aspect ratio box if width/height provided
  const aspectRatioStyle = width && height 
    ? { aspectRatio: `${width}/${height}` }
    : {};

  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      style={aspectRatioStyle}
    >
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      {imageSrc && (
        <img
          ref={imgRef}
          src={imageSrc}
          alt={alt}
          className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
          loading={loading}
          width={width}
          height={height}
          style={{
            ...aspectRatioStyle,
            objectFit: 'contain',
          }}
          onLoad={() => {
            setIsLoading(false);
            if (onLoad) onLoad();
          }}
          onError={() => {
            setHasError(true);
            setIsLoading(false);
            if (fallbackSrc) {
              setImageSrc(fallbackSrc);
            }
            if (onError) onError();
          }}
          {...props}
        />
      )}
      {hasError && !fallbackSrc && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
          {alt || 'Image'}
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;

