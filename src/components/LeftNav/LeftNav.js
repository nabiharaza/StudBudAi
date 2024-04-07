import React, { useState } from 'react';
import './LeftNav.css';
import Multiselect from 'multiselect-react-dropdown';

const LeftNav = ({
    collapsed,
    toggleCollapse,
    handleContentGeneration,
    links,
    timer,
    questionType,
    handleAddLink,
    handleLinkChange,
    selectedOption,
    setSelectedOption,
    numFlashcards,
    setNumFlashcards,
    setTimer,
    setQuestionType
}) => {
    const handleOptionChange = (e) => {
        setSelectedOption(e.target.value);
    };

    const handleNumFlashcardsChange = (e) => {
        setNumFlashcards(parseInt(e.target.value));
    };

    const handleTimerChange =(e) => {
        setTimer(parseInt(e.target.value));
    }

    const handleQuestionTypeChange =(e) => {
        setQuestionType(e)
    }

    const handleGenerateContent = () => {
        if (selectedOption === '') {
            alert("Please select an option.");
            return;
        }
        if (links.some((link) => link.trim() === '')) {
            alert("Please enter a valid link.");
            return;
        }
        // Trigger content generation with selected option, link, and number of flashcards
        handleContentGeneration(selectedOption, links, numFlashcards, timer, questionType);
    };

    return (
        <div className={`left-nav${collapsed ? ' collapsed' : ''}`}>
            <button className="collapse-button" onClick={toggleCollapse}>
                {collapsed ? '»' : '«'}
            </button>
            <button className="expand-button" onClick={toggleCollapse}>
                Expand Navigation
            </button>
            <select value={selectedOption} onChange={handleOptionChange}>
                <option value="">Select Option</option>
                <option value="summary">Summary</option>
                <option value="flashcards">Flash Cards</option>
                <option value="quizzes">Quizzes</option>
                <option value="timedQuiz">Timed Quiz</option>
                <option value="truefalse">True/False</option>
                <option value="mcqs">MCQs</option>
                <option value="history">History</option>
            </select>
            {selectedOption !== 'history' && (
                <>
                {links.map((link, index) => (
                    <input
                        key={index}
                        type="text"
                        placeholder="Enter link"
                        value={link}
                        onChange={(e) => handleLinkChange(index, e.target.value)}
                    />
                ))}
                <button className="generate-button" onClick={handleAddLink}>
                    +
                </button>
                {(selectedOption === 'flashcards' ||
                    selectedOption === 'quizzes' ||
                    selectedOption === 'truefalse' ||
                    selectedOption === 'mcqs') && (
                    <input
                        type="number"
                        placeholder="Questions"
                        value={numFlashcards}
                        onChange={handleNumFlashcardsChange}
                    />
                )}
                {(selectedOption === 'timedQuiz') && (
                    <input type="number" placeholder="Time" value={timer}
                           onChange={handleTimerChange}/>
                ) && (
                    <Multiselect
                      isObject={false}
                      onKeyPressFn={function noRefCheck(){}}
                      onRemove={function noRefCheck(){}}
                      onSearch={function noRefCheck(){}}
                      onSelect={handleQuestionTypeChange}
                      options={[
                        'Long Answer',
                        'Short Answer',
                        'MCQs',
                        'True/False',
                        'Fill in the blanks'
                      ]}
                    />
                )}
                    <button className="generate-button" onClick={handleGenerateContent}>Generate Content</button>
                </>
            )
            }
        </div>
    )
        ;
};

export default LeftNav;