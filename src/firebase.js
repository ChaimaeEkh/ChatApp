import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage} from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAPpDM8P36Yfxj2XuVkD2CljMFOZYBs3Mk",
  authDomain: "chat-39355.firebaseapp.com",
  projectId: "chat-39355",
  storageBucket: "chat-39355.firebasestorage.app",
  messagingSenderId: "898919947702",
  appId: "1:898919947702:web:9cb4f37c60c284abe37517"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage(app);
export const db = getFirestore();