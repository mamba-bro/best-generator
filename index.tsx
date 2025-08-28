
import React, { useState, useRef, ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleGenAI, Modality } from "@google/genai";

// --- TYPES (from types.ts) ---
interface CatgirlAttributes {
  hairColor: string;
  hairStyle: string;
  eyeColor: string;
  outfit: string;
  earType: string;
  tailType: string;
  personality: string;
  background: string;
  accessories: string;
  artStyle: string;
  posture: string;
}

interface CatboyAttributes {
  hairColor: string;
  hairStyle: string;
  eyeColor: string;
  outfit: string;
  earType: string;
  tailType: string;
  personality: string;
  background: string;
  accessories: string;
  artStyle: string;
  posture: string;
}

interface AdvancedSettings {
    negativePrompt: string;
    aspectRatio: '3:4' | '1:1' | '4:3' | '16:9' | '9:16';
}

// --- CONSTANTS (from constants.ts) ---
type AttributeOptions<T> = {
  [key in keyof T]: {
    label: string;
    values: string[];
  };
};

const CATGIRL_ATTRIBUTE_OPTIONS: AttributeOptions<CatgirlAttributes> = {
  hairColor: {
    label: 'Hair Color',
    values: ['Black', 'Blonde', 'Brown', 'White', 'Silver', 'Pastel Pink', 'Lavender', 'Mint Green', 'Sky Blue', 'Ruby Red', 'Crimson Red', 'Deep Ocean Blue', 'Emerald Green', 'Ombre (Pink to Purple)', 'Split Dye (Black/White)', 'Rainbow Streaks', 'Galaxy Nebula', 'Iridescent Pearl', 'Fire Gradient (Red to Yellow)', 'Electric Blue', 'Sakura Pink', 'Platinum Blonde'],
  },
  hairStyle: {
    label: 'Hair Style',
    values: ['Short and Messy', 'Long and Straight', 'Bob Cut', 'Ponytail', 'Long Twintails', 'Braids', 'Wavy Shoulder-length', 'Messy Wolfcut', 'Hime Cut', 'Pixie Cut', 'Afro Puffs', 'Side Shave with Long Bangs', 'Odango Buns', 'Elaborate Victorian Updo', 'Cyberpunk Braids with Glow Strips', 'Drill Curls'],
  },
  eyeColor: {
    label: 'Eye Color',
    values: ['Blue', 'Green', 'Brown', 'Amber', 'Heterochromia (Blue/Green)', 'Purple', 'Red', 'Golden', 'Teal', 'Galaxy Nebula', 'Molten Gold', 'Pink', 'Silver', 'Cybernetic Red Glow', 'Lime Green', 'Clockwork Gears'],
  },
  outfit: {
    label: 'Outfit',
    values: ['Maid Dress', 'School Uniform', 'Gothic Lolita Dress', 'Techwear Gear', 'Cozy Sweater & Skirt', 'Fantasy Armor', 'Kimono', 'Idol Costume', 'Cyberpunk Jumpsuit', 'Victorian Ball Gown', 'Streetwear Hoodie & Jeans', 'Magical Girl Uniform', 'Beach Bikini', 'Traditional Chinese Qipao', 'Steampunk Inventor Outfit', 'Dark Sorceress Robes', 'Futuristic Pilot Suit', 'Oni-themed Battle Armor'],
  },
  earType: {
    label: 'Ear Type',
    values: ['Standard Cat', 'Scottish Fold', 'Lynx-tipped', 'Fluffy Fox-like', 'Panther-like', 'Rounded and Small', 'Elven Pointed', 'Curled Caracal-like', 'Oversized and Floppy', 'Mechanical/Robotic', 'Crystalized Ears', 'Aquatic Fin-like Ears'],
  },
  tailType: {
    label: 'Tail Type',
    values: ['Long and Fluffy', 'Short and Bobbed', 'Thin and Sleek', 'Twin Tails', 'Puffy and Cloud-like', 'Demon-like Spade Tip', 'Skeletal/Bony', 'Prehensile and Coiled', 'Mechanical/Robotic Tail', 'Crystalized Tail', 'Peacock Feather Tail'],
  },
  personality: {
    label: 'Personality / Vibe',
    values: ['Shy and Sweet', 'Energetic and Playful', 'Cool and Aloof', 'Elegant and Mysterious', 'Mischievous Trickster', 'Cheerful and Bubbly', 'Stoic and Protective', 'Sad and Melancholic', 'Yandere (Obsessive)', 'Kuudere (Cold exterior, caring interior)', 'Dandere (Quiet and asocial)', 'Genki (Hyperactive and loud)'],
  },
  background: {
    label: 'Background',
    values: ['Neon-lit Tokyo Street', 'Cozy Library Cafe', 'Magical Forest', 'Futuristic Sci-fi City', 'Cherry Blossom Park', 'Gothic Cathedral Interior', 'Steampunk Workshop', 'Enchanted Library', 'Rooftop at Sunset', 'Post-apocalyptic Ruins', 'Vaporwave Beach', 'Bioluminescent Cave', 'Floating Sky Islands', 'Cyberpunk Data-scape', 'Inside a Giant Clocktower'],
  },
  accessories: {
    label: 'Accessories',
    values: ['None', 'Glasses', 'Hair Ribbons', 'Bell Choker', 'Fingerless Gloves', 'Headphones', 'Band-aids', 'Thigh-high Stockings', 'Eyepatch', 'Gas Mask', 'Floating Halo', 'Devil Horns', 'Witch Hat', 'Fox Mask', 'Cybernetic Implants', 'Floating Runes', 'Steampunk Goggles', 'Jeweled Tiara'],
  },
  artStyle: {
    label: 'Art Style',
    values: ['Vibrant Anime', 'Soft Watercolor', 'Modern Digital Art', 'Ghibli Inspired', 'Retro 90s Anime', 'Ink Wash Painting', 'Chibi/Kawaii', 'Dark Fantasy (Berserk-inspired)', 'Art Nouveau', 'Comic Book (Western)', 'Cyberpunk Neon Noir', 'Ukiyo-e Woodblock', 'Stained Glass Art'],
  },
  posture: {
    label: 'Body Posture',
    values: ['Standing Confidently', 'Sitting Shyly', 'Dynamic Action Pose', 'Leaning Playfully', 'Lounging Gracefully', 'Curled up Cutely', 'Dancing Energetically', 'Fighting Stance', 'Mid-air Jump', 'Crouching Stealthily', 'Offering a Hand'],
  },
};

