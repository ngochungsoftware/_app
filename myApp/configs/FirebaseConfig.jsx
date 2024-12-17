// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyAWmi4s0mI4BEJ6D1BjCKaqQ-iGDkwV82E",
//   authDomain: "buisness-directory-e6430.firebaseapp.com",
//   projectId: "buisness-directory-e6430",
//   storageBucket: "buisness-directory-e6430.appspot.com",
//   messagingSenderId: "493156074031",
//   appId: "1:493156074031:web:496e1b80f85ccac10dbcda",
//   measurementId: "G-PSDWJB1FSB"
// };

// // Initialize Firebase
// export const app = initializeApp(firebaseConfig);
// export const db = getFirestore(app);
// export const storage = getStorage(app);
// // const analytics = getAnalytics(app);


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAQ61iSJe7a8sNyPltMqwaHbWrySZN_Uqg",
  authDomain: "fashion-canth-shop.firebaseapp.com",
  projectId: "fashion-canth-shop",
  storageBucket: "fashion-canth-shop.firebasestorage.app",
  messagingSenderId: "74401189922",
  appId: "1:74401189922:web:b7d597711be2358b9b3a7b",
  measurementId: "G-5LW9L301MW"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);