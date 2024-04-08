import React, { useState, useEffect } from 'react';

const Timer = ({ timeLimit, onTimeout }) => {
  const [secondsLeft, setSecondsLeft] = useState(timeLimit);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft(prevSecondsLeft => {
        if (prevSecondsLeft === 0) {
          clearInterval(timer);
          onTimeout(); // Call the callback function when time runs out
          return prevSecondsLeft;
        } else {
          return prevSecondsLeft - 1;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onTimeout]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <div>
      Time Left: {formatTime(secondsLeft)}
    </div>
  );
};

export default Timer;
