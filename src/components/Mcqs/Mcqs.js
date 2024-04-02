import React, {useState, useEffect} from 'react';
import './Mcqs.css';

const MCQs = ({text}) => {
    const [mcqsData, setMcqsData] = useState([]);
    const [selectedAnswers, setSelectedAnswers] = useState(new Array(10).fill(null));
    const [showSubmitButton, setShowSubmitButton] = useState(false);
    const [showAnswers, setShowAnswers] = useState(false);
    const [correctAnswerCount, setCorrectAnswerCount] = useState(0);

    useEffect(() => {
        const parsedMcqsData = parseMCQs(text);
        setMcqsData(parsedMcqsData);
    }, [text]);

    const parseMCQs = (text) => {
        const mcqs = [];
        const lines = text.split('\n');
        let currentMCQ = {};
        let parsedLine = '';
        lines.forEach((line, index) => {
            if (line.trim() !== '') {
                if (line.startsWith('**Question')) {
                    if (Object.keys(currentMCQ).length !== 0) {
                        currentMCQ.question = parsedLine.trim();
                        mcqs.push(currentMCQ);
                    }
                    currentMCQ = {question: '', options: [], correctAnswer: null};
                    parsedLine = line.substring(line.indexOf(':') + 3).trim();
                } else if (line.startsWith('(')) {
                    const option = line.trim();
                    currentMCQ.options.push(option);
                } else if (line.startsWith('**Answer')) {
                    currentMCQ.correctAnswer = line.substring(line.indexOf(':') + 1).trim().replace(/\*\*/, '');
                }
            }
        });
        if (Object.keys(currentMCQ).length !== 0) {
            currentMCQ.question = parsedLine.trim();
            mcqs.push(currentMCQ);
        }
        console.log('Parsed MCQs:', mcqs);
        return mcqs;
    };
    const handleOptionSelect = (mcqIndex, option, optionIndex) => {
        const newSelectedAnswers = [...selectedAnswers];
        const optionLetter = String.fromCharCode('A'.charCodeAt(0) + optionIndex);
        newSelectedAnswers[mcqIndex] = optionLetter;
        setSelectedAnswers(newSelectedAnswers);
        setShowSubmitButton(true);
        console.log(`Selected option for MCQ ${mcqIndex + 1}: ${optionLetter}`);
    };

    const handleSubmit = () => {
        let correctCount = 0;
        const newMcqsData = mcqsData.map((mcq, index) => {
            const selectedOption = selectedAnswers[index];
            const correctOptionText = mcq.options[mcq.correctAnswer.charCodeAt(0) - 'A'.charCodeAt(0)];
            const isCorrect = selectedOption === mcq.correctAnswer;
            if (isCorrect) {
                correctCount++;
            }
            console.log(`MCQ ${index + 1} - Question: ${mcq.question}, Selected Option: ${selectedOption}, Correct Answer: ${correctOptionText}, isCorrect: ${isCorrect}`);
            return {...mcq, selectedOption, isCorrect};
        });
        setMcqsData(newMcqsData);
        setCorrectAnswerCount(correctCount);
        setShowAnswers(true);
        setShowSubmitButton(false);
        console.log('New MCQs Data:', newMcqsData);
        console.log('Correct answer count:', correctCount);
    };

    const toggleAnswers = () => {
        setShowAnswers(!showAnswers);
        console.log('showAnswers:', showAnswers);
    };

    const hideAnswers = () => {
        setShowAnswers(false);
    };

    return (
        <div className="mcq-container">
            <h2>MCQs</h2>
            {mcqsData.length > 0 ? (
                mcqsData.map((mcq, index) => (
                    <div key={index} className="mcq">
                        <p className="question">{`${index + 1}. ${mcq.question}`}</p>
                        <ul>
                            {mcq.options.map((option, optionIndex) => {
                                const optionLetter = String.fromCharCode('A'.charCodeAt(0) + optionIndex);
                                return (
                                    <li
                                        key={optionIndex}
                                        className={`option ${
                                            showAnswers
                                                ? optionLetter === mcq.correctAnswer
                                                    ? 'correct'
                                                    : selectedAnswers[index] === optionLetter
                                                        ? 'incorrect'
                                                        : ''
                                                : selectedAnswers[index] === optionLetter
                                                    ? 'selected'
                                                    : ''
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            id={`mcq_${index}_option_${optionIndex}`}
                                            name={`mcq_${index}`}
                                            value={option}
                                            checked={selectedAnswers[index] === optionLetter}
                                            onChange={() => handleOptionSelect(index, option, optionIndex)}
                                            disabled={showAnswers}
                                        />
                                        <label
                                            htmlFor={`mcq_${index}_option_${optionIndex}`}
                                            className={
                                                showAnswers
                                                    ? optionLetter === mcq.correctAnswer
                                                        ? 'correct'
                                                        : selectedAnswers[index] === optionLetter
                                                            ? 'incorrect'
                                                            : ''
                                                    : selectedAnswers[index] === optionLetter
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
                        {showAnswers && (
                            <p className="answer correct">
                                Correct Answer: {mcq.correctAnswer}
                            </p>
                        )}
                    </div>
                ))
            ) : (
                <p>No MCQs available.</p>
            )}
            {showSubmitButton && !showAnswers && <button onClick={handleSubmit}>Submit</button>}
            {showAnswers && (
                <div>
                    <p>Answers revealed!</p>
                    <p>
                        You got {correctAnswerCount} out of {mcqsData.length} correct.
                    </p>
                    <button onClick={hideAnswers}>Hide Answers</button>
                </div>
            )}
            {!showSubmitButton && !showAnswers && <button onClick={toggleAnswers}>Reveal Answers</button>}
        </div>
    );
};

export default MCQs;