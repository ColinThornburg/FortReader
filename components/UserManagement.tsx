import React, { useState, useEffect } from 'react';
import type { User } from '../types';
import * as firebaseService from '../services/firebaseService';
import Button from './common/Button';
import LoadingSpinner from './common/LoadingSpinner';

interface UserManagementProps {
  onBack: () => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ onBack }) => {
  const [users, setUsers] = useState<(User & { uid: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<(User & { uid: string }) | null>(null);
  const [editForm, setEditForm] = useState({
    readingPoints: 0,
    totalTimeRead: 0,
    generationsToday: 0,
    totalGenerationsAvailable: 0,
    dailyGoalMinutes: 15
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const allUsers = await firebaseService.getAllUsers();
      setUsers(allUsers as (User & { uid: string })[]);
    } catch (error) {
      console.error('Error loading users:', error);
      alert('Error loading users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user: User & { uid: string }) => {
    setEditingUser(user);
    setEditForm({
      readingPoints: user.readingPoints,
      totalTimeRead: user.totalTimeRead,
      generationsToday: user.skinGenerationData?.generationsToday || 0,
      totalGenerationsAvailable: user.skinGenerationData?.totalGenerationsAvailable || 0,
      dailyGoalMinutes: user.readingStats?.dailyGoalMinutes || 15
    });
  };

  const handleSaveUser = async () => {
    if (!editingUser) return;

    try {
      setSaving(true);
      
      // Update user data
      const updatedUserData: Partial<User> = {
        readingPoints: editForm.readingPoints,
        totalTimeRead: editForm.totalTimeRead,
        skinGenerationData: {
          ...editingUser.skinGenerationData,
          generationsToday: editForm.generationsToday,
          totalGenerationsAvailable: editForm.totalGenerationsAvailable,
          lastGenerationTime: editingUser.skinGenerationData?.lastGenerationTime || 0,
          dailyResetTime: editingUser.skinGenerationData?.dailyResetTime || Date.now(),
          readingTimeUsedForGeneration: editingUser.skinGenerationData?.readingTimeUsedForGeneration || 0
        },
        readingStats: {
          ...editingUser.readingStats,
          dailyGoalMinutes: editForm.dailyGoalMinutes,
          todayValidatedTime: editingUser.readingStats?.todayValidatedTime || 0,
          lastReadingDate: editingUser.readingStats?.lastReadingDate || new Date().toISOString().split('T')[0],
          readingSessions: editingUser.readingStats?.readingSessions || []
        }
      };

      await firebaseService.updateUserData(editingUser.uid, updatedUserData);
      
      // Update local state
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.uid === editingUser.uid 
            ? { ...user, ...updatedUserData }
            : user
        )
      );

      setEditingUser(null);
      alert('User data updated successfully!');
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Error updating user. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${remainingSeconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    } else {
      return `${remainingSeconds}s`;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-600">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-yellow-300">
          👥 User Management
        </h3>
        <Button onClick={onBack} variant="secondary">
          ← Back to Admin Panel
        </Button>
      </div>

      {/* Users List */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-600">
                  <th className="pb-3 text-yellow-300 font-semibold">Username</th>
                  <th className="pb-3 text-yellow-300 font-semibold">Points</th>
                  <th className="pb-3 text-yellow-300 font-semibold">Total Time</th>
                  <th className="pb-3 text-yellow-300 font-semibold">Generations Today</th>
                  <th className="pb-3 text-yellow-300 font-semibold">Total Available</th>
                  <th className="pb-3 text-yellow-300 font-semibold">Daily Goal</th>
                  <th className="pb-3 text-yellow-300 font-semibold">Admin</th>
                  <th className="pb-3 text-yellow-300 font-semibold">Actions</th>
                </tr>
              </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.uid} className="border-b border-slate-700 hover:bg-slate-700/30">
                <td className="py-3 text-white font-medium">{user.username}</td>
                <td className="py-3 text-yellow-400">{user.readingPoints.toLocaleString()}</td>
                <td className="py-3 text-blue-400">{formatTime(user.totalTimeRead)}</td>
                <td className="py-3 text-green-400">{user.skinGenerationData?.generationsToday || 0}</td>
                <td className="py-3 text-orange-400">{user.skinGenerationData?.totalGenerationsAvailable || 0}</td>
                <td className="py-3 text-purple-400">{user.readingStats?.dailyGoalMinutes || 15}m</td>
                <td className="py-3">
                  {user.isAdmin ? (
                    <span className="text-red-400 font-bold">ADMIN</span>
                  ) : (
                    <span className="text-slate-400">User</span>
                  )}
                </td>
                <td className="py-3">
                  <Button 
                    onClick={() => handleEditUser(user)} 
                    variant="primary" 
                    size="small"
                  >
                    Edit
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

        {/* Edit Modal */}
        {editingUser && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-slate-800 rounded-lg p-6 w-full max-w-md border border-purple-500/30">
              <h2 className="text-2xl font-bold text-yellow-300 mb-4">
                Edit User: {editingUser.username}
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Reading Points
                  </label>
                  <input
                    type="number"
                    value={editForm.readingPoints}
                    onChange={(e) => setEditForm(prev => ({ ...prev, readingPoints: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Total Reading Time (seconds)
                  </label>
                  <input
                    type="number"
                    value={editForm.totalTimeRead}
                    onChange={(e) => setEditForm(prev => ({ ...prev, totalTimeRead: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <p className="text-xs text-slate-400 mt-1">
                    Current: {formatTime(editingUser.totalTimeRead)}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Generations Today
                  </label>
                  <input
                    type="number"
                    value={editForm.generationsToday}
                    onChange={(e) => setEditForm(prev => ({ ...prev, generationsToday: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Total Generations Available
                  </label>
                  <input
                    type="number"
                    value={editForm.totalGenerationsAvailable}
                    onChange={(e) => setEditForm(prev => ({ ...prev, totalGenerationsAvailable: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <p className="text-xs text-slate-400 mt-1">
                    Total number of skin generations this user can perform
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Daily Goal (minutes)
                  </label>
                  <input
                    type="number"
                    value={editForm.dailyGoalMinutes}
                    onChange={(e) => setEditForm(prev => ({ ...prev, dailyGoalMinutes: parseInt(e.target.value) || 15 }))}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button 
                  onClick={handleSaveUser} 
                  variant="primary" 
                  disabled={saving}
                  className="flex-1"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button 
                  onClick={() => setEditingUser(null)} 
                  variant="secondary"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default UserManagement;
