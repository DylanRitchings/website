import { useState, useRef, useLayoutEffect } from 'react';
import type { GalleryImage } from './types';

export function Photo({
  image,
  photoRef,
  onClick,
  viewport,
}: {
  image: GalleryImage;
  photoRef: (el: HTMLDivElement | null) => void;
  onClick: () => void;
  viewport: { w: number; h: number } | null;
}) {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useLayoutEffect(() => {
    if (imgRef.current?.complete) setLoaded(true);
  }, []);

  // Below sm, size each box to that photo's own aspect ratio (nearly all of
  // this gallery is landscape ~1.5:1) instead of a fixed viewport fraction —
  // a fixed height on a tall mobile box left huge blank object-contain
  // letterbox bars top/bottom, which read as a big gap even for the centered
  // photo itself. Cap at 85% of viewport height for the rare portrait shot.
  const mobileHeight = viewport && viewport.w < 640
    ? Math.min(viewport.w * (image.height / image.width), viewport.h * 0.85)
    : undefined;

  return (
    <div
      ref={photoRef}
      style={mobileHeight ? { height: mobileHeight } : undefined}
      className="group relative w-full h-[75svh] sm:h-[calc(100svh-89px)] shrink-0 snap-center sm:snap-start overflow-hidden bg-[var(--background)]"
    >
      <button onClick={onClick} className="focus:outline-none w-full h-full block cursor-zoom-in">
        {image.placeholder && (
          <img
            src={image.placeholder}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-contain transition-opacity duration-300"
            style={{ filter: 'blur(8px)', aspectRatio: `${image.width} / ${image.height}`, opacity: loaded ? 0 : 1 }}
          />
        )}
        <img
          ref={imgRef}
          src={`/resized/2000/${image.filename}`}
          alt={image.filename}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          className="absolute inset-0 w-full h-full object-contain transition-opacity duration-500"
          style={{ opacity: loaded ? 1 : 0 }}
        />
      </button>
    </div>
  );
}
