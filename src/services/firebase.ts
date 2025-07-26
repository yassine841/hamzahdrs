import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

// Firebase configuration - replace with your actual config
const firebaseConfig = {
  apiKey: "demo-api-key",
  authDomain: "soccer-manager-demo.firebaseapp.com",
  projectId: "soccer-manager-demo",
  storageBucket: "soccer-manager-demo.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdefghijklmnop"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Connect to emulators in development
if (import.meta.env.DEV && import.meta.env.VITE_USE_FIREBASE_EMULATORS !== 'false') {
  let authEmulatorConnected = false;
  let firestoreEmulatorConnected = false;
  let storageEmulatorConnected = false;

  try {
    if (!authEmulatorConnected) {
      connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
      authEmulatorConnected = true;
      console.log('Connected to Auth emulator');
    }
  } catch (error) {
    console.log('Auth emulator connection failed or already connected');
  }

  try {
    if (!firestoreEmulatorConnected) {
      connectFirestoreEmulator(db, 'localhost', 8080);
      firestoreEmulatorConnected = true;
      console.log('Connected to Firestore emulator');
    }
  } catch (error) {
    console.log('Firestore emulator connection failed or already connected');
  }

  try {
    if (!storageEmulatorConnected) {
      connectStorageEmulator(storage, 'localhost', 9199);
      storageEmulatorConnected = true;
      console.log('Connected to Storage emulator');
    }
  } catch (error) {
    console.log('Storage emulator connection failed or already connected');
  }
}

export default app;