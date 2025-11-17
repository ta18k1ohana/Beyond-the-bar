# Beyond The Bar

A professional networking platform for baristas and coffee shops, featuring a positive badge-based recognition system.

## 🚀 Features

- **Badge System**: Earn Bronze, Silver, Gold, and Legendary badges based on peer recognition
- **Peer Reviews**: Get recognized by colleagues, managers, and industry professionals
- **Job Matching**: Connect with cafés looking for baristas with specific skills
- **Positive-First Approach**: Focuses on strengths rather than numerical ratings

## 🛠️ Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4 with custom coffee-themed color palette
- **Routing**: React Router v6
- **Forms**: React Hook Form + Zod validation
- **State Management**: Zustand
- **Backend**: Firebase (Authentication, Firestore, Storage)

## 📋 Prerequisites

- Node.js 18+ and npm
- Firebase account and project

## 🔧 Setup Instructions

### 1. Clone the repository

```bash
git clone <repository-url>
cd Beyond-the-bar
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure Firebase

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication (Email/Password)
3. Create a Firestore database
4. Enable Storage
5. Get your Firebase configuration from Project Settings

### 4. Set up environment variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` and fill in your Firebase credentials:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### 5. Run the development server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── auth/           # Authentication components
│   ├── badges/         # Badge-related components
│   ├── layout/         # Layout components (Header, Footer, etc.)
│   ├── profile/        # Profile components
│   ├── reviews/        # Review components
│   ├── jobs/           # Job board components
│   └── common/         # Reusable common components
├── config/             # Configuration files (Firebase, etc.)
├── constants/          # Constants and static data (badges, etc.)
├── contexts/           # React contexts (Auth, etc.)
├── hooks/              # Custom React hooks
├── pages/              # Page components
├── services/           # API services (auth, database, etc.)
├── store/              # Zustand stores
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

## 📚 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎨 Color Palette

The app uses a warm, coffee-inspired color scheme:

- **Primary**: `#8B4513` (Saddle Brown)
- **Secondary**: `#D2691E` (Chocolate)
- **Accent**: `#DAA520` (Goldenrod)
- **Background**: `#FFF8DC` (Cornsilk)
- **Text**: `#2F2F2F` (Dark Gray)
- **Success**: `#6B8E23` (Olive Green)
- **Error**: `#CD5C5C` (Indian Red)

## 🏆 Badge System

The platform includes 44 badges across 8 categories:

- **Technique** (9 badges): Latte Art Wizard, Espresso Alchemist, etc.
- **Speed & Efficiency** (4 badges): Rush Hour Hero, Flow State Master, etc.
- **Customer Service** (5 badges): Regular Whisperer, Vibe Curator, etc.
- **Teamwork** (5 badges): New Hire Mentor, Shift Coordinator, etc.
- **Knowledge** (5 badges): Origin Storyteller, Brewing Method Encyclopedia, etc.
- **Special Situations** (5 badges): Solo Bar Survivor, Catering Champion, etc.
- **Personality** (5 badges): Coffee Philosopher, Detail Obsessed, etc.
- **Legendary** (4 badges): Barista Sensei, Coffee Sommelier, etc.

### Badge Progression

- **Bronze**: 3 tags (Tier 1 colleagues count 2x)
- **Silver**: 8 tags
- **Gold**: 20 tags
- **Legendary**: 30+ tags + special requirements

## 🔒 Firebase Security Rules

**Important**: Before deploying, configure your Firebase Security Rules:

### Firestore Rules

```javascript
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
      allow update: if request.auth.uid == resource.data.reviewerId;
    }

    // Jobs collection
    match /jobs/{jobId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null &&
                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.type == 'employer';
      allow update, delete: if request.auth.uid == resource.data.employerId;
    }
  }
}
```

### Storage Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /users/{userId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
  }
}
```

## 📝 MVP Scope

Current MVP includes:

- ✅ User authentication (sign up, login, logout)
- ✅ User profiles
- ✅ Badge system data structure
- ✅ Routing and navigation
- ✅ Responsive layout with coffee theme
- 🚧 Review submission (coming soon)
- 🚧 Badge display and progression tracking (coming soon)
- 🚧 Job board functionality (coming soon)

## 🤝 Contributing

This is a private project. For any questions or suggestions, please contact the project maintainer.

## 📄 License

Proprietary - All rights reserved
