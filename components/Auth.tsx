import React, { useState } from 'react';
import Button from './common/Button';
import { DEFAULT_AVATAR_OPTIONS } from '../constants';

interface AuthProps {
  onLogin: (username: string) => void;
  onSignUp: (username: string, avatarUrl?: string) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin, onSignUp }) => {
  const [username, setUsername] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<string>(DEFAULT_AVATAR_OPTIONS[0].imageUrl);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [useCustomImage, setUseCustomImage] = useState(false);

  const handleLogin = () => {
    if (username.trim()) {
      onLogin(username.trim());
    }
  };

  const handleSignUp = () => {
    if (username.trim()) {
      const avatarUrl = useCustomImage && customImageUrl.trim() 
        ? customImageUrl.trim() 
        : selectedAvatar;
      onSignUp(username.trim(), avatarUrl);
    }
  };

  const startSignUp = () => {
    setIsSigningUp(true);
  };

  const backToAuth = () => {
    setIsSigningUp(false);
    setUseCustomImage(false);
    setCustomImageUrl('');
  };

  if (isSigningUp) {
    return (
      <div className="bg-black/30 p-8 rounded-2xl shadow-2xl border border-purple-500/30 max-w-2xl mx-auto text-center animate-fade-in">
        <h1 className="text-4xl font-display text-yellow-300 drop-shadow-md mb-2">Create Your Character</h1>
        <p className="text-slate-300 text-lg mb-6">Choose your Reader Rookie avatar!</p>
        
        <div className="mb-6">
          <div className="flex justify-center mb-4">
            <img 
              src={useCustomImage && customImageUrl ? customImageUrl : selectedAvatar}
              alt="Selected avatar"
              className="w-20 h-20 rounded-full border-4 border-yellow-400 shadow-lg"
              onError={(e) => {
                (e.target as HTMLImageElement).src = DEFAULT_AVATAR_OPTIONS[0].imageUrl;
              }}
            />
          </div>
          <input 
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Player Name"
            className="w-full p-4 bg-slate-800 border-2 border-slate-600 rounded-lg text-white text-xl text-center focus:outline-none focus:ring-4 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-200 placeholder:text-slate-500"
            aria-label="Player Name"
          />
        </div>

        {/* Avatar Selection */}
        <div className="mb-6">
          <div className="flex justify-center gap-4 mb-4">
            <button
              onClick={() => setUseCustomImage(false)}
              className={`px-4 py-2 rounded-lg transition-all ${
                !useCustomImage 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              Choose Avatar
            </button>
            <button
              onClick={() => setUseCustomImage(true)}
              className={`px-4 py-2 rounded-lg transition-all ${
                useCustomImage 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              Custom Image
            </button>
          </div>

          {useCustomImage ? (
            <div className="space-y-4">
              <input
                type="url"
                value={customImageUrl}
                onChange={(e) => setCustomImageUrl(e.target.value)}
                placeholder="Enter image URL"
                className="w-full p-3 bg-slate-800 border-2 border-slate-600 rounded-lg text-white focus:outline-none focus:ring-4 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-200 placeholder:text-slate-500"
              />
              {customImageUrl && (
                <div className="flex justify-center">
                  <img 
                    src={customImageUrl} 
                    alt="Custom avatar preview" 
                    className="w-24 h-24 rounded-full border-4 border-purple-500 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = DEFAULT_AVATAR_OPTIONS[0].imageUrl;
                    }}
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {DEFAULT_AVATAR_OPTIONS.map((avatar) => (
                <div
                  key={avatar.id}
                  onClick={() => setSelectedAvatar(avatar.imageUrl)}
                  className={`cursor-pointer p-3 rounded-lg transition-all hover:scale-105 ${
                    selectedAvatar === avatar.imageUrl
                      ? 'bg-purple-600/30 border-2 border-purple-400'
                      : 'bg-slate-800/50 border-2 border-slate-600 hover:border-slate-500'
                  }`}
                >
                  <img 
                    src={avatar.imageUrl} 
                    alt={avatar.name}
                    className="w-16 h-16 mx-auto rounded-full mb-2"
                  />
                  <p className="text-xs text-slate-300">{avatar.name}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <Button 
            onClick={backToAuth}
            variant="secondary"
            size="large"
          >
            Back
          </Button>
          <Button 
            onClick={handleSignUp}
            variant="primary"
            size="large"
            disabled={!username.trim()}
          >
            Create Character
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black/30 p-8 rounded-2xl shadow-2xl border border-purple-500/30 flex flex-col items-center max-w-md mx-auto text-center animate-fade-in">
      <h1 className="text-5xl font-display text-yellow-300 drop-shadow-md mb-2">FortReader</h1>
      <p className="text-slate-300 text-lg mb-8">Enter your player name to begin!</p>
      
      <div className="w-full">
        <input 
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Player Name"
          className="w-full p-4 bg-slate-800 border-2 border-slate-600 rounded-lg text-white text-xl text-center focus:outline-none focus:ring-4 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-200 placeholder:text-slate-500 mb-6"
          aria-label="Player Name"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Button 
            onClick={handleLogin}
            variant="secondary"
            size="large"
            disabled={!username.trim()}
          >
            Login
          </Button>
          <Button 
            onClick={startSignUp}
            variant="primary"
            size="large"
            disabled={!username.trim()}
          >
            Sign Up
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