const CATBOY_ATTRIBUTE_OPTIONS: AttributeOptions<CatboyAttributes> = {
  hairColor: {
    label: 'Hair Color',
    values: ['Jet Black', 'Ash Blonde', 'Chocolate Brown', 'Snow White', 'Gunmetal Silver', 'Deep Indigo', 'Forest Green', 'Blood Red', 'Split Dye (Black/Red)', 'Frosted Tips', 'Electric Blue Streaks', 'Charcoal Gray'],
  },
  hairStyle: {
    label: 'Hair Style',
    values: ['Short and Spiky', 'Medium Length Shag', 'Slicked Back Undercut', 'Messy Mop-top', 'Curtains', 'Wolf Cut', 'Samurai Top Knot', 'Buzz Cut', 'Side Part', 'Long and Flowing', 'Cyberpunk Braids'],
  },
  eyeColor: {
    label: 'Eye Color',
    values: ['Ice Blue', 'Emerald Green', 'Warm Hazel', 'Onyx Black', 'Heterochromia (Gold/Blue)', 'Violet', 'Crimson Red', 'Molten Gold', 'Cybernetic Green Glow', 'Silver', 'Amber'],
  },
  outfit: {
    label: 'Outfit',
    values: ['Butler Suit', 'Streetwear Hoodie & Cargo Pants', 'Techwear Jacket & Gear', 'Fantasy Prince Attire', 'Rocker Leather Jacket & Jeans', 'Traditional Samurai Hakama', 'Cozy Knit Sweater', 'Cyberpunk Mercenary Gear', 'Steampunk Aviator Outfit', 'Dark Mage Robes', 'Post-apocalyptic Wanderer Gear'],
  },
  earType: {
    label: 'Ear Type',
    values: ['Sleek Panther', 'Wild Lynx-tipped', 'Domestic Shorthair', 'Fluffy Maine Coon', 'Sharp and Pointed', 'Slightly Rounded', 'Mechanical/Cyborg', 'Battle-scarred/Notched'],
  },
  tailType: {
    label: 'Tail Type',
    values: ['Long and Sleek', 'Short Bobtail', 'Fluffy and Expressive', 'Thin and Wiry', 'Tufted Lion-like', 'Armored Mechanical Tail', 'Prehensile and Agile'],
  },
  personality: {
    label: 'Personality / Vibe',
    values: ['Cool and Confident', 'Playful and Energetic', 'Stoic and Protective', 'Shy and Bookish', 'Mischievous and Charming', 'Rebellious and Brooding', 'Kind and Gentle', 'Flirty and Suave', 'Tsundere (Harsh exterior, soft interior)'],
  },
  background: {
    label: 'Background',
    values: ['Gritty Cyberpunk Alley', 'Rooftop overlooking a Metropolis', 'Serene Bamboo Forest', 'Throne Room in a Castle', 'Cozy Gaming Room', 'Mechanic\'s Workshop', 'Post-apocalyptic Cityscape', 'Rainy Neo-Noir Street'],
  },
  accessories: {
    label: 'Accessories',
    values: ['None', 'Stylish Glasses', 'Single Earring', 'Dog Tags', 'Leather Gloves', 'Beanie Hat', 'Cybernetic Visor', 'Face Mask', 'Chains', 'Steampunk Goggles', 'Bandana'],
  },
  artStyle: {
    label: 'Art Style',
    values: ['Modern Anime', 'Gritty Comic Book', 'Cel-shaded Video Game', 'Retro 80s Anime', 'Dark Fantasy Illustration', 'Ink Wash Painting', 'Cyberpunk Neon Noir', 'Ukiyo-e Woodblock'],
  },
  posture: {
    label: 'Body Posture',
    values: ['Leaning against a wall', 'Confident Stance', 'Action-ready crouch', 'Sitting thoughtfully', 'Dynamic mid-movement pose', 'Relaxed and lounging', 'Protective fighting stance'],
  },
};

