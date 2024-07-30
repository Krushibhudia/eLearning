import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyATKutdkRzckG2S8BPRd69OnGT-D_GSkT8",
  authDomain: "learn-c4310.firebaseapp.com",
  projectId: "learn-c4310",
  storageBucket: "learn-c4310.appspot.com",
  messagingSenderId: "499333116470",
  appId: "1:499333116470:web:5e437ebb9ab308a6455e97",
  measurementId: "G-T6B704RLBD",
  databaseURL: 'https://learn-c4310-default-rtdb.firebaseio.com',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const db = getFirestore(app);
const auth = getAuth(app);
const database = getDatabase(app);

// Set persistence for authentication
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error("Error setting persistence:", error);
});

export { app, auth, db, database };
