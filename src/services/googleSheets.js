// Google Sheets API integration with OAuth

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID';
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY || 'YOUR_GOOGLE_API_KEY';
const DISCOVERY_DOC = 'https://sheets.googleapis.com/$discovery/rest?version=v4';
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets';

let tokenClient;
let gapiInited = false;
let gisInited = false;

class GoogleSheetsService {
  constructor() {
    this.spreadsheetId = null;
    this.isSignedIn = false;
  }

  // Initialize the Google API client
  async initializeGapi() {
    return new Promise((resolve) => {
      if (typeof gapi === 'undefined') {
        console.warn('Google API not loaded. Add the script tag to index.html');
        resolve(false);
        return;
      }

      gapi.load('client', async () => {
        await gapi.client.init({
          apiKey: API_KEY,
          discoveryDocs: [DISCOVERY_DOC],
        });
        gapiInited = true;
        resolve(true);
      });
    });
  }

  // Initialize Google Identity Services
  initializeGis() {
    return new Promise((resolve) => {
      if (typeof google === 'undefined' || !google.accounts) {
        console.warn('Google Identity Services not loaded');
        resolve(false);
        return;
      }

      tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: '', // defined later
      });
      gisInited = true;
      resolve(true);
    });
  }

  // Handle authentication
  async authenticate() {
    return new Promise((resolve, reject) => {
      if (!tokenClient) {
        reject(new Error('Google Identity Services not initialized'));
        return;
      }

      tokenClient.callback = async (resp) => {
        if (resp.error !== undefined) {
          reject(resp);
        }
        this.isSignedIn = true;
        resolve();
      };

      if (gapi.client.getToken() === null) {
        tokenClient.requestAccessToken({ prompt: 'consent' });
      } else {
        tokenClient.requestAccessToken({ prompt: '' });
      }
    });
  }

  // Sign out
  signOut() {
    const token = gapi.client.getToken();
    if (token !== null) {
      google.accounts.oauth2.revoke(token.access_token);
      gapi.client.setToken('');
      this.isSignedIn = false;
    }
  }

  // Set or create spreadsheet
  async setSpreadsheet(spreadsheetId) {
    this.spreadsheetId = spreadsheetId;
    // Verify it exists and has correct structure
    try {
      await this.getSpreadsheetMetadata();
      return true;
    } catch (error) {
      console.error('Error accessing spreadsheet:', error);
      return false;
    }
  }

  // Get spreadsheet URL
  getSpreadsheetUrl() {
    if (this.spreadsheetId) {
      return `https://docs.google.com/spreadsheets/d/${this.spreadsheetId}`;
    }
    return null;
  }

  // Create new spreadsheet
  async createSpreadsheet() {
    try {
      const response = await gapi.client.sheets.spreadsheets.create({
        properties: {
          title: 'Morning Exercise Tracker'
        },
        sheets: [{
          properties: {
            title: 'Workouts'
          }
        }]
      });

      this.spreadsheetId = response.result.spreadsheetId;

      // Add headers
      await this.appendRow([
        'Date',
        'Bar Hang Target (s)',
        'Bar Hang Completed (s)',
        'Plank Target (s)',
        'Plank Completed (s)',
        'Pushups Target',
        'Pushups Completed',
        'Difficulty Score'
      ]);

      return this.spreadsheetId;
    } catch (error) {
      console.error('Error creating spreadsheet:', error);
      throw error;
    }
  }

  // Get spreadsheet metadata
  async getSpreadsheetMetadata() {
    try {
      const response = await gapi.client.sheets.spreadsheets.get({
        spreadsheetId: this.spreadsheetId
      });
      return response.result;
    } catch (error) {
      throw error;
    }
  }

  // Append a row to the spreadsheet
  async appendRow(values) {
    try {
      const response = await gapi.client.sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: 'Workouts!A:H',
        valueInputOption: 'USER_ENTERED',
        resource: {
          values: [values]
        }
      });
      return response.result;
    } catch (error) {
      console.error('Error appending row:', error);
      throw error;
    }
  }

  // Get all rows
  async getAllRows() {
    try {
      const response = await gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: 'Workouts!A:H'
      });
      return response.result.values || [];
    } catch (error) {
      console.error('Error getting rows:', error);
      throw error;
    }
  }

  // Get previous day's workout
  async getPreviousWorkout() {
    try {
      const rows = await this.getAllRows();
      if (rows.length <= 1) return null; // Only headers or empty

      // Get the last row (most recent workout)
      const lastRow = rows[rows.length - 1];

      return {
        date: lastRow[0],
        barHangTarget: parseInt(lastRow[1]),
        barHangCompleted: parseInt(lastRow[2]),
        barHangRating: parseInt(lastRow[3]) || 3, // Default to 3 if missing
        plankTarget: parseInt(lastRow[4]),
        plankCompleted: parseInt(lastRow[5]),
        plankRating: parseInt(lastRow[6]) || 3,
        pushupsTarget: parseInt(lastRow[7]),
        pushupsCompleted: parseInt(lastRow[8]),
        pushupsRating: parseInt(lastRow[9]) || 3
      };
    } catch (error) {
      console.error('Error getting previous workout:', error);
      return null;
    }
  }

  // Save workout
  async saveWorkout(workoutData) {
    const today = new Date().toLocaleDateString();
    const row = [
      today,
      workoutData.barHangTarget,
      workoutData.barHangCompleted,
      workoutData.barHangRating,
      workoutData.plankTarget,
      workoutData.plankCompleted,
      workoutData.plankRating,
      workoutData.pushupsTarget,
      workoutData.pushupsCompleted,
      workoutData.pushupsRating,
      workoutData.bonus || 0
    ];

    return await this.appendRow(row);
  }

  // Mock methods for development without Google API
  useMockMode() {
    this.mockData = [];
    this.isMockMode = true;
  }

  async mockSaveWorkout(workoutData) {
    const today = new Date().toLocaleDateString();
    this.mockData.push({
      date: today,
      ...workoutData
    });
    localStorage.setItem('exerciseTrackerData', JSON.stringify(this.mockData));
  }

  async mockGetPreviousWorkout() {
    const stored = localStorage.getItem('exerciseTrackerData');
    if (stored) {
      this.mockData = JSON.parse(stored);
      if (this.mockData.length > 0) {
        const last = this.mockData[this.mockData.length - 1];
        // Ensure all fields exist
        return {
          ...last,
          barHangRating: last.barHangRating || 3,
          plankRating: last.plankRating || 3,
          pushupsRating: last.pushupsRating || 3
        };
      }
    }
    return null;
  }

  // Get all workouts (Mock)
  async mockGetWorkouts() {
    const stored = localStorage.getItem('exerciseTrackerData');
    if (stored) {
      this.mockData = JSON.parse(stored);
      return this.mockData;
    }
    return [];
  }

  // Get all workouts (Real)
  async getWorkouts() {
    if (this.isMockMode) {
      return this.mockGetWorkouts();
    }

    try {
      const rows = await this.getAllRows();
      if (rows.length <= 1) return []; // Only headers or empty

      // Skip header row
      return rows.slice(1).map(row => ({
        date: row[0],
        barHangTarget: parseInt(row[1]),
        barHangCompleted: parseInt(row[2]),
        barHangRating: parseInt(row[3]) || 3,
        plankTarget: parseInt(row[4]),
        plankCompleted: parseInt(row[5]),
        plankRating: parseInt(row[6]) || 3,
        pushupsTarget: parseInt(row[7]),
        pushupsCompleted: parseInt(row[8]),
        pushupsRating: parseInt(row[9]) || 3
      }));
    } catch (error) {
      console.error('Error getting workouts:', error);
      return [];
    }
  }
}

export default new GoogleSheetsService();

