# Project Structure

This document explains the organization and purpose of each file in the Morning Exercise Tracker.

## Directory Overview

```
morning-exercise-app/
├── src/                      # Source code
│   ├── components/           # React components
│   ├── services/            # API and external service integrations
│   ├── hooks/               # Custom React hooks
│   ├── styles/              # CSS styling
│   ├── App.jsx              # Main app component & state machine
│   └── main.jsx             # React entry point
├── public/                  # Static assets (auto-created by Vite)
├── index.html               # HTML entry point
├── package.json             # Dependencies and scripts
├── vite.config.js           # Vite configuration
├── README.md                # Main documentation
├── QUICKSTART.md            # Quick start guide
├── SETUP_GOOGLE_SHEETS.md   # Google Sheets setup guide
└── PROJECT_STRUCTURE.md     # This file
```

## Core Files

### `src/App.jsx`
**Purpose**: Main application component and workout state machine

**Key Responsibilities**:
- Manages workout flow through different states (welcome, exercises, rating, complete)
- Implements adaptive difficulty algorithm
- Coordinates between exercises, voice controller, and data storage
- Handles Google Sheets vs. mock mode switching

**States**:
- `WELCOME`: Initial screen
- `DIFFICULTY_ADJUST`: Ask user for difficulty preference
- `EXERCISE_1/2/3`: Individual exercise screens
- `RATING`: Post-workout difficulty rating
- `COMPLETE`: Success screen

**Key Functions**:
- `adjustDifficulty()`: Modifies exercise targets based on user input
- `handleExerciseXComplete()`: Processes exercise completion
- `handleRatingSubmit()`: Saves workout data

### `src/main.jsx`
**Purpose**: React application entry point

Renders the root App component into the DOM.

## Components (`src/components/`)

### `Exercise.jsx`
**Purpose**: Reusable exercise component wrapper

**Props**:
- `name`: Exercise name (e.g., "Bar Hang")
- `type`: "timer" or "counter"
- `target`: Duration in seconds or rep count
- `onComplete`: Callback when exercise finishes
- `isActive`: Whether this exercise is currently active
- `icon`: Emoji icon for the exercise

**Features**:
- Conditionally renders Timer or Counter based on type
- Manages START/STOP button states
- Shows completion checkmark

### `Timer.jsx`
**Purpose**: Countdown timer with circular progress indicator

**Props**:
- `duration`: Total time in seconds
- `onComplete`: Callback when timer reaches zero
- `isRunning`: Whether timer is active
- `onStop`: Callback for stop button

**Features**:
- Visual circular progress bar (SVG)
- Displays time in MM:SS format
- Auto-completes when reaching zero

### `Counter.jsx`
**Purpose**: Push-up counter with target and input

**Props**:
- `target`: Target number of reps
- `onComplete`: Callback with actual count

**Features**:
- Shows target count prominently
- Number input for actual count completed
- Input validation (numbers only)

### `VoiceController.jsx`
**Purpose**: Manages voice entertainment during exercises

**Props**:
- `isActive`: Whether voice should be active
- `onCommandReceived`: Callback for voice commands

**Features**:
- Automatically plays jokes/facts during exercises
- Listens for voice commands continuously
- Visual indicators for listening/speaking states
- Content queue management

**Voice Commands**:
- "more"/"next": New content
- "joke": Switch to jokes
- "fact": Switch to facts
- "motivate": Motivational quotes
- "stop": Pause voice

### `DifficultyRating.jsx`
**Purpose**: Post-workout difficulty rating (1-10)

**Props**:
- `onRatingSubmit`: Callback with rating value

**Features**:
- Voice input mode (say number 1-10)
- Manual input mode (tap buttons)
- Toggleable between voice and manual
- Converts spoken numbers to digits

## Services (`src/services/`)

### `voiceService.js`
**Purpose**: Abstraction layer for Web Speech API

**Exports**: Singleton instance

**Methods**:
- `speak(text, options)`: Text-to-speech
- `stopSpeaking()`: Cancel current speech
- `startListening(onResult, onError)`: Start speech recognition
- `stopListening()`: Stop speech recognition
- `isAvailable()`: Check browser support

**Browser Support**:
- Chrome/Edge: Full support
- Safari: TTS + recognition on iOS 14+
- Firefox: Limited/no support

