import React, { useState } from 'react';
import './LeftNav.css';

const LeftNav = ({
    collapsed,
    toggleCollapse,
    handleContentGeneration,
    links,
    handleAddLink,
    handleLinkChange,
    selectedOption,
    setSelectedOption,
    numFlashcards,
    setNumFlashcards,
}) => {
    const handleOptionChange = (e) => {
        setSelectedOption(e.target.value);
    };

    const handleNumFlashcardsChange = (e) => {
        setNumFlashcards(parseInt(e.target.value));
    };

    const handleGenerateContent = () => {
        if (selectedOption === '') {
            alert("Please select an option.");
            return;
        }
        if (links.some((link) => link.trim() === '')) {
            alert("Please enter a valid link.");
            return;
        }
        handleContentGeneration(selectedOption, links, numFlashcards);
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
                    <button className="generate-button" onClick={handleGenerateContent}>
                        Generate Content
                    </button>
                </>
            )}
        </div>
    );
};

export default LeftNav;