// --- SERVICES (from services/geminiService.ts) ---
if (!process.env.API_KEY) {
  // In a browser environment, process.env isn't available.
  // We'll let the user know they need to set it up if the API key is missing.
  // This check is more for local development; in the deployed app, it's assumed to be present.
  console.warn("API_KEY is not set. The application will not work without it.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const buildCatgirlPrompt = (attributes: CatgirlAttributes, advanced: AdvancedSettings): string => {
  const accessoryLine = attributes.accessories !== 'None'
    ? `wearing ${attributes.accessories}`
    : 'with no notable accessories';

  const corePrompt = `
    masterpiece, best quality, high resolution, detailed digital illustration of a beautiful anime catgirl.
    Full body shot, showing the character from head to toe.
    The art style is ${attributes.artStyle}.
    Her posture is ${attributes.posture}.
    She has ${attributes.hairColor} hair styled as ${attributes.hairStyle}, and stunning ${attributes.eyeColor} eyes.
    She is wearing a stylish ${attributes.outfit}, ${accessoryLine}.
    She has cute, expressive ${attributes.earType} cat ears and a ${attributes.tailType} tail.
    Her expression and vibe reflect a ${attributes.personality} personality.
    The setting is a ${attributes.background}.
    The character is the central focus, clean lines, vibrant colors, aesthetically pleasing.
  `.replace(/\s+/g, ' ').trim();

  const negativePrompt = `
    ${advanced.negativePrompt}, text, watermark, signature, blurry, low quality, deformed, mutated, extra limbs, missing limbs, ugly, poorly drawn hands, poorly drawn face.
  `.replace(/\s+/g, ' ').trim();
  
  return `${corePrompt}\n\nNegative prompt: ${negativePrompt}`;
};

const buildCatboyPrompt = (attributes: CatboyAttributes, advanced: AdvancedSettings): string => {
  const accessoryLine = attributes.accessories !== 'None'
    ? `wearing ${attributes.accessories}`
    : 'with no notable accessories';

  const corePrompt = `
    masterpiece, best quality, high resolution, detailed digital illustration of a handsome anime catboy.
    Full body shot, showing the character from head to toe.
    The art style is ${attributes.artStyle}.
    His posture is ${attributes.posture}.
    He has ${attributes.hairColor} hair styled as ${attributes.hairStyle}, and striking ${attributes.eyeColor} eyes.
    He is wearing a stylish ${attributes.outfit}, ${accessoryLine}.
    He has expressive ${attributes.earType} cat ears and a ${attributes.tailType} tail.
    His expression and vibe reflect a ${attributes.personality} personality.
    The setting is a ${attributes.background}.
    The character is the central focus, clean lines, vibrant colors, aesthetically pleasing.
  `.replace(/\s+/g, ' ').trim();
  
  const negativePrompt = `
    ${advanced.negativePrompt}, text, watermark, signature, blurry, low quality, deformed, mutated, extra limbs, missing limbs, ugly, poorly drawn hands, poorly drawn face, feminine features.
  `.replace(/\s+/g, ' ').trim();

  return `${corePrompt}\n\nNegative prompt: ${negativePrompt}`;
};

const handleApiError = (error: unknown): never => {
  console.error("Error with Gemini API:", error);
  if (error instanceof Error && error.message.includes('SAFETY')) {
      throw new Error("The request was blocked due to safety policies. Please adjust your prompt and try again.");
  }
  throw new Error("Failed to communicate with the AI model. Please try again later.");
};

const generateCatgirlImage = async (attributes: CatgirlAttributes, advanced: AdvancedSettings): Promise<string> => {
  const prompt = buildCatgirlPrompt(attributes, advanced);
  try {
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: advanced.aspectRatio,
      },
    });

    if (!response.generatedImages || response.generatedImages.length === 0) {
      throw new Error("The AI model did not return an image.");
    }

    const base64ImageBytes = response.generatedImages[0].image.imageBytes;
    return `data:image/jpeg;base64,${base64ImageBytes}`;
  } catch (error) {
    handleApiError(error);
  }
};

