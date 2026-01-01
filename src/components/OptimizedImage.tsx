import React, { useState, useRef, useEffect, ImgHTMLAttributes } from 'react';

interface OptimizedImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean; // If true, load eagerly (for above-the-fold images)
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  sizes?: string;
  className?: string;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * OptimizedImage Component
 * 
 * A performance-optimized image component that:
 * - Uses native lazy loading with Intersection Observer fallback
 * - Supports WebP/AVIF with fallbacks
 * - Implements blur-up placeholder effect
 * - Prevents Cumulative Layout Shift (CLS) with aspect ratio
 * - Uses decoding="async" for non-blocking decode
 * 
 * @example
 * <OptimizedImage
 *   src="/images/hero.jpg"
 *   alt="Hero image"
 *   width={800}
 *   height={600}
 *   priority={true}
 *   sizes="(max-width: 768px) 100vw, 50vw"
 * />
 */
const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  priority = false,
  placeholder = 'empty',
  blurDataURL,
  sizes = '100vw',
  className = '',
  onLoad,
  onError,
  ...rest
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Generate optimized image URLs
  const getOptimizedSrc = (format: 'webp' | 'avif' | 'original') => {
    if (!src) return '';
    
    // Handle external URLs (like Pexels)
    if (src.startsWith('http')) {
      if (src.includes('pexels.com')) {
        // Pexels supports on-the-fly optimization
        const baseUrl = src.split('?')[0];
        const params = new URLSearchParams({
          auto: 'compress',
          cs: 'tinysrgb',
          w: String(width || 800),
        });
        if (format === 'webp') params.set('fm', 'webp');
        return `${baseUrl}?${params.toString()}`;
      }
      return src;
    }
    
    // For local images, check for optimized versions
    const basePath = src.replace(/\.(jpg|jpeg|png|gif)$/i, '');
    if (format === 'avif') return `${basePath}.avif`;
    if (format === 'webp') return `${basePath}.webp`;
    return src;
  };

  // Generate srcset for responsive images
  const generateSrcSet = (format: 'webp' | 'avif') => {
    if (!src || src.startsWith('http')) return undefined;
    
    const basePath = src.replace(/\.(jpg|jpeg|png|gif)$/i, '');
    const widths = [320, 640, 768, 1024, 1280, 1920];
    
    return widths
      .filter(w => !width || w <= width * 2)
      .map(w => `${basePath}-${w}w.${format} ${w}w`)
      .join(', ');
  };

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || !imgRef.current) return;

    // Check for native lazy loading support
    if ('loading' in HTMLImageElement.prototype) {
      setIsInView(true);
      return;
    }

    // Fallback to Intersection Observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '50px 0px', // Load images 50px before they enter viewport
        threshold: 0.01,
      }
    );

    observer.observe(imgRef.current);

    return () => observer.disconnect();
  }, [priority]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  // Calculate aspect ratio for preventing CLS
  const aspectRatio = width && height ? width / height : undefined;
  const paddingBottom = aspectRatio ? `${(1 / aspectRatio) * 100}%` : undefined;

  // Placeholder styles
  const placeholderStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#e5e7eb',
    transition: 'opacity 0.3s ease-in-out',
    opacity: isLoaded ? 0 : 1,
  };

  const blurPlaceholderStyle: React.CSSProperties = {
    ...placeholderStyle,
    backgroundImage: blurDataURL ? `url(${blurDataURL})` : undefined,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    filter: 'blur(20px)',
    transform: 'scale(1.1)',
  };

  return (
    <div
      className={`optimized-image-wrapper ${className}`}
      style={{
        position: 'relative',
        overflow: 'hidden',
        width: width ? `${width}px` : '100%',
        maxWidth: '100%',
      }}
    >
      {/* Aspect ratio box to prevent CLS */}
      {paddingBottom && (
        <div style={{ paddingBottom, width: '100%' }} aria-hidden="true" />
      )}

      {/* Placeholder */}
      {placeholder === 'blur' && blurDataURL ? (
        <div style={blurPlaceholderStyle} aria-hidden="true" />
      ) : (
        <div style={placeholderStyle} aria-hidden="true" />
      )}

      {/* Actual image with picture element for format selection */}
      {isInView && !hasError && (
        <picture>
          {/* AVIF format (best compression, limited support) */}
          <source
            type="image/avif"
            srcSet={generateSrcSet('avif')}
            sizes={sizes}
          />
          {/* WebP format (good compression, wide support) */}
          <source
            type="image/webp"
            srcSet={generateSrcSet('webp') || getOptimizedSrc('webp')}
            sizes={sizes}
          />
          {/* Fallback image */}
          <img
            ref={imgRef}
            src={getOptimizedSrc('original')}
            alt={alt}
            width={width}
            height={height}
            loading={priority ? 'eager' : 'lazy'}
            decoding={priority ? 'sync' : 'async'}
            fetchPriority={priority ? 'high' : 'auto'}
            onLoad={handleLoad}
            onError={handleError}
            style={{
              position: paddingBottom ? 'absolute' : 'relative',
              top: 0,
              left: 0,
              width: '100%',
              height: paddingBottom ? '100%' : 'auto',
              objectFit: 'cover',
              opacity: isLoaded ? 1 : 0,
              transition: 'opacity 0.3s ease-in-out',
            }}
            {...rest}
          />
        </picture>
      )}

      {/* Error fallback */}
      {hasError && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f3f4f6',
            color: '#9ca3af',
          }}
          role="img"
          aria-label={alt}
        >
          <span>Image unavailable</span>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;

/**
 * Hook for lazy loading any element with Intersection Observer
 * 
 * @example
 * const { ref, isInView } = useLazyLoad({ threshold: 0.1 });
 * return <div ref={ref}>{isInView && <HeavyComponent />}</div>;
 */
export const useLazyLoad = (options: IntersectionObserverInit = {}) => {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '100px',
        threshold: 0.01,
        ...options,
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [options]);

  return { ref, isInView };
};

/**
 * Generate a tiny blur placeholder data URL
 * Use this during build time to generate blur placeholders
 */
export const generateBlurPlaceholder = (color = '#e5e7eb'): string => {
  // Simple 1x1 pixel SVG as blur placeholder
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"><rect fill="${color}" width="1" height="1"/></svg>`;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};
