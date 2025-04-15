import React, { useState, useEffect, useCallback, useRef } from 'react';

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
  const [isPlaying, setIsPlaying] = useState(true);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const isVideo = (media: CarouselMedia) => media.type === 'video' || media.url.endsWith('.mp4');

  const nextSlide = useCallback(() => {
    const currentVideo = videoRefs.current[currentIndex];
    if (currentVideo) {
      currentVideo.pause();
      currentVideo.currentTime = 0;
    }
    setCurrentIndex((current) => (current + 1) % images.length);
  }, [currentIndex, images.length]);

  const previousSlide = useCallback(() => {
    const currentVideo = videoRefs.current[currentIndex];
    if (currentVideo) {
      currentVideo.pause();
      currentVideo.currentTime = 0;
    }
    setCurrentIndex((current) => (current - 1 + images.length) % images.length);
  }, [currentIndex, images.length]);

  useEffect(() => {
    const currentMedia = images[currentIndex];
    if (isVideo(currentMedia)) {
      const video = videoRefs.current[currentIndex];
      if (video) {
        video.play().catch((error) => {
          console.warn('Autoplay blocked by the browser:', error);
          setIsVideoPlaying(false);
          setIsPlaying(true);
        });
      }
    }
  }, [currentIndex, images]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {images.map((media, index) => (
        <div
          key={index}
          className={`absolute inset-0 w-full h-full transition-opacity duration-700 ${
            index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {isVideo(media) ? (
            <video
              ref={(el) => (videoRefs.current[index] = el)}
              className="w-full h-full object-cover"
              playsInline
              muted
              autoPlay
              loop={false}
              preload="metadata"
              poster={media.poster}
            >
              <source src={media.url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <img
              src={media.url}
              alt={media.alt}
              className="w-full h-full object-cover"
            />
          )}
        </div>
      ))}
      <button
        onClick={previousSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"
      >
        &#8249;
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"
      >
        &#8250;
      </button>
    </div>
  );
};

export default ImageCarousel;