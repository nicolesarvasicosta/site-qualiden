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
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const isVideo = (media: CarouselMedia) => media.type === 'video' || media.url.endsWith('.mp4');

  const nextSlide = () => {
    const currentVideo = videoRefs.current[currentIndex];
    if (currentVideo) {
      currentVideo.pause();
      currentVideo.currentTime = 0;
    }
    setCurrentIndex((current) => (current + 1) % images.length);
  };

  const previousSlide = () => {
    const currentVideo = videoRefs.current[currentIndex];
    if (currentVideo) {
      currentVideo.pause();
      currentVideo.currentTime = 0;
    }
    setCurrentIndex((current) => (current - 1 + images.length) % images.length);
  };

  useEffect(() => {
    const currentMedia = images[currentIndex];
    let timer: NodeJS.Timeout;

    if (isVideo(currentMedia)) {
      const video = videoRefs.current[currentIndex];
      if (video) {
        video.play().catch((error) => {
          console.warn('Autoplay blocked by the browser:', error);
        });

        // Wait for the video to end before transitioning to the next slide
        video.onended = nextSlide;
      }
    } else {
      // For images, use the interval to transition to the next slide
      timer = setTimeout(nextSlide, interval);
    }

    return () => {
      clearTimeout(timer);
      const video = videoRefs.current[currentIndex];
      if (video) {
        video.onended = null; // Clean up the event listener
      }
    };
  }, [currentIndex, images, interval]);

  return (
    <div className={`relative overflow-hidden group ${className}`}>
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
              autoPlay={index === currentIndex} // Only autoplay the current video
              loop={false}
              preload="metadata"
              poster={media.poster}
              onEnded={nextSlide} // Move to the next slide when the video ends
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