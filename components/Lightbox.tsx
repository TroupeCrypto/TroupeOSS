import React from 'react';
import { GeneratedImage } from '../types';
import { IconClose, IconDownload, IconRemix } from './Icons';

interface LightboxProps {
  image: GeneratedImage;
  onClose: () => void;
  onRemix: (image: GeneratedImage) => void;
}

const Lightbox: React.FC<LightboxProps> = ({ image, onClose, onRemix }) => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = image.base64;
    link.download = `vibe-check-${image.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md animate-fade-in">
      <div className="absolute top-4 right-4 z-50">
        <button
          onClick={onClose}
          className="p-3 bg-gray-800/80 rounded-full text-white hover:bg-gray-700 transition-colors"
        >
          <IconClose className="w-6 h-6" />
        </button>
      </div>

      <div className="w-full h-full p-4 flex flex-col items-center justify-center">
        <img
          src={image.base64}
          alt={image.prompt}
          className="max-h-[80vh] max-w-full object-contain shadow-2xl rounded-lg"
        />
        
        <div className="mt-6 flex gap-4">
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-6 py-3 bg-gray-800 rounded-full text-white font-medium hover:bg-gray-700 transition-all border border-gray-700"
          >
            <IconDownload className="w-5 h-5" />
            <span>Download</span>
          </button>
          
          <button
            onClick={() => onRemix(image)}
            className="flex items-center gap-2 px-6 py-3 bg-primary rounded-full text-white font-medium hover:bg-primary-hover transition-all shadow-lg shadow-primary/30"
          >
            <IconRemix className="w-5 h-5" />
            <span>Remix Vibe</span>
          </button>
        </div>

        <p className="mt-4 text-gray-400 text-sm max-w-md text-center line-clamp-2">
            {image.prompt}
        </p>
      </div>
    </div>
  );
};

export default Lightbox;