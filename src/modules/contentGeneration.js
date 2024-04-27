import React, {useState} from 'react';
import Summary from "../src/components/Summary/Summary";
import FlashCards from "../src/components/FlashCards/FlashCards";
import TimedQuiz from "../src/components/TimedQuiz/TimedQuiz";
import Quizes from "../src/components/Quizes/Quizes";
import TrueFalse from "../src/components/TrueFalse/TrueFalse";
import Mcqs from "../src/components/Mcqs/Mcqs";

const useContentGeneration = (genAI, chat) => {
    const [content, setContent] = useState(null);
    const [summary, setSummary] = useState('');
    const [loading, setLoading] = useState(false);

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
                    prompt = `Read this links: ${links.join(', ')} and provide quiz questions with a mix of (${questionType}) for ${timer} minutes (The quiz question numbers should not repeat.) in the following format
                        **Questions**
    **{question number}. {questionType} 
    content
    
    **Answers**
    **{answer number}. {questionType} 
    content.
    Sample response format: **Questions**
    
    **1. Long Answer**
    Question
    
    **2. MCQs**
    Question
    (a) option
    (b) option...
    **Answers**
    
    **1. Long Answer**
    Answer for the question
    
    **2. MCQs**
    (option character) Answer for the question
    Ensure the quiz is balanced and follow this rule for each question- long answers- 2 min (20-25% of quiz questions), short answers - 1.5 min (25-30% of quiz questions), mcqs - 1 min (30-40% of quiz questions), true/false - 30 sec(10-15% of quiz questions), fill in the blanks - 30 sec(10-15% of quiz questions)`;
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
                    setContent(<div><TimedQuiz text={response.text()}/></div>);
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

    return {content, summary, loading, handleContentGeneration};
};

export default useContentGeneration;