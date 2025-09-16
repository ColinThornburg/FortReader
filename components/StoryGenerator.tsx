import React, { useState } from 'react';
import type { ReadingLevel } from '../types';
import { ReadingLevel as ReadingLevelEnum, StoryLength } from '../types';
import { STORY_LENGTH_SETTINGS } from '../constants';
import Button from './common/Button';

interface StoryGeneratorProps {
  onGenerate: (readingLevel: ReadingLevel, topic: string, length: StoryLength) => void;
}

const StoryGenerator: React.FC<StoryGeneratorProps> = ({ onGenerate }) => {
  const [readingLevel, setReadingLevel] = useState<ReadingLevel>(ReadingLevelEnum.Grade1);
  const [topic, setTopic] = useState<string>('');
  const [storyLength, setStoryLength] = useState<StoryLength>(StoryLength.Medium);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim()) {
      onGenerate(readingLevel, topic, storyLength);
    }
  };

  const lengthOptions = Object.entries(STORY_LENGTH_SETTINGS) as Array<[
    StoryLength,
    typeof STORY_LENGTH_SETTINGS[StoryLength.Short]
  ]>;

  return (
    <div className="bg-black/30 p-8 rounded-2xl shadow-2xl border border-purple-500/30 flex flex-col items-center max-w-2xl mx-auto animate-fade-in">
      <h2 className="text-4xl font-display text-center text-yellow-300 drop-shadow-md mb-2">Choose Your Adventure!</h2>
      <p className="text-slate-300 text-center mb-8">Select a reading level, choose a story length, and write a topic for your story.</p>
      
      <form onSubmit={handleSubmit} className="w-full">
        <div className="mb-6">
          <label className="block text-lg font-bold text-slate-200 mb-3 text-center">Reading Level</label>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-3">
            {(Object.values(ReadingLevelEnum) as ReadingLevel[]).map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setReadingLevel(level)}
                className={`w-full p-3 rounded-lg font-bold text-md transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-yellow-400/50 ${
                  readingLevel === level
                    ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-slate-900 shadow-lg scale-105'
                    : 'bg-slate-800 hover:bg-slate-700 text-white'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <label className="block text-lg font-bold text-slate-200 mb-3 text-center">Story Length</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {lengthOptions.map(([lengthKey, settings]) => (
              <button
                key={lengthKey}
                type="button"
                onClick={() => setStoryLength(lengthKey)}
                className={`w-full p-4 rounded-xl text-left transition-all duration-200 border-2 focus:outline-none focus:ring-4 focus:ring-purple-400/40 ${
                  storyLength === lengthKey
                    ? 'bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500 border-transparent text-white shadow-lg scale-[1.02]'
                    : 'bg-slate-800/70 border-slate-600 text-slate-200 hover:bg-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xl font-semibold">{settings.label}</span>
                  <span className="text-xs uppercase tracking-wide text-purple-200/80">Max {Math.round(settings.maxTimeSeconds / 60)} min</span>
                </div>
                <p className="text-sm text-slate-300">{settings.description}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <label htmlFor="topic" className="block text-lg font-bold text-slate-200 mb-3 text-center">Story Topic</label>
          <input 
            id="topic"
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., A talking squirrel who is afraid of heights"
            className="w-full p-4 bg-slate-800 border-2 border-slate-600 rounded-lg text-white text-lg focus:outline-none focus:ring-4 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-200 placeholder:text-slate-500"
          />
        </div>
        
        <Button onClick={handleSubmit} variant="primary" size="large" className="w-full" disabled={!topic.trim()}>
          Generate Story
        </Button>
      </form>
    </div>
  );
};

export default StoryGenerator;
