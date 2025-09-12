import type { User, AdminSkinData } from '../types';

const USERS_KEY = 'fortReaderUsers';
const CURRENT_USER_KEY = 'fortReaderCurrentUser';
const ADMIN_SKINS_KEY = 'fortReaderAdminSkins';

// Helper to get all users from localStorage
const getUsers = (): Record<string, User> => {
  try {
    const usersJson = localStorage.getItem(USERS_KEY);
    return usersJson ? JSON.parse(usersJson) : {};
  } catch (error) {
    console.error("Failed to parse users from localStorage", error);
    return {};
  }
};

// Helper to save all users to localStorage
const saveUsers = (users: Record<string, User>): void => {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch (error) {
    console.error("Failed to save users to localStorage", error);
  }
};

// --- Public API ---

/**
 * Retrieves a specific user's data.
 * @param username The username to look up.
 * @returns The user data or null if not found.
 */
export const getUserData = (username: string): User | null => {
  const users = getUsers();
  return users[username] || null;
};

/**
 * Saves a specific user's data.
 * @param username The username to save data for.
 * @param data The user data object.
 */
export const saveUserData = (username: string, data: User): void => {
  const users = getUsers();
  users[username] = data;
  saveUsers(users);
};

/**
 * Gets the username of the currently logged-in user.
 * @returns The username or null.
 */
export const getCurrentUser = (): string | null => {
  return localStorage.getItem(CURRENT_USER_KEY);
};

/**
 * Sets the currently logged-in user.
 * @param username The username to set as current.
 */
export const setCurrentUser = (username: string): void => {
  localStorage.setItem(CURRENT_USER_KEY, username);
};

/**
 * Clears the currently logged-in user session.
 */
export const clearCurrentUser = (): void => {
  localStorage.removeItem(CURRENT_USER_KEY);
};

// Admin skin management functions
export const getAdminSkins = (): AdminSkinData[] => {
  try {
    const skinsJson = localStorage.getItem(ADMIN_SKINS_KEY);
    return skinsJson ? JSON.parse(skinsJson) : [];
  } catch (error) {
    console.error('Error loading admin skins:', error);
    return [];
  }
};

export const saveAdminSkin = (skin: AdminSkinData): void => {
  try {
    const skins = getAdminSkins();
    const existingIndex = skins.findIndex(s => s.id === skin.id);
    
    if (existingIndex >= 0) {
      skins[existingIndex] = skin;
    } else {
      skins.push(skin);
    }
    
    localStorage.setItem(ADMIN_SKINS_KEY, JSON.stringify(skins));
  } catch (error) {
    console.error('Error saving admin skin:', error);
  }
};

export const deleteAdminSkin = (skinId: string): void => {
  try {
    const skins = getAdminSkins();
    const filteredSkins = skins.filter(s => s.id !== skinId);
    localStorage.setItem(ADMIN_SKINS_KEY, JSON.stringify(filteredSkins));
  } catch (error) {
    console.error('Error deleting admin skin:', error);
  }
};

export const getActiveAdminSkins = (): AdminSkinData[] => {
  return getAdminSkins().filter(skin => skin.isActive);
};
