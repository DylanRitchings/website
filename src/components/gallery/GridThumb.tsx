import { useState, useRef, useLayoutEffect } from 'react';
import type { GalleryImage } from './types';

export function GridThumb({
  image,
  isFocused,
  thumbRef,
  onClick,
}: {
  image: GalleryImage;
  isFocused: boolean;
  thumbRef: (el: HTMLButtonElement | null) => void;
  onClick: () => void;
}) {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useLayoutEffect(() => {
    if (imgRef.current?.complete) setLoaded(true);
  }, []);

  return (
    <button
      ref={thumbRef}
      onClick={onClick}
      className={`group relative w-full h-full snap-start overflow-hidden border-4 bg-[var(--background)] shadow-sm hover:shadow-xl transition-[box-shadow,border-color] focus:outline-none hover:border-blue-500 ${
        isFocused ? 'border-blue-500' : 'border-transparent'
      }`}
    >
      {image.placeholder && (
        <img
          src={image.placeholder}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover scale-110 transition-opacity duration-300"
          style={{ filter: 'blur(8px)', opacity: loaded ? 0 : 1 }}
        />
      )}
      <img
        ref={imgRef}
        src={`/resized/400/${image.filename}`}
        alt={image.filename}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        style={{ opacity: loaded ? 1 : 0 }}
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
    </button>
  );
}
