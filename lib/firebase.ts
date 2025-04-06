import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: Constants.expoConfig?.extra?.FIREBASE_API_KEY || "your-api-key", 
  authDomain: Constants.expoConfig?.extra?.FIREBASE_AUTH_DOMAIN || "your-auth-domain",
  projectId: Constants.expoConfig?.extra?.FIREBASE_PROJECT_ID || "your-project-id",
  storageBucket: Constants.expoConfig?.extra?.FIREBASE_STORAGE_BUCKET || "your-storage-bucket",
  messagingSenderId: Constants.expoConfig?.extra?.FIREBASE_MESSAGING_SENDER_ID || "your-messaging-sender-id",
  appId: Constants.expoConfig?.extra?.FIREBASE_APP_ID || "your-app-id",
  measurementId: Constants.expoConfig?.extra?.FIREBASE_MEASUREMENT_ID || "your-measurement-id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Use standard auth for now, we'll add persistence in a later PR
// This avoids errors during development but will require user to login each time
const auth = getAuth(app);

// Note for future improvement:
// To properly implement persistence we need to use:
// import { initializeAuth, getReactNativePersistence } from 'firebase/auth/react-native';
// const auth = initializeAuth(app, {
//   persistence: getReactNativePersistence(AsyncStorage)
// });

const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { auth, db, googleProvider }; 