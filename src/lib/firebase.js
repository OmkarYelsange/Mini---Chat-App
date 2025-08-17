import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "react-chat-app-f973b.firebaseapp.com",
  projectId: "react-chat-app-f973b",
  storageBucket: "react-chat-app-f973b.firebasestorage.app",
  messagingSenderId: "129784231307",
  appId: "1:129784231307:web:463e618331b0312d14ab8e",
  measurementId: "G-F9P24V5GSE",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore();
