import React, { useState, useEffect } from 'react';
import './Mcqs.css';

const MCQs = ({ text }) => {
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
          currentMCQ = { question: '', options: [], answer: null, selectedOption: null };
          parsedLine = line.substring(line.indexOf(':') + 3).trim();
        } else if (line.startsWith('(')) {
          const option = line.trim();
          currentMCQ.options.push(option);
        } else if (line.startsWith('**Answer')) {
          currentMCQ.answer = line.substring(line.indexOf(':') + 1).trim();
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

  const handleOptionSelect = (mcqIndex, option) => {
    const newSelectedAnswers = [...selectedAnswers];
    newSelectedAnswers[mcqIndex] = option;
    setSelectedAnswers(newSelectedAnswers);
    setShowSubmitButton(true);
    console.log(`Selected option for MCQ ${mcqIndex + 1}: ${option}`);
  };

  const handleSubmit = () => {
    let correctCount = 0;
    const newMcqsData = mcqsData.map((mcq, index) => {
      const selectedOption = selectedAnswers[index];
      const isCorrect = selectedOption === mcq.answer;
      if (isCorrect) {
        correctCount++;
      }
      console.log(`MCQ ${index + 1} - Question: ${mcq.question}, Selected Option: ${selectedOption}, Correct Answer: ${mcq.answer}, isCorrect: ${isCorrect}`);
      return { ...mcq, selectedOption, isCorrect };
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
              {mcq.options.map((option, optionIndex) => (
                <li
                  key={optionIndex}
                  className={`option ${
                    showAnswers
                      ? option === mcq.answer
                        ? 'correct'
                        : selectedAnswers[index] === option
                        ? 'incorrect'
                        : ''
                      : selectedAnswers[index] === option && option === mcq.answer
                      ? 'correct'
                      : selectedAnswers[index] === option
                      ? 'selected'
                      : ''
                  }`}
                >
                  <input
                    type="radio"
                    id={`mcq_${index}_option_${optionIndex}`}
                    name={`mcq_${index}`}
                    value={option}
                    checked={selectedAnswers[index] === option}
                    onChange={() => handleOptionSelect(index, option)}
                    disabled={showAnswers}
                  />
                  <label
                    htmlFor={`mcq_${index}_option_${optionIndex}`}
                    className={
                      showAnswers
                        ? option === mcq.answer
                          ? 'correct'
                          : selectedAnswers[index] === option
                          ? 'incorrect'
                          : ''
                        : selectedAnswers[index] === option && option === mcq.answer
                        ? 'correct'
                        : ''
                    }
                  >
                    {option}
                  </label>
                </li>
              ))}
            </ul>
            {showAnswers && (
              <p className="answer correct">
                Correct Answer: {mcq.answer}
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