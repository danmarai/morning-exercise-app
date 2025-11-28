# Setting Up Google Sheets Integration

This guide will walk you through setting up Google Sheets API integration for the Morning Exercise Tracker.

## Prerequisites

- A Google account
- Access to Google Cloud Console
- The app running locally (`npm run dev`)

## Step-by-Step Setup

### 1. Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click the project dropdown at the top
3. Click "New Project"
4. Name it "Morning Exercise Tracker" (or your preferred name)
5. Click "Create"
6. Wait for the project to be created and select it

### 2. Enable Google Sheets API

1. In the Google Cloud Console, ensure your project is selected
2. Click on the hamburger menu (≡) → "APIs & Services" → "Library"
3. Search for "Google Sheets API"
4. Click on "Google Sheets API"
5. Click "Enable"
6. Wait for the API to be enabled

### 3. Configure OAuth Consent Screen

1. Go to "APIs & Services" → "OAuth consent screen"
2. Select "External" user type (unless you have a Google Workspace)
3. Click "Create"
4. Fill in the required fields:
   - **App name**: Morning Exercise Tracker
   - **User support email**: Your email
   - **Developer contact email**: Your email
5. Click "Save and Continue"
6. On the Scopes page, click "Add or Remove Scopes"
7. Add the following scope: `https://www.googleapis.com/auth/spreadsheets`
8. Click "Update" then "Save and Continue"
9. On Test users page, add your email address
10. Click "Save and Continue"
11. Review and click "Back to Dashboard"

### 4. Create OAuth 2.0 Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. If prompted, configure the consent screen (should already be done)
4. Choose "Web application" as the application type
5. Name it "Morning Exercise Tracker Web Client"
6. Under "Authorized JavaScript origins", click "Add URI" and add:
   - `http://localhost:3000` (for local development)
   - Your production URL when you deploy (e.g., `https://your-app.netlify.app`)
7. Under "Authorized redirect URIs", add the same URIs as above
8. Click "Create"
9. **Important**: Copy the Client ID that appears (you'll need this)
10. Click "OK"

### 5. Create API Key

1. Still in "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "API Key"
3. **Important**: Copy the API key that appears
4. Click "Restrict Key" for security
5. Under "API restrictions", select "Restrict key"
6. Choose "Google Sheets API" from the dropdown
7. Click "Save"

### 6. Configure the App

#### Option A: Using Environment Variables (Recommended)

1. Create a `.env` file in the project root:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your credentials:
   ```
   VITE_GOOGLE_CLIENT_ID=your_actual_client_id.apps.googleusercontent.com
   VITE_GOOGLE_API_KEY=your_actual_api_key
   VITE_USE_MOCK_MODE=false
   ```

3. Update `src/services/googleSheets.js` to use environment variables:
   ```javascript
   const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
   const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
   ```

#### Option B: Direct Configuration

1. Open `src/services/googleSheets.js`

2. Replace the placeholder values at the top:
   ```javascript
   const CLIENT_ID = 'YOUR_ACTUAL_CLIENT_ID.apps.googleusercontent.com';
   const API_KEY = 'YOUR_ACTUAL_API_KEY';
   ```

### 7. Enable Google API Scripts

1. Open `index.html`
2. Uncomment the Google API script tags:
   ```html
   <script src="https://accounts.google.com/gsi/client" async defer></script>
   <script src="https://apis.google.com/js/api.js" async defer></script>
   ```

### 8. Switch from Mock Mode to Google Sheets

1. Open `src/App.jsx`
2. Find the line:
   ```javascript
   const [useMockMode, setUseMockMode] = useState(true);
   ```
3. Change it to:
   ```javascript
   const [useMockMode, setUseMockMode] = useState(false);
   ```

### 9. Test the Integration

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. Open the app in your browser at `http://localhost:3000`

3. You should see a "Connect Google Sheets" button

4. Click it and follow the OAuth flow:
   - Select your Google account
   - Grant permissions to the app
   - You'll be redirected back to the app

5. Complete a workout and check your Google Drive:
   - A new spreadsheet called "Morning Exercise Tracker" should be created
   - Your workout data should be recorded

## Troubleshooting

### "Redirect URI mismatch" error
- Make sure your authorized URIs exactly match the URL you're accessing
- Don't forget `http://` or `https://`
- Port numbers must match (e.g., `:3000`)

### "Access blocked: This app's request is invalid"
- Complete the OAuth consent screen configuration
- Add your email as a test user
- Make sure the Google Sheets API is enabled

### "API key not valid"
- Check that the API key is correctly copied
- Ensure API restrictions include Google Sheets API
- Try creating a new API key

### App doesn't prompt for authentication
- Check browser console for errors
- Verify Google API scripts are loaded (check Network tab)
- Make sure `useMockMode` is set to `false`

### Spreadsheet not created
- Check if you granted the necessary permissions
- Look in browser console for error messages
- Verify the API key and Client ID are correct

## Security Best Practices

1. **Never commit your API credentials to version control**
   - Add `.env` to `.gitignore`
   - Use environment variables

2. **Restrict your API key**
   - Limit to only Google Sheets API
   - Add HTTP referrer restrictions for production

3. **Review OAuth consent screen**
   - Only request necessary scopes
   - Keep app information up to date

4. **Monitor API usage**
   - Check Google Cloud Console for quota usage
   - Set up billing alerts if needed

## API Quotas and Limits

The free tier of Google Sheets API includes:
- 100 requests per 100 seconds per user
- 500 requests per 100 seconds per project

For daily exercise tracking (1-2 requests per day), you'll never hit these limits.

## Production Deployment

When deploying to production:

1. Add your production URL to OAuth authorized origins
2. Update API key restrictions to include your production domain
3. Consider switching OAuth consent screen from "Testing" to "Published"
4. Update environment variables in your hosting service
5. Test the OAuth flow on your production URL

## Alternative: Using Service Account (Advanced)

If you want to avoid the OAuth flow and have the app write to a single shared spreadsheet:

1. Create a Service Account in Google Cloud Console
2. Generate a JSON key file
3. Share your Google Sheet with the service account email
4. Update the code to use service account authentication

Note: This approach is more complex but useful for shared/public deployments.

## Need Help?

- Check the [Google Sheets API documentation](https://developers.google.com/sheets/api)
- Review the [Google Identity Services docs](https://developers.google.com/identity/gsi/web/guides/overview)
- Check browser console for specific error messages
- Test with mock mode first to isolate API issues

---

Once set up, you'll have a permanent record of all your workouts accessible from anywhere! 📊💪

