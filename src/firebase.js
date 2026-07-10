import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAQQQ8ny_R4o1g0DaF6ciIS6-Ntvaw42Eo",
  authDomain: "desh-digital-hub.firebaseapp.com",
  projectId: "desh-digital-hub",
  storageBucket: "desh-digital-hub.firebasestorage.app",
  messagingSenderId: "467371569214",
  appId: "1:467371569214:web:c23703cdb21cc68ad4e16f",
  measurementId: "G-9RQY57WPDC"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
