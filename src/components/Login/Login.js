import React from 'react';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import firebaseApp from '../../FirebaseAuth'
import './Login.css';

const SignInWithGoogleButton = ({ onLogin }) => {
  const signInWithGoogle = async () => {
    const auth = getAuth(firebaseApp);
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      onLogin(); // Call the onLogin callback after successful authentication
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  return (
    <div className="container">
      <h1>Sign In with Google</h1>
      <button onClick={signInWithGoogle}>Sign In</button>
    </div>
  );
};

export default SignInWithGoogleButton;
