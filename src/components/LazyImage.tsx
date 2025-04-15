import React, { useState } from 'react';
import { useInView } from 'react-intersection-observer';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  quality?: number;
}

const LazyImage: React.FC<LazyImageProps> = ({ 
  src, 
  alt, 
  className = '', 
  width = 800,
  height = 600,
  quality = 75
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  // Optimize Contentful image URL
  const optimizeContentfulImage = (url: string): string => {
    if (!url.includes('images.ctfassets.net')) return url;

    const baseUrl = url.startsWith('//') ? `https:${url}` : url;
    const params = new URLSearchParams({
      w: width.toString(),
      h: height.toString(),
      q: quality.toString(),
      fm: 'webp',
      fit: 'fill'
    });

    return `${baseUrl}?${params.toString()}`;
  };

  const optimizedSrc = optimizeContentfulImage(src);
  const placeholderSrc = optimizeContentfulImage(src).replace(`w=${width}`, 'w=20').replace(`h=${height}`, 'h=15');

  return (
    <div 
      ref={ref} 
      className={`relative overflow-hidden ${className}`}
    >
      {/* Low quality placeholder */}
      <img
        src={placeholderSrc}
        alt={alt}
        className={`absolute inset-0 w-full h-full object-cover blur-lg scale-110 transition-opacity duration-300 ${
          isLoaded ? 'opacity-0' : 'opacity-100'
        }`}
        loading="lazy"
      />
      
      {/* Main image */}
      {inView && (
        <img
          src={optimizedSrc}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-700 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setIsLoaded(true)}
          loading="lazy"
        />
      )}
    </div>
  );
};

export default LazyImage;