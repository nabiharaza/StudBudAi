import React, {useState} from 'react';
import './LeftNav.css';

const LeftNav = ({
                     collapsed,
                     toggleCollapse,
                     handleOptionSelect,
                     handleLinkSubmit,
                     handleContentGeneration
                 }) => {
    const [selectedOption, setSelectedOption] = useState('');
    const [link, setLink] = useState('');
    const [numFlashcards, setNumFlashcards] = useState(0);

    const handleOptionChange = (e) => {
        setSelectedOption(e.target.value);
    };

    const handleLinkChange = (e) => {
        setLink(e.target.value);
    };

    const handleNumFlashcardsChange = (e) => {
        setNumFlashcards(parseInt(e.target.value));
    };

    const handleSubmit = () => {
        if (selectedOption === '') {
            alert("Please select an option.");
            return;
        }
        handleOptionSelect(selectedOption); // Trigger option select handler
    };

    const handleSubmitLink = () => {
        if (link.trim() === '') {
            alert("Please enter a valid link.");
            return;
        }
        handleLinkSubmit(link); // Trigger link submit handler
    };

    const handleGenerateContent = () => {
        if (selectedOption === '') {
            alert("Please select an option.");
            return;
        }
        if (link.trim() === '') {
            alert("Please enter a valid link.");
            return;
        }
        // Trigger content generation with selected option, link, and number of flashcards
        handleContentGeneration(selectedOption, link, numFlashcards);
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
            {(selectedOption !== 'history') && (
                <>
                    <input type="text" placeholder="Enter link" value={link} onChange={handleLinkChange}/>
                    {(selectedOption === 'flashcards' || selectedOption === 'quizzes' || selectedOption === 'truefalse' || selectedOption === 'mcqs') && (
                        <input type="number" placeholder="Questions" value={numFlashcards}
                               onChange={handleNumFlashcardsChange}/>
                    )}
                    <button className="generate-button" onClick={handleGenerateContent}>Generate Content</button>
                </>
            )}

        </div>

    );
};

export default LeftNav;
