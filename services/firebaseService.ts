import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser 
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  getDocs, 
  deleteDoc,
  query,
  where 
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { auth, db, storage } from './firebase';
import type { User, AdminSkinData } from '../types';

// Auth functions
export const signUp = async (email: string, password: string, userData: Omit<User, 'username'> & { username: string }) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Save user data to Firestore
    await setDoc(doc(db, 'users', user.uid), {
      ...userData,
      email: user.email,
      createdAt: Date.now()
    });
    
    return user;
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};

export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

export const onAuthStateChange = (callback: (user: FirebaseUser | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// User data functions
export const getUserData = async (uid: string): Promise<User | null> => {
  try {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as User;
    }
    return null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

export const saveUserData = async (uid: string, userData: User) => {
  try {
    await setDoc(doc(db, 'users', uid), {
      ...userData,
      updatedAt: Date.now()
    }, { merge: true });
  } catch (error) {
    console.error('Error saving user data:', error);
    throw error;
  }
};

// Admin skin functions
export const getAdminSkins = async (): Promise<AdminSkinData[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'adminSkins'));
    const skins: AdminSkinData[] = [];
    
    querySnapshot.forEach((doc) => {
      skins.push({ id: doc.id, ...doc.data() } as AdminSkinData);
    });
    
    return skins.sort((a, b) => b.createdAt - a.createdAt);
  } catch (error) {
    console.error('Error getting admin skins:', error);
    return [];
  }
};

export const saveAdminSkin = async (skin: AdminSkinData) => {
  try {
    await setDoc(doc(db, 'adminSkins', skin.id), {
      ...skin,
      updatedAt: Date.now()
    });
  } catch (error) {
    console.error('Error saving admin skin:', error);
    throw error;
  }
};

export const deleteAdminSkin = async (skinId: string) => {
  try {
    await deleteDoc(doc(db, 'adminSkins', skinId));
  } catch (error) {
    console.error('Error deleting admin skin:', error);
    throw error;
  }
};

export const getActiveAdminSkins = async (): Promise<AdminSkinData[]> => {
  try {
    const q = query(collection(db, 'adminSkins'), where('isActive', '==', true));
    const querySnapshot = await getDocs(q);
    const skins: AdminSkinData[] = [];
    
    querySnapshot.forEach((doc) => {
      skins.push({ id: doc.id, ...doc.data() } as AdminSkinData);
    });
    
    return skins.sort((a, b) => b.createdAt - a.createdAt);
  } catch (error) {
    console.error('Error getting active admin skins:', error);
    return [];
  }
};

// File upload functions
export const uploadImage = async (file: File, path: string): Promise<string> => {
  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

export const deleteImage = async (path: string) => {
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};



