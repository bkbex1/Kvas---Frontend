import { useState } from 'react';
import { toImageSrc } from '@/lib/api';

interface ProductGalleryProps {
  imgQuery: string;
  images?: string[];
  name: string;
}

export default function ProductGallery({ imgQuery, images = [], name }: ProductGalleryProps) {
  const [selected, setSelected] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  const primaryImage = toImageSrc(imgQuery, name);
  const gallery = (images.length > 0 ? images : [imgQuery]).map((img) => toImageSrc(img, name));
  const normalizedGallery = gallery.length > 0 ? gallery : [primaryImage];

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div
        className="relative aspect-square rounded-2xl overflow-hidden bg-[#F5EFE6] cursor-zoom-in"
        onClick={() => setZoomed(true)}
      >
        <img
          src={normalizedGallery[selected] || normalizedGallery[0]}
          alt={name}
          className="w-full h-full object-cover transition-opacity duration-300"
        />
        <button
          className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center bg-white/80 rounded-full text-gray-600 hover:bg-white transition-colors cursor-pointer"
        >
          <i className="ri-zoom-in-line text-lg"></i>
        </button>
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-4 gap-3">
        {normalizedGallery.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setSelected(idx)}
            className={`aspect-square rounded-xl overflow-hidden bg-[#F5EFE6] cursor-pointer transition-all ${
              selected === idx ? 'ring-2 ring-[#1A0F08] ring-offset-2' : 'opacity-60 hover:opacity-100'
            }`}
          >
            <img src={img} alt={`${name} ${idx + 1}`} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>

      {/* Zoom Modal */}
      {zoomed && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-8 cursor-zoom-out"
          onClick={() => setZoomed(false)}
        >
          <div className="relative max-w-3xl w-full aspect-square rounded-2xl overflow-hidden">
            <img src={normalizedGallery[selected] || normalizedGallery[0]} alt={name} className="w-full h-full object-cover" />
          </div>
          <button className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center bg-white rounded-full cursor-pointer">
            <i className="ri-close-line text-xl text-[#1A0F08]"></i>
          </button>
        </div>
      )}
    </div>
  );
}
