# Cricket Scoring Mobile App

A React Native mobile application for scoring cricket matches in real-time.

## Features

- Real-time cricket match scoring
- Team management
- Match history
- Live match statistics
- Support for different match formats (T20, ODI, Test)

## Prerequisites

- Node.js >= 18
- React Native development environment set up
- iOS development environment (for iOS)
- Android development environment (for Android)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd mobile
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add:
```
API_URL=http://localhost:3000/api
```

## Running the App

### iOS

```bash
npm run ios
```

### Android

```bash
npm run android
```

## Development

The app is built with:

- React Native
- TypeScript
- React Navigation
- Axios for API calls

### Project Structure

```
src/
  ├── components/     # Reusable components
  ├── interfaces/     # TypeScript interfaces
  ├── navigation/     # Navigation configuration
  ├── screens/        # Screen components
  ├── services/       # API services
  └── types/         # TypeScript types
```

### Screens

- HomeScreen: List of matches
- MatchDetailsScreen: Match details and scoring options
- LiveScoringScreen: Real-time scoring interface
- TeamsScreen: Team management
- TeamDetailsScreen: Team details and player management
- NewMatchScreen: Create new matches
- NewTeamScreen: Create new teams

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.
