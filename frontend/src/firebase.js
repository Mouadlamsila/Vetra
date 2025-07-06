import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBgksSx89cdU2YNbSoZ-tFeFCHZVafFljI",
  authDomain: "vetra-dev.firebaseapp.com",
  projectId: "vetra-dev",
  storageBucket: "vetra-dev.firebasestorage.app",
  messagingSenderId: "70374207297",
  appId: "1:70374207297:web:d99852e63a8cb67652bbc0",
  measurementId: "G-PFTX8SNG3W"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();
// هنا ممكن تعطي client ID يدويا (نادر الاستعمال)


export { auth, googleProvider };
