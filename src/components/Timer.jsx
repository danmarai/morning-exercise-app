import { useState, useEffect, useCallback } from 'react';

const Timer = ({ duration, onComplete, isRunning, onStop, onTimeUpdate }) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          if (onComplete) onComplete();
          return 0;
        }
        const newTimeLeft = prev - 1;
        // Update elapsed time in parent
        if (onTimeUpdate) {
          onTimeUpdate(duration - newTimeLeft);
        }
        return newTimeLeft;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, onComplete, duration, onTimeUpdate]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((duration - timeLeft) / duration) * 100;

  return (
    <div className="timer-container">
      <div className="timer-display">
        <div className="timer-circle">
          <svg className="timer-svg" viewBox="0 0 100 100">
            <circle
              className="timer-background"
              cx="50"
              cy="50"
              r="45"
            />
            <circle
              className="timer-progress"
              cx="50"
              cy="50"
              r="45"
              style={{
                strokeDasharray: `${2 * Math.PI * 45}`,
                strokeDashoffset: `${2 * Math.PI * 45 * (1 - progress / 100)}`
              }}
            />
          </svg>
          <div className="timer-text">
            {formatTime(timeLeft)}
          </div>
        </div>
      </div>
      <div className="timer-info">
        Target: {formatTime(duration)}
      </div>
    </div>
  );
};

export default Timer;

