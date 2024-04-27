import React, {useState} from 'react';
import Summary from "../components/Summary/Summary";
import FlashCards from "../components/FlashCards/FlashCards";
import TimedQuiz from "../components/TimedQuiz/TimedQuiz";
import Quizes from "../components/Quizes/Quizes";
import TrueFalse from "../components/TrueFalse/TrueFalse";
import Mcqs from "../components/Mcqs/Mcqs";

const useContentGeneration = (genAI, chat, setNumFlashcards) => {
    const [content, setContent] = useState(null);
    const [summary, setSummary] = useState('');
    const [loading, setLoading] = useState(false);
    const [answersToValidate, setAnswersToValidate] = useState([]);

    const handleContentGeneration = async (option, links, numFlashcards, timer, questionType) => {
        try {
            console.log("Generating content...");
            setLoading(true);
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
            setLoading(false);
        }
    };

    return {content, summary, loading, setNumFlashcards, handleContentGeneration};
};

export default useContentGeneration;