
import { GoogleGenAI, Modality } from "@google/genai";
import type { CatgirlAttributes, CatboyAttributes, AdvancedSettings } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
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

export const generateCatgirlImage = async (attributes: CatgirlAttributes, advanced: AdvancedSettings): Promise<string> => {
  const prompt = buildCatgirlPrompt(attributes, advanced);

  try {
    // FIX: Completed the generateImages call and the function body.
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

export const generateCatboyImage = async (attributes: CatboyAttributes, advanced: AdvancedSettings): Promise<string> => {
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

export const remixImage = async (base64ImageData: string, mimeType: string, prompt: string): Promise<string> => {
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
