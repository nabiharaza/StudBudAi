import React, {useState, useEffect} from 'react';
import Timer from '../Timer/Timer';
import {parseQuiz} from './TimedQuizUtil';


const TimedQuiz = ({text, timer, handleContentGeneration}) => {
    const [title, setTitle] = useState("");
    const [quizData, setQuizData] = useState([]);
    const [showAnswers, setShowAnswers] = useState(false);
    const [answers, setAnswers] = useState(new Array().fill(null));
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [showSubmitButton, setShowSubmitButton] = useState(true);
    const [correctAnswerCount, setCorrectAnswerCount] = useState(0);
    const [answersToValidate, setAnswersToValidate] = useState([]);
    const runChat = require("../../modules/chatPrompt");

    useEffect(() => {
        const parsedQuizData = parseQuiz(text);
        setQuizData(parsedQuizData);
    }, [text]);

    const handleTimeout = () => {
        setQuizCompleted(true);
        // TODO: Add show answers logic
    };

    const handleOptionSelect = (mcqIndex, option) => {
        const newSelectedAnswers = [...answers];
        newSelectedAnswers[mcqIndex] = option;
        setAnswers(newSelectedAnswers);
        console.log(`Selected option for MCQ ${mcqIndex + 1}: ${option}`);
    };

    const handleAnswer = (idx, val) => {
        const newSelectedAnswers = [...answers];
        newSelectedAnswers[idx] = val;
        setAnswers(newSelectedAnswers);
        console.log(`Answer for ans ${idx + 1}: ${val}`);
    };

    const hideAnswers = () => {
        setShowAnswers(false);
    };

    const handleRevealAnswers = () => {
        setShowAnswers(true);
        console.log('showAnswers:', showAnswers);
    };

    useEffect(() => {
        const fetchData = async () => {
            let response = await handleGenerateContent();
            //   console.log(response.text());

            // Update quiz data, correct answer count, and UI states
            setShowAnswers(true);
            setShowSubmitButton(false);
        };

        if (answersToValidate.length > 0) {
            fetchData();
        }
    }, [answersToValidate]);

    const handleGenerateContent = async () => {
        try {
            console.log("Answers to validate is going for Validation...->", JSON.stringify(answersToValidate));
            prompt = `Provided is a list of answers that need validation. ${JSON.stringify(answersToValidate)}. Please help validate if the userAnswer matches the correctAnswer and return the response in the same format with 2 new properties added to the response - 1. correctnessScore (score out of 1) and 2. improvements`;
            const responseText = await runChat(prompt);
            console.log("The ans is back from Validation -> ", responseText);
            let correctAnswers = 0;
            if (responseText) {
                var parsedResponse = JSON.parse(responseText)
                parsedResponse?.forEach(response => {
                    correctAnswers += response.correctnessScore;
                    setQuizData(prevQuizData => 
                        prevQuizData.map(quiz => {
                            if (quiz.id === response.id) {
                                return {
                                    ...quiz,
                                    improvement: response.improvements,
                                    score: response.correctnessScore,
                                };
                            }

                            return quiz;
                        })
                    );
                });

                setCorrectAnswerCount(correctAnswerCount+correctAnswers)
            }
        } catch (error) {
            console.error("Error generating content:", error);
        }
    };

    const handleSubmit = async () => {
        let correctCount = 0;
        let toValidate = [];
        const newQuizData = quizData.map((quiz, index) => {
            let isCorrect = false;
            const answer = answers[index];
            if (quiz.questionType?.toLowerCase()?.startsWith('mcq') || quiz.questionType?.toLowerCase()?.startsWith('true')) {
                isCorrect = answer === quiz.correctAnswer;
            } else {
                quiz.userAnswer = answer;
                toValidate.push(quiz)
            }

            if (isCorrect) {
                correctCount++;
            }
            // console.log(`MCQ ${index + 1} - Question: ${quiz.question}, Selected Option: ${answer}, Correct Answer: ${correctOptionText}, isCorrect: ${isCorrect}`);
            return {...quiz, answer, isCorrect};
        });
        setQuizData(newQuizData);
        setCorrectAnswerCount(correctCount);

        console.log('New MCQs Data:', newQuizData);
        console.log('Correct answer count:', correctCount);
        if (toValidate?.length > 0) {
            setAnswersToValidate(prevAnswers => [...prevAnswers, ...toValidate]);
        }
    };


    return (
        <div className="mcq-container">
            <h2>{title}</h2>
            {quizData.length > 0 ? (
                <>
                    {/* TODO: Add Start Quiz pop up */}
                    <div>
                        {!quizCompleted && <Timer timeLimit={timer * 60} onTimeout={handleTimeout}/>}
                        {quizCompleted && <p>Time Up!</p>}
                    </div>
                    {quizData.map((quiz, index) => (
                        <QuizQuestion key={quiz.id} quiz={quiz} index={index} handleOptionSelect={handleOptionSelect}
                                      handleAnswer={handleAnswer} answer={answers[index]} showAnswers={showAnswers}/>
                    ))}
                    {(!quizCompleted && showSubmitButton) && <button onClick={handleSubmit}>Submit</button>}
                    {(quizCompleted || !showAnswers) && <button onClick={handleRevealAnswers}>Reveal Answers</button>}
                    {showAnswers && (
                        <div>
                            <p>Answers revealed!</p>
                            <p>
                                You got {correctAnswerCount} out of {quizData.length} correct.
                            </p>
                            <button onClick={hideAnswers}>Hide Answers</button>
                        </div>
                    )}
                </>
            ) : (
                <p>No Timed Quiz available.</p>
            )}
        </div>
    );
};

