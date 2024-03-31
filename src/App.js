import React, {useState, useEffect} from 'react';
import './App.css';
import LeftNav from './components/LeftNav/LeftNav';
import Summary from './components/Summary/Summary';
import FlashCards from "./components/FlashCards/FlashCards";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Quizes from "./components/Quizes/Quizes";
import TrueFalse from "./components/TrueFalse/TrueFalse";
import Mcqs from "./components/Mcqs/Mcqs";

const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} = require("@google/generative-ai");

const MODEL_NAME = "gemini-1.0-pro";
const API_KEY = "AIzaSyAn06BWXljPZMoFqtRrq170R0npa0OMwrs";

const App = () => {
    const [content, setContent] = useState(null);
    const [collapsed, setCollapsed] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const [genAI, setGenAI] = useState(null);
    const [summary, setSummary] = useState('');
    const [numFlashcards, setNumFlashcards] = useState(10);
    const [chat, setChat] = useState(null);

    useEffect(() => {
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

    const handleContentGeneration = async (option, link, numFlashcards) => {
        try {
            console.log("Generating content...");
            let prompt;
            if (option === 'summary') {
                prompt = `Read this link: ${link} and provide a summary`;
            } else if (option === 'flashcards') {
                prompt = `Read this link: ${link} and provide ${numFlashcards} flashcards in the following format:

**Front of Flashcard:**
<front content>

**Back of Flashcard:**
<back content>

Separate each flashcard with a blank line.`;
            } else if (option === 'quizzes') {
                prompt = `Read this link: ${link} and provide ${numFlashcards} quizzes questions`;
            } else if (option === 'truefalse') {
                prompt = `Read this link: ${link} and provide ${numFlashcards} true false questions`;
            } else if (option === 'mcqs') {
                prompt = `Read this link: ${link} and provide ${numFlashcards} multiple choice questions and give its answers below in the format: Answer to Question <answer>.Make sure there is no gap between question and its options`;
            } else {
                console.error("Invalid option selected.");
                return;
            }
            console.log("Sending request to GenAI with prompt:", prompt);
            const result = await chat.sendMessage(prompt);
            const response = result.response;
            console.log("Generated Content:", response.text());
            console.log("PDF has been accepted.");

            if (option === 'summary') {
                setSummary(response.text());
                setContent(<div><Summary text={response.text()}/></div>);
            } else if (option === 'flashcards') {
                setContent(<div><FlashCards text={response.text()}/></div>);
            } else if (option === 'quizzes') {
                setContent(<div><Quizes text={response.text()}/></div>);
            } else if (option === 'truefalse') {
                setContent(<div><TrueFalse text={response.text()}/></div>);
            } else if (option === 'mcqs') {
                setContent(<div><Mcqs text={response.text()}/></div>);
            }
        } catch (error) {
            console.error("Error generating content:", error);
        }
    };

    return (
        <div className="app-container">
            <Header className="header"/>
            <button className="expand-button" onClick={toggleCollapse}>
                {collapsed ? "Expand Navigation" : "Collapse Navigation"}
            </button>
            <div className="main-content">
                <LeftNav
                    collapsed={collapsed}
                    toggleCollapse={toggleCollapse}
                    handleContentGeneration={handleContentGeneration}
                />
                <div className={`content-area${collapsed ? ' collapsed' : ''}`}>
                    {selectedOption && <h1>{selectedOption} Content</h1>}
                    {content}
                    {!selectedOption && summary && <div></div>}
                </div>
            </div>
            <Footer className="footer"/>
        </div>
    );
};

export default App;