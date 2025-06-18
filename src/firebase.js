// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyAGVwRX8A30S-dczmhBRoeooCaXMb1Hdig",
    authDomain: "supriya-crm-c22a5.firebaseapp.com",
    projectId: "supriya-crm-c22a5",
    storageBucket: "supriya-crm-c22a5.firebasestorage.app",
    messagingSenderId: "770032179972",
    appId: "1:770032179972:web:a4e80e02cf1c4b418d4e51",
    measurementId: "G-0B0CWVFXQT"
  };

  const app = initializeApp(firebaseConfig);
  export const auth = getAuth(app);
export default app;