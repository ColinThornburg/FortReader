import React, { useState, useEffect, useRef } from 'react';
import type { Story } from '../types';
import Button from './common/Button';

interface ReadingViewProps {
  story: Story;
  onFinish: (timeInSeconds: number) => void;
}

const ReadingView: React.FC<ReadingViewProps> = ({ story, onFinish }) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  // Fix: Use ReturnType<typeof setInterval> for the timer ref type, which is environment-agnostic and resolves correctly in browser environments.
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setElapsedTime(prevTime => prevTime + 1);
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleFinish = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    onFinish(elapsedTime);
  };

  return (
    <div className="bg-slate-900/50 p-6 md:p-10 rounded-2xl shadow-2xl border border-purple-500/30 max-w-4xl mx-auto animate-fade-in">
      <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-purple-400/20">
        <h2 className="text-3xl md:text-4xl font-display text-yellow-300 drop-shadow-md">{story.title}</h2>
        <div className="bg-slate-800 text-xl font-bold px-4 py-2 rounded-lg text-white">
          {formatTime(elapsedTime)}
        </div>
      </div>
      
      <div 
        className="prose prose-invert lg:prose-xl max-w-none text-slate-200 leading-relaxed text-lg"
        dangerouslySetInnerHTML={{ __html: story.content }}
      />

      <div className="mt-8 pt-6 border-t-2 border-purple-400/20 text-center">
        <Button onClick={handleFinish} variant="primary" size="large">I'm Finished Reading!</Button>
      </div>
    </div>
  );
};

export default ReadingView;