import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC8shUpsDypJaEjsDNKELPorQeCTn6HiI8",
  authDomain: "edumusic-458fa.firebaseapp.com",
  projectId: "edumusic-458fa",
  storageBucket: "edumusic-458fa.firebasestorage.app",
  messagingSenderId: "1069275799024",
  appId: "1:1069275799024:web:3f23573fba67be13e15135",
  measurementId: "G-XRXSTWKH1L",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);