import React, {useState, useEffect} from 'react';
import {BrowserRouter as Router, Route, Routes, Navigate} from 'react-router-dom';
import './App.css';
import LeftNav from './components/LeftNav/LeftNav';
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import SignInWithGoogleButton from "./components/Login/Login";
import {getAuth, onAuthStateChanged} from "firebase/auth";
import firebaseApp from "./FirebaseAuth";
import useAuth from '../src/modules/auth';
import useContentGeneration from './modules/contentGeneration';
import UserInfo from '../src/components/UserInfo';
import LoadingIcon from '../src/components/LoadingIcon';


const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} = require("@google/generative-ai");

const MODEL_NAME = "gemini-1.0-pro";
const API_KEY = "AIzaSyCPyHYwuoKPaUpA3HUo_h8ejIUPJagjDng";

const App = () => {
    const auth = getAuth(firebaseApp);
    const {isLoggedIn, handleLogin, setIsLoggedIn, handleLogout} = useAuth();
    // const {isLoggedIn, handleLogin, handleLogout} = auth;
    const [collapsed, setCollapsed] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const [genAI, setGenAI] = useState(null);
    const [numFlashcards, setNumFlashcards] = useState(10);
    const [chat, setChat] = useState(null);
    const [links, setLinks] = useState(['']);
    const [timer, setTimer] = useState(20);
    const [answersToValidate, setAnswersToValidate] = useState([]);
    const [questionType, setQuestionType] = useState([]);
    const {content, summary, loading, handleContentGeneration} = useContentGeneration(genAI, chat);


    // useEffect(() => {
    //     const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    // }, []);


    const handleRedirectAfterAuth = () => {
        const currentUrl = new URL(window.location.href);
        console.log("currentUrl:",currentUrl)
        console.log("Auth:" , auth)

        const isRedirectedFromAuth = true;
        console.log('isRedirectedFromAuth:', isRedirectedFromAuth); // Debug log

        if (isRedirectedFromAuth) {
            setIsLoggedIn(true);
            window.history.replaceState(null, null, '/app');
            console.log('Redirected after authentication'); // Debug log
        }
    };

    useEffect(() => {
        handleRedirectAfterAuth();
        const genAIInstance = new GoogleGenerativeAI(API_KEY);
        setGenAI(genAIInstance);
        setChat(
            genAIInstance
                .getGenerativeModel({model: MODEL_NAME})
                .startChat({
                    generationConfig: {
                        temperature: 0.9,
                        topK: 1,
                        topP: 1,
                        maxOutputTokens: 2048,
                    },
                    safetySettings: [
                        {
                            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
                        },
                        {
                            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
                        },
                        {
                            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
                        },
                        {
                            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
                        },
                    ],
                    history: [],
                })
        );

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in
                setIsLoggedIn(true);
            } else {
                // User is signed out
                setIsLoggedIn(false);
            }
        });

        // Clean up the observer on component unmount
        return () => unsubscribe();
    }, [auth, setIsLoggedIn]);

    const contentGeneration = useContentGeneration(genAI, chat, setNumFlashcards);

    const toggleCollapse = () => {
        setCollapsed(!collapsed);
        document.querySelector('.left-nav').classList.toggle('collapsed');
        document.querySelector('.content-area').classList.toggle('collapsed');
    };

    const handleAddLink = () => {
        setLinks([...links, '']);
    };

    const handleLinkChange = (index, value) => {
        const newLinks = [...links];
        newLinks[index] = value;
        setLinks(newLinks);
    };

    return (
        <Router>
            <div className="app-container">
                <Header className="header"/>
                <Routes>
                    <Route path="/login" element={<SignInWithGoogleButton onLogin={handleLogin}/>}/>
                    <Route
                        path="/app"
                        element={
                            isLoggedIn ? (
                                <>
                                    <button className="expand-button" onClick={toggleCollapse}>
                                        {collapsed ? 'Expand Navigation' : 'Collapse Navigation'}
                                    </button>
                                    <div className="main-content">
                                        <LeftNav
                                            collapsed={collapsed}
                                            toggleCollapse={toggleCollapse}
                                            handleContentGeneration={contentGeneration.handleContentGeneration}
                                            links={links}
                                            handleAddLink={handleAddLink}
                                            handleLinkChange={handleLinkChange}
                                            selectedOption={selectedOption}
                                            setSelectedOption={setSelectedOption}
                                            numFlashcards={numFlashcards}
                                            setNumFlashcards={setNumFlashcards}
                                            timer={timer}
                                            setTimer={setTimer}
                                            questionType={questionType}
                                            setQuestionType={setQuestionType}
                                        />
                                        <div className={`content-area${collapsed ? ' collapsed' : ''}`}>
                                            {contentGeneration.loading ? (
                                                <LoadingIcon/>
                                            ) : (
                                                <>
                                                    {selectedOption && <h1>{selectedOption} Content</h1>}
                                                    {contentGeneration.content}
                                                    {!selectedOption && contentGeneration.summary && <div></div>}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <Footer className="footer"/>
                                </>
                            ) : (
                                <Navigate to="/login" replace/>
                            )
                        }
                    />
                </Routes>
            </div>
        </Router>
    );
};

export default App;