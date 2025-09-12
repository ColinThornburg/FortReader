
import React from 'react';
import Button from './common/Button';

interface ResultsScreenProps {
  readingTime: number;
  pointsEarned: number;
  onReturnHome: () => void;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ readingTime, pointsEarned, onReturnHome }) => {
    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}m ${remainingSeconds}s`;
    };

    return (
        <div className="bg-black/30 p-8 rounded-2xl shadow-2xl border border-purple-500/30 flex flex-col items-center max-w-lg mx-auto text-center animate-fade-in">
            <h2 className="text-5xl font-display text-yellow-300 drop-shadow-md mb-4">Victory!</h2>
            <p className="text-slate-300 text-xl mb-8">You completed the story. Well done!</p>

            <div className="w-full space-y-4 mb-10">
                <div className="bg-slate-800/70 p-4 rounded-lg flex justify-between items-center">
                    <span className="text-lg text-slate-200">Reading Time:</span>
                    <span className="text-2xl font-bold text-white">{formatTime(readingTime)}</span>
                </div>
                 <div className="bg-slate-800/70 p-4 rounded-lg flex justify-between items-center">
                    <span className="text-lg text-slate-200">RP Earned:</span>
                    <span className="text-2xl font-bold text-yellow-400">+{pointsEarned.toLocaleString()} RP</span>
                </div>
            </div>

            <Button onClick={onReturnHome} variant="primary" size="large">
                Read Another Story
            </Button>
        </div>
    );
};

export default ResultsScreen;
