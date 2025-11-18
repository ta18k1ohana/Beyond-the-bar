# Beyond The Bar - Firebase Setup Guide

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Name it "Beyond The Bar" (or your preferred name)
4. Disable Google Analytics (optional for MVP)
5. Click "Create project"

## Step 2: Enable Authentication

1. In Firebase Console, click "Authentication" in left sidebar
2. Click "Get started"
3. Click "Email/Password" under Sign-in method
4. Enable "Email/Password"
5. Click "Save"

## Step 3: Create Firestore Database

1. Click "Firestore Database" in left sidebar
2. Click "Create database"
3. **Start in production mode** (we'll update rules)
4. Choose your location (closest to your users)
5. Click "Enable"

### Update Firestore Rules

Go to "Rules" tab and paste:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }

    // Reviews collection
    match /reviews/{reviewId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null &&
                      (request.auth.uid == resource.data.reviewerId ||
                       request.auth.uid == resource.data.revieweeId);
    }

    // Jobs collection
    match /jobs/{jobId} {
      allow read: if true; // Public read for job listings
      allow create: if request.auth != null;
      allow update, delete: if request.auth.uid == resource.data.employerId;
    }

    // Notifications collection
    match /notifications/{notificationId} {
      allow read: if request.auth.uid == resource.data.userId;
      allow create: if request.auth != null;
      allow update: if request.auth.uid == resource.data.userId;
    }
  }
}
```

Click "Publish"

## Step 4: Enable Storage

1. Click "Storage" in left sidebar
2. Click "Get started"
3. **Start in production mode**
4. Choose same location as Firestore
5. Click "Done"

### Update Storage Rules

Go to "Rules" tab and paste:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /profile-photos/{userId}_{timestamp}.{extension} {
      // Allow authenticated users to upload their own photos
      allow read: if true;
      allow write: if request.auth != null &&
                     request.resource.size < 5 * 1024 * 1024 && // 5MB limit
                     request.resource.contentType.matches('image/.*');
    }
  }
}
```

Click "Publish"

## Step 5: Get Firebase Config

1. Click the gear icon ⚙️ next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps"
4. Click the "</>" (Web) icon
5. Register app with nickname "Beyond The Bar Web"
6. Copy the `firebaseConfig` object values

## Step 6: Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Paste your Firebase config values into `.env`:
   ```
   VITE_FIREBASE_API_KEY=AIzaSy...
   VITE_FIREBASE_AUTH_DOMAIN=beyond-the-bar-12345.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=beyond-the-bar-12345
   VITE_FIREBASE_STORAGE_BUCKET=beyond-the-bar-12345.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
   VITE_FIREBASE_APP_ID=1:123456789012:web:abc123def456
   ```

## Step 7: Test the Setup

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open http://localhost:5173

3. Try to sign up with a test account

4. If successful, you should see:
   - User created in Firebase Authentication
   - User profile created in Firestore
   - Able to navigate to profile page

## Firestore Collections Structure

Your database will have these collections:

### `users`
```json
{
  "id": "user_id_here",
  "type": "barista",
  "name": "John Doe",
  "email": "john@example.com",
  "profilePhoto": "https://...",
  "location": {
    "city": "Seattle",
    "state": "WA",
    "country": "USA"
  },
  "badges": [],
  "workHistory": [],
  "certifications": [],
  "reviewCount": 0,
  "averageRating": 0,
  "privacySettings": {
    "showAverageRating": false,
    "acceptTier3Reviews": true,
    "showReviewCount": true
  }
}
```

### `reviews`
```json
{
  "id": "review_id",
  "reviewerId": "user_id",
  "revieweeId": "user_id",
  "tier": "tier1",
  "starRating": 5,
  "badgeTags": ["latte_art_wizard", "speed_demon"],
  "comment": "Great barista!",
  "relationship": {
    "type": "colleague",
    "workplace": "Blue Bottle Coffee",
    "verified": false
  },
  "createdAt": "2025-01-15T10:00:00Z"
}
```

### `jobs`
```json
{
  "id": "job_id",
  "employerId": "user_id",
  "title": "Lead Barista",
  "cafeName": "Espresso Dreams",
  "location": {
    "city": "Portland",
    "state": "OR"
  },
  "positionType": "lead_barista",
  "employmentType": "full_time",
  "payRate": {
    "min": 18,
    "max": 22,
    "period": "hourly"
  },
  "status": "active",
  "createdAt": "2025-01-15T10:00:00Z"
}
```

### `notifications`
```json
{
  "id": "notification_id",
  "userId": "user_id",
  "type": "badge_earned",
  "title": "Badge Earned!",
  "message": "You've earned the Bronze Latte Art Wizard badge!",
  "read": false,
  "createdAt": "2025-01-15T10:00:00Z"
}
```

## Troubleshooting

### "Permission denied" errors
- Check Firestore rules are published
- Ensure user is authenticated
- Verify user ID matches document ID

### Storage upload fails
- Check Storage rules are published
- Ensure file size < 5MB
- Verify file type is image/*

### Can't create user
- Check Authentication is enabled
- Verify Email/Password provider is enabled
- Check browser console for specific error

## Next Steps

Once Firebase is configured:
1. Create test accounts (barista and employer)
2. Test profile creation
3. Give and verify reviews
4. Post jobs
5. Upload profile photos
6. View analytics

## Security Notes for Production

Before going live:
1. Update Firestore rules to be more restrictive
2. Add rate limiting
3. Enable App Check
4. Set up backup schedule
5. Configure alerts and monitoring
6. Review Storage costs and quotas
