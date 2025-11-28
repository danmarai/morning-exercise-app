import { useState, useEffect } from 'react';
import Exercise from './components/Exercise';
import DifficultyRating from './components/DifficultyRating';
import ContentDisplay from './components/ContentDisplay';
import ErrorBoundary from './components/ErrorBoundary';
import googleSheetsService from './services/googleSheets';
import './styles/App.css';
import Stats from './components/Stats';
import LootBox from './components/LootBox';
import { calculateStreak } from './utils/streakCalculator';
import { calculateRank } from './utils/rankCalculator';
import rewardsService from './services/rewardsService';
import { getPersonalBests } from './services/ghostService';

import ExternalWorkout from './components/ExternalWorkout';

// Workout states
const STATES = {
  WELCOME: 'welcome',
  EXERCISE_1: 'exercise_1',
  RATING_1: 'rating_1',
  EXERCISE_2: 'exercise_2',
  RATING_2: 'rating_2',
  EXERCISE_3: 'exercise_3',
  RATING_3: 'rating_3',
  COMPLETE: 'complete',
  SETUP: 'setup',
  EXTERNAL_WORKOUT: 'external_workout'
};

// Default exercise values
const DEFAULT_EXERCISES = {
  barHang: 60,
  plank: 60,
  pushups: 20
};

const MINIMUMS = {
  barHang: 10,
  plank: 10,
  pushups: 5
};