### `jokesAPI.js`
**Purpose**: Fetch jokes and facts from free APIs

**Exports**: Singleton instance

**APIs Used**:
- Jokes: official-joke-api.appspot.com
- Facts: uselessfacts.jsph.pl

**Methods**:
- `fetchJoke()`: Get random joke
- `fetchFact()`: Get random fact
- `getContent(type)`: Get specific content type
- `getRandomContent()`: Mix of jokes and facts
- `getMotivationalQuote()`: Built-in motivational quotes
- `getFallbackJoke()`: Offline fallback jokes
- `getFallbackFact()`: Offline fallback facts

**Fallback System**:
Uses local content if API fails or offline.

### `googleSheets.js`
**Purpose**: Google Sheets API integration with OAuth

**Exports**: Singleton instance

**Configuration**:
- Requires Google Cloud project
- OAuth 2.0 client ID
- API key
- Spreadsheet ID (auto-created or provided)

**Methods**:
- `initializeGapi()`: Load Google API client
- `initializeGis()`: Load Google Identity Services
- `authenticate()`: OAuth flow
- `signOut()`: Revoke access
- `createSpreadsheet()`: Create new tracker spreadsheet
- `saveWorkout(data)`: Append workout row
- `getPreviousWorkout()`: Get most recent workout
- `getAllRows()`: Fetch all workout data

**Mock Mode Methods** (for development):
- `useMockMode()`: Enable localStorage mode
- `mockSaveWorkout(data)`: Save to localStorage
- `mockGetPreviousWorkout()`: Retrieve from localStorage

**Spreadsheet Schema**:
```
Date | Bar Hang Target | Bar Hang Completed | Plank Target | 
Plank Completed | Pushups Target | Pushups Completed | Difficulty Score
```

## Hooks (`src/hooks/`)

### `useVoice.js`
**Purpose**: React hook for text-to-speech

**Returns**:
- `speak(text, options)`: Function to speak text
- `stopSpeaking()`: Function to cancel speech
- `isSpeaking`: Boolean state
- `isAvailable`: Boolean for browser support

**Usage**:
```javascript
const { speak, isSpeaking } = useVoice();
speak("Hello world!");
```

### `useSpeechRecognition.js`
**Purpose**: React hook for speech recognition

**Parameters**:
- `onCommand`: Callback function for recognized text

**Returns**:
- `isListening`: Boolean state
- `transcript`: Latest recognized text
- `error`: Error state if recognition fails
- `startListening()`: Start listening
- `stopListening()`: Stop listening

**Usage**:
```javascript
const { isListening, startListening } = useSpeechRecognition((text) => {
  console.log('Heard:', text);
});
```

**Cleanup**: Automatically stops listening on unmount

## Styles (`src/styles/`)

### `App.css`
**Purpose**: All application styles

**Structure**:
1. CSS Reset & Variables
2. Global styles
3. Layout (header, main, footer)
4. Component styles
5. Responsive design
6. Accessibility features

**CSS Variables**:
- Colors: primary, secondary, success, warning, danger, info
- Shadows: for depth and elevation
- Text colors: primary and secondary

**Responsive Breakpoints**:
- Mobile: < 768px
- Landscape: special handling for short screens
- Touch devices: Larger touch targets (min 56px)

**Animations**:
- Pulse effect for listening indicator
- Scale-in for success checkmark
- Smooth transitions throughout

**Accessibility**:
- Respects `prefers-reduced-motion`
- High contrast colors
- Large touch targets

## Configuration Files

### `package.json`
**Dependencies**:
- `react` & `react-dom`: UI framework
- `axios`: HTTP client (prepared for future API calls)

**Dev Dependencies**:
- `vite`: Build tool and dev server
- `@vitejs/plugin-react`: React support for Vite

**Scripts**:
- `dev`: Start development server
- `build`: Create production build
- `preview`: Preview production build

### `vite.config.js`
**Configuration**:
- React plugin enabled
- Dev server on port 3000
- Host mode enabled for mobile access

### `index.html`
**Features**:
- Mobile-optimized viewport
- PWA capabilities (`mobile-web-app-capable`)
- Root div for React
- Google API scripts (commented out by default)

## Documentation Files

