import React, { useState, useEffect } from 'react';
import Timer from '../Timer/Timer';

const TimedQuiz = ({ text, timer }) => {
    const [title, setTitle] = useState("");
    const [quizData, setQuizData] = useState([]);
    const [showAnswers, setShowAnswers] = useState(false);
    const [selectedAnswers, setSelectedAnswers] = useState(new Array(10).fill(null));
    const [quizCompleted, setQuizCompleted] = useState(false);

    useEffect(() => {
        const parsedQuizData = parseQuiz(text);
        setQuizData(parsedQuizData);
    }, [text]);

    const startsWithNumberAndPeriod = (line) => {
        const pattern = /^\*\*([0-9]+)\. (.*)\*\*$/;
        const match = line.match(pattern);
        if (match) {
            const number = match[1]?.trim('*');
            const questionType = match[2]?.trimEnd('*');
            return { number, questionType };
        } else {
            return null;
        }
    };

    const parseQuiz = (text) => {
        const quiz = [];
        const lines = text.split('\n');
        let currentQuiz = {};
        let parseQuestions = false;
        let parseAnswers = false;
        let isNextLineAQuestion = false;
        let isNextLineAnOption = false;
        let isNextLineAnAnswer = false;
        let isMCQ = false;
        let isTrueFalse = false;

        lines.forEach((line, _) => {
            if (line.trim() !== '') {
                if (line.startsWith('**Questions')) {
                    // Check if this is not the first question
                    parseQuestions = true;
                } else if (line.startsWith('**Answers')) {
                    parseAnswers = true;
                    parseQuestions = false;
                    currentQuiz = {};
                }
                if (parseQuestions) {
                    let res = startsWithNumberAndPeriod(line);
                    if (res) {
                        currentQuiz = {
                            id: res.number,
                            questionType: res.questionType
                        }
                        quiz.push(currentQuiz)
                        isNextLineAQuestion = true;
                        isNextLineAnOption = false;
                        isMCQ = currentQuiz.questionType?.startsWith('MCQ')
                        isTrueFalse = currentQuiz.questionType?.startsWith('True')
                    } else {
                        if (!isMCQ) {
                            currentQuiz.question = line;
                        } else if (!isNextLineAnOption && isMCQ) {
                            currentQuiz.question = line;
                            isNextLineAnOption = true;
                        } else if (isNextLineAnOption) {
                            if (!currentQuiz?.options) {
                                currentQuiz.options = [];
                            }
                            currentQuiz.options.push(line)
                        } 
                        if (isTrueFalse) {
                            currentQuiz.options = ["True", "False"]
                            isTrueFalse = false;
                        }
                        isNextLineAQuestion = false;
                    }
                } else if (parseAnswers) {
                    let res = startsWithNumberAndPeriod(line);
                    if (res) {
                        const index = quiz.findIndex(item => item.id === res.number);
                        if (index !== -1) {
                            currentQuiz = quiz[index];
                        }
                        currentQuiz.answer = res.questionType;
                        currentQuiz = {};
                    }
                }
            }
        });

        console.log(quiz);
        return quiz;
    };

    const handleTimeout = () => {
        setQuizCompleted(true);
        // Add any additional logic you want when the quiz timer runs out
    };

    const handleOptionSelect = (mcqIndex, option) => {
        const newSelectedAnswers = [...selectedAnswers];
        newSelectedAnswers[mcqIndex] = option;
        setSelectedAnswers(newSelectedAnswers);
        console.log(`Selected option for MCQ ${mcqIndex + 1}: ${option}`);
    };

    return (
        <div className="mcq-container">
            <h2>{title}</h2>
            {/* TODO: Add Start Quiz pop up */}
            <div>
                {!quizCompleted && <Timer timeLimit={timer*60} onTimeout={handleTimeout} />}
                {/* Render your quiz questions and answers here */}
                {quizCompleted && <p>Quiz completed!</p>}
            </div>
            {quizData.length > 0 ? (
                quizData.map((quiz, index) => (
                    <div key={quiz.id} className="mcq">
                        <p className="question">{`${quiz.id}. ${quiz.question}`}</p>
                        {quiz?.options && quiz?.options?.length > 0 ? (
                        <ul>
                            {quiz?.options?.map(option => {
                                return (
                                    <li
                                        key={option}
                                        className={`option ${
                                            showAnswers
                                                ? option === quiz.answer
                                                    ? 'correct'
                                                    : selectedAnswers[index] === option
                                                        ? 'incorrect'
                                                        : ''
                                                : selectedAnswers[index] === option
                                                    ? 'selected'
                                                    : ''
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            id={`mcq_${index}_option_${option}`}
                                            name={`mcq_${index}`}
                                            value={option}
                                            checked={selectedAnswers[index] === option}
                                            onChange={() => handleOptionSelect(index, option)}
                                            disabled={showAnswers}
                                        />
                                        <label
                                            htmlFor={`mcq_${index}_option_${option}`}
                                            className={
                                                showAnswers
                                                    ? option === quiz.answer
                                                        ? 'correct'
                                                        : selectedAnswers[index] === option
                                                            ? 'incorrect'
                                                            : ''
                                                    : selectedAnswers[index] === option
                                                        ? 'selected'
                                                        : ''
                                            }
                                        >
                                            {option}
                                        </label>
                                    </li>
                                );
                            })}
                        </ul>
                        ) : quiz.questionType === 'Long Answer' ?
                            <textarea rows="4" cols="50" />
                        : <input type={text}/>}
                    </div>
                ))
                ) : (
                <p>No Timed Quiz available.</p>
            )}
            {/*<button onClick={toggleAnswers}>*/}
            {/*    {submitQuiz ? 'Hide Answers' : 'Reveal Answers'}*/}
            {/*</button>*/}
        </div>
    );
};

export default TimedQuiz;