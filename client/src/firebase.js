
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCWTxkgcyJrqzabhi5TjKfFD8Sr02XZl-Q",
  authDomain: "socialex-85cb3.firebaseapp.com",
  projectId: "socialex-85cb3",
  storageBucket: "socialex-85cb3.appspot.com",
  messagingSenderId: "682531867137",
  appId: "1:682531867137:web:b9e07d8af4bcad5ba64e00"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage();