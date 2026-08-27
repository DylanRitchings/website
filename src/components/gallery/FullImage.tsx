import { useState, useCallback, useRef, useLayoutEffect, type TouchEvent } from 'react';
import type { GalleryImage } from './types';

export function FullImage({
  image,
  isPreloaded,
  onClose,
  onLoaded,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}: {
  image: GalleryImage;
  isPreloaded: boolean;
  onClose: () => void;
  onLoaded: () => void;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}) {
  const [loaded, setLoaded] = useState(isPreloaded);
  const imgRef = useRef<HTMLImageElement>(null);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  useLayoutEffect(() => {
    if (imgRef.current?.complete) {
      setLoaded(true);
      onLoaded();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleLoad = useCallback(() => {
    setLoaded(true);
    onLoaded();
  }, [onLoaded]);

  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
      if (dx < 0 && hasNext) onNext();
      if (dx > 0 && hasPrev) onPrev();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="relative w-full h-full" onClick={e => e.stopPropagation()}>
        {!loaded && (
          <img
            src={`/resized/400/${image.filename}`}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-contain"
            style={{ filter: 'blur(4px)', transform: 'scale(1.02)' }}
          />
        )}
        <img
          ref={imgRef}
          src={`/resized/2000/${image.filename}`}
          alt="full image"
          onLoad={handleLoad}
          className="absolute inset-0 w-full h-full object-contain transition-opacity duration-700"
          style={{ opacity: loaded ? 1 : 0 }}
        />

        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 text-white text-3xl font-light z-10 w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
        >
          &times;
        </button>
        {hasPrev && (
          <button
            onClick={e => { e.stopPropagation(); onPrev(); }}
            aria-label="Previous"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-4xl font-light z-10 w-12 h-12 flex items-center justify-center rounded-full opacity-60 hover:opacity-100 hover:bg-white/10 transition-all"
          >
            ‹
          </button>
        )}
        {hasNext && (
          <button
            onClick={e => { e.stopPropagation(); onNext(); }}
            aria-label="Next"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-4xl font-light z-10 w-12 h-12 flex items-center justify-center rounded-full opacity-60 hover:opacity-100 hover:bg-white/10 transition-all"
          >
            ›
          </button>
        )}
      </div>
    </div>
  );
}
