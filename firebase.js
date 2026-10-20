import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { addDoc, collection, deleteDoc, doc, getDocs, getFirestore, orderBy, query, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
import { firebaseConfig } from './firebase-config.js';

export const isFirebaseConfigured = Object.values(firebaseConfig).every((value) =>
  typeof value === 'string' && value.length > 0 && !value.includes('YOUR_')
);

export const app = isFirebaseConfigured ? initializeApp(firebaseConfig) : null;
export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;
export { addDoc, collection, deleteDoc, doc, getDocs, onAuthStateChanged, orderBy, query, serverTimestamp, signInWithEmailAndPassword, signOut };
