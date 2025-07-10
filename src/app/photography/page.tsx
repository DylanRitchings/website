import fs from 'fs';
import path from 'path';
import GalleryClient from './GalleryClient';

const GALLERY_DIR = "gallery";

export default function GalleryPage() {
  const galleryDir = path.join(process.cwd(), `public/${GALLERY_DIR}`);
  const files = fs.readdirSync(galleryDir);

  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'];

  const images = files.filter(file =>
    imageExtensions.includes(path.extname(file).toLowerCase())
  );

  return <GalleryClient images={images} />;
}
