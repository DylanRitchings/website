import fs from 'fs';
import path from 'path';
import { imageSize } from 'image-size';
import GalleryClient, { GalleryImage } from '@/components/gallery/GalleryClient';

const GALLERY_DIR = "gallery";
const PLACEHOLDER_DIR = "resized/20";
const FULL_DIR = "resized/2000";

export default function Home() {
  const galleryDir = path.join(process.cwd(), `public/${GALLERY_DIR}`);
  const files = fs.readdirSync(galleryDir);

  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'];

  const images: GalleryImage[] = files
    .filter(file => imageExtensions.includes(path.extname(file).toLowerCase()))
    .map(filename => {
      const placeholderPath = path.join(process.cwd(), `public/${PLACEHOLDER_DIR}`, filename);
      let placeholder = '';
      if (fs.existsSync(placeholderPath)) {
        const buf = fs.readFileSync(placeholderPath);
        placeholder = `data:image/jpeg;base64,${buf.toString('base64')}`;
      }

      const fullPath = path.join(process.cwd(), `public/${FULL_DIR}`, filename);
      const { width, height } = imageSize(fs.readFileSync(fullPath));

      return { filename, placeholder, width, height };
    });

  return <GalleryClient images={images} />;
}
