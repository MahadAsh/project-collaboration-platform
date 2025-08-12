# ProjectHub - Collaborative Project Platform

A modern web platform where creators can post project ideas, find teammates, and collaborate on amazing projects together.

## Features

- **Google Sign-In Authentication** - Secure login with Google accounts
- **Project Posting** - Create and share your project ideas
- **Real-time Updates** - See new projects and join requests instantly
- **Join Requests** - Express interest in projects and connect with creators
- **Notification System** - Get notified when someone wants to join your project
- **Responsive Design** - Works perfectly on desktop and mobile devices

## Tech Stack

- **Frontend**: React 19, Tailwind CSS, shadcn/ui components
- **Backend**: Firebase Firestore (NoSQL database)
- **Authentication**: Firebase Auth with Google Sign-In
- **Hosting**: Compatible with Netlify, Vercel, GitHub Pages, or Firebase Hosting

## Setup Instructions

### 1. Firebase Configuration

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable Authentication:
   - Go to Authentication > Sign-in method
   - Enable Google sign-in provider
   - Add your domain to authorized domains
4. Enable Firestore Database:
   - Go to Firestore Database
   - Create database in production mode
   - Set up security rules (see below)
5. Get your Firebase config:
   - Go to Project Settings > General
   - Scroll down to "Your apps" and click "Web app"
   - Copy the configuration object

### 2. Environment Setup

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   # or
   pnpm install
   ```

3. Update Firebase configuration in `src/lib/firebase.js`:
   ```javascript
   const firebaseConfig = {
     apiKey: "your-api-key-here",
     authDomain: "your-project-id.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project-id.appspot.com",
     messagingSenderId: "your-sender-id",
     appId: "your-app-id"
   };
   ```

### 3. Firestore Security Rules

Set up these security rules in your Firestore Database:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /projects/{document} {
      allow read: if request.auth != null;
      allow create: if request.auth != null 
        && request.auth.token.email == resource.data.authorEmail;
      allow update: if request.auth != null 
        && (request.auth.token.email == resource.data.authorEmail 
            || request.auth.token.email in resource.data.joinRequests[].userEmail);
      allow delete: if request.auth != null 
        && request.auth.token.email == resource.data.authorEmail;
    }
  }
}
```

### 4. Development

Start the development server:
```bash
npm run dev --host
# or
pnpm run dev --host
```

The application will be available at `http://localhost:5173`

## Deployment Options

### Option 1: Netlify

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy the `dist` folder to Netlify:
   - Drag and drop the `dist` folder to Netlify
   - Or connect your GitHub repository for automatic deployments

### Option 2: Vercel

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   vercel --prod
   ```

### Option 3: Firebase Hosting

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login and initialize:
   ```bash
   firebase login
   firebase init hosting
   ```

3. Build and deploy:
   ```bash
   npm run build
   firebase deploy
   ```

### Option 4: GitHub Pages

1. Install gh-pages:
   ```bash
   npm install --save-dev gh-pages
   ```

2. Add to package.json:
   ```json
   {
     "homepage": "https://yourusername.github.io/your-repo-name",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

3. Deploy:
   ```bash
   npm run deploy
   ```

## Email Notifications

The current implementation uses the browser's default email client for notifications. For production use, consider implementing:

1. **Firebase Functions** - Server-side email sending
2. **EmailJS** - Client-side email service
3. **Third-party services** - SendGrid, Mailgun, etc.

Example Firebase Function for email notifications:
```javascript
const functions = require('firebase-functions');
const nodemailer = require('nodemailer');

exports.sendJoinNotification = functions.firestore
  .document('projects/{projectId}')
  .onUpdate(async (change, context) => {
    // Email sending logic here
  });
```

## Project Structure

```
src/
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── AuthGuard.jsx    # Authentication wrapper
│   ├── Header.jsx       # Navigation header
│   ├── NotificationSystem.jsx  # Join request notifications
│   ├── ProjectCard.jsx  # Individual project display
│   ├── ProjectForm.jsx  # New project creation form
│   └── ProjectList.jsx  # Main project listing
├── contexts/
│   └── AuthContext.jsx  # Authentication state management
├── lib/
│   └── firebase.js      # Firebase configuration
├── App.jsx              # Main application component
└── main.jsx            # Application entry point
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project for your own purposes.

## Support

If you encounter any issues or have questions, please open an issue on GitHub or contact the maintainers.

