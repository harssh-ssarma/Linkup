# Firebase Setup Instructions for LinkUp

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Enter project name: `linkup-app` (or any name you prefer)
4. Enable Google Analytics if you want (optional)
5. Click "Create project"

## Step 2: Enable Authentication

1. In your Firebase project dashboard, click on "Authentication" in the left sidebar
2. Click on "Get started"
3. Go to the "Sign-in method" tab
4. Click on "Email link (passwordless sign-in)"
5. Enable it by toggling the switch
6. Click "Save"

## Step 3: Get your configuration

1. In your Firebase project dashboard, click on the "Project settings" gear icon
2. Scroll down to "Your apps" section
3. Click on the web icon (`</>`) to add a web app
4. Enter app nickname: `linkup-frontend`
5. Click "Register app"
6. Copy the `firebaseConfig` object values

## Step 4: Create your .env.local file

1. In your `frontend` folder, create a file named `.env.local`
2. Add the following content with your actual Firebase values:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## Step 5: Configure Authorized Domains

1. In Firebase Console, go to Authentication > Settings
2. Scroll down to "Authorized domains"
3. Add your domain(s):
   - `localhost` (for development)
   - Your production domain when you deploy

## Step 6: Test the Authentication

1. Restart your Next.js development server: `npm run dev`
2. Go to your app and try to sign in/sign up
3. Check your email for the verification link
4. Click the link to complete authentication

## Important Notes:

- The email link will redirect back to your app with special parameters
- Make sure your `.env.local` file is in the `frontend` folder
- Never commit your `.env.local` file to git (it should be in .gitignore)
- The authentication will now send real emails through Firebase

## Troubleshooting:

- If emails aren't being sent, check your Firebase console for errors
- Make sure you've enabled "Email link" sign-in method
- Check that your authorized domains include your current domain
- Verify that your environment variables are correctly set
