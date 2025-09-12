import React, { useState } from 'react';
import Button from './common/Button';
import { READING_LEVEL_SETTINGS, SKIN_GENERATION_COST, SKIN_GENERATION_LIMITS } from '../constants';
import { Rarity } from '../types';

interface HelpProps {
  onBack: () => void;
}

const Help: React.FC<HelpProps> = ({ onBack }) => {
  const [activeSection, setActiveSection] = useState<'scoring' | 'features' | 'skins' | 'tips'>('scoring');

  const rarityColors = {
    [Rarity.Common]: 'text-gray-300',
    [Rarity.Rare]: 'text-blue-300', 
    [Rarity.Epic]: 'text-purple-400',
    [Rarity.Legendary]: 'text-orange-400',
    [Rarity.Custom]: 'text-teal-300'
  };

  const renderScoringGuide = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-display text-yellow-300 mb-4">📊 How Scoring Works</h3>
        <div className="bg-slate-800/50 rounded-lg p-6 space-y-4">
          <div>
            <h4 className="text-lg font-semibold text-white mb-2">Reading Points Formula:</h4>
            <div className="bg-slate-900/50 rounded p-3 font-mono text-sm">
              <div className="text-green-400">Points = (Time × Points/Second) + Completion Bonus</div>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-white mb-3">Reading Level Rewards:</h4>
            <div className="grid gap-3">
              {Object.entries(READING_LEVEL_SETTINGS).map(([level, settings]) => (
                <div key={level} className="flex justify-between items-center bg-slate-900/30 rounded p-3">
                  <div>
                    <span className="font-semibold text-white capitalize">{level}</span>
                    <div className="text-sm text-slate-400">{settings.description}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-yellow-400 font-semibold">{settings.pointsPerSecond}/sec</div>
                    <div className="text-green-400 text-sm">+{settings.completionBonus} bonus</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
            <h4 className="text-blue-300 font-semibold mb-2">💡 Scoring Tips:</h4>
            <ul className="space-y-1 text-sm text-slate-300">
              <li>• <strong>Read slowly</strong> to maximize time-based points</li>
              <li>• <strong>Choose harder levels</strong> for better rewards</li>
              <li>• <strong>Complete stories</strong> to get the completion bonus</li>
              <li>• <strong>Read daily</strong> to build up points for skins</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const renderFeaturesGuide = () => (
    <div className="space-y-6">
      <h3 className="text-2xl font-display text-yellow-300 mb-4">🎮 Game Features</h3>
      
      <div className="grid gap-4">
        <div className="bg-slate-800/50 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-purple-300 mb-3">📚 Story Generator</h4>
          <p className="text-slate-300 mb-3">Create personalized stories based on your interests and reading level.</p>
          <ul className="space-y-1 text-sm text-slate-400">
            <li>• Choose from 4 reading levels</li>
            <li>• Enter any topic you're interested in</li>
            <li>• AI generates unique stories every time</li>
            <li>• Stories are tailored to your level</li>
          </ul>
        </div>

        <div className="bg-slate-800/50 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-blue-300 mb-3">🛍️ Skin Shop</h4>
          <p className="text-slate-300 mb-3">Spend your reading points on cool character skins!</p>
          <ul className="space-y-1 text-sm text-slate-400">
            <li>• Default skins available for all players</li>
            <li>• Admin-uploaded premium skins</li>
            <li>• Different rarities and prices</li>
            <li>• Skins show your reading achievements</li>
          </ul>
        </div>

        <div className="bg-slate-800/50 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-teal-300 mb-3">👕 My Locker</h4>
          <p className="text-slate-300 mb-3">Manage and equip your collected skins.</p>
          <ul className="space-y-1 text-sm text-slate-400">
            <li>• View all your purchased skins</li>
            <li>• Switch between different looks</li>
            <li>• See your equipped skin in the header</li>
            <li>• Show off your reading progress</li>
          </ul>
        </div>

        <div className="bg-slate-800/50 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-orange-300 mb-3">🎨 Skin Creator</h4>
          <p className="text-slate-300 mb-3">Design your own custom skins with AI!</p>
          <ul className="space-y-1 text-sm text-slate-400">
            <li>• Costs {SKIN_GENERATION_COST} reading points</li>
            <li>• Limited to {SKIN_GENERATION_LIMITS.MAX_GENERATIONS_PER_DAY} per day</li>
            <li>• {SKIN_GENERATION_LIMITS.COOLDOWN_MINUTES} minute cooldown between generations</li>
            <li>• Preview before claiming</li>
          </ul>
        </div>
      </div>
    </div>
  );

  const renderSkinsGuide = () => (
    <div className="space-y-6">
      <h3 className="text-2xl font-display text-yellow-300 mb-4">👕 Skin System</h3>
      
      <div className="bg-slate-800/50 rounded-lg p-6 space-y-4">
        <div>
          <h4 className="text-lg font-semibold text-white mb-3">Skin Rarities & Costs:</h4>
          <div className="grid gap-3">
            <div className="flex justify-between items-center bg-slate-900/30 rounded p-3">
              <div className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded-full bg-gray-500`}></div>
                <span className={`font-semibold ${rarityColors[Rarity.Common]}`}>Common</span>
              </div>
              <span className="text-yellow-400 font-semibold">250 RP</span>
            </div>
            <div className="flex justify-between items-center bg-slate-900/30 rounded p-3">
              <div className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded-full bg-blue-500`}></div>
                <span className={`font-semibold ${rarityColors[Rarity.Rare]}`}>Rare</span>
              </div>
              <span className="text-yellow-400 font-semibold">750 RP</span>
            </div>
            <div className="flex justify-between items-center bg-slate-900/30 rounded p-3">
              <div className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded-full bg-purple-500`}></div>
                <span className={`font-semibold ${rarityColors[Rarity.Epic]}`}>Epic</span>
              </div>
              <span className="text-yellow-400 font-semibold">2,000 RP</span>
            </div>
            <div className="flex justify-between items-center bg-slate-900/30 rounded p-3">
              <div className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded-full bg-orange-500`}></div>
                <span className={`font-semibold ${rarityColors[Rarity.Legendary]}`}>Legendary</span>
              </div>
              <span className="text-yellow-400 font-semibold">5,000 RP</span>
            </div>
            <div className="flex justify-between items-center bg-slate-900/30 rounded p-3">
              <div className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded-full bg-teal-500`}></div>
                <span className={`font-semibold ${rarityColors[Rarity.Custom]}`}>Custom</span>
              </div>
              <span className="text-yellow-400 font-semibold">1,000 RP to create</span>
            </div>
          </div>
        </div>

        <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
          <h4 className="text-purple-300 font-semibold mb-2">🎨 Custom Skin Creation:</h4>
          <ul className="space-y-1 text-sm text-slate-300">
            <li>• Describe your ideal character skin</li>
            <li>• AI generates it in Fortnite style</li>
            <li>• Preview before spending points</li>
            <li>• Rate limited to prevent spam</li>
          </ul>
        </div>
      </div>
    </div>
  );

  const renderTipsGuide = () => (
    <div className="space-y-6">
      <h3 className="text-2xl font-display text-yellow-300 mb-4">💡 Pro Tips</h3>
      
      <div className="grid gap-4">
        <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-6">
          <h4 className="text-green-300 font-semibold mb-3">📈 Maximize Your Points:</h4>
          <ul className="space-y-2 text-slate-300">
            <li>• <strong>Take your time:</strong> Points increase with reading time</li>
            <li>• <strong>Challenge yourself:</strong> Higher levels = more points per second</li>
            <li>• <strong>Read daily:</strong> Consistent reading builds up your point balance</li>
            <li>• <strong>Complete stories:</strong> Always finish for the completion bonus</li>
          </ul>
        </div>

        <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-6">
          <h4 className="text-blue-300 font-semibold mb-3">🎯 Smart Shopping:</h4>
          <ul className="space-y-2 text-slate-300">
            <li>• <strong>Start with Common skins:</strong> Best value for new players</li>
            <li>• <strong>Save for Legendary:</strong> Most impressive and rare skins</li>
            <li>• <strong>Check shop regularly:</strong> New admin skins may appear</li>
            <li>• <strong>Equip your favorites:</strong> Show off your reading achievements</li>
          </ul>
        </div>

        <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-6">
          <h4 className="text-orange-300 font-semibold mb-3">🎨 Custom Skin Tips:</h4>
          <ul className="space-y-2 text-slate-300">
            <li>• <strong>Be specific:</strong> Detailed descriptions work better</li>
            <li>• <strong>Think Fortnite style:</strong> Colorful, heroic characters</li>
            <li>• <strong>Plan your generations:</strong> Only {SKIN_GENERATION_LIMITS.MAX_GENERATIONS_PER_DAY} per day</li>
            <li>• <strong>Save points first:</strong> Need {SKIN_GENERATION_COST} RP to create</li>
          </ul>
        </div>

        <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-6">
          <h4 className="text-purple-300 font-semibold mb-3">👨‍👩‍👧‍👦 Family Features:</h4>
          <ul className="space-y-2 text-slate-300">
            <li>• <strong>Shared shop:</strong> Everyone sees the same skins</li>
            <li>• <strong>Individual progress:</strong> Each account tracks separately</li>
            <li>• <strong>Admin features:</strong> Parents can add custom skins</li>
            <li>• <strong>Safe content:</strong> AI-generated stories are family-friendly</li>
          </ul>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-black/30 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-purple-500/30">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-display text-yellow-300">📖 FortReader Guide</h2>
          <Button onClick={onBack} variant="secondary" size="medium">
            ← Back
          </Button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 p-1 bg-slate-800/50 rounded-lg">
          <button
            onClick={() => setActiveSection('scoring')}
            className={`px-4 py-2 rounded-md transition-all ${
              activeSection === 'scoring'
                ? 'bg-purple-600 text-white'
                : 'text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            📊 Scoring
          </button>
          <button
            onClick={() => setActiveSection('features')}
            className={`px-4 py-2 rounded-md transition-all ${
              activeSection === 'features'
                ? 'bg-purple-600 text-white'
                : 'text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            🎮 Features
          </button>
          <button
            onClick={() => setActiveSection('skins')}
            className={`px-4 py-2 rounded-md transition-all ${
              activeSection === 'skins'
                ? 'bg-purple-600 text-white'
                : 'text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            👕 Skins
          </button>
          <button
            onClick={() => setActiveSection('tips')}
            className={`px-4 py-2 rounded-md transition-all ${
              activeSection === 'tips'
                ? 'bg-purple-600 text-white'
                : 'text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            💡 Tips
          </button>
        </div>

        {/* Content */}
        <div className="min-h-[500px]">
          {activeSection === 'scoring' && renderScoringGuide()}
          {activeSection === 'features' && renderFeaturesGuide()}
          {activeSection === 'skins' && renderSkinsGuide()}
          {activeSection === 'tips' && renderTipsGuide()}
        </div>
      </div>
    </div>
  );
};

export default Help;



