import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyB9DXMhq_zmGkdvxM2hvW8RB3ASID1wqq4",
  authDomain: "recuitwebsite-76dec.firebaseapp.com",
  projectId: "recuitwebsite-76dec",
  storageBucket: "recuitwebsite-76dec.appspot.com",
  messagingSenderId: "91066045086",
  appId: "1:91066045086:web:1552f35decb8387276e18f",
  measurementId: "G-7E6ZCFX83R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const storage = getStorage(app);

export { auth, provider, storage };