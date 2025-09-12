import React from 'react';
import type { User } from '../types';

interface ReadingStatsProps {
  user: User;
}

const ReadingStats: React.FC<ReadingStatsProps> = ({ user }) => {
  const readingStats = user.readingStats || {
    dailyGoalMinutes: 15,
    todayValidatedTime: 0,
    lastReadingDate: new Date().toISOString().split('T')[0],
    readingSessions: []
  };

  const todayMinutes = Math.floor(readingStats.todayValidatedTime / 60);
  const goalMinutes = readingStats.dailyGoalMinutes;
  const progressPercentage = Math.min((todayMinutes / goalMinutes) * 100, 100);
  const isGoalMet = todayMinutes >= goalMinutes;

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (minutes === 0) {
      return `${remainingSeconds}s`;
    }
    return `${minutes}m ${remainingSeconds}s`;
  };

  // Get the last 7 days of reading data
  const getLast7Days = () => {
    const days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const session = readingStats.readingSessions.find(s => s.date === dateStr);
      const minutes = session ? Math.floor(session.timeRead / 60) : 0;
      
      days.push({
        date: dateStr,
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        minutes,
        isToday: i === 0
      });
    }
    
    return days;
  };

  const weekData = getLast7Days();

  return (
    <div className="bg-slate-800/50 rounded-lg p-4 border border-purple-500/20">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-white flex items-center">
          📚 Daily Reading
        </h3>
        <div className="text-right">
          <div className={`text-lg font-bold ${isGoalMet ? 'text-green-400' : 'text-yellow-400'}`}>
            {todayMinutes}m / {goalMinutes}m
          </div>
          {isGoalMet && <div className="text-green-400 text-sm">🎉 Goal Met!</div>}
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="w-full bg-slate-700 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${
              isGoalMet 
                ? 'bg-gradient-to-r from-green-500 to-green-400' 
                : 'bg-gradient-to-r from-purple-500 to-blue-500'
            }`}
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <div className="text-xs text-slate-400 mt-1">
          {readingStats.todayValidatedTime > 0 && (
            <span>
              Validated reading time: {formatTime(readingStats.todayValidatedTime)}
            </span>
          )}
        </div>
      </div>

      {/* 7-day mini chart */}
      <div className="flex justify-between items-end space-x-1">
        {weekData.map((day, index) => (
          <div key={day.date} className="flex-1 text-center">
            <div
              className={`rounded-sm mb-1 transition-all duration-300 ${
                day.minutes >= goalMinutes 
                  ? 'bg-green-500' 
                  : day.minutes > 0 
                    ? 'bg-purple-500' 
                    : 'bg-slate-600'
              } ${day.isToday ? 'ring-2 ring-yellow-400' : ''}`}
              style={{ 
                height: `${Math.max(4, (day.minutes / goalMinutes) * 24)}px`,
                minHeight: '4px'
              }}
              title={`${day.dayName}: ${day.minutes}m`}
            ></div>
            <div className={`text-xs ${day.isToday ? 'text-yellow-400 font-bold' : 'text-slate-400'}`}>
              {day.dayName}
            </div>
          </div>
        ))}
      </div>

      {/* Additional stats */}
      {readingStats.readingSessions.length > 0 && (
        <div className="mt-3 pt-3 border-t border-slate-600 text-xs text-slate-400">
          <div className="flex justify-between">
            <span>Total validated time:</span>
            <span className="text-white">{formatTime(user.totalTimeRead)}</span>
          </div>
          {readingStats.readingSessions.length > 0 && (
            <div className="flex justify-between mt-1">
              <span>Reading streak:</span>
              <span className="text-white">{calculateStreak(readingStats.readingSessions, goalMinutes)} days</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Helper function to calculate reading streak
const calculateStreak = (sessions: Array<{date: string, timeRead: number}>, goalMinutes: number): number => {
  if (sessions.length === 0) return 0;
  
  const sortedSessions = [...sessions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const today = new Date().toISOString().split('T')[0];
  let streak = 0;
  
  // Check if today has reading time that meets the goal
  const todaySession = sortedSessions.find(s => s.date === today);
  if (!todaySession || Math.floor(todaySession.timeRead / 60) < goalMinutes) {
    return 0; // Streak is broken if today doesn't meet the goal
  }
  
  // Count consecutive days with goal met
  const goalSeconds = goalMinutes * 60;
  for (let i = 0; i < sortedSessions.length; i++) {
    const session = sortedSessions[i];
    const expectedDate = new Date();
    expectedDate.setDate(expectedDate.getDate() - i);
    const expectedDateStr = expectedDate.toISOString().split('T')[0];
    
    if (session.date === expectedDateStr && session.timeRead >= goalSeconds) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
};

export default ReadingStats;

