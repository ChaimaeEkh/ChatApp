// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBeZz3-pi8WukKT8ubQYVFgA_RVR1hDPAw",
  authDomain: "chatapp-7a385.firebaseapp.com",
  projectId: "chatapp-7a385",
  storageBucket: "chatapp-7a385.firebasestorage.app",
  messagingSenderId: "634290061897",
  appId: "1:634290061897:web:87aab518eee30a55b9f598"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);