import React from 'react';
import type { Skin } from '../types';
import { Rarity } from '../types';
import Button from './common/Button';

interface MyLockerProps {
  ownedSkins: Skin[];
  equippedSkin: Skin | null;
  onEquip: (skin: Skin) => void;
}

const LockerCard: React.FC<{ skin: Skin; isEquipped: boolean; onEquip: (skin: Skin) => void; }> = ({ skin, isEquipped, onEquip }) => {
    return (
        <div className="bg-slate-800/50 rounded-xl overflow-hidden shadow-lg border-2 border-slate-700 flex flex-col">
            <div className="p-1 bg-gradient-to-br from-slate-700 to-slate-800">
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
                        onClick={() => onEquip(skin)} 
                        disabled={isEquipped}
                        variant={isEquipped ? 'secondary' : 'primary'}
                        className="w-full"
                    >
                        {isEquipped ? 'Equipped' : 'Equip'}
                    </Button>
                </div>
            </div>
        </div>
    )
}

const MyLocker: React.FC<MyLockerProps> = ({ ownedSkins, equippedSkin, onEquip }) => {
  return (
    <div className="animate-fade-in">
      <h2 className="text-4xl font-display text-center text-yellow-300 drop-shadow-md mb-8">My Locker</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {ownedSkins.map(skin => (
          <LockerCard 
            key={skin.id} 
            skin={skin} 
            isEquipped={equippedSkin?.id === skin.id}
            onEquip={onEquip}
          />
        ))}
      </div>
    </div>
  );
};

export default MyLocker;