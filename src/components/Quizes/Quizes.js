// Quizzes.js

import React from 'react';

const Quizzes = ({ quizzes }) => {
  return (
    <div>
      <h2>Quizzes</h2>
      {quizzes.map((quiz, index) => (
        <div key={index} className="quiz">
          <p>{quiz.question}</p>
          <ul>
            {quiz.options.map((option, i) => (
              <li key={i}>{option}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default Quizzes;
