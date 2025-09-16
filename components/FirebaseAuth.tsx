import React, { useState } from 'react';
import Button from './common/Button';
import { DEFAULT_AVATAR_OPTIONS } from '../constants';
import { Rarity } from '../types';
import type { User } from '../types';

interface FirebaseAuthProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onSignUp: (email: string, password: string, userData: User) => Promise<void>;
  isLoading: boolean;
}

const FirebaseAuth: React.FC<FirebaseAuthProps> = ({ onLogin, onSignUp, isLoading }) => {
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState<string>(DEFAULT_AVATAR_OPTIONS[0].imageUrl);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [useCustomImage, setUseCustomImage] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && password.trim()) {
      await onLogin(email.trim(), password.trim());
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && password.trim() && username.trim()) {
      const avatarUrl = useCustomImage && customImageUrl.trim() 
        ? customImageUrl.trim() 
        : selectedAvatar;
      
      // Check if this should be an admin user
      const isAdmin = username.toLowerCase() === 'admin';
      
      const userData: User = {
        username: username.trim(),
        readingPoints: isAdmin ? 50000 : 500,
        ownedSkins: [{
          id: 'skin_default',
          name: 'Reader Rookie',
          prompt: 'A friendly cartoon character with glasses holding a book',
          rarity: Rarity.Common,
          cost: 0,
          imageUrl: avatarUrl,
        }],
        equippedSkinId: 'skin_default',
        totalTimeRead: 0,
        isAdmin,
      };

      await onSignUp(email.trim(), password.trim(), userData);
    }
  };

  const backToLogin = () => {
    setIsSigningUp(false);
    setUseCustomImage(false);
    setCustomImageUrl('');
  };

  if (isSigningUp) {
    return (
      <div className="bg-black/30 p-8 rounded-2xl shadow-2xl border border-purple-500/30 max-w-2xl mx-auto text-center animate-fade-in">
        <h1 className="text-4xl font-display text-yellow-300 drop-shadow-md mb-2">Create Your Account</h1>
        <p className="text-slate-300 text-lg mb-6">Join the FortReader family!</p>
        
        <form onSubmit={handleSignUp} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              className="w-full p-4 bg-slate-800 border-2 border-slate-600 rounded-lg text-white text-xl focus:outline-none focus:ring-4 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-200 placeholder:text-slate-500"
              required
              disabled={isLoading}
            />
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full p-4 bg-slate-800 border-2 border-slate-600 rounded-lg text-white text-xl focus:outline-none focus:ring-4 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-200 placeholder:text-slate-500"
              required
              disabled={isLoading}
            />
          </div>

          <input 
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Display Name"
            className="w-full p-4 bg-slate-800 border-2 border-slate-600 rounded-lg text-white text-xl focus:outline-none focus:ring-4 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-200 placeholder:text-slate-500"
            required
            disabled={isLoading}
          />

          {/* Avatar Selection */}
          <div>
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

            <div className="flex justify-center gap-4 mb-4">
              <button
                type="button"
                onClick={() => setUseCustomImage(false)}
                className={`px-4 py-2 rounded-lg transition-all ${
                  !useCustomImage 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
                disabled={isLoading}
              >
                Choose Avatar
              </button>
              <button
                type="button"
                onClick={() => setUseCustomImage(true)}
                className={`px-4 py-2 rounded-lg transition-all ${
                  useCustomImage 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
                disabled={isLoading}
              >
                Custom Image
              </button>
            </div>

            {useCustomImage ? (
              <input
                type="url"
                value={customImageUrl}
                onChange={(e) => setCustomImageUrl(e.target.value)}
                placeholder="Enter image URL"
                className="w-full p-3 bg-slate-800 border-2 border-slate-600 rounded-lg text-white focus:outline-none focus:ring-4 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-200 placeholder:text-slate-500"
                disabled={isLoading}
              />
            ) : (
              <div className="grid grid-cols-3 gap-4">
                {DEFAULT_AVATAR_OPTIONS.map((avatar) => (
                  <div
                    key={avatar.id}
                    onClick={() => !isLoading && setSelectedAvatar(avatar.imageUrl)}
                    className={`cursor-pointer p-3 rounded-lg transition-all hover:scale-105 ${
                      selectedAvatar === avatar.imageUrl
                        ? 'bg-purple-600/30 border-2 border-purple-400'
                        : 'bg-slate-800/50 border-2 border-slate-600 hover:border-slate-500'
                    } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
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
              type="button"
              onClick={backToLogin}
              variant="secondary"
              size="large"
              disabled={isLoading}
            >
              Back
            </Button>
            <Button 
              type="submit"
              variant="primary"
              size="large"
              disabled={!email.trim() || !password.trim() || !username.trim() || isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-black/30 p-8 rounded-2xl shadow-2xl border border-purple-500/30 flex flex-col items-center max-w-md mx-auto text-center animate-fade-in">
      <h1 className="text-5xl font-display text-yellow-300 drop-shadow-md mb-2">FortReader</h1>
      <p className="text-slate-300 text-lg mb-8">Welcome back to your reading adventure!</p>
      
      <form onSubmit={handleLogin} className="w-full space-y-6">
        <input 
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email Address"
          className="w-full p-4 bg-slate-800 border-2 border-slate-600 rounded-lg text-white text-xl text-center focus:outline-none focus:ring-4 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-200 placeholder:text-slate-500"
          required
          disabled={isLoading}
        />
        <input 
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full p-4 bg-slate-800 border-2 border-slate-600 rounded-lg text-white text-xl text-center focus:outline-none focus:ring-4 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-200 placeholder:text-slate-500"
          required
          disabled={isLoading}
        />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Button 
            type="submit"
            variant="primary"
            size="large"
            disabled={!email.trim() || !password.trim() || isLoading}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>
          <Button 
            type="button"
            onClick={() => setIsSigningUp(true)}
            variant="secondary"
            size="large"
            disabled={isLoading}
          >
            Sign Up
          </Button>
        </div>
      </form>
    </div>
  );
};

export default FirebaseAuth;




