import React, { useState } from 'react';
import './FlashCards.css'; // Import CSS for styling

const FlashCards = ({ text }) => {
  const [showBack, setShowBack] = useState(false);
  const [currentCard, setCurrentCard] = useState(0);

  // Split the text into flashcards
  const flashcards = [];
  const cardTexts = text.split('\n\n');
  for (let i = 0; i < cardTexts.length; i += 2) {
    const frontText = cardTexts[i].replace('**Front of Flashcard:**\n', '').trim();
    const backText = cardTexts[i + 1].replace('**Back of Flashcard:**\n', '').trim();
    flashcards.push({ front: frontText, back: backText });
  }


  const handleFlipCard = () => {
    setShowBack(!showBack);
  };

  const handleNextCard = () => {
    setShowBack(false);
    setCurrentCard((currentCard + 1) % flashcards.length);
  };

  const handlePrevCard = () => {
    setShowBack(false);
    setCurrentCard((currentCard - 1 + flashcards.length) % flashcards.length);
  };

  const { front, back, count } = flashcards[currentCard];

  return (
    <div className="flashcard-container">
      <div className="flashcard">
         <div className="flashcard-count">{count}</div>
        <div className="flashcard-content">
          <div className="flashcard-text">{showBack ? back : front}</div>
        </div>
        <button className="flip-button" onClick={handleFlipCard}>
          {showBack ? 'Show Front' : 'Show Back'}
        </button>
        <div className="flashcard-navigation">
          <button onClick={handlePrevCard}>Prev</button>
          <button onClick={handleNextCard}>Next</button>
        </div>
      </div>
      <div className="flashcard-count">{count}</div>
    </div>
  );
};

export default FlashCards;
