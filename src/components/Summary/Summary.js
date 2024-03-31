import React from 'react';

const Summary = ({ text }) => {
  const renderText = () => {
    if (!text) return null;

    const lines = text.split('\n');
    return lines.map((line, index) => {
      if (line.startsWith('- ')) {
        // Render bullet point
        return <li key={index}>{line.substring(2)}</li>;
      } else if (line.startsWith('**')) {
        // Render bold text
        const endBoldIndex = line.indexOf('**', 2);
        if (endBoldIndex === -1) {
          return <p key={index}><strong>{line.substring(2)}</strong></p>;
        } else {
          const boldText = line.substring(2, endBoldIndex);
          const remainingText = line.substring(endBoldIndex + 2);
          return (
            <p key={index}>
              <strong>{boldText}</strong>
              {remainingText}
            </p>
          );
        }
      } else {
        // Render plain text
        return <p key={index}>{line}</p>;
      }
    });
  };

  return (
    <div className="summary">
      <ul>{renderText()}</ul>
    </div>
  );
};

export default Summary;