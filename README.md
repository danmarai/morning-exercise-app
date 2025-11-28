# Morning Exercise Tracker 💪

A mobile-friendly web app to help you get through your morning exercises with hands-free voice interaction, automatic difficulty adjustment, and progress tracking via Google Sheets.

## Features

- **3 Exercise Types**: Bar hang, plank (timer-based), and push-ups (counter-based)
- **Voice-Controlled Entertainment**: Jokes and facts during exercises with hands-free commands
- **Adaptive Difficulty**: Automatically adjusts workout intensity based on your performance
- **Progress Tracking**: Stores workout data in Google Sheets with dates and difficulty scores
- **Mobile-Optimized**: Large touch targets and responsive design for easy use during workouts
- **Web Speech API**: Text-to-speech and speech recognition for truly hands-free operation

## Getting Started

### Prerequisites

- Node.js (v16 or higher) and npm
- Modern web browser (Chrome, Edge, or Safari for voice features)
- Google account (for data persistence)

### Installation

1. Clone or download this repository

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:3000`

## Initial Setup

The app starts in **mock mode** using browser localStorage, so you can use it immediately without any configuration. To enable Google Sheets integration:

### Setting Up Google Sheets API

1. **Create a Google Cloud Project**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable the Google Sheets API for your project

2. **Create OAuth 2.0 Credentials**:
   - In the Cloud Console, go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Choose "Web application"
   - Add authorized JavaScript origins: `http://localhost:3000`
   - Add authorized redirect URIs: `http://localhost:3000`
   - Copy the Client ID and API Key

3. **Configure the App**:
   - Open `src/services/googleSheets.js`
   - Replace `YOUR_GOOGLE_CLIENT_ID` with your Client ID
   - Replace `YOUR_GOOGLE_API_KEY` with your API Key

4. **Add Google API Scripts**:
   - The app requires Google Identity Services and Google API client
   - Add these to `index.html` before the closing `</body>` tag:
   
   ```html
   <script src="https://accounts.google.com/gsi/client" async defer></script>
   <script src="https://apis.google.com/js/api.js" async defer></script>
   ```

5. **Enable Google Sheets Mode**:
   - In `src/App.jsx`, change `const [useMockMode, setUseMockMode] = useState(true);` to `false`
   - The app will now use Google Sheets for data persistence

## Usage

### Starting Your Workout

1. Open the app on your mobile device
2. Tap "Start Workout"
3. If you've worked out before, the app will ask if you want it harder, easier, or the same
4. Say your preference or tap a button

### During Exercises

**Bar Hang & Plank (Timer-based)**:
- Tap the large START button to begin
- The timer counts down while jokes/facts play
- Use voice commands to control entertainment:
  - "more" or "next" - Get new content
  - "joke" - Switch to jokes
  - "fact" - Switch to facts
  - "motivate" - Get motivational quotes
  - "stop" - Pause voice output

**Push-ups (Counter-based)**:
- Do your push-ups to failure
- Enter the actual count completed
- Tap "Submit Count"

### Rating Your Workout

After completing all exercises:
- The app will ask you to rate difficulty (1-10)
- Say a number or tap the rating buttons
- Your workout data is automatically saved

### Next Day

When you return:
- The app recalls your previous workout and score
- Suggests difficulty adjustment based on your rating
- You can accept or modify the suggestion

## Difficulty Progression Algorithm

The app uses smart progression based on your performance:

- **Score 8-10 + "harder"**: 
  - Bar hang: +10 seconds
  - Plank: +10 seconds
  - Push-ups: +3 reps

- **Score 1-5 or "easier"**:
  - Bar hang: -5 seconds
  - Plank: -5 seconds
  - Push-ups: -2 reps

- **Minimum values**: 
  - Bar hang: 10s
  - Plank: 10s
  - Push-ups: 5 reps

## Data Storage

### Mock Mode (Default)
- Uses browser localStorage
- Data persists until you clear browser data
- No setup required

### Google Sheets Mode
- Creates a spreadsheet in your Google Drive
- Columns: Date, Bar Hang Target, Bar Hang Completed, Plank Target, Plank Completed, Pushups Target, Pushups Completed, Difficulty Score
- Data synced across devices
- Permanent record of your progress

## Customization

### Changing Exercise Defaults

Edit the `DEFAULT_EXERCISES` object in `src/App.jsx`:

```javascript
const DEFAULT_EXERCISES = {
  barHang: 60,   // seconds
  plank: 60,     // seconds
  pushups: 20    // reps
};
```

### Adding More Exercises

1. Add exercise definition to the exercises state
2. Create a new exercise state (e.g., `EXERCISE_4`)
3. Add the exercise component to the appropriate state
4. Update the completion handler chain
5. Update Google Sheets columns if needed

### Customizing Voice Content

Edit the fallback content in `src/services/jokesAPI.js`:
- `getFallbackJoke()` - Add your favorite jokes
- `getFallbackFact()` - Add interesting facts
- `getMotivationalQuote()` - Add motivational quotes

### Styling

All styles are in `src/styles/App.css`. Key CSS variables:

```css
:root {
  --primary-color: #4CAF50;
  --secondary-color: #2196F3;
  --success-color: #4CAF50;
  /* ... etc */
}
```

## Browser Compatibility

- **Voice Features**: Chrome, Edge, Safari (iOS 14+)
- **Basic Features**: All modern browsers
- **Mobile**: iOS 12+, Android 5+

## Troubleshooting

### Voice not working
- Ensure you're using Chrome, Edge, or Safari
- Check microphone permissions in browser settings
- Test on a different browser

### Google Sheets not saving
- Verify API credentials are correct
- Check browser console for errors
- Ensure you've authorized the app
- Try mock mode first to test the app

### Timer issues
- Keep the browser tab active during exercises
- Disable battery saving mode on mobile
- Close other apps to free up resources

## Building for Production

```bash
npm run build
```

This creates an optimized build in the `dist` folder. Deploy to any static hosting service:
- Netlify
- Vercel
- GitHub Pages
- Firebase Hosting

**Important**: Update your Google OAuth authorized origins to include your production URL.

## Future Enhancements

Potential features to add:
- ChatGPT integration for conversational AI during workouts
- Multiple user profiles with login
- Exercise history graphs and analytics
- Custom exercise builder
- Rest days and workout scheduling
- Achievement badges and streaks
- Export data to CSV
- Dark mode

## Contributing

Feel free to fork this project and customize it for your needs!

## License

MIT License - feel free to use and modify as you wish.

## Support

For issues or questions:
1. Check the browser console for errors
2. Verify all dependencies are installed
3. Test in mock mode first
4. Check Google API quota limits

---

Stay strong! 💪 Every day is a chance to get better.

