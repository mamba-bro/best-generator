import React, { useState, useRef } from 'react';
import { remixImage } from '../../services/geminiService';
import ImageDisplay from '../ImageDisplay';
import { SparklesIcon } from '../icons/SparklesIcon';
import { UploadIcon } from '../icons/UploadIcon';

interface ImageRemixPageProps {
  onBack: () => void;
}

const ImageRemixPage: React.FC<ImageRemixPageProps> = ({ onBack }) => {
  const [sourceImage, setSourceImage] = useState<{ url: string; base64: string; mimeType: string;} | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [resultImageUrl, setResultImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file.');
        return;
      }
      setError(null);
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];
        setSourceImage({
          url: URL.createObjectURL(file),
          base64: base64String,
          mimeType: file.type,
        });
        setResultImageUrl(null);
      };
      reader.onerror = () => {
        setError('Failed to read the image file.');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemix = async () => {
    if (!sourceImage || !prompt) {
      setError('Please upload an image and provide a remix prompt.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setResultImageUrl(null);
    try {
      const url = await remixImage(sourceImage.base64, sourceImage.mimeType, prompt);
      setResultImageUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button onClick={onBack} className="mb-4 text-cyan-400 hover:text-cyan-300 transition-colors">&larr; Back to Home</button>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 flex flex-col gap-6">
          <h2 className="text-2xl font-bold font-display text-purple-400">Dream Remix</h2>
          
          <div>
            <label className="text-sm font-medium text-gray-400 mb-2 block">1. Upload an Image</label>
            <div 
              className="w-full h-64 bg-gray-800 rounded-lg border-2 border-dashed border-gray-600 flex items-center justify-center cursor-pointer hover:border-purple-400 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              {sourceImage ? (
                <img src={sourceImage.url} alt="Source for remix" className="w-full h-full object-contain rounded-md p-2"/>
              ) : (
                <div className="text-center text-gray-500">
                  <UploadIcon className="w-10 h-10 mx-auto mb-2" />
                  <p>Click to browse or drag & drop</p>
                </div>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="remix-prompt" className="text-sm font-medium text-gray-400 mb-2 block">2. Describe your edit</label>
            <textarea
              id="remix-prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., 'make the sky a vibrant sunset', 'add a cute cat wearing a wizard hat', 'turn this into a ghibli-style painting'"
              className="w-full h-32 bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
          </div>

          <button
            onClick={handleRemix}
            disabled={isLoading || !sourceImage || !prompt}
            className="w-full mt-auto bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Remixing...</span>
              </>
            ) : (
               <>
                <SparklesIcon className="w-5 h-5" />
                <span>Remix Image</span>
               </>
            )}
          </button>
        </div>
        <div className="h-[500px] lg:h-auto">
           <ImageDisplay 
             imageUrl={resultImageUrl} 
             isLoading={isLoading} 
             error={error} 
             placeholderText="Your remixed dream will appear here."
             placeholderSubtext="Upload an image, describe your edit, and let the magic happen!"
           />
        </div>
      </div>
    </div>
  );
};

export default ImageRemixPage;
