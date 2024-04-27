import React from 'react';
import {getAuth, GoogleAuthProvider, signInWithPopup, signOut} from 'firebase/auth';
import firebaseApp from '../../FirebaseAuth';
import './Login.css';
import {useNavigate} from 'react-router-dom';

const SignInWithGoogleButton = ({onLogin}) => {
    const navigate = useNavigate();
    const signInWithGoogle = async () => {
        const auth = getAuth(firebaseApp);
        const provider = new GoogleAuthProvider();

        try {
            await signInWithPopup(auth, provider);
            onLogin(); // Call the onLogin callback after successful authentication
            // localStorage.setItem('isLoggedIn', 'true');
            console.log('Logged in successfully');
            navigate('/app');
        } catch (error) {
            console.error('Error signing in with Google:', error);
        }
    };

    const handleSignOut = async () => {
        const auth = getAuth(firebaseApp);
        try {
            await signOut(auth);
            console.log('Logged out successfully')
            navigate('/login');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    return (
        <div className="container">
            <h1>Sign In with Google</h1>
            <button onClick={signInWithGoogle} className="sign-in-btn">Sign In</button>
            <button onClick={handleSignOut} className="sign-out-btn">Sign Out</button>
        </div>
    );
};

export default SignInWithGoogleButton;
