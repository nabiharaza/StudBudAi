import React, { useState, useEffect } from 'react';
import Timer from '../Timer/Timer';
import { parseQuiz } from './TimedQuizUtil';

const TimedQuiz = ({ text, timer, handleContentGeneration }) => {
    const [title, setTitle] = useState("");
    const [quizData, setQuizData] = useState([]);
    const [showAnswers, setShowAnswers] = useState(false);
    const [answers, setAnswers] = useState(new Array(10).fill(null));
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [showSubmitButton, setShowSubmitButton] = useState(true);
    const [correctAnswerCount, setCorrectAnswerCount] = useState(0);
    const [answersToValidate, setAnswersToValidate] = useState([]);

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

    const handleGenerateContent = async () => {
        // Trigger content generation with selected option, link, and number of flashcards
        await handleContentGeneration('validateAnswer', null, null, null, null, answersToValidate);
    };

    const handleSubmit = async () => {
        let correctCount = 0;
        let answersToValidate = [];
        const newQuizData = quizData.map((quiz, index) => {
            let isCorrect = false;
            const answer = answers[index];
            if (quiz.questionType === 'MCQ' || quiz.questionType == 'True/False') {
                let correctOptionText = quiz.options[quiz.correctAnswer.charCodeAt(0) - 'A'.charCodeAt(0)];
                isCorrect = answer === quiz.correctAnswer;
            } else {
                quiz.userAnswer = answer;
                answersToValidate.push(quiz)
            }

            if (isCorrect) {
                correctCount++;
            }
            // console.log(`MCQ ${index + 1} - Question: ${quiz.question}, Selected Option: ${answer}, Correct Answer: ${correctOptionText}, isCorrect: ${isCorrect}`);
            return {...quiz, answer, isCorrect};
        });
        if (answersToValidate?.length > 0) {
            setAnswersToValidate(answersToValidate);
            let response = await handleGenerateContent();
            console.log("Validated answer:", response.text());
        }
        setQuizData(newQuizData);
        setCorrectAnswerCount(correctCount);
        setShowAnswers(true);
        setShowSubmitButton(false);
        console.log('New MCQs Data:', newQuizData);
        console.log('Correct answer count:', correctCount);
    };

    return (
        <div className="mcq-container">
            <h2>{title}</h2>
            {quizData.length > 0 ? (
                <>
                    {/* TODO: Add Start Quiz pop up */}
                    <div>
                        {!quizCompleted && <Timer timeLimit={timer*60} onTimeout={handleTimeout} />}
                        {quizCompleted && <p>Time Up!</p>}
                    </div>
                    {quizData.map((quiz, index) => (
                        <QuizQuestion key={quiz.id} quiz={quiz} index={index} handleOptionSelect={handleOptionSelect} handleAnswer={handleAnswer} answer={answers[index]} showAnswers={showAnswers} />
                    ))}
                    {!quizCompleted && showSubmitButton && <button onClick={handleSubmit}>Submit</button>}
                    {quizCompleted && <button onClick={handleRevealAnswers}>Reveal Answers</button>}
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

const QuizQuestion = ({ quiz, index, handleOptionSelect, handleAnswer, answer, showAnswers }) => {
    return (
        <form onSubmit={this.handleSubmit}>
            <div className="mcq">
                <p className="question">{`${quiz.id}. ${quiz.question}`}</p>
                {quiz.options && quiz.options.length > 0 ? (
                    <ul>
                        {quiz.options.map(option => (
                            <QuizOption key={option} option={option} quiz={quiz} index={index} handleOptionSelect={handleOptionSelect} answer={answer} showAnswers={showAnswers} />
                        ))}
                    </ul>
                ) : quiz.questionType === 'Long Answer' || quiz.questionType === 'Short Answer' ? (
                    <textarea id={`ques_${index}`} rows="4" cols="50" onBlur={() => handleAnswer(index, answer)} />
                ) : (
                    <input type="text" id={`ques_${index}`} onBlur={() => handleAnswer(index, answer)} />
                )}
            </div>
        </form>
    );
};

const QuizOption = ({ option, quiz, index, handleOptionSelect, answer, showAnswers }) => {
    return (
        <li className={`option ${getOptionClassName(option, quiz, answer, showAnswers)}`}>
            <input type="radio" id={`mcq_${index}_option_${option}`} name={`mcq_${index}`} value={option} checked={answer === option} onChange={() => handleOptionSelect(index, option)} disabled={showAnswers} />
            <label htmlFor={`mcq_${index}_option_${option}`} className={getOptionClassName(option, quiz, answer, showAnswers)}>{option}</label>
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