function App() {
  const [state, setState] = useState(STATES.WELCOME);
  const [exercises, setExercises] = useState({ ...DEFAULT_EXERCISES });
  const [previousWorkout, setPreviousWorkout] = useState(null);
  const [workoutData, setWorkoutData] = useState({});
  const [isGoogleConnected, setIsGoogleConnected] = useState(false);
  const [isTestMode, setIsTestMode] = useState(false); // Default to Live Mode
  const [isExerciseRunning, setIsExerciseRunning] = useState(false);
  const [view, setView] = useState('exercises'); // 'exercises' or 'stats'
  const [streak, setStreak] = useState(0);
  const [rank, setRank] = useState(null);
  const [showLootBox, setShowLootBox] = useState(false);
  const [reward, setReward] = useState(null);
  const [personalBests, setPersonalBests] = useState({ barHang: 0, plank: 0, pushups: 0 });

  // Calculate difficulty based on previous workout ratings
  const calculateDifficulty = (prevWorkout) => {
    if (!prevWorkout) return { ...DEFAULT_EXERCISES };

    let newExercises = { ...DEFAULT_EXERCISES };

    // Helper to adjust single exercise
    // Rating 1-2: Easy -> Increase
    // Rating 3: Medium -> Same
    // Rating 4-5: Hard -> Decrease
    const adjust = (current, rating, min, step) => {
      if (rating <= 2) return current + step;
      if (rating >= 4) return Math.max(min, current - step);
      return current;
    };

    newExercises.barHang = adjust(prevWorkout.barHangTarget, prevWorkout.barHangRating, MINIMUMS.barHang, 10);
    newExercises.plank = adjust(prevWorkout.plankTarget, prevWorkout.plankRating, MINIMUMS.plank, 10);
    newExercises.pushups = adjust(prevWorkout.pushupsTarget, prevWorkout.pushupsRating, MINIMUMS.pushups, 3);

    return newExercises;
  };

  // Initialize Google Sheets (or use mock mode)
  useEffect(() => {
    const initializeStorage = async () => {
      if (isTestMode) {
        googleSheetsService.useMockMode();
        const prevWorkout = await googleSheetsService.mockGetPreviousWorkout();
        setPreviousWorkout(prevWorkout);
        if (prevWorkout) {
          setExercises(calculateDifficulty(prevWorkout));
        }

        // Calculate streak & rank & PBs
        const allWorkouts = await googleSheetsService.mockGetWorkouts();
        setStreak(calculateStreak(allWorkouts));
        setRank(calculateRank(allWorkouts.length));
        setPersonalBests(getPersonalBests(allWorkouts));

        setIsGoogleConnected(true);
      } else {
        // Initialize Google API (requires setup)
        // await googleSheetsService.initializeGapi();
        // await googleSheetsService.initializeGis();

        // In real mode, we'd also fetch workouts here to calculate streak
        // const allWorkouts = await googleSheetsService.getWorkouts();
        // setStreak(calculateStreak(allWorkouts));
      }
    };

    initializeStorage();
  }, [isTestMode]);

  // Start workout
  const startWorkout = () => {
    setState(STATES.EXERCISE_1);
    setIsExerciseRunning(false);
  };

  const handleExerciseStart = () => {
    setIsExerciseRunning(true);
  };

  const handleExerciseStop = () => {
    setIsExerciseRunning(false);
  };

  // Exercise completion handlers
  const handleExercise1Complete = (completed) => {
    setIsExerciseRunning(false);
    setWorkoutData(prev => ({
      ...prev,
      barHangTarget: exercises.barHang,
      barHangCompleted: completed
    }));
    setState(STATES.RATING_1);
  };

  const handleRating1Submit = (rating) => {
    setWorkoutData(prev => ({ ...prev, barHangRating: rating }));
    setState(STATES.EXERCISE_2);
    setIsExerciseRunning(false);
  };

  const handleExercise2Complete = (completed) => {
    setIsExerciseRunning(false);
    setWorkoutData(prev => ({
      ...prev,
      plankTarget: exercises.plank,
      plankCompleted: completed
    }));
    setState(STATES.RATING_2);
  };

  const handleRating2Submit = (rating) => {
    setWorkoutData(prev => ({ ...prev, plankRating: rating }));
    setState(STATES.EXERCISE_3);
    setIsExerciseRunning(false);
  };

  const handleExercise3Complete = (completed) => {
    setIsExerciseRunning(false);
    setWorkoutData(prev => ({
      ...prev,
      pushupsTarget: exercises.pushups,
      pushupsCompleted: completed
    }));
    setState(STATES.RATING_3);
  };

  const handleRating3Submit = async (rating) => {
    // Generate reward
    const newReward = rewardsService.getRandomReward();
    setReward(newReward);
    setShowLootBox(true);

    const finalData = {
      ...workoutData,
      pushupsRating: rating,
      bonus: newReward.type === 'bonus' ? newReward.content : 0
    };

    // Save to storage
    if (isTestMode) {
      await googleSheetsService.mockSaveWorkout(finalData);
    } else {
      await googleSheetsService.saveWorkout(finalData);
    }

    // Update streak & rank & PBs immediately after save
    if (isTestMode) {
      const allWorkouts = await googleSheetsService.mockGetWorkouts();
      setStreak(calculateStreak(allWorkouts));
      setRank(calculateRank(allWorkouts.length));
      setPersonalBests(getPersonalBests(allWorkouts));
    } else {
      // const allWorkouts = await googleSheetsService.getWorkouts();
      // setStreak(calculateStreak(allWorkouts));
    }

    setState(STATES.COMPLETE);
    setIsExerciseRunning(false);
  };

  // Render different screens based on state
  return (
    <ErrorBoundary>
      <div className="app">
        <header className="app-header">
          <div className="header-left">
            <button
              className="view-toggle-btn"
              onClick={() => setView(view === 'exercises' ? 'stats' : 'exercises')}
            >
              {view === 'exercises' ? '📊 Stats' : '💪 Exercises'}
            </button>
          </div>

          <div className="header-center">
            <h1>💪 Morning Exercise Tracker</h1>
            <div className="streak-container">
              <div className="streak-counter" title="Current Streak">
                <span className="streak-icon">🔥</span>
                <span className="streak-count">{streak}</span>
              </div>
              {rank && (
                <div className="rank-badge" style={{ borderColor: rank.currentRank.color }} title={`Rank: ${rank.currentRank.title}`}>
                  <span className="rank-title" style={{ color: rank.currentRank.color }}>{rank.currentRank.title}</span>
                </div>
              )}
            </div>
          </div>

          <div className="header-right">
            <div className="mode-toggle">
              <label className="switch">
                <input
                  type="checkbox"
                  checked={isTestMode}
                  onChange={() => setIsTestMode(!isTestMode)}
                />
                <span className="slider round"></span>
              </label>
              <span className="mode-label">{isTestMode ? 'TEST' : 'LIVE'}</span>
            </div>
          </div>
        </header>

        <main className="app-main">
          {view === 'stats' ? (
            <Stats isTestMode={isTestMode} />
          ) : (
            <>
              {state === STATES.WELCOME && (
                <div className="welcome-screen">
                  <h2>Ready to start your workout?</h2>
                  {previousWorkout && (
                    <div className="previous-workout-summary">
                      <h3>Last Workout Summary</h3>
                      <p>Date: {previousWorkout.date}</p>
                      <p>Bar Hang: {previousWorkout.barHangTarget}s (Rated: {previousWorkout.barHangRating}/5)</p>
                      <p>Plank: {previousWorkout.plankTarget}s (Rated: {previousWorkout.plankRating}/5)</p>
                      <p>Push-ups: {previousWorkout.pushupsTarget} (Rated: {previousWorkout.pushupsRating}/5)</p>
                    </div>
                  )}

                  <div className="upcoming-exercises">
                    <h3>Today's Plan (Adjusted for you):</h3>
                    <ul>
                      <li>Bar Hang: {exercises.barHang}s</li>
                      <li>Plank: {exercises.plank}s</li>
                      <li>Push-ups: {exercises.pushups} reps</li>
                    </ul>
                  </div>

                  <button
                    className="btn btn-primary btn-large"
                    onClick={startWorkout}
                  >
                    Start Workout
                  </button>

                  <button
                    className="btn btn-secondary"
                    style={{ marginTop: '1rem' }}
                    onClick={() => setState(STATES.EXTERNAL_WORKOUT)}
                  >
                    Log External Workout 📸
                  </button>

                  {!isTestMode && !isGoogleConnected && (
                    <div className="setup-section">
                      <p>Connect to Google Sheets to save your progress</p>
                      <button className="btn btn-secondary">
                        Connect Google Sheets
                      </button>
                    </div>
                  )}
                </div>
              )}

              {state === STATES.EXERCISE_1 && (
                <>
                  <Exercise
                    name="Bar Hang"
                    type="timer"
                    target={exercises.barHang}
                    onComplete={handleExercise1Complete}
                    isActive={true}
                    icon="🏋️"
                    isRunning={isExerciseRunning}
                    onStart={handleExerciseStart}
                    onStop={handleExerciseStop}
                    ghostTarget={personalBests.barHang}
                  />
                  <ContentDisplay isActive={isExerciseRunning} />
                </>
              )}

              {state === STATES.RATING_1 && (
                <DifficultyRating
                  title="Rate Bar Hang Difficulty"
                  onRatingSubmit={handleRating1Submit}
                />
              )}

              {state === STATES.EXERCISE_2 && (
                <>
                  <Exercise
                    name="Plank"
                    type="timer"
                    target={exercises.plank}
                    onComplete={handleExercise2Complete}
                    isActive={true}
                    icon="🧘"
                    isRunning={isExerciseRunning}
                    onStart={handleExerciseStart}
                    onStop={handleExerciseStop}
                    ghostTarget={personalBests.plank}
                  />
                  <ContentDisplay isActive={isExerciseRunning} />
                </>
              )}

              {state === STATES.RATING_2 && (
                <DifficultyRating
                  title="Rate Plank Difficulty"
                  onRatingSubmit={handleRating2Submit}
                />
              )}

              {state === STATES.EXERCISE_3 && (
                <>
                  <Exercise
                    name="Push-ups"
                    type="counter"
                    target={exercises.pushups}
                    onComplete={handleExercise3Complete}
                    isActive={true}
                    icon="💪"
                    ghostTarget={personalBests.pushups}
                  />
                  <ContentDisplay isActive={true} />
                </>
              )}

              {state === STATES.RATING_3 && (
                <DifficultyRating
                  title="Rate Push-ups Difficulty"
                  onRatingSubmit={handleRating3Submit}
                />
              )}

              {state === STATES.COMPLETE && (
                <div className="complete-screen">
                  <div className="success-animation">
                    <div className="success-checkmark">✓</div>
                  </div>
                  <h2>Workout Complete! 🎉</h2>
                  <p>Great job today! See you tomorrow.</p>

                  <div className="workout-summary">
                    <h3>Today's Results:</h3>
                    <ul>
                      <li>Bar Hang: {workoutData.barHangCompleted}s / {workoutData.barHangTarget}s</li>
                      <li>Plank: {workoutData.plankCompleted}s / {workoutData.plankTarget}s</li>
                      <li>Push-ups: {workoutData.pushupsCompleted} / {workoutData.pushupsTarget}</li>
                    </ul>
                  </div>

                  <button
                    className="btn btn-primary btn-large"
                    onClick={() => {
                      setState(STATES.WELCOME);
                      setWorkoutData({});
                    }}
                  >
                    Done
                  </button>
                </div>
              )}
            </>
          )}

          {state === STATES.EXTERNAL_WORKOUT && (
            <ExternalWorkout
              onComplete={(points) => {
                // Handle completion (maybe show loot box or just go to complete)
                // For now, let's just go to complete with a summary
                setWorkoutData({
                  bonus: points,
                  barHangCompleted: 0, plankCompleted: 0, pushupsCompleted: 0,
                  barHangTarget: 0, plankTarget: 0, pushupsTarget: 0
                });
                setState(STATES.COMPLETE);
              }}
              onCancel={() => setState(STATES.WELCOME)}
              isTestMode={isTestMode}
            />
          )}
        </main>

        {showLootBox && reward && (
          <LootBox
            reward={reward}
            onClose={() => {
              setShowLootBox(false);
              setReward(null);
            }}
          />
        )}

        <footer className="app-footer">
          <p>Stay strong! 💪</p>
        </footer>
      </div>
    </ErrorBoundary >
  );
}

export default App;
