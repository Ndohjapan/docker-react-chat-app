// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB3hsOfquzNZWwtUQYhdxBtoP5tj32FqTo",
  authDomain: "chat-fe948.firebaseapp.com",
  projectId: "chat-fe948",
  storageBucket: "chat-fe948.appspot.com",
  messagingSenderId: "943936788491",
  appId: "1:943936788491:web:9d47b223c381b3e27bcf0e",
  measurementId: "G-39ZV2RKPVK"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();

// Create a root reference
export const storage = getStorage();
