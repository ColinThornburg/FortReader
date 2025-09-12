import React from 'react';
import type { Skin } from '../types';
import { Rarity } from '../types';
import Button from './common/Button';

interface SkinShopProps {
  skins: Skin[];
  onBuy: (skin: Skin) => void;
  userPoints: number;
}

const rarityColorMap: Record<Rarity, string> = {
    [Rarity.Common]: 'border-gray-400',
    [Rarity.Rare]: 'border-blue-400',
    [Rarity.Epic]: 'border-purple-500',
    [Rarity.Legendary]: 'border-orange-500',
    [Rarity.Custom]: 'border-teal-400',
};

const SkinCard: React.FC<{ skin: Skin; onBuy: (skin: Skin) => void; userPoints: number;}> = ({ skin, onBuy, userPoints }) => {
    const canAfford = userPoints >= skin.cost;

    return (
        <div className="bg-slate-800/50 rounded-xl overflow-hidden shadow-lg border-2 border-slate-700 flex flex-col transition-transform duration-300 hover:scale-105 hover:shadow-purple-500/30">
            <div className={`p-1 bg-gradient-to-br from-slate-700 to-slate-800 border-b-4 ${rarityColorMap[skin.rarity]}`}>
                <img src={skin.imageUrl} alt={skin.name} className="w-full h-64 object-cover rounded-t-lg" />
            </div>
            <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-2xl font-display text-white">{skin.name}</h3>
                <p className={`font-bold text-sm ${
                    skin.rarity === Rarity.Legendary ? 'text-orange-400' :
                    skin.rarity === Rarity.Epic ? 'text-purple-400' :
                    skin.rarity === Rarity.Rare ? 'text-blue-300' :
                    skin.rarity === Rarity.Custom ? 'text-teal-300' :
                    'text-gray-300'
                }`}>{skin.rarity}</p>
                <div className="flex-grow"></div>
                <div className="mt-4">
                    <Button 
                        onClick={() => onBuy(skin)} 
                        disabled={!canAfford}
                        variant="primary"
                        className="w-full"
                    >
                        <div className="flex justify-center items-center gap-2">
                            <span>{skin.cost.toLocaleString()}</span>
                            <span className="text-yellow-200 font-display">RP</span>
                        </div>
                    </Button>
                </div>
            </div>
        </div>
    )
}

const SkinShop: React.FC<SkinShopProps> = ({ skins, onBuy, userPoints }) => {
  return (
    <div className="animate-fade-in">
      <h2 className="text-4xl font-display text-center text-yellow-300 drop-shadow-md mb-8">Item Shop</h2>
      {skins.length === 0 ? (
        <p className="text-center text-slate-400 text-lg">The shop is currently empty or you own all available items. Check back later!</p>
      ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {skins.map(skin => (
          <SkinCard key={skin.id} skin={skin} onBuy={onBuy} userPoints={userPoints} />
        ))}
      </div>
      )}
    </div>
  );
};

export default SkinShop;
