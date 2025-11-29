import { useState, useEffect, useCallback } from 'react';

const Timer = ({ duration, onComplete, isRunning, onStop, onTimeUpdate, onFinish }) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  // Audio helpers
  const playTone = (freq = 440, type = 'sine', duration = 0.1) => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  };

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.2; // Slightly faster
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const newTimeLeft = prev - 1;

        // Audio Cues
        if (newTimeLeft === 10) {
          speak("10 seconds left");
        } else if (newTimeLeft <= 3 && newTimeLeft > 0) {
          playTone(600, 'sine', 0.2); // Soft tone
        } else if (newTimeLeft === 0) {
          playTone(800, 'sine', 0.4); // Target met tone
          // Do NOT stop automatically
          // We do NOT call onComplete here anymore because we want the user to manually stop
        }

        // Update elapsed time in parent
        // If newTimeLeft is negative (overtime), duration - newTimeLeft > duration
        if (onTimeUpdate) {
          onTimeUpdate(duration - newTimeLeft);
        }
        return newTimeLeft;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, onComplete, duration, onTimeUpdate]);

  const formatTime = (seconds) => {
    const absSeconds = Math.abs(seconds);
    const mins = Math.floor(absSeconds / 60);
    const secs = absSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Progress logic
  // Normal: 100% -> 0%
  // Overtime: Keep at 0% (empty) or 100% (full)? Let's make it full to show "MAX"
  const isOvertime = timeLeft < 0;
  const progress = isOvertime ? 100 : ((duration - timeLeft) / duration) * 100;

  return (
    <div className={`timer-container ${isOvertime ? 'timer-overtime' : ''}`} onClick={onFinish}>
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
            {isOvertime && "+"}
            {formatTime(timeLeft)}
          </div>
        </div>
      </div>
      <div className="timer-info">
        {isOvertime ? 'Overtime!' : `Target: ${formatTime(duration)}`}
      </div>
      {isRunning && <div className="tap-to-stop-hint">(Tap to Stop)</div>}
    </div>
  );
};

export default Timer;
