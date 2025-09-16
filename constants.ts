import { ReadingLevel, Rarity, StoryLength } from './types';

export const GEMINI_TEXT_MODEL = 'gemini-2.5-flash';
export const GEMINI_IMAGE_MODEL = 'gemini-2.5-flash-image-preview'; // Correct Gemini image model

export const SKIN_GENERATION_COST = 1500;

// Reading-time based skin generation limits
export const SKIN_GENERATION_LIMITS = {
  READING_TIME_REQUIRED_SECONDS: 600, // 10 minutes of validated reading time required per generation
  MAX_GENERATIONS_PER_DAY: 10, // Increased since it's based on reading time now
  COOLDOWN_MINUTES: 0, // No cooldown since it's based on reading time now
};

export const READING_LEVEL_SETTINGS = {
  [ReadingLevel.Grade1]: {
    wordCount: '100-200',
    promptAddition: 'The story should use simple vocabulary and sentence structure suitable for a 1st grader.',
    pointsPerSecond: 0.7,
    completionBonus: 40,
    description: 'Simple stories with basic vocabulary',
  },
  [ReadingLevel.Grade2]: {
    wordCount: '200-350',
    promptAddition: 'The story should be engaging for a 2nd grader with a developing vocabulary.',
    pointsPerSecond: 0.8,
    completionBonus: 60,
    description: 'Engaging stories with developing vocabulary',
  },
  [ReadingLevel.Grade3]: {
    wordCount: '350-500',
    promptAddition: 'The story should use descriptive language and a clear plot suitable for a 3rd grader.',
    pointsPerSecond: 0.9,
    completionBonus: 90,
    description: 'Descriptive stories with clear plots',
  },
  [ReadingLevel.Grade4]: {
    wordCount: '500-750',
    promptAddition: 'The story should have a more complex plot and vocabulary suitable for a 4th grader.',
    pointsPerSecond: 1.0,
    completionBonus: 125,
    description: 'Complex plots with advanced vocabulary',
  },
  [ReadingLevel.Grade5]: {
    wordCount: '750-1000',
    promptAddition: 'The story should feature richer vocabulary, character development, and plot twists for a 5th grader.',
    pointsPerSecond: 1.1,
    completionBonus: 175,
    description: 'Rich vocabulary with character development',
  },
  [ReadingLevel.Grade6]: {
    wordCount: '1000-1500',
    promptAddition: 'The story should be complex, with sophisticated themes and language suitable for a 6th grader preparing for middle school.',
    pointsPerSecond: 1.2,
    completionBonus: 250,
    description: 'Sophisticated themes and complex language',
  },
};

// Story length options control both AI instruction and max validated time per story
export const STORY_LENGTH_SETTINGS: Record<StoryLength, {
  label: string;
  description: string;
  wordCountMultiplier: number;
  promptAddition: string;
  maxTimeSeconds: number;
}> = {
  [StoryLength.Short]: {
    label: 'Short',
    description: 'Quick tale (~1-2 minutes)',
    wordCountMultiplier: 0.6,
    promptAddition: 'Keep the story brisk with 2-3 short paragraphs and a single, clear conflict.',
    maxTimeSeconds: 120,
  },
  [StoryLength.Medium]: {
    label: 'Medium',
    description: 'Standard adventure (~3-4 minutes)',
    wordCountMultiplier: 1,
    promptAddition: 'Provide a balanced beginning, middle, and end with vivid details.',
    maxTimeSeconds: 240,
  },
  [StoryLength.Long]: {
    label: 'Long',
    description: 'Epic quest (~6-8 minutes)',
    wordCountMultiplier: 1.4,
    promptAddition: 'Include multiple scenes or challenges and a satisfying resolution.',
    maxTimeSeconds: 480,
  },
};