const QuizQuestion = ({quiz, index, handleOptionSelect, handleAnswer, answer, showAnswers}) => {
    return (
        <div className="mcq">
            <p className="question">{`${quiz.id}. ${quiz.question}`}</p>
            {quiz.options && quiz.options.length > 0 ? (
                <ul>
                    {quiz.options.map(option => (
                        <QuizOption key={option} option={option} quiz={quiz} index={index}
                                    handleOptionSelect={handleOptionSelect} answer={answer} showAnswers={showAnswers}/>
                    ))}
                </ul>
            ) : quiz.questionType === 'Long Answer' || quiz.questionType === 'Short Answer' ? (
                <><textarea id={`ques_${index}`} rows="4" cols="50"
                        onBlur={(event) => handleAnswer(index, event?.target?.value)} />{showAnswers && (<div className={quiz.score > 0.75 ? 'correct' : 'incorrect'}> {quiz.improvement} ({quiz.score}) </div>)}</>
            ) : (
                <><input type="text" id={`ques_${index}`} onBlur={(event) => handleAnswer(index, event?.target?.value)} />{showAnswers && (<div className={quiz.score > 0.75 ? 'correct' : 'incorrect'}> {quiz.improvement} ({quiz.score}) </div>)}</>
            )}
        </div>
    );
};

const QuizOption = ({option, quiz, index, handleOptionSelect, answer, showAnswers}) => {
    return (
        <li className={`option ${getOptionClassName(option, quiz, answer, showAnswers)}`}>
            <input type="radio" id={`mcq_${index}_option_${option}`} name={`mcq_${index}`} value={option}
                   checked={answer === option} onChange={() => handleOptionSelect(index, option)}
                   disabled={showAnswers}/>
            <label htmlFor={`mcq_${index}_option_${option}`}
                   className={getOptionClassName(option, quiz, answer, showAnswers)}>{option}</label>
        </li>
    );
};

const getOptionClassName = (option, quiz, selectedAnswer, showAnswers) => {
    if (showAnswers) {
        return option === quiz.answer ? 'correct' : selectedAnswer === option ? 'incorrect' : '';
    } else {
        return selectedAnswer === option ? 'selected' : '';
    }
};

export default TimedQuiz;
