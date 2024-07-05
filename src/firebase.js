// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCqU012ta4bj_gTH7Q4qiYoRezwkICrybM",
  authDomain: "webs-7101e.firebaseapp.com",
  projectId: "webs-7101e",
  storageBucket: "webs-7101e.appspot.com",
  messagingSenderId: "1067520682005",
  appId: "1:1067520682005:web:7cc40d54d94f62a7bd861c",
  measurementId: "G-8R6LK9R996"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore();
