'use client';

import { useState } from 'react';
// import ModalImage from './ModalImage';
// import Image from 'next/image';

interface GalleryClientProps {
  images: string[];
}

export default function GalleryClient({ images }: GalleryClientProps) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <>
      <div className="grid grid-cols-3 md:grid-cols-4 gap-2 p-4">
        {images.map((filename, i) => (
          <div key={i} className="relative w-full aspect-square overflow-hidden h-55">
            <button onClick={() => setSelected(filename)} className="focus:outline-none w-full h-full block">
              {/* Thumbnail from resized folder */}
              <img
                src={`/resized/400/${filename}`}
                alt={`Thumbnail ${i}`}
                className="object-cover rounded w-full h-full"
                loading="lazy"
                style={{
                  backgroundColor: 'transparent'
                }}
              />
            </button>
          </div>
        ))}
      </div>
      {selected && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={() => setSelected(null)}
        >
          <div
            className="relative w-full h-full"
            onClick={e => e.stopPropagation()}
          >
            <img
              src={`/gallery/${selected}`}
              alt="full image"
              loading="lazy"
              // fill
              style={{
                maxWidth: '100vw',
                maxHeight: '100vh',
                objectFit: 'contain',
                margin: '0 auto',
                backgroundColor: 'transparent'
              }}
            // priority
            />
            <button onClick={() => setSelected(null)} className="absolute top-4 right-4 text-white text-3xl font-bold" >
              &times;
            </button>
          </div >
        </div>
      )}
    </>
  );
}
//

//
// {selected && (
//   <ModalImage
//     thumbnailSrc={`/resized/400/${selected}`}
//     fullSrc={`/gallery/${selected}`}
//   />
// )}
