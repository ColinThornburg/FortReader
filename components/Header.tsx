import React from 'react';
import type { View, Skin, User } from '../types';
import NavButton from './common/NavButton';
import ReadingStats from './ReadingStats';

interface HeaderProps {
  user: User;
  equippedSkin: Skin | null;
  onNavigate: (view: View) => void;
  currentView: View;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, equippedSkin, onNavigate, currentView, onLogout }) => {
  return (
    <div className="space-y-4">
      <header className="bg-black/30 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-purple-500/30 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-blue-500 p-1 shadow-md">
            <img 
              src={equippedSkin?.imageUrl} 
              alt={equippedSkin?.name || 'Avatar'}
              className="w-full h-full rounded-full object-cover border-2 border-slate-900"
            />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-display tracking-wider text-white drop-shadow-lg">FortReader</h1>
            <p className="text-sm text-yellow-300 font-bold">Player: {user.username}</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex items-center gap-2 bg-slate-900/50 px-4 py-2 rounded-full border border-yellow-400/50">
            <span className="text-yellow-400 font-bold text-lg">{user.readingPoints.toLocaleString()}</span>
            <span className="text-yellow-200 font-display text-lg">RP</span>
          </div>
          <nav className="flex items-center gap-2 bg-slate-900/50 p-1.5 rounded-full">
              <NavButton onClick={() => onNavigate('generator')} isActive={currentView === 'generator'}>Play</NavButton>
              <NavButton onClick={() => onNavigate('shop')} isActive={currentView === 'shop'}>Shop</NavButton>
              <NavButton onClick={() => onNavigate('locker')} isActive={currentView === 'locker'}>Locker</NavButton>
              <NavButton onClick={() => onNavigate('creator')} isActive={currentView === 'creator'}>Creator</NavButton>
              {user.isAdmin && (
                <NavButton onClick={() => onNavigate('admin')} isActive={currentView === 'admin'} className="bg-red-600/20 border border-red-500/50 text-red-300">Admin</NavButton>
              )}
              <NavButton onClick={() => onNavigate('help')} isActive={currentView === 'help'} className="bg-blue-600/20 border border-blue-500/50 text-blue-300">Help</NavButton>
              <button onClick={onLogout} className="px-4 py-2 text-red-400 hover:bg-red-500/20 rounded-full font-bold text-sm transition-colors">Logout</button>
          </nav>
        </div>
      </header>
      
      {/* Reading Stats */}
      <div className="max-w-md">
        <ReadingStats user={user} />
      </div>
    </div>
  );
};

export default Header;
