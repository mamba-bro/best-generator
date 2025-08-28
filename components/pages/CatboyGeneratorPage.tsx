import React, { useState } from 'react';
import { CATBOY_ATTRIBUTE_OPTIONS } from '../../constants';
import { generateCatboyImage } from '../../services/geminiService';
import type { CatboyAttributes, AdvancedSettings } from '../../types';
import AttributeSelector from '../AttributeSelector';
import ImageDisplay from '../ImageDisplay';
import CollapsibleSection from '../CollapsibleSection';
import { DiceIcon } from '../icons/DiceIcon';
import { SparklesIcon } from '../icons/SparklesIcon';

interface CatboyGeneratorPageProps {
  onBack: () => void;
}

const getDefaultAttributes = (): CatboyAttributes => {
    const defaultAttributes: Partial<CatboyAttributes> = {};
    for (const key in CATBOY_ATTRIBUTE_OPTIONS) {
        const attrKey = key as keyof CatboyAttributes;
        defaultAttributes[attrKey] = CATBOY_ATTRIBUTE_OPTIONS[attrKey].values[0];
    }
    return defaultAttributes as CatboyAttributes;
};

const CatboyGeneratorPage: React.FC<CatboyGeneratorPageProps> = ({ onBack }) => {
  const [attributes, setAttributes] = useState<CatboyAttributes>(getDefaultAttributes());
  const [advanced, setAdvanced] = useState<AdvancedSettings>({ negativePrompt: '', aspectRatio: '3:4' });
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAttributeChange = (attribute: keyof CatboyAttributes, value: string) => {
    setAttributes(prev => ({ ...prev, [attribute]: value }));
  };
  
  const handleAdvancedChange = (field: keyof AdvancedSettings, value: string) => {
    setAdvanced(prev => ({ ...prev, [field]: value }));
  };

  const randomizeAttributes = () => {
    const randomAttributes: Partial<CatboyAttributes> = {};
    for (const key in CATBOY_ATTRIBUTE_OPTIONS) {
      const attrKey = key as keyof CatboyAttributes;
      const options = CATBOY_ATTRIBUTE_OPTIONS[attrKey].values;
      randomAttributes[attrKey] = options[Math.floor(Math.random() * options.length)];
    }
    setAttributes(randomAttributes as CatboyAttributes);
  };
  
  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    setImageUrl(null);
    try {
      const url = await generateCatboyImage(attributes, advanced);
      setImageUrl(url);
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
        <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold font-display text-cyan-400">Customize Your Catboy</h2>
            <button
              onClick={randomizeAttributes}
              className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              title="Randomize Attributes"
            >
              <DiceIcon className="w-5 h-5" />
              <span>Randomize</span>
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(Object.keys(CATBOY_ATTRIBUTE_OPTIONS) as Array<keyof CatboyAttributes>).map((key) => (
              <AttributeSelector
                key={key}
                label={CATBOY_ATTRIBUTE_OPTIONS[key].label}
                value={attributes[key]}
                options={CATBOY_ATTRIBUTE_OPTIONS[key].values}
                onChange={(value) => handleAttributeChange(key, value)}
              />
            ))}
          </div>
          <CollapsibleSection title="Advanced Settings" defaultOpen={false}>
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-sm font-medium text-gray-400 mb-2 block">Negative Prompt</label>
                <input
                  type="text"
                  value={advanced.negativePrompt}
                  onChange={(e) => handleAdvancedChange('negativePrompt', e.target.value)}
                  placeholder="e.g., extra limbs, blurry"
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <AttributeSelector
                label="Aspect Ratio"
                value={advanced.aspectRatio}
                options={['1:1', '3:4', '4:3', '16:9', '9:16']}
                onChange={(value) => handleAdvancedChange('aspectRatio', value)}
              />
            </div>
          </CollapsibleSection>
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full mt-6 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Generating...</span>
              </>
            ) : (
               <>
                <SparklesIcon className="w-5 h-5" />
                <span>Generate Image</span>
               </>
            )}
          </button>
        </div>
        <div className="h-[500px] lg:h-auto">
           <ImageDisplay 
             imageUrl={imageUrl} 
             isLoading={isLoading} 
             error={error} 
             placeholderText="Your generated catboy will appear here."
             placeholderSubtext="Customize his features, tweak advanced settings, and click generate!"
           />
        </div>
      </div>
    </div>
  );
};

export default CatboyGeneratorPage;
