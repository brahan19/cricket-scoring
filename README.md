# Cricket Scoring App

A mobile application for recording cricket match scores built with React Native and Node.js.

## Features

- Record match details (teams, venue, date)
- Track innings progress
- Record runs, wickets, and extras
- Track individual batsman and bowler statistics
- View match summary and statistics
- Real-time score updates

## Project Structure

```
cricket-scoring-app/
├── backend/           # Node.js backend
├── mobile/           # React Native mobile app
└── README.md
```

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- React Native development environment
- iOS Simulator (for Mac) or Android Studio (for Android development)

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a .env file with the following variables:
   ```
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   ```

4. Start the server:
   ```bash
   npm start
   ```

### Mobile App Setup

1. Navigate to the mobile directory:
   ```bash
   cd mobile
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. For iOS:
   ```bash
   cd ios
   pod install
   cd ..
   ```

4. Start the development server:
   ```bash
   npm start
   ```

5. Run on iOS:
   ```bash
   npm run ios
   ```
   
   Or run on Android:
   ```bash
   npm run android
   ```

## API Endpoints

- POST /api/matches - Create a new match
- GET /api/matches - Get all matches
- GET /api/matches/:id - Get match details
- PUT /api/matches/:id - Update match details
- POST /api/matches/:id/score - Update match score
- GET /api/matches/:id/statistics - Get match statistics

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request 