// Default avatar options for Reader Rookie skin
export const DEFAULT_AVATAR_OPTIONS = [
  {
    id: 'avatar_1',
    name: 'Classic Reader',
    imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=reader1'
  },
  {
    id: 'avatar_2', 
    name: 'Bookworm',
    imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=reader2'
  },
  {
    id: 'avatar_3',
    name: 'Story Seeker', 
    imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=reader3'
  },
  {
    id: 'avatar_4',
    name: 'Adventure Reader',
    imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=reader4'
  },
  {
    id: 'avatar_5',
    name: 'Curious Scholar',
    imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=reader5'
  },
  {
    id: 'avatar_6',
    name: 'Magic Reader',
    imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=reader6'
  }
];

// Initial shop skins with pre-generated placeholder images
export const INITIAL_SKINS_DATA = [
    { 
      id: 'skin_cosmic_knight',
      name: 'Cosmic Knight', 
      prompt: 'Fortnite style character skin, futuristic space knight with vibrant galaxy armor, glowing purple energy sword, heroic pose, cartoon-like 3D render, bright saturated colors, clean cel-shaded style, white background, Unreal Engine aesthetic.', 
      rarity: Rarity.Epic, 
      cost: 2000,
      imageUrl: 'https://api.dicebear.com/7.x/bottts-neutral/svg?seed=cosmic-knight&backgroundColor=1a0c35&primaryColor=8b5cf6'
    },
    { 
      id: 'skin_forest_spirit',
      name: 'Forest Spirit', 
      prompt: 'Fortnite style character skin, mystical forest guardian with glowing antlers, leaf and flower clothing, magical lantern, whimsical cartoon 3D render, bright nature colors, cel-shaded style, white background, Unreal Engine aesthetic.', 
      rarity: Rarity.Rare, 
      cost: 750,
      imageUrl: 'https://api.dicebear.com/7.x/bottts-neutral/svg?seed=forest-spirit&backgroundColor=16a34a&primaryColor=22c55e'
    },
    { 
      id: 'skin_cyber_runner',
      name: 'Cyber Runner', 
      prompt: 'Fortnite style character skin, cyberpunk street runner with neon jacket, holographic visor, athletic build, cartoon 3D render, vibrant neon colors, cel-shaded style, white background, Unreal Engine aesthetic.', 
      rarity: Rarity.Rare, 
      cost: 750,
      imageUrl: 'https://api.dicebear.com/7.x/bottts-neutral/svg?seed=cyber-runner&backgroundColor=0ea5e9&primaryColor=06b6d4'
    },
    { 
      id: 'skin_time_tinkerer',
      name: 'Time Tinkerer', 
      prompt: 'Fortnite style character skin, steampunk inventor with brass goggles, mechanical arm, gear-filled vest, cartoon 3D render, warm bronze colors, cel-shaded style, white background, Unreal Engine aesthetic.', 
      rarity: Rarity.Common, 
      cost: 250,
      imageUrl: 'https://api.dicebear.com/7.x/bottts-neutral/svg?seed=time-tinkerer&backgroundColor=d97706&primaryColor=f59e0b'
    },
    { 
      id: 'skin_sunfire_sorceress',
      name: 'Sunfire Sorceress', 
      prompt: 'Fortnite style character skin, fire mage with golden armor, flame cape, magical staff, heroic pose, cartoon 3D render, bright orange and gold colors, cel-shaded style, white background, Unreal Engine aesthetic.', 
      rarity: Rarity.Epic, 
      cost: 2000,
      imageUrl: 'https://api.dicebear.com/7.x/bottts-neutral/svg?seed=sunfire-sorceress&backgroundColor=dc2626&primaryColor=f97316'
    },
    { 
      id: 'skin_abyssal_diver',
      name: 'Abyssal Diver', 
      prompt: 'Fortnite style character skin, deep sea explorer in bioluminescent dive suit, underwater gear, mysterious pose, cartoon 3D render, dark blue and cyan colors, cel-shaded style, white background, Unreal Engine aesthetic.', 
      rarity: Rarity.Legendary, 
      cost: 5000,
      imageUrl: 'https://api.dicebear.com/7.x/bottts-neutral/svg?seed=abyssal-diver&backgroundColor=1e40af&primaryColor=3730a3'
    },
];
