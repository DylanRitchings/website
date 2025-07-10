// 'use client';
// import { useState } from 'react';
//
// interface ModalImageProps {
//   thumbnailSrc: string;
//   fullSrc: string;
// }
//
// export default function ModalImage({ thumbnailSrc, fullSrc }: ModalImageProps) {
//   const [loaded, setLoaded] = useState(false);
//
//
//   return (
//     <img
//       src={fullSrc}
//       alt="Full image"
//       className={`relative max-w-full max-h-full object-contain transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'
//         }`}
//       onLoad={() => setLoaded(true)}
//       style={{ zIndex: 10 }}
//     />
//   );
// }

// <div className="relative w-full h-full flex items-center justify-center">
//   {/* Thumbnail placeholder (blurred + scaled) */}
//   <img
//     src={thumbnailSrc}
//     alt=""
//     className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-500 blur-sm scale-105 ${loaded ? 'opacity-0' : 'opacity-100'
//       }`}
//     aria-hidden="true"
//   />
//
//   {/* Full image */}
//   <img
//     src={fullSrc}
//     alt="Full image"
//     className={`relative max-w-full max-h-full object-contain transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'
//       }`}
//     onLoad={() => setLoaded(true)}
//     style={{
//       backgroundColor: 'transparent',
//     }}
//   />
// </div>
