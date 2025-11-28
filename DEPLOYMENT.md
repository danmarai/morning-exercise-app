# Deployment Guide

The easiest way to host your Morning Exercise Tracker for free is using **Vercel**. It connects directly to your GitHub repository and updates automatically when you push changes.

## Prerequisites

1.  **GitHub Account**: You already have this (`https://github.com/danmarai/morning-exercise-app`).
2.  **Vercel Account**: Sign up at [vercel.com](https://vercel.com) using your GitHub account.

## Step 1: Push Latest Changes

Ensure all your local changes are pushed to GitHub:

```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

## Step 2: Deploy on Vercel

1.  Go to your [Vercel Dashboard](https://vercel.com/dashboard).
2.  Click **"Add New..."** -> **"Project"**.
3.  Import your `morning-exercise-app` repository.
4.  **Configure Project**:
    *   **Framework Preset**: Vercel should automatically detect **Vite**.
    *   **Root Directory**: `./` (default).
    *   **Build Command**: `npm run build` (default).
    *   **Output Directory**: `dist` (default).
5.  **Environment Variables**:
    *   Go to **Settings** > **Environment Variables**.
    *   Add the following variables:
        *   `VITE_GOOGLE_CLIENT_ID`: Your Google Client ID.
        *   `VITE_GOOGLE_API_KEY`: Your Google API Key.
        *   `OPENAI_API_KEY`: Your OpenAI API Key (starts with `sk-...`).
    *   Click **Save**.
6.  Click **"Deploy"**.

## Step 3: Configure Google Cloud Console

Since your app is now hosted on a live URL (e.g., `https://morning-exercise-app.vercel.app`), you need to update your Google Cloud settings to allow this domain.

1.  Go to the [Google Cloud Console](https://console.cloud.google.com/).
2.  Navigate to **APIs & Services** -> **Credentials**.
3.  Edit your **OAuth 2.0 Client ID**.
4.  **Authorized JavaScript origins**:
    *   Add your new Vercel URL (e.g., `https://morning-exercise-app.vercel.app`).
    *   Keep `http://localhost:3000` for local development.
5.  **Authorized redirect URIs**:
    *   Add your Vercel URL (same as above).
6.  Click **Save**.

## Step 4: Verify

1.  Visit your Vercel URL.
2.  Click "Connect Google Sheets".
3.  Complete the Google Sign-In flow.
4.  Enjoy your live app!

## How to Update

Since you connected Vercel to your GitHub repository, **updates are automatic!**

Whenever you want to release new features or fixes:

1.  **Save your changes** locally.
2.  **Commit and Push** to GitHub:
    ```bash
    git add .
    git commit -m "Description of your changes"
    git push origin main
    ```
3.  **Wait**: Vercel detects the new commit and automatically builds and deploys the new version (usually takes 1-2 minutes).
4.  **Refresh**: Go to your live URL and refresh to see the changes.
