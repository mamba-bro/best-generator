
export interface CatgirlAttributes {
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

export interface CatboyAttributes {
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

export interface AdvancedSettings {
    negativePrompt: string;
    aspectRatio: '3:4' | '1:1' | '4:3' | '16:9' | '9:16';
}