### `README.md`
Main documentation covering:
- Feature overview
- Installation
- Usage guide
- Customization
- Troubleshooting
- Deployment

### `QUICKSTART.md`
5-minute getting started guide:
- Installation steps
- First workout walkthrough
- Mobile setup
- Basic customization

### `SETUP_GOOGLE_SHEETS.md`
Detailed Google Sheets integration:
- Google Cloud Console setup
- OAuth configuration
- API key creation
- Security best practices
- Troubleshooting

### `PROJECT_STRUCTURE.md`
This file - complete project architecture.

## Data Flow

### Workout Flow:
```
App (WELCOME)
    ↓
App (DIFFICULTY_ADJUST) → adjustDifficulty()
    ↓
Exercise 1 (Bar Hang)
    ├── Timer → START/STOP
    └── VoiceController → jokes/facts + speech recognition
    ↓
Exercise 2 (Plank)
    ├── Timer
    └── VoiceController
    ↓
Exercise 3 (Push-ups)
    └── Counter → input actual count
    ↓
DifficultyRating → voice or manual input
    ↓
Save to Google Sheets / localStorage
    ↓
App (COMPLETE) → show summary
```

### Voice Flow:
```
VoiceController (active)
    ↓
useVoice → voiceService.speak()
    ↓
useSpeechRecognition → voiceService.startListening()
    ↓
User speaks command
    ↓
handleVoiceCommand → process command
    ↓
Update content or trigger action
```

### Data Storage Flow:
```
Workout completion
    ↓
handleRatingSubmit(rating)
    ↓
Build workoutData object
    ↓
Check mode: mock or Google Sheets
    ↓
Mock: localStorage.setItem()
OR
Google Sheets: gapi.client.sheets.spreadsheets.values.append()
    ↓
Show completion screen
```

## State Management

The app uses React's built-in state management:
- `useState` for component-level state
- Props for parent-child communication
- No external state library needed (simple app)

**Main State (App.jsx)**:
- `state`: Current workflow state
- `exercises`: Current exercise targets
- `previousWorkout`: Last workout data
- `workoutData`: Current workout results
- `isGoogleConnected`: Connection status
- `useMockMode`: Storage mode flag

## Extensibility

### Adding a New Exercise:

1. Add state in `App.jsx`:
   ```javascript
   const STATES = {
     // ... existing
     EXERCISE_4: 'exercise_4',
   };
   ```

2. Add to flow:
   ```javascript
   const handleExercise3Complete = (completed) => {
     // ... save data
     setState(STATES.EXERCISE_4);
   };
   ```

3. Add render:
   ```javascript
   {state === STATES.EXERCISE_4 && (
     <Exercise 
       name="Squats" 
       type="counter" 
       target={30}
       onComplete={handleExercise4Complete}
       isActive={true}
       icon="🦵"
     />
   )}
   ```

4. Update Google Sheets schema

### Adding New Voice Commands:

In `VoiceController.jsx`, extend `handleVoiceCommand()`:
```javascript
if (transcript.includes('new_command')) {
  // Handle new command
}
```

### Custom Content Sources:

In `jokesAPI.js`, add new methods:
```javascript
async fetchQuotes() {
  const response = await fetch('YOUR_API');
  return response.json();
}
```

## Performance Considerations

- Voice service is singleton (single instance)
- Speech recognition automatically restarts if interrupted
- Timers use `setInterval` with cleanup
- Components only re-render when state changes
- No expensive computations or deep state nesting

## Browser Compatibility

- **Minimum**: ES6 support, modern browser
- **Voice features**: Chrome 33+, Edge 79+, Safari 14.1+
- **General features**: All modern browsers
- **Mobile**: iOS 12+, Android 5+

## Security Notes

- Google API credentials should be in `.env` (not committed)
- OAuth flow is client-side (no backend needed)
- API key restrictions should be set in Google Cloud Console
- LocalStorage is not encrypted (use for non-sensitive data only)

## Future Enhancements

Potential additions (not implemented):
- ChatGPT API integration for conversational AI
- Multiple user profiles
- Exercise history graphs (Chart.js)
- Rest day tracking
- Streak counter
- Achievement system
- Dark mode
- Custom exercise builder
- Export to CSV
- Social sharing

---

This structure is designed to be simple, maintainable, and extensible. Happy coding! 🚀

