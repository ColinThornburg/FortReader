import React, { useState, useEffect, useCallback } from 'react';
import type { View, ReadingLevel, Story, Skin, User } from './types';
import { Rarity } from './types';
import { generateStory, generateSkin, generateComprehensionQuestion } from './services/geminiService';
import * as firebaseService from './services/firebaseService';
import { INITIAL_SKINS_DATA, READING_LEVEL_SETTINGS, SKIN_GENERATION_COST, SKIN_GENERATION_LIMITS, DEFAULT_AVATAR_OPTIONS } from './constants';
import type { AdminSkinData } from './types';
import Header from './components/Header';
import StoryGenerator from './components/StoryGenerator';
import ReadingView from './components/ReadingView';
import ResultsScreen from './components/ResultsScreen';
import SkinShop from './components/SkinShop';
import MyLocker from './components/MyLocker';
import LoadingSpinner from './components/common/LoadingSpinner';
import SkinCreator from './components/SkinCreator';
import FirebaseAuth from './components/FirebaseAuth';
import AdminPanel from './components/AdminPanel';
import Help from './components/Help';
import ComprehensionQuestion from './components/ComprehensionQuestion';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<View>('generator');
  const [availableSkins, setAvailableSkins] = useState<Skin[]>([]);
  const [currentStory, setCurrentStory] = useState<Story | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<ComprehensionQuestion | null>(null);
  const [readingTime, setReadingTime] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState<string>('Summoning skins...');
  const [isGeneratingSkin, setIsGeneratingSkin] = useState<boolean>(false);
  const [tempSkin, setTempSkin] = useState<{prompt: string, name: string, imageUrl: string} | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(false);
  const [firebaseUid, setFirebaseUid] = useState<string | null>(null);

  // Initialize Firebase auth listener and load skins
  useEffect(() => {
    const initializeApp = async () => {
      setIsLoading(true);
      setLoadingMessage('Loading shop skins...');
      setError(null);
      try {
        // Load admin skins from Firebase
        const adminSkins = await firebaseService.getActiveAdminSkins();
        const adminSkinsAsSkins: Skin[] = adminSkins.map(adminSkin => ({
          id: adminSkin.id,
          name: adminSkin.name,
          prompt: adminSkin.description || `${adminSkin.name} - Custom admin skin`,
          rarity: adminSkin.rarity,
          cost: adminSkin.cost,
          imageUrl: adminSkin.imageUrl
        }));
        
        // Combine admin skins with default skins
        const allSkins = [...INITIAL_SKINS_DATA, ...adminSkinsAsSkins];
        setAvailableSkins(allSkins);
      } catch (err) {
        console.error("Failed to initialize app:", err);
        setError("Could not load shop skins. Please refresh and try again.");
      } finally {
        setIsLoading(false);
      }
    };

    // Set up Firebase auth listener
    const unsubscribe = firebaseService.onAuthStateChange(async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in, load their data
        setFirebaseUid(firebaseUser.uid);
        try {
          const userData = await firebaseService.getUserData(firebaseUser.uid);
          if (userData) {
            setCurrentUser(userData);
          } else {
            // If no user data exists, this might be a newly created account
            // The data should be created during sign-up, so we'll wait a moment and try again
            setTimeout(async () => {
              const retryUserData = await firebaseService.getUserData(firebaseUser.uid);
              if (retryUserData) {
                setCurrentUser(retryUserData);
              }
            }, 1000);
          }
        } catch (error) {
          console.error('Error loading user data:', error);
          setError('Failed to load user data. Please try refreshing.');
        }
      } else {
        // User is signed out
        setFirebaseUid(null);
        setCurrentUser(null);
      }
    });

    initializeApp();

    // Cleanup auth listener on unmount
    return () => unsubscribe();
  }, []);

  // Save user data whenever it changes (Firebase will handle this)
  useEffect(() => {
    if (currentUser && firebaseUid) {
      firebaseService.saveUserData(firebaseUid, currentUser);
    }
  }, [currentUser, firebaseUid]);
  
  // Clean up temp skin when navigating away from creator
  useEffect(() => {
    if (currentView !== 'creator') {
      setTempSkin(null);
    }
  }, [currentView]);

  const updateUser = (updateFn: (user: User) => User) => {
    setCurrentUser(prevUser => {
      if (!prevUser) return null;
      return updateFn(prevUser);
    });
  };

  // Reading-time based generation limits
  const checkSkinGenerationLimits = (user: User): { 
    canGenerate: boolean; 
    reason?: string; 
    availableGenerations?: number;
    readingTimeNeeded?: number; 
  } => {
    const today = new Date().toDateString();
    
    // Initialize skin generation data if it doesn't exist
    const skinGenData = user.skinGenerationData || {
      lastGenerationTime: 0,
      generationsToday: 0,
      dailyResetTime: Date.now(),
      readingTimeUsedForGeneration: 0
    };
    
    // Check if we need to reset daily counter
    const lastResetDate = new Date(skinGenData.dailyResetTime).toDateString();
    const isNewDay = today !== lastResetDate;
    const currentGenerationsToday = isNewDay ? 0 : skinGenData.generationsToday;
    
    // Check daily limit
    if (currentGenerationsToday >= SKIN_GENERATION_LIMITS.MAX_GENERATIONS_PER_DAY) {
      return { 
        canGenerate: false, 
        reason: `Daily limit reached (${SKIN_GENERATION_LIMITS.MAX_GENERATIONS_PER_DAY} generations per day)`,
        availableGenerations: 0
      };
    }
    
    // Calculate available reading time for skin generation
    const totalValidatedTime = user.totalTimeRead;
    const timeUsedForGeneration = isNewDay ? 0 : (skinGenData.readingTimeUsedForGeneration || 0);
    const availableReadingTime = totalValidatedTime - timeUsedForGeneration;
    const requiredTime = SKIN_GENERATION_LIMITS.READING_TIME_REQUIRED_SECONDS;
    
    // Check if user has enough reading time
    if (availableReadingTime < requiredTime) {
      const timeNeeded = requiredTime - availableReadingTime;
      const minutesNeeded = Math.ceil(timeNeeded / 60);
      return { 
        canGenerate: false, 
        reason: `Need ${minutesNeeded} more minutes of validated reading time`,
        readingTimeNeeded: timeNeeded,
        availableGenerations: 0
      };
    }
    
    // Calculate how many generations they can afford based on reading time
    const possibleGenerations = Math.floor(availableReadingTime / requiredTime);
    const remainingDailyGenerations = SKIN_GENERATION_LIMITS.MAX_GENERATIONS_PER_DAY - currentGenerationsToday;
    const availableGenerations = Math.min(possibleGenerations, remainingDailyGenerations);
    
    return { 
      canGenerate: availableGenerations > 0, 
      availableGenerations,
      reason: availableGenerations === 0 ? 'No generations available' : undefined
    };
  };

  const updateSkinGenerationData = (user: User): User => {
    const now = Date.now();
    const today = new Date().toDateString();
    
    const currentData = user.skinGenerationData;
    const isNewDay = !currentData || new Date(currentData.dailyResetTime).toDateString() !== today;
    
    // Calculate new reading time used (add the required time for this generation)
    const currentTimeUsed = isNewDay ? 0 : (currentData?.readingTimeUsedForGeneration || 0);
    const newTimeUsed = currentTimeUsed + SKIN_GENERATION_LIMITS.READING_TIME_REQUIRED_SECONDS;
    
    return {
      ...user,
      skinGenerationData: {
        lastGenerationTime: now,
        generationsToday: isNewDay ? 1 : (currentData?.generationsToday || 0) + 1,
        dailyResetTime: isNewDay ? now : (currentData?.dailyResetTime || now),
        readingTimeUsedForGeneration: newTimeUsed
      }
    };
  };

  const refreshShopSkins = async () => {
    try {
      const adminSkins = await firebaseService.getActiveAdminSkins();
      
      const adminSkinsAsSkins: Skin[] = adminSkins.map(adminSkin => ({
        id: adminSkin.id,
        name: adminSkin.name,
        prompt: adminSkin.description || `${adminSkin.name} - Custom admin skin`,
        rarity: adminSkin.rarity,
        cost: adminSkin.cost,
        imageUrl: adminSkin.imageUrl
      }));
      
      // Combine admin skins with default skins
      const allSkins = [...INITIAL_SKINS_DATA, ...adminSkinsAsSkins];
      setAvailableSkins(allSkins);
    } catch (error) {
      console.error('Error refreshing shop skins:', error);
    }
  };

  const handleGenerateStory = async (readingLevel: ReadingLevel, topic: string) => {
    setIsLoading(true);
    setLoadingMessage('Crafting a new adventure...');
    setError(null);
    try {
      const { title, content } = await generateStory(readingLevel, topic);
      setCurrentStory({ title, content, readingLevel });
      setCurrentView('reading');
    } catch (err) {
      console.error("Failed to generate story:", err);
      setError("The storybook is stuck! Couldn't generate a tale. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinishReading = async (time: number) => {
    setReadingTime(time);
    setIsLoading(true);
    setLoadingMessage('Preparing your question...');
    
    try {
      const question = await generateComprehensionQuestion(currentStory!);
      setCurrentQuestion(question);
      setCurrentView('question');
    } catch (error) {
      console.error("Error generating comprehension question:", error);
      // If question generation fails, skip to results
      handleQuestionAnswered(true); // Assume they read it if we can't generate a question
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuestionAnswered = (correct: boolean) => {
    const levelSetting = READING_LEVEL_SETTINGS[currentStory!.readingLevel];
    let pointsEarned = Math.round(readingTime * levelSetting.pointsPerSecond) + levelSetting.completionBonus;
    
    // Give a small bonus for correct answers
    if (correct) {
      pointsEarned += Math.round(levelSetting.completionBonus * 0.1);
    }
    
    updateUser(user => {
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
      const isNewDay = !user.readingStats?.lastReadingDate || user.readingStats.lastReadingDate !== today;
      
      // Initialize reading stats if they don't exist
      const currentStats = user.readingStats || {
        dailyGoalMinutes: 15, // default 15 minutes per day
        todayValidatedTime: 0,
        lastReadingDate: today,
        readingSessions: []
      };
      
      // Reset daily time if it's a new day
      const todayValidatedTime = isNewDay ? 0 : currentStats.todayValidatedTime;
      
      // Add full reading time for correct answers, half for incorrect answers
      const timeToAdd = correct ? readingTime : Math.floor(readingTime / 2);
      const newValidatedTime = todayValidatedTime + timeToAdd;
      const newTotalTime = user.totalTimeRead + timeToAdd;
      
      // Update or create today's reading session
      const existingSessionIndex = currentStats.readingSessions.findIndex(session => session.date === today);
      const updatedSessions = [...currentStats.readingSessions];
      
      if (existingSessionIndex >= 0) {
        // Update existing session
        const existingSession = updatedSessions[existingSessionIndex];
        updatedSessions[existingSessionIndex] = {
          ...existingSession,
          timeRead: existingSession.timeRead + timeToAdd,
          storiesCompleted: existingSession.storiesCompleted + 1,
          questionsCorrect: existingSession.questionsCorrect + (correct ? 1 : 0),
          questionsTotal: existingSession.questionsTotal + 1
        };
      } else {
        // Create new session for today
        updatedSessions.push({
          date: today,
          timeRead: timeToAdd,
          storiesCompleted: 1,
          questionsCorrect: correct ? 1 : 0,
          questionsTotal: 1
        });
      }
      
      // Keep only last 30 days of sessions
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const filteredSessions = updatedSessions.filter(session => 
        new Date(session.date) >= thirtyDaysAgo
      );
      
      return {
        ...user,
        readingPoints: user.readingPoints + pointsEarned,
        totalTimeRead: newTotalTime,
        readingStats: {
          ...currentStats,
          todayValidatedTime: newValidatedTime,
          lastReadingDate: today,
          readingSessions: filteredSessions
        }
      };
    });

    setCurrentView('results');
  };

  const handleReturnHome = () => {
    setCurrentStory(null);
    setCurrentQuestion(null);
    setReadingTime(0);
    setCurrentView('generator');
  };

  const handleBuySkin = async (skin: Skin) => {
    if (currentUser && currentUser.readingPoints >= skin.cost && !currentUser.ownedSkins.some(s => s.id === skin.id)) {
      const updatedUser = {
        ...currentUser,
        readingPoints: currentUser.readingPoints - skin.cost,
        ownedSkins: [...currentUser.ownedSkins, skin],
      };
      
      // Update local state
      setCurrentUser(updatedUser);
      
      // Explicitly save to Firebase
      if (firebaseUid) {
        try {
          await firebaseService.saveUserData(firebaseUid, updatedUser);
          console.log('Purchased skin saved to Firebase successfully');
        } catch (error) {
          console.error('Error saving purchased skin to Firebase:', error);
          alert('Error saving skin purchase. Please try again.');
          return;
        }
      }
    }
  };

  const handleEquipSkin = (skin: Skin) => {
    updateUser(user => ({ ...user, equippedSkinId: skin.id }));
    alert(`${skin.name} equipped!`);
  };

  const handleGenerateSkinPreview = async (prompt: string, name: string) => {
    if (!currentUser) return;
    
    // Check rate limits
    const limitCheck = checkSkinGenerationLimits(currentUser);
    if (!limitCheck.canGenerate) {
      let errorMessage = "🚫 " + limitCheck.reason;
      if (limitCheck.cooldownMinutes) {
        errorMessage += `. Try again in ${limitCheck.cooldownMinutes} minutes.`;
      } else {
        errorMessage += ". Come back tomorrow for more generations!";
      }
      setError(errorMessage);
      return;
    }
    
    // Check if user has enough points
    if (currentUser.readingPoints < SKIN_GENERATION_COST) {
      setError(`🪙 Not enough reading points! You need ${SKIN_GENERATION_COST} points to generate a skin.`);
      return;
    }
    
    setIsGeneratingSkin(true);
    setError(null);
    setTempSkin(null);
    
    try {
        const fullPrompt = `Fortnite style character skin named '${name}'. Description: ${prompt}. Style: Cartoon 3D render, cel-shaded, vibrant saturated colors, clean stylized details, heroic pose, full body character, white background, Unreal Engine aesthetic, battle royale game art style.`;
        const imageUrl = await generateSkin(fullPrompt);
        
        // Update user's generation data (but don't deduct points yet - that happens on claim)
        updateUser(updateSkinGenerationData);
        
        setTempSkin({ prompt, name, imageUrl });
    } catch (err) {
        console.error("Failed to generate skin preview:", err);
        setError("The creative forge is cold! Couldn't generate a skin. Please try again.");
    } finally {
        setIsGeneratingSkin(false);
    }
  };

  const handleClaimSkin = async () => {
    if (!tempSkin || !currentUser || currentUser.readingPoints < SKIN_GENERATION_COST) {
        return;
    }
    
    const newSkin: Skin = {
        id: `skin_custom_${Date.now()}`,
        name: tempSkin.name,
        prompt: tempSkin.prompt,
        rarity: Rarity.Custom,
        cost: 0,
        imageUrl: tempSkin.imageUrl,
    };
    
    const updatedUser = {
      ...currentUser,
      readingPoints: currentUser.readingPoints - SKIN_GENERATION_COST,
      ownedSkins: [...currentUser.ownedSkins, newSkin],
    };
    
    // Update local state
    setCurrentUser(updatedUser);
    
    // Explicitly save to Firebase
    if (firebaseUid) {
      try {
        await firebaseService.saveUserData(firebaseUid, updatedUser);
        console.log('Skin saved to Firebase successfully');
      } catch (error) {
        console.error('Error saving skin to Firebase:', error);
        alert('Error saving skin. Please try again.');
        return;
      }
    }

    setTempSkin(null); 
    alert(`"${newSkin.name}" has been added to your locker!`);
    setCurrentView('locker');
  };

  const handleSignUp = async (email: string, password: string, userData: User) => {
    setAuthLoading(true);
    setError(null);
    try {
      await firebaseService.signUp(email, password, userData);
      // User will be set via the auth state listener
    } catch (error: any) {
      console.error('Error signing up:', error);
      setError(error.message || 'Failed to create account. Please try again.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogin = async (email: string, password: string) => {
    setAuthLoading(true);
    setError(null);
    try {
      await firebaseService.signIn(email, password);
      // User will be set via the auth state listener
    } catch (error: any) {
      console.error('Error signing in:', error);
      setError(error.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await firebaseService.signOutUser();
      setCurrentUser(null);
      setCurrentView('generator');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  if (!currentUser) {
    return (
      <div className="bg-gradient-to-br from-[#1a0c35] via-[#1b104d] to-[#3b1c6b] min-h-screen text-white font-sans antialiased flex items-center justify-center p-4">
        {isLoading ? <LoadingSpinner /> : (
          <>
            {error && (
              <div className="mb-4 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-200 text-center">
                {error}
              </div>
            )}
            <FirebaseAuth onLogin={handleLogin} onSignUp={handleSignUp} isLoading={authLoading} />
          </>
        )}
      </div>
    );
  }

  const equippedSkin = currentUser.ownedSkins.find(s => s.id === currentUser.equippedSkinId) || currentUser.ownedSkins[0];

  const renderView = () => {
    if (isLoading) {
        return <div className="flex flex-col items-center justify-center h-full text-white text-2xl font-display"><LoadingSpinner />{loadingMessage}</div>;
    }
     if (error) {
      return <div className="flex items-center justify-center h-full text-red-400 text-center p-8 text-xl bg-gray-800/50 rounded-lg">{error}</div>;
    }

    switch (currentView) {
      case 'reading':
        return <ReadingView story={currentStory!} onFinish={handleFinishReading} />;
      case 'question':
        return <ComprehensionQuestion 
          question={currentQuestion!} 
          storyTitle={currentStory!.title}
          onAnswer={handleQuestionAnswered} 
        />;
      case 'results':
        const levelSetting = READING_LEVEL_SETTINGS[currentStory!.readingLevel];
        const pointsEarned = Math.round(readingTime * levelSetting.pointsPerSecond) + levelSetting.completionBonus;
        return <ResultsScreen readingTime={readingTime} pointsEarned={pointsEarned} onReturnHome={handleReturnHome} />;
      case 'shop':
        const shopSkins = availableSkins.filter(s => {
          const isOwned = currentUser.ownedSkins.some(os => os.id === s.id);
          
          // Admin users can see all skins (including ones they created)
          if (currentUser.isAdmin) {
            return true;
          }
          
          return !isOwned;
        });
        return <SkinShop skins={shopSkins} onBuy={handleBuySkin} userPoints={currentUser.readingPoints} />;
      case 'locker':
        return <MyLocker ownedSkins={currentUser.ownedSkins} equippedSkin={equippedSkin} onEquip={handleEquipSkin} />;
      case 'creator':
        const limitCheck = checkSkinGenerationLimits(currentUser);
        return <SkinCreator 
          onGenerate={handleGenerateSkinPreview}
          onClaim={handleClaimSkin}
          tempSkinUrl={tempSkin?.imageUrl || null}
          isGenerating={isGeneratingSkin}
          cost={SKIN_GENERATION_COST}
          userPoints={currentUser.readingPoints}
          canGenerate={limitCheck.canGenerate}
          limitReason={limitCheck.reason}
          availableGenerations={limitCheck.availableGenerations || 0}
          readingTimeNeeded={limitCheck.readingTimeNeeded || 0}
          generationsToday={currentUser.skinGenerationData?.generationsToday || 0}
          maxGenerationsPerDay={SKIN_GENERATION_LIMITS.MAX_GENERATIONS_PER_DAY}
          totalReadingTime={currentUser.totalTimeRead}
          readingTimeRequired={SKIN_GENERATION_LIMITS.READING_TIME_REQUIRED_SECONDS}
        />;
      case 'admin':
        return <AdminPanel onBack={async () => {
          setCurrentView('generator');
          await refreshShopSkins(); // Refresh shop when leaving admin panel
        }} />;
      case 'help':
        return <Help onBack={() => setCurrentView('generator')} />;
      case 'generator':
      default:
        return <StoryGenerator onGenerate={handleGenerateStory} />;
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#1a0c35] via-[#1b104d] to-[#3b1c6b] min-h-screen text-white font-sans antialiased">
      <div className="container mx-auto p-4 md:p-6">
        <Header 
          user={currentUser}
          equippedSkin={equippedSkin}
          onNavigate={(view) => {
            if (view === 'shop') {
              refreshShopSkins().then(() => setCurrentView(view));
            } else {
              setCurrentView(view);
            }
          }}
          currentView={currentView}
          onLogout={handleLogout}
        />
        <main className="mt-6">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default App;
