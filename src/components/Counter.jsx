import { useState } from 'react';

const Counter = ({ target, onComplete }) => {
  const [actualCount, setActualCount] = useState('');

  const handleSubmit = () => {
    const count = parseInt(actualCount) || 0;
    if (onComplete) {
      onComplete(count);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    // Only allow numbers
    if (value === '' || /^\d+$/.test(value)) {
      setActualCount(value);
    }
  };

  return (
    <div className="counter-container">
      <div className="counter-target">
        <div className="counter-label">Target</div>
        <div className="counter-number">{target}</div>
        <div className="counter-unit">push-ups</div>
      </div>
      
      <div className="counter-input-section">
        <label htmlFor="actual-count" className="counter-label">
          How many did you complete?
        </label>
        <input
          id="actual-count"
          type="number"
          inputMode="numeric"
          className="counter-input"
          value={actualCount}
          onChange={handleInputChange}
          placeholder="Enter count"
          min="0"
        />
      </div>

      <button
        className="btn btn-primary btn-large"
        onClick={handleSubmit}
        disabled={actualCount === ''}
      >
        Submit Count
      </button>
    </div>
  );
};

export default Counter;