const generateCatboyImage = async (attributes: CatboyAttributes, advanced: AdvancedSettings): Promise<string> => {
  const prompt = buildCatboyPrompt(attributes, advanced);
  try {
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: advanced.aspectRatio,
      },
    });

    if (!response.generatedImages || response.generatedImages.length === 0) {
      throw new Error("The AI model did not return an image.");
    }

    const base64ImageBytes = response.generatedImages[0].image.imageBytes;
    return `data:image/jpeg;base64,${base64ImageBytes}`;
  } catch (error) {
    handleApiError(error);
  }
};

const remixImage = async (base64ImageData: string, mimeType: string, prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64ImageData,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    if (response.candidates && response.candidates.length > 0) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const base64ImageBytes = part.inlineData.data;
          const imageMimeType = part.inlineData.mimeType;
          return `data:${imageMimeType};base64,${base64ImageBytes}`;
        }
      }
    }
    
    throw new Error("The AI model did not return an image from the remix operation.");

  } catch (error) {
    handleApiError(error);
  }
};


// --- COMPONENTS (from components folder) ---

// --- ICONS ---
const SparklesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 3L9.5 8.5L4 11L9.5 13.5L12 19L14.5 13.5L20 11L14.5 8.5L12 3Z" />
    <path d="M3 21L4.5 16.5" />
    <path d="M19.5 16.5L21 21" />
  </svg>
);

const CatIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 5c-1.66 0-3 1.34-3 3 0 .55.15 1.05.4 1.5 1.15.05 2.6.5 2.6 2.5 0 .55-.15 1.05-.4 1.5C9.8 15.55 8 18 8 18c-2.21 0-4-1.79-4-4 0-1.66 1.34-3 3-3 .55 0 1.05.15 1.5.4C10.45 9.8 12.5 8 14.5 8c.55 0 1.05.15 1.5.4.05-1.15.5-2.6 2.5-2.6 1.66 0 3 1.34 3 3s-1.34 3-3 3c-1.1 0-2.05-.6-2.5-1.5-.45.25-.95.4-1.5.4-1.66 0-3-1.34-3-3 0-.55.15-1.05.4-1.5-.05-1.15-.5-2.6-2.5-2.6zm-5 4c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zm10 0c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z" />
  </svg>
);

const DiceIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <path d="M16 8h.01"></path>
    <path d="M12 12h.01"></path>
    <path d="M8 16h.01"></path>
    <path d="M8 8h.01"></path>
    <path d="M16 16h.01"></path>
  </svg>
);

const DownloadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="7 10 12 15 17 10"></polyline>
        <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
);

const UploadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="17 8 12 3 7 8"></polyline>
        <line x1="12" y1="3" x2="12" y2="15"></line>
    </svg>
);

// --- UI COMPONENTS ---
interface AttributeSelectorProps {
  label: string;
  value: string;
  options: string[];
  onChange: (newValue: string) => void;
}

const AttributeSelector: React.FC<AttributeSelectorProps> = ({ label, value, options, onChange }) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-400">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-3 appearance-none focus:outline-none focus:ring-2 focus:ring-pink-500 transition-colors"
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
          </svg>
        </div>
      </div>
    </div>
  );
};

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


const Header: React.FC = () => {
  return (
    <header className="text-center py-4">
      <div className="inline-flex items-center gap-4">
        <CatIcon className="w-12 h-12 text-pink-400" />
        <h1 className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-cyan-400 font-display">
          Catgirl Dream Studio
        </h1>
        <CatIcon className="w-12 h-12 text-cyan-400" />
      </div>
      <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
        Craft your perfect companion. Select her features and let AI bring her to life!
      </p>
    </header>
  );
};

interface CollapsibleSectionProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-gray-700 rounded-lg mb-4 bg-gray-800/50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-4 bg-gray-800 hover:bg-gray-700/50 transition-colors rounded-t-lg"
        aria-expanded={isOpen}
      >
        <h3 className="text-lg font-semibold text-cyan-400">{title}</h3>
        <svg
          className={`w-6 h-6 text-gray-400 transition-transform transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>
      {isOpen && (
        <div className="p-4 border-t border-gray-700">
          {children}
        </div>
      )}
    </div>
  );
};

// --- PAGES ---
type Page = 'home' | 'catgirl' | 'catboy' | 'remix';

interface HomePageProps {
  onNavigate: (page: Page) => void;
}

const FeatureCard: React.FC<{
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  colorClass: string;
}> = ({ title, description, icon, onClick, colorClass }) => (
  <div
    onClick={onClick}
    className={`bg-gray-800 rounded-xl p-6 flex flex-col items-center text-center cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/20 border-2 border-transparent hover:border-${colorClass}`}
  >
    <div className={`mb-4 text-${colorClass}`}>
      {icon}
    </div>
    <h2 className="text-2xl font-bold font-display text-white mb-2">{title}</h2>
    <p className="text-gray-400">{description}</p>
  </div>
);

const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  return (
    <div className="text-center animate-fade-in">
      <h1 className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-cyan-400 font-display mb-4">
        Welcome to the Dream Studio
      </h1>
      <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-12">
        Your creative hub for generating unique AI-powered characters and art. Choose your canvas below to begin.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <FeatureCard
          title="Catgirl Generator"
          description="Craft your perfect catgirl from a vast array of detailed attributes."
          icon={<CatIcon className="w-16 h-16" />}
          onClick={() => onNavigate('catgirl')}
          colorClass="pink-400"
        />
        <FeatureCard
          title="Catboy Generator"
          description="Design a handsome and stylish catboy with unique features and personality."
          icon={<CatIcon className="w-16 h-16" />}
          onClick={() => onNavigate('catboy')}
          colorClass="cyan-400"
        />
        <FeatureCard
          title="Dream Remix"
          description="Upload any image and reimagine it with the power of generative AI."
          icon={<SparklesIcon className="w-16 h-16" />}
          onClick={() => onNavigate('remix')}
          colorClass="purple-400"
        />
      </div>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
        .hover\\:border-pink-400:hover { border-color: #f472b6; }
        .hover\\:border-cyan-400:hover { border-color: #22d3ee; }
        .hover\\:border-purple-400:hover { border-color: #a78bfa; }
        .text-pink-400 { color: #f472b6; }
        .text-cyan-400 { color: #22d3ee; }
        .text-purple-400 { color: #a78bfa; }
      `}</style>
    </div>
  );
};


