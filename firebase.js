// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDTlHWipstb7kkghnnFWcDdjR1ZjW3uArg",
  authDomain: "inventorymanagement-c52b9.firebaseapp.com",
  projectId: "inventorymanagement-c52b9",
  storageBucket: "inventorymanagement-c52b9.appspot.com",
  messagingSenderId: "326090319590",
  appId: "1:326090319590:web:307afe3da2470202db3d27",
  measurementId: "G-RM62ZGKTJ7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const fireStore = getFirestore(app)

export {fireStore}