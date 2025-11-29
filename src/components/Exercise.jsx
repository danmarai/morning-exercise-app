import { useState, useEffect } from 'react';
import Timer from './Timer';
import Counter from './Counter';

const Exercise = ({
  name,
  type,
  target,
  onComplete,
  isActive,
  icon,
  isRunning,
  onStart,
  onStop,
  ghostTarget
}) => {
  const [isCompleted, setIsCompleted] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  // This is now called manually when user stops the timer (even in overtime)
  const handleFinish = () => {
    if (onStop) onStop();
    setIsCompleted(true);
    if (onComplete) {
      // Pass the actual elapsed time (which includes overtime)
      onComplete(elapsedTime);
    }
  };

  const handleCounterComplete = (actualCount) => {
    setIsCompleted(true);
    if (onComplete) {
      onComplete(actualCount);
    }
  };

  const handleSkipToNext = () => {
    console.log(`[Exercise] Skipping ${name} - recording elapsed time: ${elapsedTime}s`);
    if (onStop) onStop();
    setIsCompleted(true);
    if (onComplete) {
      // For timer exercises, pass the elapsed time; for counter, pass 0
      onComplete(type === 'timer' ? elapsedTime : 0);
    }
  };

  if (!isActive) {
    return null;
  }

  return (
    <div className="exercise-container">
      <div className="exercise-header">
        {icon && <div className="exercise-icon">{icon}</div>}
        <h2 className="exercise-name">{name}</h2>
        {ghostTarget > 0 && (
          <div className="ghost-target" title="Your Personal Best">
            <span className="ghost-icon">👻</span>
            <span className="ghost-label">Best: {ghostTarget}{type === 'timer' ? 's' : ''}</span>
          </div>
        )}
      </div>

      <div className="exercise-content">
        {type === 'timer' && (
          <>
            <Timer
              duration={target}
              onComplete={() => { }} // No auto-complete anymore
              isRunning={isRunning}
              onStop={onStop}
              onTimeUpdate={setElapsedTime}
              onFinish={handleFinish}
            />

            {!isCompleted && !isRunning && (
              <button
                className="btn btn-success btn-large"
                onClick={onStart}
              >
                START
              </button>
            )}

            {!isCompleted && isRunning && (
              <>
                <button
                  className="btn btn-danger btn-large"
                  onClick={handleFinish}
                >
                  STOP
                </button>
                <button
                  className="btn btn-warning btn-large next-exercise-btn"
                  onClick={handleSkipToNext}
                >
                  ⏭️ NEXT EXERCISE
                </button>
              </>
            )}

            {isCompleted && (
              <div className="exercise-complete">
                <div className="checkmark">✓</div>
                <div>Exercise Complete!</div>
              </div>
            )}
          </>
        )}

        {type === 'counter' && !isCompleted && (
          <>
            <Counter
              target={target}
              onComplete={handleCounterComplete}
            />
            <button
              className="btn btn-warning btn-large next-exercise-btn"
              onClick={handleSkipToNext}
            >
              ⏭️ NEXT EXERCISE
            </button>
          </>
        )}

        {type === 'counter' && isCompleted && (
          <div className="exercise-complete">
            <div className="checkmark">✓</div>
            <div>Exercise Complete!</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Exercise;