interface CatgirlGeneratorPageProps {
  onBack: () => void;
}

const CatgirlGeneratorPage: React.FC<CatgirlGeneratorPageProps> = ({ onBack }) => {
  const getDefaultAttributes = (): CatgirlAttributes => {
    const defaultAttributes: Partial<CatgirlAttributes> = {};
    for (const key in CATGIRL_ATTRIBUTE_OPTIONS) {
        const attrKey = key as keyof CatgirlAttributes;
        defaultAttributes[attrKey] = CATGIRL_ATTRIBUTE_OPTIONS[attrKey].values[0];
    }
    return defaultAttributes as CatgirlAttributes;
  };
  
  const [attributes, setAttributes] = useState<CatgirlAttributes>(getDefaultAttributes());
  const [advanced, setAdvanced] = useState<AdvancedSettings>({ negativePrompt: '', aspectRatio: '3:4' });
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAttributeChange = (attribute: keyof CatgirlAttributes, value: string) => {
    setAttributes(prev => ({ ...prev, [attribute]: value }));
  };
  
  const handleAdvancedChange = (field: keyof AdvancedSettings, value: string) => {
    setAdvanced(prev => ({ ...prev, [field]: value }));
  };

  const randomizeAttributes = () => {
    const randomAttributes: Partial<CatgirlAttributes> = {};
    for (const key in CATGIRL_ATTRIBUTE_OPTIONS) {
      const attrKey = key as keyof CatgirlAttributes;
      const options = CATGIRL_ATTRIBUTE_OPTIONS[attrKey].values;
      randomAttributes[attrKey] = options[Math.floor(Math.random() * options.length)];
    }
    setAttributes(randomAttributes as CatgirlAttributes);
  };
  
  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    setImageUrl(null);
    try {
      const url = await generateCatgirlImage(attributes, advanced);
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
            <h2 className="text-2xl font-bold font-display text-pink-400">Customize Your Catgirl</h2>
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
            {(Object.keys(CATGIRL_ATTRIBUTE_OPTIONS) as Array<keyof CatgirlAttributes>).map((key) => (
              <AttributeSelector
                key={key}
                label={CATGIRL_ATTRIBUTE_OPTIONS[key].label}
                value={attributes[key]}
                options={CATGIRL_ATTRIBUTE_OPTIONS[key].values}
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
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
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
            className="w-full mt-6 bg-gradient-to-r from-pink-500 to-orange-400 hover:from-pink-600 hover:to-orange-500 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
             placeholderText="Your generated catgirl will appear here."
             placeholderSubtext="Customize her features, tweak advanced settings, and click generate!"
           />
        </div>
      </div>
    </div>
  );
};

interface CatboyGeneratorPageProps {
  onBack: () => void;
}

const CatboyGeneratorPage: React.FC<CatboyGeneratorPageProps> = ({ onBack }) => {
  const getDefaultAttributes = (): CatboyAttributes => {
    const defaultAttributes: Partial<CatboyAttributes> = {};
    for (const key in CATBOY_ATTRIBUTE_OPTIONS) {
        const attrKey = key as keyof CatboyAttributes;
        defaultAttributes[attrKey] = CATBOY_ATTRIBUTE_OPTIONS[attrKey].values[0];
    }
    return defaultAttributes as CatboyAttributes;
  };

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

// --- APP (from App.tsx) ---
const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  const navigateTo = (page: Page) => {
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'catgirl':
        return <CatgirlGeneratorPage onBack={() => navigateTo('home')} />;
      case 'catboy':
        return <CatboyGeneratorPage onBack={() => navigateTo('home')} />;
      case 'remix':
        return <ImageRemixPage onBack={() => navigateTo('home')} />;
      case 'home':
      default:
        return <HomePage onNavigate={navigateTo} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <Header />
        <main className="mt-8">
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

// --- RENDER (from original index.tsx) ---
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
