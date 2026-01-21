import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCQz0oILC1WYcVa021eQqOIYYB_vJkucDI",
  authDomain: "mememail-32495.firebaseapp.com",
  projectId: "mememail-32495",
  storageBucket: "mememail-32495.firebasestorage.app",
  messagingSenderId: "789582472436",
  appId: "1:789582472436:web:ad2dcda2ba8fd786d12aa1",
  measurementId: "G-N261E7Y9BN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export default app;