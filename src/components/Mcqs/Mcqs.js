import React, {useState} from 'react';
import './Mcqs.css';

const MCQs = ({text}) => {
    const [showAnswers, setShowAnswers] = useState(false);

    const toggleAnswers = () => {
        setShowAnswers(!showAnswers);
    };

    const parseMCQs = (text) => {
        const mcqs = [];
        const lines = text.split('\n');
        let currentMCQ = {};
        let parsedLine = '';

        lines.forEach((line, index) => {
            if (line.trim() !== '') {
                if (line.startsWith('**Question')) {
                    // Check if this is not the first question
                    if (Object.keys(currentMCQ).length !== 0) {
                        currentMCQ.question = parsedLine.trim();
                        mcqs.push(currentMCQ);
                    }

                    // Reset current MCQ
                    currentMCQ = {
                        question: '',
                        options: [],
                        answer: null
                    };
                    // Set parsedLine to be the line containing the question
                    parsedLine = line.substring(line.indexOf(':') + 3).trim();
                } else if (line.startsWith('(')) {
                    const option = line.trim();
                    currentMCQ.options.push(option);
                } else if (line.startsWith('**Answer')) {
                    currentMCQ.answer = line.substring(line.indexOf(':') + 1).trim();
                }
            }
        });

        // Push the last MCQ
        if (Object.keys(currentMCQ).length !== 0) {
            currentMCQ.question = parsedLine.trim();
            mcqs.push(currentMCQ);
        }

        return mcqs;
    };


    const mcqsData = parseMCQs(text);

    return (
        <div className="mcq-container">
            <h2>MCQs</h2>
            {mcqsData.map((mcq, index) => (
                <div key={index} className="mcq">
                    <p className="question">{`${index + 1}. ${mcq.question}`}</p>
                    <ul>
                        {mcq.options.map((option, optionIndex) => (
                            <li key={optionIndex}>{option}</li>
                        ))}
                    </ul>
                    {showAnswers && (
                        <p className="answer">Answer: {mcq.answer}</p>
                    )}
                </div>
            ))}
            <button onClick={toggleAnswers}>
                {showAnswers ? 'Hide Answers' : 'Reveal Answers'}
            </button>
        </div>
    );
};

export default MCQs;