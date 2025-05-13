import React, { useState, useEffect, useRef } from 'react';

interface CarouselMedia {
  url: string;
  alt: string;
  caption?: string;
  type?: 'image' | 'video';
  poster?: string;
}

interface ImageCarouselProps {
  images: CarouselMedia[];
  interval?: number;
  className?: string;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images,
  interval = 5000,
  className = ''
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const isVideo = (media: CarouselMedia) => media.type === 'video' || media.url.endsWith('.mp4');

  // Helper to clear timer
  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const nextSlide = () => {
    clearTimer();
    setCurrentIndex((current) => (current + 1) % images.length);
  };

  const previousSlide = () => {
    clearTimer();
    setCurrentIndex((current) => (current - 1 + images.length) % images.length);
  };

  useEffect(() => {
    const currentMedia = images[currentIndex];
    clearTimer();
    if (!isVideo(currentMedia)) {
      timerRef.current = setTimeout(() => {
        nextSlide();
      }, interval);
    }
    return clearTimer;
  }, [currentIndex]);

  // Prevent video from resetting on re-render by using a stable key
  const renderMedia = () => {
    const media = images[currentIndex];
    if (isVideo(media)) {
      return (
        <video
          key={`video-${currentIndex}`}
          ref={el => {
            videoRef.current = el;
          }}
          className="w-full h-full object-cover"
          playsInline
          muted
          autoPlay
          loop={false}
          preload="metadata"
          poster={media.poster}
          onEnded={nextSlide}
          controls={false}
        >
          <source src={media.url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      );
    } else {
      return (
        <img
          src={media.url}
          alt={media.alt}
          className="w-full h-full object-cover"
        />
      );
    }
  };

  return (
    <div className={`relative overflow-hidden group ${className}`}>
      {renderMedia()}
      {/* Navigation Buttons */}
      <button
        onClick={previousSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20"
      >
        &#8249;
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20"
      >
        &#8250;
      </button>
    </div>
  );
};

export default ImageCarousel;