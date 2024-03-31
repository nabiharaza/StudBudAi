// TrueFalse.js

import React from 'react';

const TrueFalse = ({ questions }) => {
  return (
    <div>
      <h2>True/False</h2>
      {questions.map((question, index) => (
        <div key={index} className="true-false">
          <p>{question.statement}</p>
          <p>Answer: {question.answer ? 'True' : 'False'}</p>
        </div>
      ))}
    </div>
  );
};

export default TrueFalse;
