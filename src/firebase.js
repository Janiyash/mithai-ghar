import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyDtm5_ivoLWEXi1cUI0Po8oyOC7Ku57qDw",
  authDomain: "mithai-ghar.firebaseapp.com",
  projectId: "mithai-ghar",
  storageBucket: "mithai-ghar.firebasestorage.app",
  messagingSenderId: "858653867596",
  appId: "1:858653867596:web:4f63d5f63244487c937ee9"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);