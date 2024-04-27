import {useState, useEffect} from 'react';
import {getAuth, onAuthStateChanged} from 'firebase/auth';
import firebaseApp, {auth} from '../FirebaseAuth';


const useAuth = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        console.log("Setting up auth state change listener...");
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in
                console.log("User is already authenticated:", user);
                setIsLoggedIn(true);
            } else {
                // User is signed out
                console.log("User is not authenticated.");
                setIsLoggedIn(false);
            }
        });

        // Clean up the observer on component unmount
        return () => {
            console.log("Cleaning up auth state change listener...");
            unsubscribe();
        };
    }, []);
    const handleLogin = () => {
        setIsLoggedIn(true);
        localStorage.setItem('isLoggedIn', 'true');
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        localStorage.removeItem('isLoggedIn');
    };

    return {isLoggedIn, setIsLoggedIn, handleLogin, handleLogout};
};

export default useAuth;
