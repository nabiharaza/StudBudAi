// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB0aovS14UKQaE_rkZ6rpjV5nOyzCho2pQ",
  authDomain: "studbudai-ee2c8.firebaseapp.com",
  projectId: "studbudai-ee2c8",
  storageBucket: "studbudai-ee2c8.appspot.com",
  messagingSenderId: "808757807333",
  appId: "1:808757807333:web:6cf8541006563965f9ec0c",
  measurementId: "G-G6PXPNN2SL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firebaseApp = initializeApp(firebaseConfig);
export default firebaseApp;