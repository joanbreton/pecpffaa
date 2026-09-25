import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  onSnapshot, 
  deleteDoc, 
  updateDoc,
  Firestore
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore with custom databaseId if configured
export const db: Firestore = (firebaseConfig as { firestoreDatabaseId?: string }).firestoreDatabaseId
  ? getFirestore(app, (firebaseConfig as { firestoreDatabaseId: string }).firestoreDatabaseId)
  : getFirestore(app);

export const COLLECTIONS = {
  SLIDES: 'slides',
  NEWS: 'news',
  SERVICES: 'services',
  MESSAGES: 'messages',
  USERS: 'users',
  AUDIT_LOGS: 'audit_logs'
} as const;

export { 
  app, 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  onSnapshot, 
  deleteDoc, 
  updateDoc 
};
