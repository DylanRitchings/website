
// import Image from 'next/image';
// import { useState } from 'react';

export default async function Home() {

  return (
    <div>
      <div>
        Welcome to my website
      </div>
      <div>
        🚧 Work in progress 🚧
      </div>
    </div>
  );
}

// export default function Gallery({ images }: Props) {
//   return (
//     <div className="p-8">
//       <h1 className="text-3xl font-bold mb-6">Gallery</h1>
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//         {images.map((src, idx) => (
//           <Image
//             key={idx}
//             src={src}
//             alt={`Image ${idx}`}
//             width={300}
//             height={200}
//             className="rounded object-cover"
//           />
//         ))}
//       </div>
//     </div>
//   );
// }
