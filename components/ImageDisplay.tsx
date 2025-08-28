import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';
import { DownloadIcon } from './icons/DownloadIcon';

interface ImageDisplayProps {
  imageUrl: string | null;
  isLoading: boolean;
  error: string | null;
  placeholderText?: string;
  placeholderSubtext?: string;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({
  imageUrl,
  isLoading,
  error,
  placeholderText = "Your generated image will appear here.",
  placeholderSubtext = "Customize features, tweak settings, and click generate!"
}) => {

  const handleDownload = () => {
    if (!imageUrl) return;
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = 'dream-studio-creation.jpeg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full h-full bg-gray-900/70 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-600 p-4 relative overflow-hidden">
      {isLoading && (
        <div className="text-center text-gray-400 flex flex-col items-center gap-4">
          <svg className="animate-spin h-10 w-10 text-pink-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="font-semibold">Dreaming up your creation...</span>
          <span className="text-sm text-gray-500">This can take a moment!</span>
        </div>
      )}
      {error && (
        <div className="text-center text-red-400 flex flex-col items-center gap-2 p-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <p className="font-semibold">Oops! Something went wrong.</p>
          <p className="text-sm">{error}</p>
        </div>
      )}
      {!isLoading && !error && !imageUrl && (
        <div className="text-center text-gray-500 flex flex-col items-center gap-4">
          <SparklesIcon className="w-16 h-16 text-cyan-500" />
          <p className="font-semibold">{placeholderText}</p>
          <p className="text-sm">{placeholderSubtext}</p>
        </div>
      )}
      {imageUrl && (
        <>
          <img
            src={imageUrl}
            alt="Generated Creation"
            className="w-full h-full object-contain rounded-md animate-fade-in"
          />
          <button
            onClick={handleDownload}
            className="absolute bottom-4 right-4 bg-black/50 hover:bg-black/75 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
            aria-label="Download Image"
            title="Download Image"
          >
            <DownloadIcon className="w-5 h-5"/>
          </button>
        </>
      )}
      <style>{`
        @keyframes fade-in {
          0% { opacity: 0; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default ImageDisplay;