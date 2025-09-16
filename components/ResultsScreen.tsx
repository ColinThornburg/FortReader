
import React from 'react';
import Button from './common/Button';

interface ResultsScreenProps {
  rawReadingTime: number;
  validatedReadingTime: number;
  pointsEarned: number;
  questionCorrect: boolean | null;
  validationNote?: string | null;
  onReturnHome: () => void;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ rawReadingTime, validatedReadingTime, pointsEarned, questionCorrect, validationNote, onReturnHome }) => {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const effectiveValidatedTime = questionCorrect === null ? rawReadingTime : validatedReadingTime;
  const timeDifference = Math.max(0, rawReadingTime - effectiveValidatedTime);

  return (
    <div className="bg-black/30 p-8 rounded-2xl shadow-2xl border border-purple-500/30 flex flex-col items-center max-w-lg mx-auto text-center animate-fade-in">
      <h2 className="text-5xl font-display text-yellow-300 drop-shadow-md mb-4">Victory!</h2>
      <p className="text-slate-300 text-xl mb-8">You completed the story. Well done!</p>

      <div className="w-full space-y-4 mb-6">
        <div className="bg-slate-800/70 p-4 rounded-lg flex justify-between items-center">
          <span className="text-lg text-slate-200">Time you spent reading:</span>
          <span className="text-2xl font-bold text-white">{formatTime(rawReadingTime)}</span>
        </div>
        <div className="bg-slate-800/70 p-4 rounded-lg flex justify-between items-center">
          <span className="text-lg text-slate-200">Time counted toward goals:</span>
          <span className="text-2xl font-bold text-purple-300">{formatTime(effectiveValidatedTime)}</span>
        </div>
        {timeDifference > 0 && (
          <div className="bg-yellow-900/20 border border-yellow-500/30 text-yellow-200 text-sm p-3 rounded-lg">
            {questionCorrect === false
              ? `Time difference includes the missed-question adjustment: ${formatTime(timeDifference)} did not count this time.`
              : `Time difference capped at the story limit: ${formatTime(timeDifference)} beyond the cap did not count.`}
          </div>
        )}
        <div className="bg-slate-800/70 p-4 rounded-lg flex justify-between items-center">
          <span className="text-lg text-slate-200">RP Earned:</span>
          <span className="text-2xl font-bold text-yellow-400">+{pointsEarned.toLocaleString()} RP</span>
        </div>
      </div>

      {validationNote && (
        <p className="text-slate-300 text-sm mb-4">
          {validationNote}
        </p>
      )}

      <Button onClick={onReturnHome} variant="primary" size="large">
        Read Another Story
      </Button>
    </div>
  );
};

export default ResultsScreen;
