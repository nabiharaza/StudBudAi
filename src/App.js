import React, {useState, useEffect} from 'react';
import {BrowserRouter as Router, Route, Routes, Navigate} from 'react-router-dom';
import './App.css';
import LeftNav from './components/LeftNav/LeftNav';
import Summary from './components/Summary/Summary';
import FlashCards from "./components/FlashCards/FlashCards";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Quizes from "./components/Quizes/Quizes";
import TimedQuiz from "./components/TimedQuiz/TimedQuiz";
import TrueFalse from "./components/TrueFalse/TrueFalse";
import Mcqs from "./components/Mcqs/Mcqs";
import loadingIcon from './imgs/birdwait.gif';
import SignInWithGoogleButton from "./components/Login/Login";

const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} = require("@google/generative-ai");

const MODEL_NAME = "gemini-1.0-pro";
const API_KEY = "AIzaSyCPyHYwuoKPaUpA3HUo_h8ejIUPJagjDng";

const App = () => {
    const [content, setContent] = useState(null);
    const [collapsed, setCollapsed] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const [genAI, setGenAI] = useState(null);
    const [summary, setSummary] = useState('');
    const [numFlashcards, setNumFlashcards] = useState(10);
    const [chat, setChat] = useState(null);
    const [loading, setLoading] = useState(false);
    const [links, setLinks] = useState(['']);
    const [isLoggedIn, setIsLoggedIn] = useState(false); // State to manage authentication
    const [timer, setTimer] = useState(20);
    const [questionType, setQuestionType] = useState([])
    const [answersToValidate, setAnswersToValidate] = useState([])

        const handleLogin = () => {
            setIsLoggedIn(true); // Update authentication state on successful login
        };

        useEffect(() => {
            const handleRedirectAfterAuth = () => {
                const currentUrl = new URL(window.location.href);
                const isRedirectedFromAuth = currentUrl.searchParams.has('authUser');

                if (isRedirectedFromAuth) {
                    setIsLoggedIn(true);
                    window.history.replaceState(null, null, '/');
                }
            };

            handleRedirectAfterAuth();

            const genAIInstance = new GoogleGenerativeAI(API_KEY);
            setGenAI(genAIInstance);
            setChat(genAIInstance.getGenerativeModel({model: MODEL_NAME}).startChat({
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
            }));
        }, []);

        const toggleCollapse = () => {
            setCollapsed(!collapsed);
            document.querySelector('.left-nav').classList.toggle('collapsed');
            document.querySelector('.content-area').classList.toggle('collapsed');
        };

    const handleContentGeneration = async (option, links, numFlashcards, timer, questionType) => {
        try {
            console.log("Generating content...");
            let prompt;
            switch (option?.toLowerCase()) {
                case 'summary':
                    prompt = `Read this links: ${links} and provide a summary`;
                    break;
                case 'flashcards':
                    prompt = `Read this links: ${links} and provide ${numFlashcards} flashcards in the following format:

**Front of Flashcard:**
<front content>

**Back of Flashcard:**
<back content>

Separate each flashcard with a blank line.`;

                    break;
                    case 'quizzes':
                        prompt = `Read these links: ${links.join(', ')} and provide ${numFlashcards} quizzes questions`;
                        break;
                    case 'timedquiz':
                        prompt = `Read this links: ${links.join(', ')} and provide quiz questions with a mix of only (${questionType}) question types, Number of questions = ${Math.round(timer/2)} (The quiz question numbers should not repeat.).
                        Make sure there is no gap between question and display like this **Question {question number}:** [without any extra line] {question type} and in the next line give the actual question. After the actual question, next line
**Answer:** {question type} and in the next line give the actual answer. Add new line before next question.  In case of MCQs after the actual question give options in the next line like  
(a) x
(b) y
(c) z
(d) a
And then in the next line after options, give the answer in this format - **Answer:** {question type} and in the next line give the actual answer. Please ensure Number of questions returned is at max ${Math.round(timer/2)} questions.`;
                        break;
                case 'truefalse':
                    prompt = `Read these links: ${links.join(', ')} and provide ${numFlashcards} true false questions`;
                    break;
                case 'mcqs':
                    prompt = `Read these links: ${links.join(', ')} and provide ${numFlashcards} multiple choice questions and give its answers below in the format: Answer to Question <answer>.Make sure there is no gap between question and display like this **Question 1:** without any extra line. Question? and in the next line options.  
(A) x
(B) y
(C) z
(D) a
**Answer: A**`;
                    break;
                case 'validateAnswer':
                    prompt = `Provided is a list of answers that need validation. ${answersToValidate}. Please help validate if the userAnswer matches the correctAnswer and return the response in the same format with correctness score out of 10 and improvements if any`;
                    break;
                default:
                    console.error("Invalid option selected.");
                    return;
                }

                console.log("Sending request to GenAI with prompt:", prompt);
                const result = await chat.sendMessage(prompt);
                const response = result.response;
                console.log("Generated Content:", response.text());
                console.log("PDF has been accepted");

                switch (option?.toLowerCase()) {
                    case 'summary':
                        setSummary(response.text());
                        setContent(<div><Summary text={response.text()}/></div>);
                        break;
                    case 'flashcards':
                        setContent(<div><FlashCards text={response.text()}/></div>);
                        break;
                    case 'timedquiz':
                        setContent(<div><TimedQuiz text={response.text()} timer={timer} setAnswersToValidate={setAnswersToValidate}/></div>);
                        break;
                    case 'quizzes':
                        setContent(<div><Quizes text={response.text()}/></div>);
                        break;
                    case 'truefalse':
                        setContent(<div><TrueFalse text={response.text()}/></div>);
                        break;
                    case 'mcqs':
                        setContent(<div><Mcqs text={response.text()}/></div>);
                        break;
                }
            } catch (error) {
                console.error("Error generating content:", error);
            } finally {
                setLoading(false); // Set loading to false when content generation is complete
            }
        };

        const handleAddLink = () => {
            setLinks([...links, '']);
        };

        const handleDeleteLink = (index, value) => {
            const newLinks = [...links];
            newLinks.splice(index, 1);
            setLinks(newLinks);
        };

        if (!isLoggedIn) {
            return (
                <div className="app-container">
                    <Header className="header"/>
                    <div className="main-content">
                        <div className="login">
                            <SignInWithGoogleButton onLogin={handleLogin}/> {/* Pass the handleLogin function */}
                        </div>
                    </div>
                    <Footer className="footer"/>
                </div>
            );
        }
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
                        <Route path="/" element={isLoggedIn ? (
                            <>
                                <button className="expand-button" onClick={toggleCollapse}>
                                    {collapsed ? "Expand Navigation" : "Collapse Navigation"}
                                </button>
                                <div className="main-content">
                                    <LeftNav
                                        collapsed={collapsed}
                                        toggleCollapse={toggleCollapse}
                                        handleContentGeneration={handleContentGeneration}
                                        links={links}
                                        handleAddLink={handleAddLink}
                                        handleDeleteLink={handleDeleteLink}
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
                                        {loading ? (
                                            <div className="loading-icon">
                                                <img src={loadingIcon} alt="Loading"/>
                                            </div>
                                        ) : (
                                            <>
                                                {selectedOption && <h1>{selectedOption} Content</h1>}
                                                {content}
                                                {!selectedOption && summary && <div></div>}
                                            </>
                                        )}
                                    </div>
                                </div>
                                <Footer className="footer"/>
                            </>
                        ) : (
                            <Navigate to="/login" replace/>
                        )}/>
                    </Routes>
                </div>
            </Router>
        )
            ;
    }
;

export default App;