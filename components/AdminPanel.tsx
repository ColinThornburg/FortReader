import React, { useState, useEffect } from 'react';
import type { AdminSkinData } from '../types';
import { Rarity } from '../types';
import Button from './common/Button';
import * as firebaseService from '../services/firebaseService';
import UserManagement from './UserManagement';

interface AdminPanelProps {
  onBack: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onBack }) => {
  const [adminSkins, setAdminSkins] = useState<AdminSkinData[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSkin, setEditingSkin] = useState<AdminSkinData | null>(null);
  const [showUserManagement, setShowUserManagement] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    rarity: Rarity.Common,
    cost: 250,
    imageUrl: '',
    isActive: true
  });

  // File upload state
  const [uploadMethod, setUploadMethod] = useState<'url' | 'file'>('file');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string>('');

  useEffect(() => {
    loadAdminSkins();
  }, []);

  const loadAdminSkins = async () => {
    try {
      const skins = await firebaseService.getAdminSkins();
      setAdminSkins(skins);
    } catch (error) {
      console.error('Error loading admin skins:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      rarity: Rarity.Common,
      cost: 250,
      imageUrl: '',
      isActive: true
    });
    setEditingSkin(null);
    setShowAddForm(false);
    setUploadMethod('file');
    setIsUploading(false);
    setUploadedFileName('');
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file!');
      return;
    }

    // Validate file size (max 2MB)
    const maxSize = 2 * 1024 * 1024; // 2MB in bytes
    if (file.size > maxSize) {
      alert('Image file is too large! Please choose a file smaller than 2MB.');
      return;
    }

    setIsUploading(true);

    try {
      // Upload to Firebase Storage
      const timestamp = Date.now();
      const fileName = `admin-skins/${timestamp}-${file.name}`;
      const downloadURL = await firebaseService.uploadImage(file, fileName);
      
      setFormData({ ...formData, imageUrl: downloadURL });
      setUploadedFileName(file.name);
      setIsUploading(false);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file. Please try again.');
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.imageUrl.trim()) {
      alert('Name and Image URL are required!');
      return;
    }

    try {
      const skinData: AdminSkinData = {
        id: editingSkin?.id || `admin_skin_${Date.now()}`,
        name: formData.name.trim(),
        description: formData.description.trim(),
        rarity: formData.rarity,
        cost: Math.max(0, formData.cost),
        imageUrl: formData.imageUrl.trim(),
        isActive: formData.isActive,
        createdAt: editingSkin?.createdAt || Date.now()
      };

      await firebaseService.saveAdminSkin(skinData);
      await loadAdminSkins();
      resetForm();
    } catch (error) {
      console.error('Error saving admin skin:', error);
      alert('Error saving skin. Please try again.');
    }
  };

  const handleEdit = (skin: AdminSkinData) => {
    setFormData({
      name: skin.name,
      description: skin.description || '',
      rarity: skin.rarity,
      cost: skin.cost,
      imageUrl: skin.imageUrl,
      isActive: skin.isActive
    });
    // Determine upload method based on existing image URL (Firebase URLs vs external URLs)
    setUploadMethod(skin.imageUrl.includes('firebasestorage.googleapis.com') ? 'file' : 'url');
    setEditingSkin(skin);
    setShowAddForm(true);
  };

  const handleDelete = async (skinId: string) => {
    if (confirm('Are you sure you want to delete this skin?')) {
      try {
        await firebaseService.deleteAdminSkin(skinId);
        await loadAdminSkins();
      } catch (error) {
        console.error('Error deleting admin skin:', error);
        alert('Error deleting skin. Please try again.');
      }
    }
  };

  const toggleActive = async (skin: AdminSkinData) => {
    try {
      const updatedSkin = { ...skin, isActive: !skin.isActive };
      await firebaseService.saveAdminSkin(updatedSkin);
      await loadAdminSkins();
    } catch (error) {
      console.error('Error updating admin skin:', error);
      alert('Error updating skin. Please try again.');
    }
  };

  const rarityColors = {
    [Rarity.Common]: 'text-gray-300',
    [Rarity.Rare]: 'text-blue-300',
    [Rarity.Epic]: 'text-purple-400',
    [Rarity.Legendary]: 'text-orange-400',
    [Rarity.Custom]: 'text-teal-300'
  };

  return (
    <div className="bg-black/30 p-8 rounded-2xl shadow-2xl border border-red-500/30 max-w-6xl mx-auto animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-4xl font-display text-red-400 drop-shadow-md">Admin Panel</h2>
        <Button onClick={onBack} variant="secondary">Back to Game</Button>
      </div>

      {/* User Management Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold text-yellow-300">User Management</h3>
          <Button 
            onClick={() => setShowUserManagement(!showUserManagement)} 
            variant="primary"
          >
            {showUserManagement ? 'Hide User Management' : 'Manage Users'}
          </Button>
        </div>
        
        {showUserManagement && (
          <UserManagement onBack={() => setShowUserManagement(false)} />
        )}
      </div>

      {/* Skin Management Section */}
      <div className="mb-6">
        <Button 
          onClick={() => setShowAddForm(!showAddForm)} 
          variant="primary"
          className="mb-4"
        >
          {showAddForm ? 'Cancel' : 'Add New Skin'}
        </Button>

        {showAddForm && (
          <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-600 mb-6">
            <h3 className="text-2xl font-bold text-white mb-4">
              {editingSkin ? 'Edit Skin' : 'Add New Skin'}
            </h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-200 mb-2">Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full p-3 bg-slate-700 border border-slate-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Skin name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-200 mb-2">Cost (RP) *</label>
                <input
                  type="number"
                  value={formData.cost}
                  onChange={(e) => setFormData({...formData, cost: parseInt(e.target.value) || 0})}
                  className="w-full p-3 bg-slate-700 border border-slate-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  min="0"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-200 mb-2">Rarity</label>
                <select
                  value={formData.rarity}
                  onChange={(e) => setFormData({...formData, rarity: e.target.value as Rarity})}
                  className="w-full p-3 bg-slate-700 border border-slate-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  {Object.values(Rarity).map(rarity => (
                    <option key={rarity} value={rarity}>{rarity}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center">
                <label className="flex items-center text-slate-200">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                    className="mr-2"
                  />
                  Active in Store
                </label>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-200 mb-2">Image *</label>
                
                {/* Upload method selector */}
                <div className="flex gap-4 mb-4">
                  <button
                    type="button"
                    onClick={() => setUploadMethod('file')}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      uploadMethod === 'file' 
                        ? 'bg-red-600 text-white' 
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    📁 Upload File
                  </button>
                  <button
                    type="button"
                    onClick={() => setUploadMethod('url')}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      uploadMethod === 'url' 
                        ? 'bg-red-600 text-white' 
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    🔗 Use URL
                  </button>
                </div>

                {/* File upload */}
                {uploadMethod === 'file' ? (
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="w-full p-3 bg-slate-700 border border-slate-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-red-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                      disabled={isUploading}
                    />
                    {isUploading && (
                      <div className="mt-2 text-yellow-400">
                        📤 Uploading image...
                      </div>
                    )}
                    {uploadedFileName && !isUploading && (
                      <div className="mt-2 text-green-400 text-sm">
                        ✅ Uploaded: {uploadedFileName}
                      </div>
                    )}
                    <div className="mt-2 text-xs text-slate-400">
                      Supported: JPG, PNG, GIF, WebP • Max size: 2MB
                    </div>
                  </div>
                ) : (
                  /* URL input */
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                    className="w-full p-3 bg-slate-700 border border-slate-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="https://example.com/image.jpg"
                    required
                  />
                )}

                {/* Image preview */}
                {formData.imageUrl && (
                  <div className="mt-4">
                    <p className="text-sm text-slate-300 mb-2">Preview:</p>
                    <img 
                      src={formData.imageUrl} 
                      alt="Preview" 
                      className="w-32 h-32 object-cover rounded border-2 border-slate-500 shadow-lg"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-200 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full p-3 bg-slate-700 border border-slate-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  rows={3}
                  placeholder="Optional description"
                />
              </div>

              <div className="md:col-span-2 flex gap-4">
                <Button 
                  type="submit" 
                  variant="primary" 
                  disabled={isUploading || !formData.imageUrl.trim()}
                >
                  {isUploading ? 'Uploading...' : editingSkin ? 'Update Skin' : 'Add Skin'}
                </Button>
                <Button type="button" onClick={resetForm} variant="secondary">
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>

      <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-600">
        <h3 className="text-2xl font-bold text-white mb-4">Manage Store Items ({adminSkins.length})</h3>
        
        {adminSkins.length === 0 ? (
          <p className="text-slate-400 text-center py-8">No admin skins created yet. Add your first skin above!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {adminSkins.map(skin => (
              <div key={skin.id} className="bg-slate-700/50 p-4 rounded-lg border border-slate-600">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-lg font-bold text-white truncate">{skin.name}</h4>
                  <span className={`text-xs px-2 py-1 rounded ${skin.isActive ? 'bg-green-600' : 'bg-gray-600'}`}>
                    {skin.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                
                <img 
                  src={skin.imageUrl} 
                  alt={skin.name}
                  className="w-full h-32 object-cover rounded mb-2"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://api.dicebear.com/7.x/bottts-neutral/svg?seed=' + skin.name;
                  }}
                />
                
                <div className="text-sm text-slate-300 mb-3">
                  <p className={rarityColors[skin.rarity]}>{skin.rarity}</p>
                  <p className="text-yellow-300 font-bold">{skin.cost.toLocaleString()} RP</p>
                  {skin.description && <p className="text-xs mt-1 opacity-75">{skin.description}</p>}
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={() => handleEdit(skin)} 
                    variant="secondary" 
                    size="small"
                    className="flex-1"
                  >
                    Edit
                  </Button>
                  <Button 
                    onClick={() => toggleActive(skin)} 
                    variant={skin.isActive ? "secondary" : "primary"} 
                    size="small"
                    className="flex-1"
                  >
                    {skin.isActive ? 'Hide' : 'Show'}
                  </Button>
                  <Button 
                    onClick={() => handleDelete(skin.id)} 
                    variant="secondary" 
                    size="small"
                    className="text-red-400 hover:text-red-300"
                  >
                    Del
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
