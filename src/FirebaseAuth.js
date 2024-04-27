// Import the functions you need from the SDKs you need
import {initializeApp} from "firebase/app";
import {getAnalytics} from "firebase/analytics";
import {getAuth, setPersistence, browserSessionPersistence, onAuthStateChanged} from 'firebase/auth';
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
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const analytics = getAnalytics(firebaseApp);
// const firebaseApp = initializeApp(firebaseConfig);
setPersistence(auth, browserSessionPersistence)
    .then(() => {
        console.log('Session persistence set successfully');
    })
    .catch((error) => {
        console.error('Error setting persistence:', error.message);
    });

onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in.
        console.log('User is signed in:', user);
    } else {
        // User is signed out.
        console.log('User is signed out');
    }
});
export default firebaseApp;
export {auth};