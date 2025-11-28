# Quick Start Guide

Get your Morning Exercise Tracker running in 5 minutes!

## 1. Install Node.js

If you don't have Node.js installed:
- **Mac**: Download from [nodejs.org](https://nodejs.org/) or use `brew install node`
- **Windows**: Download from [nodejs.org](https://nodejs.org/)
- **Linux**: Use your package manager, e.g., `sudo apt install nodejs npm`

Verify installation:
```bash
node --version
npm --version
```

## 2. Install Dependencies

Navigate to the project folder and run:
```bash
cd morning-exercise-app
npm install
```

This will download all required packages.

## 3. Start the App

```bash
npm run dev
```

You should see output like:
```
VITE v5.0.8  ready in 500 ms

➜  Local:   http://localhost:3000/
➜  Network: use --host to expose
```

## 4. Open in Browser

Open your browser (Chrome, Edge, or Safari recommended) and go to:
```
http://localhost:3000
```

## 5. First Workout

1. Click "Start Workout"
2. For **Bar Hang**:
   - Click the large green START button
   - Hold for as long as you can
   - Click STOP when done (or it auto-stops at 60s)
   - Listen to jokes/facts during the exercise
3. For **Plank**:
   - Same as bar hang
4. For **Push-ups**:
   - Do as many push-ups as you can
   - Enter the count
   - Click Submit
5. **Rate the difficulty** (1-10)
6. Done! Your workout is saved.

## Voice Features (Optional)

To use hands-free voice commands:

1. Allow microphone access when prompted
2. During exercises, you can say:
   - "more" or "next" - Get new jokes/facts
   - "joke" - Switch to jokes
   - "fact" - Switch to facts
   - "motivate" - Get motivational quotes
   - "stop" - Pause voice output

## Mobile Usage

1. Open `http://localhost:3000` on your mobile device
   - Make sure your phone is on the same WiFi network
   - You may need to use your computer's IP address instead of `localhost`
   
2. **Add to Home Screen** for app-like experience:
   - **iOS Safari**: Tap Share → Add to Home Screen
   - **Android Chrome**: Tap Menu → Add to Home Screen

## Data Storage

By default, the app uses **mock mode** with browser localStorage:
- Your data stays on your device
- Works offline
- No setup required
- Data persists until you clear browser data

To enable Google Sheets (for cross-device sync):
- See [SETUP_GOOGLE_SHEETS.md](./SETUP_GOOGLE_SHEETS.md)

## Customizing Your Workout

Want to change the exercise targets?

1. Open `src/App.jsx`
2. Find this section:
   ```javascript
   const DEFAULT_EXERCISES = {
     barHang: 60,   // seconds
     plank: 60,     // seconds
     pushups: 20    // reps
   };
   ```
3. Change the numbers to your liking
4. Save and refresh the browser

## Troubleshooting

### Port 3000 already in use?
```bash
# Kill the process using port 3000, or specify a different port:
npm run dev -- --port 3001
```

### Voice not working?
- Use Chrome, Edge, or Safari (Firefox doesn't support Web Speech API)
- Allow microphone permissions
- Try refreshing the page

### "Cannot find module" errors?
```bash
rm -rf node_modules package-lock.json
npm install
```

### App won't start?
Make sure you're in the project directory:
```bash
cd morning-exercise-app
ls  # Should show package.json, src/, etc.
```

## Building for Production

When ready to deploy:
```bash
npm run build
```

This creates a `dist/` folder you can deploy to:
- [Netlify](https://netlify.com) (drag & drop the dist folder)
- [Vercel](https://vercel.com) (connect your GitHub repo)
- [GitHub Pages](https://pages.github.com)
- Any static hosting service

## Next Steps

- ✅ Complete your first workout
- 📱 Add to mobile home screen
- 🔗 Set up Google Sheets for cloud sync
- 🎨 Customize exercise targets
- 💪 Start your fitness journey!

## Tips for Success

1. **Consistency over intensity**: Do it every day, even if you reduce the difficulty
2. **Listen to your body**: Rate honestly so the app adjusts appropriately
3. **Morning routine**: Do it right when you wake up, before checking your phone
4. **Track progress**: Check your Google Sheet weekly to see improvement
5. **Gradual progression**: Let the app handle difficulty adjustments

---

Happy exercising! Remember: The best workout is the one you actually do. 💪

