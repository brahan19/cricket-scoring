# Cricket Scoring App

A web application for scoring cricket matches in real-time.

## Features

- Create and manage cricket teams
- Create and manage cricket matches
- Real-time match scoring
- Ball-by-ball commentary
- Match statistics and scorecards
- Support for different match formats (T20, ODI, Test)

## Tech Stack

- Frontend: React with TypeScript
- Backend: Node.js with Express and TypeScript
- Database: MongoDB
- API: RESTful

## Prerequisites

- Node.js 18 or higher
- MongoDB
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/brahan19/cricket-scoring.git
cd cricket-scoring
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../web
npm install
```

4. Create a `.env` file in the backend directory:
```bash
PORT=3000
MONGODB_URI=mongodb://localhost:27017/cricket-scoring
```

## Running the Application

1. Start the backend server:
```bash
cd backend
npm run dev  # For development with hot-reload
# or
npm start    # For production
```

2. Start the frontend development server:
```bash
cd web
npm start
```

The application will be available at:
- Frontend: http://localhost:3001
- Backend API: http://localhost:3000/api

## API Endpoints

### Teams
- `GET /api/teams` - Get all teams
- `POST /api/teams` - Create a new team
- `GET /api/teams/:id` - Get team by ID
- `PUT /api/teams/:id` - Update team
- `DELETE /api/teams/:id` - Delete team

### Matches
- `GET /api/matches` - Get all matches
- `POST /api/matches` - Create a new match
- `GET /api/matches/:id` - Get match by ID
- `PUT /api/matches/:id` - Update match details
- `POST /api/matches/:id/score` - Update match score

## Development

The project uses TypeScript for both frontend and backend. To make changes:

1. Backend:
   - Source files are in `backend/src`
   - TypeScript configuration in `backend/tsconfig.json`
   - Development server with hot-reload: `npm run dev`

2. Frontend:
   - Source files are in `web/src`
   - TypeScript configuration in `web/tsconfig.json`
   - Development server with hot-reload: `npm start`

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License. 