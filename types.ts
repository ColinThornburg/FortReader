export type View = 'generator' | 'reading' | 'question' | 'results' | 'shop' | 'locker' | 'creator' | 'admin' | 'help';

export enum ReadingLevel {
  Grade1 = '1st Grade',
  Grade2 = '2nd Grade',
  Grade3 = '3rd Grade',
  Grade4 = '4th Grade',
  Grade5 = '5th Grade',
  Grade6 = '6th Grade',
}

export enum Rarity {
    Common = 'Common',
    Rare = 'Rare',
    Epic = 'Epic',
    Legendary = 'Legendary',
    Custom = 'Custom',
}

export interface Story {
  title: string;
  content: string;
  readingLevel: ReadingLevel;
}

export interface ComprehensionQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation?: string;
}

export interface Skin {
  id: string;
  name: string;
  prompt: string;
  rarity: Rarity;
  cost: number;
  imageUrl: string;
}

export interface ReadingSession {
  date: string; // YYYY-MM-DD format
  timeRead: number; // seconds of validated reading time (only when questions answered correctly)
  storiesCompleted: number;
  questionsCorrect: number;
  questionsTotal: number;
}

export interface User {
  username: string;
  readingPoints: number;
  ownedSkins: Skin[];
  equippedSkinId: string;
  totalTimeRead: number; // in seconds - total validated reading time
  isAdmin?: boolean; // Admin flag
  uid?: string; // Firebase UID for admin management
  skinGenerationData?: {
    lastGenerationTime: number; // timestamp
    generationsToday: number;
    dailyResetTime: number; // timestamp of last daily reset
    readingTimeUsedForGeneration: number; // total reading time (in seconds) that has been "spent" on skin generation
  };
  readingStats?: {
    dailyGoalMinutes: number; // daily reading goal in minutes (default 15)
    todayValidatedTime: number; // validated reading time today in seconds
    lastReadingDate: string; // YYYY-MM-DD format
    readingSessions: ReadingSession[]; // historical reading data
  };
}

export interface AdminSkinData {
  id: string;
  name: string;
  description?: string;
  rarity: Rarity;
  cost: number;
  imageUrl: string;
  isActive: boolean; // Whether it should show in the store
  createdAt: number; // timestamp
}
