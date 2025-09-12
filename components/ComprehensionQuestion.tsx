import React, { useState } from 'react';
import type { ComprehensionQuestion } from '../types';
import Button from './common/Button';

interface ComprehensionQuestionProps {
  question: ComprehensionQuestion;
  storyTitle: string;
  onAnswer: (correct: boolean) => void;
}

const ComprehensionQuestion: React.FC<ComprehensionQuestionProps> = ({ 
  question, 
  storyTitle, 
  onAnswer 
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleAnswerSelect = (index: number) => {
    if (showResult) return; // Don't allow changes after submission
    setSelectedAnswer(index);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) return;
    
    const correct = selectedAnswer === question.correctAnswerIndex;
    setIsCorrect(correct);
    setShowResult(true);
    
    // Give a brief moment to show the result, then proceed
    setTimeout(() => {
      onAnswer(correct);
    }, 2000);
  };

  const getOptionClassName = (index: number) => {
    let baseClass = "p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 text-left";
    
    if (!showResult) {
      // Before submission
      if (selectedAnswer === index) {
        return `${baseClass} bg-purple-600/30 border-purple-400 text-white`;
      } else {
        return `${baseClass} bg-slate-800/50 border-slate-600 text-slate-200 hover:bg-slate-700/50 hover:border-slate-500`;
      }
    } else {
      // After submission - show correct/incorrect
      if (index === question.correctAnswerIndex) {
        return `${baseClass} bg-green-600/30 border-green-400 text-white`;
      } else if (selectedAnswer === index && index !== question.correctAnswerIndex) {
        return `${baseClass} bg-red-600/30 border-red-400 text-white`;
      } else {
        return `${baseClass} bg-slate-800/30 border-slate-600 text-slate-400`;
      }
    }
  };

  return (
    <div className="bg-slate-900/50 p-6 md:p-10 rounded-2xl shadow-2xl border border-purple-500/30 max-w-4xl mx-auto animate-fade-in">
      <div className="mb-6 pb-4 border-b-2 border-purple-400/20">
        <h2 className="text-2xl md:text-3xl font-display text-yellow-300 drop-shadow-md mb-2">
          Quick Question About "{storyTitle}"
        </h2>
        <p className="text-slate-300 text-lg">
          Let's see how well you read the story! Choose the best answer:
        </p>
      </div>
      
      <div className="mb-8">
        <h3 className="text-xl md:text-2xl text-white mb-6 font-semibold">
          {question.question}
        </h3>
        
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <div
              key={index}
              className={getOptionClassName(index)}
              onClick={() => handleAnswerSelect(index)}
            >
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center mr-4 font-bold">
                  {String.fromCharCode(65 + index)}
                </div>
                <span className="text-lg">{option}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {!showResult && (
        <div className="text-center">
          <Button 
            onClick={handleSubmit} 
            variant="primary" 
            size="large"
            disabled={selectedAnswer === null}
          >
            Submit Answer
          </Button>
        </div>
      )}

      {showResult && (
        <div className="text-center">
          <div className={`p-6 rounded-lg mb-4 ${
            isCorrect 
              ? 'bg-green-600/20 border border-green-400/30' 
              : 'bg-yellow-600/20 border border-yellow-400/30'
          }`}>
            <h3 className={`text-2xl font-bold mb-2 ${
              isCorrect ? 'text-green-300' : 'text-yellow-300'
            }`}>
              {isCorrect ? '🎉 Excellent!' : '📚 Good Try!'}
            </h3>
            <p className="text-lg text-slate-200">
              {isCorrect 
                ? "You read the story carefully! Your full reading time has been logged." 
                : "Good try! You still read the whole story, so half your reading time counts toward your daily goal."}
            </p>
            {question.explanation && (
              <p className="text-slate-300 mt-3 italic">
                {question.explanation}
              </p>
            )}
          </div>
          <p className="text-slate-400">Moving to results...</p>
        </div>
      )}
    </div>
  );
};

export default ComprehensionQuestion;
