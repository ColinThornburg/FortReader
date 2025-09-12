import React, { useState } from 'react';
import Button from './common/Button';
import LoadingSpinner from './common/LoadingSpinner';

interface SkinCreatorProps {
  userPoints: number;
  cost: number;
  isGenerating: boolean;
  tempSkinUrl: string | null;
  onGenerate: (prompt: string, name: string) => void;
  onClaim: () => void;
  canGenerate: boolean;
  limitReason?: string;
  availableGenerations: number;
  readingTimeNeeded: number;
  generationsToday: number;
  maxGenerationsPerDay: number;
  totalReadingTime: number;
  readingTimeRequired: number;
}

const SkinCreator: React.FC<SkinCreatorProps> = ({ 
  userPoints, 
  cost, 
  isGenerating, 
  tempSkinUrl, 
  onGenerate, 
  onClaim, 
  canGenerate, 
  limitReason, 
  availableGenerations,
  readingTimeNeeded,
  generationsToday, 
  maxGenerationsPerDay,
  totalReadingTime,
  readingTimeRequired
}) => {
  const [prompt, setPrompt] = useState('');
  const [skinName, setSkinName] = useState('');
  
  const canAfford = userPoints >= cost;

  const handleGenerateClick = () => {
    if (prompt.trim() && skinName.trim() && !isGenerating) {
      onGenerate(prompt, skinName);
    }
  };
  
  const isFormInvalid = !prompt.trim() || !skinName.trim();

  return (
    <div className="bg-black/30 p-8 rounded-2xl shadow-2xl border border-purple-500/30 max-w-4xl mx-auto animate-fade-in">
      <h2 className="text-4xl font-display text-center text-yellow-300 drop-shadow-md mb-2">Skin Creator</h2>
      <p className="text-slate-300 text-center mb-4">
        Create amazing Fortnite-style character skins! <br /> 
        Cost: <span className="font-bold text-yellow-300">{cost.toLocaleString()} RP</span> per generation.
      </p>
      
      {/* Reading time requirements */}
      <div className="bg-slate-800/50 rounded-lg p-4 mb-6 border border-slate-600">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Generations today:</span>
              <span className="font-bold text-yellow-300">{generationsToday}/{maxGenerationsPerDay}</span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-slate-300">Available generations:</span>
              <span className={`font-bold ${availableGenerations > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {availableGenerations}
              </span>
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Reading time earned:</span>
              <span className="font-bold text-blue-400">{Math.floor(totalReadingTime / 60)}m {totalReadingTime % 60}s</span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-slate-300">Required per generation:</span>
              <span className="font-bold text-purple-400">{Math.floor(readingTimeRequired / 60)} minutes</span>
            </div>
          </div>
        </div>
        
        {!canGenerate && readingTimeNeeded > 0 && (
          <div className="mt-3 p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
            <div className="flex items-center text-red-400">
              <span className="text-lg mr-2">📚</span>
              <span className="font-bold">
                Read for {Math.ceil(readingTimeNeeded / 60)} more minutes to unlock skin generation!
              </span>
            </div>
            <p className="text-red-300 text-xs mt-1">
              Complete stories and answer comprehension questions correctly to earn reading time.
            </p>
          </div>
        )}
        
        {canGenerate && availableGenerations > 0 && (
          <div className="mt-3 p-3 bg-green-900/20 border border-green-500/30 rounded-lg">
            <div className="flex items-center text-green-400">
              <span className="text-lg mr-2">✨</span>
              <span className="font-bold">
                Ready to generate! You've earned {availableGenerations} skin{availableGenerations !== 1 ? 's' : ''}.
              </span>
            </div>
          </div>
        )}
        
        {!canGenerate && generationsToday >= maxGenerationsPerDay && (
          <div className="mt-3 p-3 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
            <div className="flex items-center text-yellow-400">
              <span className="text-lg mr-2">🌅</span>
              <span className="font-bold">Daily limit reached! Come back tomorrow for more generations.</span>
            </div>
          </div>
        )}
      </div>
      
      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Left side: Form */}
        <div className="flex flex-col gap-6">
          <div>
            <label htmlFor="skinName" className="block text-lg font-bold text-slate-200 mb-2">1. Give it a Name</label>
            <input 
              id="skinName"
              type="text"
              value={skinName}
              onChange={(e) => setSkinName(e.target.value)}
              placeholder="e.g., Captain Cookie"
              className="w-full p-3 bg-slate-800 border-2 border-slate-600 rounded-lg text-white text-lg focus:outline-none focus:ring-4 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-200 placeholder:text-slate-500"
              disabled={isGenerating || !!tempSkinUrl}
            />
          </div>
          <div>
            <label htmlFor="prompt" className="block text-lg font-bold text-slate-200 mb-2">2. Describe Your Skin</label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., A gingerbread man wearing a pirate hat and holding a chocolate chip sword"
              rows={4}
              className="w-full p-3 bg-slate-800 border-2 border-slate-600 rounded-lg text-white text-lg focus:outline-none focus:ring-4 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-200 placeholder:text-slate-500"
              disabled={isGenerating || !!tempSkinUrl}
            />
          </div>
          <Button onClick={handleGenerateClick} variant="primary" size="large" disabled={isFormInvalid || isGenerating || !!tempSkinUrl || !canGenerate || !canAfford}>
            {isGenerating 
              ? 'Generating...' 
              : !canGenerate 
                ? (readingTimeNeeded > 0 ? 'Need More Reading Time' : 'Daily Limit Reached')
                : !canAfford 
                  ? 'Not Enough RP' 
                  : 'Generate Skin'
            }
          </Button>
          {isFormInvalid && <p className="text-center text-sm text-slate-400">Please fill out both name and description.</p>}
          {!canAfford && canGenerate && <p className="text-center text-sm text-red-400">You need {cost.toLocaleString()} RP to generate a skin.</p>}
        </div>
        
        {/* Right side: Preview */}
        <div className="flex flex-col items-center justify-center bg-slate-800/50 rounded-lg p-4 min-h-[350px] border-2 border-slate-700">
            <h3 className="text-2xl font-display text-white mb-4">Preview</h3>
            {isGenerating ? (
                <LoadingSpinner />
            ) : tempSkinUrl ? (
                <div className="flex flex-col items-center gap-4 w-full">
                    <img src={tempSkinUrl} alt="Generated Skin" className="w-64 h-64 object-cover rounded-lg shadow-lg border-2 border-teal-400" />
                     <Button onClick={onClaim} variant="primary" size="large" className="w-full" disabled={!canAfford}>
                        {canAfford ? `Claim for ${cost.toLocaleString()} RP` : `Not Enough RP`}
                    </Button>
                    <Button onClick={() => onGenerate(prompt, skinName)} variant="secondary" className="w-full" disabled={!canGenerate || !canAfford}>
                        {!canGenerate 
                          ? (readingTimeNeeded > 0 ? 'Need More Reading Time' : 'Daily Limit Reached')
                          : !canAfford 
                            ? 'Not Enough RP' 
                            : 'Try Again'
                        }
                    </Button>
                </div>
            ) : (
                <div className="text-center text-slate-400">
                    <p>Your generated skin will appear here.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default SkinCreator;