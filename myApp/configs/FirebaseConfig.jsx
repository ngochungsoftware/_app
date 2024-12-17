
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAQ61iSJe7a8sNyPltMqwaHbWrySZN_Uqg",
  authDomain: "fashion-canth-shop.firebaseapp.com",
  projectId: "fashion-canth-shop",
  storageBucket: "fashion-canth-shop.firebasestorage.app",
  messagingSenderId: "74401189922",
  appId: "1:74401189922:web:b7d597711be2358b9b3a7b",
  measurementId: "G-5LW9L301MW"
};


export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);