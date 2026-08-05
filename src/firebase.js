// Firebase Initialization & Firestore Database Export for viaipipos
import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  setDoc,
  query,
  orderBy,
  serverTimestamp 
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDHR-KKjMtDJnWKuzBZcbnnjsItp6_2O84",
  authDomain: "viaipipos.firebaseapp.com",
  projectId: "viaipipos",
  storageBucket: "viaipipos.firebasestorage.app",
  messagingSenderId: "604270106206",
  appId: "1:604270106206:web:d93052fcd5b89b2c3f06cf",
  measurementId: "G-DNSTWWEZFZ"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firestore DB
export const db = getFirestore(app);

export { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  setDoc,
  query,
  orderBy,
  serverTimestamp 
};
